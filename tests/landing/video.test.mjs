import assert from "node:assert/strict";
import { closeSync, existsSync, openSync, readSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The launch film as the page plays it (lib/landing/film/video.ts): the recorded film, in three copies a browser picks
// from. Each copy is read from its own file, so one remade at other settings can't go out saying the wrong codecs, with
// its index at the end (it would only play once all of it had come), or at the wrong length.
const { FILM_VIDEO, FILM_VIDEO_TRANSCRIPT } = loadTs("lib/landing/film/video.ts");
const { chapterOf } = loadTs("lib/landing/film/player.ts");
const file = (src) => join("public", src);

/** An MP4's top-level boxes in order, its length, and each track's codecs string (RFC 6381) from its sample entry. */
function mp4(path) {
  const fd = openSync(path, "r"), size = statSync(path).size, top = [];
  for (let p = 0; p < size;) {
    const h = Buffer.alloc(16);
    readSync(fd, h, 0, 16, p);
    let s = h.readUInt32BE(0);
    if (s === 1) s = Number(h.readBigUInt64BE(8));
    if (s === 0) s = size - p;
    top.push({ type: h.toString("latin1", 4, 8), at: p, size: s });
    p += s;
  }
  const mv = top.find((b) => b.type === "moov"), buf = Buffer.alloc(mv.size);
  readSync(fd, buf, 0, mv.size, mv.at);
  closeSync(fd);
  const kids = (at, end) => {
    const out = [];
    for (let p = at; p + 8 <= end; p += buf.readUInt32BE(p)) out.push({ type: buf.toString("latin1", p + 4, p + 8), at: p, body: p + 8, end: p + buf.readUInt32BE(p) });
    return out;
  };
  const find = (b, ...path) => path.reduce((x, t) => x && kids(x.body, x.end).find((k) => k.type === t), b);
  const moov = { body: 8, end: mv.size };
  const mvhd = find(moov, "mvhd"), v1 = buf[mvhd.body] === 1;
  const scale = buf.readUInt32BE(mvhd.body + (v1 ? 20 : 12)), length = v1 ? Number(buf.readBigUInt64BE(mvhd.body + 24)) : buf.readUInt32BE(mvhd.body + 16);
  const hex = (n) => n.toString(16).toUpperCase().padStart(2, "0");
  const codecs = kids(moov.body, moov.end).filter((k) => k.type === "trak").map((t) => {
    const stsd = find(t, "mdia", "minf", "stbl", "stsd"), entry = kids(stsd.body + 8, stsd.end)[0];
    if (entry.type === "mp4a") return "mp4a.40.2";
    const size = { w: buf.readUInt16BE(entry.body + 24), h: buf.readUInt16BE(entry.body + 26) };
    const conf = kids(entry.body + 78, entry.end).find((k) => k.type === "hvcC" || k.type === "avcC");
    if (conf.type === "avcC") return { ...size, codecs: `${entry.type}.${[1, 2, 3].map((i) => hex(buf[conf.body + i])).join("")}` };
    // HEVC: profile, its compatibility flags bit-reversed, tier and level, then the constraint bytes up to the last set
    const p = conf.body + 1, b = buf[p];
    let flags = buf.readUInt32BE(p + 1), rev = 0;
    for (let i = 0; i < 32; i++) { rev = (rev << 1) | (flags & 1); flags >>>= 1; }
    const cons = [...buf.subarray(p + 5, p + 11)];
    while (cons.length && cons.at(-1) === 0) cons.pop();
    const parts = [`${["", "A", "B", "C"][b >> 6]}${b & 31}`, (rev >>> 0).toString(16).toUpperCase(), `${(b >> 5) & 1 ? "H" : "L"}${buf[p + 11]}`, ...cons.map(hex)];
    return { ...size, codecs: `${entry.type}.${parts.join(".")}` };
  });
  return { size, order: top.map((b) => b.type), duration: length / scale, video: codecs.find((c) => typeof c === "object"), audio: codecs.find((c) => typeof c === "string") };
}

test("the film's parts start at its start, in order, each long enough to name, as its own cards name them", () => {
  const { chapters, duration } = FILM_VIDEO;
  assert.deepEqual([...chapters.map((c) => c.title)], ["Today", "Fovea", "Next"]);
  assert.equal(chapters[0].at, 0);
  chapters.forEach((c, i) => {
    const stop = chapters[i + 1]?.at ?? duration;
    assert.ok(stop - c.at >= 10, `${c.title}: ${(stop - c.at).toFixed(1)} s`);
  });
  assert.equal(chapterOf(chapters, chapters[1].at - 0.01), 0);
  assert.equal(chapterOf(chapters, chapters[1].at), 1);
  assert.equal(chapterOf(chapters, duration), 2);
});

test("each copy is there, small enough for the page, its index first, and the film's length", () => {
  for (const s of FILM_VIDEO.sources) {
    assert.ok(existsSync(file(s.src)), s.src);
    const m = mp4(file(s.src));
    assert.ok(m.size < 50e6, `${s.src}: ${(m.size / 1e6).toFixed(1)} MB (GitHub warns past 50 MB)`);
    assert.ok(m.order.indexOf("moov") < m.order.indexOf("mdat"), `${s.src}: the index comes after the picture (${m.order})`);
    assert.ok(Math.abs(m.duration - FILM_VIDEO.duration) < 0.1, `${s.src}: ${m.duration} s`);
  }
});

test("each copy says what it is: its own codecs, HEVC tagged hvc1 (as Safari needs), and its size", () => {
  const sizes = { 1440: [2560, 1440], 720: [1280, 720], 1080: [1920, 1080] };
  for (const s of FILM_VIDEO.sources) {
    const m = mp4(file(s.src));
    assert.equal(s.type, `video/mp4; codecs="${m.video.codecs}, ${m.audio}"`, s.src);
    assert.match(m.video.codecs, /^(hvc1|avc1)\./, s.src);
    const [w, h] = sizes[s.src.match(/-(\d+)\.mp4$/)[1]];
    assert.deepEqual([m.video.w, m.video.h], [w, h], s.src);
  }
});

test("a browser picks the copy for its screen, and every browser has one it can play", () => {
  const [wide, phone, any] = FILM_VIDEO.sources;
  assert.match(wide.type, /hvc1/);
  assert.match(phone.type, /hvc1/);
  assert.equal(wide.media, "(min-width: 900px)");
  assert.equal(phone.media, "(max-width: 899px)");
  assert.equal("media" in any, false, "the last copy is for any screen");
  assert.match(any.type, /avc1/, "and H.264, which every browser plays");
});

test("the title card stands in where nothing plays by itself; the music is credited; the words say what the film does", () => {
  assert.ok(existsSync(file(FILM_VIDEO.poster)));
  assert.ok(statSync(file(FILM_VIDEO.poster)).size < 300e3);
  const m = FILM_VIDEO.music;
  assert.deepEqual([m.title, m.by, m.license], ["Petrichor", "Scott Buckley", "CC BY 4.0"]);
  assert.match(m.licenseHref, /creativecommons\.org\/licenses\/by\/4\.0/);
  assert.ok(FILM_VIDEO_TRANSCRIPT.startsWith("“Imagine interacting with agents, effortlessly.”"));
  assert.ok(FILM_VIDEO_TRANSCRIPT.includes("Petrichor") && FILM_VIDEO_TRANSCRIPT.includes("Scott Buckley"));
  assert.ok(FILM_VIDEO_TRANSCRIPT.includes("enter sends it") && !/\breturn\b/i.test(FILM_VIDEO_TRANSCRIPT), "the key that sends is enter");
  // Yulun's notes (Oct 27): FoveaOS right after Next, and the hardware card's line
  const next = FILM_VIDEO_TRANSCRIPT.indexOf("Next."), os = FILM_VIDEO_TRANSCRIPT.indexOf("FoveaOS");
  assert.ok(next >= 0 && os > next && os < FILM_VIDEO_TRANSCRIPT.indexOf("All your agents, as one."), "FoveaOS comes right after Next");
  assert.ok(FILM_VIDEO_TRANSCRIPT.includes("Open Spotify, find a jazz playlist, and play it."));
  assert.ok(FILM_VIDEO_TRANSCRIPT.includes("Fovea is not making another pair of glasses, rings, or necklaces."));
});
