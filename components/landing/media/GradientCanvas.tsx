"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { fallbackBackground, Presets, rgb, type PresetName } from "../../../lib/landing/gradient";
import { reducedMotion } from "../../../lib/landing/motion";

// A soft field of colour that drifts, pulled in its middle into stretched, wavering columns: the
// reference's picture, drawn by a fragment shader at a fraction of the screen's resolution (it is
// all blur, so nothing is lost) and only while on screen. With reduced motion it is one still
// frame; without WebGL, the same colours as CSS light.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCream, uCool, uWarmA, uWarmB, uYellow;
uniform float uStripes, uBand, uBandWidth, uSeed;
const float COLS = 46.0;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// The light before it's pulled: cream above, a cool haze across the middle, warm at the foot.
vec3 field(vec2 p, float t) {
  vec3 col = uCream;
  float haze = exp(-pow((p.y - 0.47 - 0.06 * sin(p.x * 3.1 + t * 0.31 + uSeed)) / 0.17, 2.0));
  col = mix(col, uCool, haze * 0.9);
  float foot = smoothstep(0.46, 0.02, p.y + 0.07 * sin(p.x * 4.3 - t * 0.27 + uSeed));
  vec3 warm = mix(uWarmA, uWarmB, smoothstep(0.15, 0.85, p.x + 0.18 * sin(t * 0.21 + p.y * 3.0 + uSeed)));
  col = mix(col, warm, foot);
  float sun = exp(-pow(length(p - vec2(0.12 + 0.08 * sin(t * 0.17 + uSeed), 0.2)) / 0.24, 2.0));
  col = mix(col, uYellow, sun * 0.45);
  return col;
}

// One column of the band: the field sampled from somewhere else, pulled up or down, and repeated
// along it in long soft ovals.
vec3 column(float ci, vec2 uv, float band, float t) {
  float r = hash(vec2(ci, uSeed));
  float cx = (ci + 0.5) / COLS;
  float rep = sin(uv.y * (6.0 + r * 8.0) + t * (0.3 + r * 0.55) + r * 6.28);
  vec2 sp = vec2(mix(uv.x, cx + (r - 0.5) * 0.25, band), uv.y + band * (rep * 0.09 + (r - 0.5) * 0.24));
  vec3 col = field(sp, t);
  vec3 hue = r < 0.34 ? uWarmB : (r < 0.67 ? uWarmA : uCool);
  return mix(col, hue, band * smoothstep(-0.3, 1.0, rep) * 0.92);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float c = uBand + 0.04 * sin(t * 0.13 + uSeed);
  float band = exp(-pow((uv.x - c) / uBandWidth, 2.0)) * uStripes;
  float x = uv.x * COLS;
  float ci = floor(x);
  // Neighbouring columns run into each other, as if a little out of focus.
  float f = smoothstep(0.12, 0.88, fract(x));
  vec3 col = mix(column(ci, uv, band, t), column(ci + 1.0, uv, band, t), f);
  col += (hash(uv * uRes + fract(t)) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Rendered at this fraction of its size on screen. */
const SCALE = 0.5;

type Props = { preset: PresetName; className?: string; style?: CSSProperties };

export default function GradientCanvas({ preset, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = Presets[preset];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.dataset.fallback = "";
      return;
    }
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.dataset.fallback = "";
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const [cream, cool, warmA, warmB, yellow] = p.colors.map(rgb);
    gl.uniform3fv(u("uCream"), cream);
    gl.uniform3fv(u("uCool"), cool);
    gl.uniform3fv(u("uWarmA"), warmA);
    gl.uniform3fv(u("uWarmB"), warmB);
    gl.uniform3fv(u("uYellow"), yellow);
    gl.uniform1f(u("uStripes"), p.stripes);
    gl.uniform1f(u("uBand"), p.band);
    gl.uniform1f(u("uBandWidth"), p.bandWidth);
    gl.uniform1f(u("uSeed"), p.seed);
    const uRes = u("uRes");
    const uTime = u("uTime");

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * SCALE));
      const h = Math.max(1, Math.round(r.height * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };
    let last = 12;
    const draw = (seconds: number) => {
      last = seconds;
      gl.uniform1f(uTime, seconds * p.speed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    size();
    const still = reducedMotion();
    let frame = 0;
    let visible = false;
    const start = performance.now() - 20000 * (p.seed % 1);
    const loop = (now: number) => {
      frame = 0;
      if (!visible) return;
      draw((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    };
    draw(12);
    canvas.dataset.ready = "";
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !still && !frame) frame = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    // A new size clears the canvas: draw again at once rather than wait for the next frame.
    const ro = new ResizeObserver(() => {
      size();
      draw(last);
    });
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [p]);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      style={{ background: fallbackBackground(p), ...style }}
    />
  );
}
