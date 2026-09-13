/* ==========================================================================
   Fovea — landing page behaviour (v2)

   initOriginButtons  the CTA's fill grows from the cursor's entry point
   initLighting       the cursor is the light: cast shadow, table glow, and
                      the shading on the hardware's two ends follow it
   initShowcase       page two: the sticky index follows the screens as you
                      scroll, clicking an item scrolls to its screen, and the
                      screens and the closing line reveal once on the way in
                      (the demos inside the screens are demos.js)
   initGallery        page three: the camera sticks and the history's seven
                      columns slide sideways as you scroll, easing after the
                      scroll position; the rail on the right tracks it, each
                      column's picture reveals once as it arrives, and the
                      ring on the next column's send button fixates
   initForm           early-access form: posts to /api/subscribe (the site's
                      waitlist endpoint, backed by Supabase)

   No dependencies. Without JavaScript the page is the photograph at rest
   and a plain black button.
   ========================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');   // style.css hides reveal-on-scroll elements only under html.js

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* ------------------------------------------------------------------------
     Origin button (after 21st.dev › lyanchouss › Origin Button)
     The circle is placed at the pointer and sized to the farthest corner ×2
     so it covers the button from any origin; CSS animates scale 0 → 1.
     ------------------------------------------------------------------------ */
  function initOriginButtons() {
    var buttons = document.querySelectorAll('.btn--origin');
    Array.prototype.forEach.call(buttons, function (btn) {
      var fill = btn.querySelector('.btn__fill');
      if (!fill) return;

      function place(e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var d = Math.ceil(2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)));
        fill.style.left = x + 'px';
        fill.style.top = y + 'px';
        fill.style.width = d + 'px';
        fill.style.height = d + 'px';
      }

      btn.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        place(e); btn.classList.add('is-hot');
      });
      btn.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse') return;
        place(e); btn.classList.remove('is-hot');   // collapses toward the exit point
      });
      // Touch and pen: fill from the touch point while pressed
      btn.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse') return;
        place(e); btn.classList.add('is-hot');
      });
      ['pointerup', 'pointercancel'].forEach(function (type) {
        btn.addEventListener(type, function (e) {
          if (e.pointerType === 'mouse') return;
          btn.classList.remove('is-hot');
        });
      });
      // Keyboard focus is handled in CSS (:focus-visible fills from the centre).
    });
  }

  /* ------------------------------------------------------------------------
     Light rig
     Every dynamic layer is a delta from the rest light (high above the
     hardware's centre), so at rest all of them are invisible and the screen
     is the untouched photograph. The cursor's height drives the cast shadow
     and the table glow; its horizontal position drives the shading on the
     objects' two ends.
     ------------------------------------------------------------------------ */
  function initLighting() {
    if (!finePointer.matches || reduceMotion.matches) return;
    var hero = document.getElementById('hero');
    var stage = document.getElementById('stage');
    if (!hero || !stage) return;

    var soft = stage.querySelector('.stage__shadow--soft');
    var tight = stage.querySelector('.stage__shadow--tight');
    var glow = stage.querySelector('.stage__glow');
    var lightL = stage.querySelector('.lit__light--left');
    var lightR = stage.querySelector('.lit__light--right');
    var shadeL = stage.querySelector('.lit__shade--left');
    var shadeR = stage.querySelector('.lit__shade--right');
    if (!soft || !tight || !glow || !lightL || !lightR || !shadeL || !shadeR) return;

    // Tunables (see style.css › .stage)
    var css = getComputedStyle(stage);
    function num(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
    var K = {
      shift: num('--k-shift', 50), skew: num('--k-skew', 28), len: num('--k-len', .28),
      shadowA: num('--shadow-a', .35), lightA: num('--light-a', .22), shadeA: num('--shade-a', .18),
      glowA: num('--glow-a', .07), lerp: num('--lerp', .15)
    };
    // Hardware box in image space (tools/probe.swift): x 288–1349, y 555–871 of 1672×941
    var HW = { cx: 818 / 1672, top: 555 / 941, by: 871 / 941, w: 1061 / 1672, h: 316 / 941 };
    var REST = { ux: 0, uy: -1.8 };      // rest light: high above the hardware's centre, in hardware units (see apply)

    var A = null;          // hardware anchor in hero coordinates
    var restL = null;      // rest light position in hero coordinates
    var target = null, current = null;
    var raf = 0, last = 0;

    function placeBlob(el, cx, cy, size) {
      el.style.left = (cx - size / 2) + 'px';
      el.style.top = (cy - size / 2) + 'px';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
    }

    function measure() {
      var sr = stage.getBoundingClientRect(), hr = hero.getBoundingClientRect();
      var rect = { x: sr.left - hr.left, y: sr.top - hr.top, w: sr.width, h: sr.height };
      A = {
        cx: rect.x + HW.cx * rect.w,
        cy: rect.y + (HW.top + HW.h / 2) * rect.h,
        by: rect.y + HW.by * rect.h,
        w: HW.w * rect.w,
        h: HW.h * rect.h
      };
      restL = { x: A.cx + REST.ux * A.w / 2, y: A.by + REST.uy * A.h };
      // The glow blob lives in stage coordinates; the side strips are laid out in CSS
      placeBlob(glow, A.cx - rect.x, A.by - rect.y - A.h * .05, A.w * 1.6);
      if (!current) { current = { x: restL.x, y: restL.y }; target = { x: restL.x, y: restL.y }; }
      apply(current);
    }

    function apply(L) {
      var ux = clamp((L.x - A.cx) / (A.w / 2), -2.2, 2.2);
      var uy = clamp((L.y - A.by) / A.h, -3, 0.8);
      var d = Math.min(1, Math.hypot(ux - REST.ux, uy - REST.uy) / 1.2);

      // Cast shadow: pivots on the contact line and leans away from the light.
      // Light above the table (uy < 0): the shadow lies on the table toward
      // the viewer, longer the lower the light gets. Light below the contact
      // line: it stands behind the objects. It fades out where the light
      // meets the table, where a real shadow would stretch to infinity.
      var tx = -ux * K.shift;
      var sk = clamp(-ux * K.skew, -40, 40);
      var sy = uy < 0 ? -clamp(K.len / Math.max(0.35, -uy), 0.08, 0.6) : clamp(0.12 + 0.25 * uy, 0.12, 0.3);
      var t = 'translateX(' + tx.toFixed(2) + 'px) skewX(' + sk.toFixed(2) + 'deg) scaleY(' + sy.toFixed(3) + ')';
      var w = Math.min(1, Math.hypot(ux, uy) / 1.8);   // farther light → softer shadow
      var level = Math.min(1, Math.abs(uy) / 0.35);    // fade at table level
      var a = K.shadowA * d * level;
      soft.style.transform = t;  soft.style.opacity = (w * a).toFixed(3);
      tight.style.transform = t; tight.style.opacity = ((1 - w) * a).toFixed(3);

      // Side shading: the light's horizontal position, relative to the
      // hardware, decides which end of each object is lit and which end falls
      // into shade. Symmetric about the hardware so both halves of the screen
      // respond; zero when the pointer leaves (rest resets it below).
      var s = clamp(ux / 1.3, -1, 1);   // full strength near the viewport's edges
      lightR.style.opacity = (K.lightA * Math.max(0, s)).toFixed(3);
      shadeL.style.opacity = (K.shadeA * Math.max(0, s)).toFixed(3);
      lightL.style.opacity = (K.lightA * Math.max(0, -s)).toFixed(3);
      shadeR.style.opacity = (K.shadeA * Math.max(0, -s)).toFixed(3);

      // Light pool on the table
      var gx = clamp(L.x - A.cx, -A.w, A.w);
      var gy = clamp(L.y - A.by, -A.h * 1.2, A.h * 0.4);
      glow.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px)';
      glow.style.opacity = (K.glowA * d).toFixed(3);
    }

    function tick(now) {
      var dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      var k = 1 - Math.pow(1 - K.lerp, dt / 16.7);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      var remaining = Math.hypot(target.x - current.x, target.y - current.y);
      if (remaining < 0.05) { current.x = target.x; current.y = target.y; apply(current); raf = 0; last = 0; return; }
      apply(current);
      raf = requestAnimationFrame(tick);
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }

    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var hr = hero.getBoundingClientRect();
      target.x = e.clientX - hr.left;
      target.y = e.clientY - hr.top;
      wake();
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      target.x = restL.x; target.y = restL.y;
      wake();
    });

    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
    else window.addEventListener('resize', measure);
    measure();
  }

  /* ------------------------------------------------------------------------
     Showcase (page two, after diabrowser.com's "Dia reads between the tabs")
     Index item k pairs with panel k by document order. The panel whose
     centre is nearest ANCHOR × the viewport height is the active one;
     clicking an index item scrolls its panel to LAND px from the top and
     holds the tracker for HOLD ms so the glide cannot flip the state. The
     panels and the closing line get is-in once, as they are about to scroll
     into view. A <video> dropped into a slot gets a play/pause overlay.
     ------------------------------------------------------------------------ */
  function initShowcase() {
    var section = document.getElementById('showcase');
    if (!section) return;
    var items = Array.prototype.slice.call(section.querySelectorAll('.index__item'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('.panel'));
    var closing = section.querySelector('.showcase__closing');
    var n = Math.min(items.length, panels.length);
    if (!n) return;

    // Tunables (see style.css › .showcase)
    var css = getComputedStyle(section);
    function num(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
    var ANCHOR = num('--show-anchor', .4), LAND = num('--show-land', 160), HOLD = num('--show-hold', 700);

    var desktop = window.matchMedia('(min-width: 800px)');
    var useObserver = 'IntersectionObserver' in window && !reduceMotion.matches;

    // Screens with a <video>: click plays (from the start, with sound) or stops. One at a time.
    var screens = Array.prototype.slice.call(section.querySelectorAll('.screen'));
    var playing = null;
    function overlay(screen) {
      if (screen.querySelector('.screen__play')) return;
      var el = document.createElement('span');
      el.className = 'screen__play';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<span class="screen__play-btn">' +
        '<svg class="screen__ico--play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10-6.5z"/></svg>' +
        '<svg class="screen__ico--pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>' +
        '</span>';
      screen.appendChild(el);
    }
    function stop(screen) {
      var v = screen.querySelector('video');
      screen.classList.remove('is-playing');
      if (v) { v.muted = true; v.pause(); v.currentTime = 0; }
      if (playing === screen) playing = null;
    }
    function stopAll() { if (playing) stop(playing); }
    screens.forEach(function (screen) {
      var v = screen.querySelector('video');
      if (v) {
        screen.classList.add('screen--video');
        overlay(screen);
        v.addEventListener('ended', function () { stop(screen); });
      }
      screen.addEventListener('click', function () {
        var video = screen.querySelector('video');   // looked up now, so a video dropped in later still works
        if (!video) return;
        if (playing === screen) { stop(screen); return; }
        stopAll();
        screen.classList.add('screen--video', 'is-playing');
        overlay(screen);
        playing = screen;
        video.currentTime = 0;
        video.muted = false;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      });
    });

    // Active item: the panel whose centre is nearest the anchor line
    var active = -1, holdUntil = 0, raf = 0;
    function setActive(i) {
      if (i === active) return;
      active = i;
      items.forEach(function (btn, k) {
        btn.classList.toggle('is-active', k === i);
        if (k === i) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
      });
      stopAll();
    }
    function measure() {
      raf = 0;
      if (!desktop.matches || Date.now() < holdUntil) return;
      var anchor = window.innerHeight * ANCHOR, best = 0, bestD = Infinity;
      for (var i = 0; i < n; i++) {
        var r = panels[i].getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - anchor);
        if (d < bestD) { bestD = d; best = i; }
      }
      setActive(best);
    }
    function wake() { if (!raf) raf = requestAnimationFrame(measure); }

    items.forEach(function (btn, k) {
      if (k >= n) return;
      btn.addEventListener('click', function () {
        setActive(k);
        holdUntil = Date.now() + HOLD;
        window.scrollTo({
          top: panels[k].getBoundingClientRect().top + window.scrollY - LAND,
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    // Reveals: is-in once, when the element is about to scroll into view
    var panelObserver = null;
    function observe(els, margin) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: margin, threshold: 0 });
      els.forEach(function (el) { if (el) io.observe(el); });
      return io;
    }
    function observePanels() {
      if (!useObserver) return;
      if (panelObserver) panelObserver.disconnect();
      var pending = panels.filter(function (p) { return !p.classList.contains('is-in'); });
      panelObserver = observe(pending, desktop.matches ? '100px 0px' : '50px 0px');
    }
    if (useObserver) {
      observe([closing], '50px 0px');
      observePanels();
    } else {
      panels.concat([closing]).forEach(function (el) { if (el) el.classList.add('is-in'); });
    }

    function onLayoutChange() { observePanels(); wake(); }
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    if (desktop.addEventListener) desktop.addEventListener('change', onLayoutChange);
    else desktop.addListener(onLayoutChange);
    measure();
  }

  /* ------------------------------------------------------------------------
     Gallery (page three, after en.ruien.be's horizontal room)
     On desktop the camera sticks for the length of the run and the strip
     slides left as the page scrolls down. The run is as tall as the strip
     has to travel (× RATIO) plus a hold at the end (HOLD × the viewport
     height), so the last frame settles before the camera lets go. The strip
     eases toward where the scroll position puts it (LERP per 60fps frame,
     the light rig's loop) and jumps instead while the run is off screen, so
     a leap past it never leaves a stale glide. The rail's thumb is the
     viewport's share of the strip, like a scrollbar's. Without pinning
     (below 800px, reduced motion) the strip scrolls sideways natively and
     the same thumb follows its scrollLeft.
     ------------------------------------------------------------------------ */
  function initGallery() {
    var section = document.getElementById('gallery');
    if (!section) return;
    var run = section.querySelector('.gallery__run');
    var camera = section.querySelector('.gallery__camera');
    var strip = section.querySelector('.gallery__strip');
    var rail = section.querySelector('.gallery__rail');
    var thumb = section.querySelector('.gallery__thumb');
    if (!run || !camera || !strip || !rail || !thumb) return;

    // Tunables (see style.css › .gallery)
    var css = getComputedStyle(section);
    function num(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
    var RATIO = num('--gal-ratio', 1.2), HOLD = num('--gal-hold', .2), LERP = num('--gal-lerp', .12);

    var desktop = window.matchMedia('(min-width: 800px)');
    var pinned = false;
    var travel = 0, range = 0, hold = 0, track = 0, thumbLen = 0;   // px, from measure()
    var target = 0, current = null;                                  // the strip's offset: where it should be, where it is
    var raf = 0, last = 0;

    function measure() {
      var view, total;
      if (pinned) {
        var camH = camera.offsetHeight;
        view = camera.clientWidth; total = strip.scrollWidth;
        travel = Math.max(0, total - view);
        hold = camH * HOLD;
        run.style.height = Math.round(camH + travel * RATIO + hold) + 'px';
        range = run.offsetHeight - camH;                 // the pinned run
        track = rail.clientHeight;
      } else {
        view = strip.clientWidth; total = strip.scrollWidth;
        travel = Math.max(0, total - view);
        track = rail.clientWidth;
      }
      thumbLen = total ? clamp(Math.round(track * view / total), Math.min(20, track), track) : track;
      thumb.style.width = thumb.style.height = '';
      thumb.style[pinned ? 'height' : 'width'] = thumbLen + 'px';
      wake();
    }

    function apply(x) {
      var p = travel ? -x / travel : 0;
      var t = ((track - thumbLen) * p).toFixed(2);
      if (pinned) strip.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      thumb.style.transform = pinned ? 'translate3d(0,' + t + 'px,0)' : 'translate3d(' + t + 'px,0,0)';
    }

    function tick(now) {
      var away = false;
      if (pinned) {
        var r = run.getBoundingClientRect();
        var y = clamp(-r.top, 0, range);                          // how far into the run the page has scrolled
        target = -travel * clamp(y / Math.max(1, range - hold), 0, 1);
        away = r.bottom <= 0 || r.top >= window.innerHeight;      // the whole run is off screen
      } else {
        target = -strip.scrollLeft;
      }
      // Jump rather than glide: the first frame, off screen, or not pinned (the strip scrolls natively then)
      if (current === null || away || !pinned) { current = target; apply(current); raf = 0; last = 0; return; }
      var dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      var k = 1 - Math.pow(1 - LERP, dt / 16.7);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.1) { current = target; apply(current); raf = 0; last = 0; return; }
      apply(current);
      raf = requestAnimationFrame(tick);
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }

    // Pinned at 800px and up when motion is allowed; a native sideways scroller otherwise
    function setMode() {
      pinned = desktop.matches && !reduceMotion.matches;
      section.classList.toggle('is-pinned', pinned);
      if (!pinned) { strip.style.transform = ''; run.style.height = ''; }
      current = null;                                             // the next frame snaps
      measure();
    }

    window.addEventListener('scroll', wake, { passive: true });   // pinned: the page drives the strip
    strip.addEventListener('scroll', wake, { passive: true });    // not pinned: the strip drives the thumb
    window.addEventListener('resize', measure);
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(strip);
    if (desktop.addEventListener) desktop.addEventListener('change', setMode);
    else desktop.addListener(setMode);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', setMode);
    else reduceMotion.addListener(setMode);
    setMode();

    // Reveal — each column gets is-in once, as it comes into view; style.css fades the column's
    // subject up, and columns that arrive in the same frame go left to right, --gal-stagger ms
    // apart. Under reduced motion, or without observers, everything shows.
    var cols = Array.prototype.slice.call(section.querySelectorAll('.gallery__col'));
    var STAGGER = num('--gal-stagger', 110);
    if ('IntersectionObserver' in window && !reduceMotion.matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return cols.indexOf(a.target) - cols.indexOf(b.target); })
          .forEach(function (e, k) {
            e.target.style.setProperty('--reveal', (k * STAGGER) + 'ms');
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          });
      }, { threshold: .3 });
      cols.forEach(function (col) { io.observe(col); });
    } else {
      cols.forEach(function (col) { col.classList.add('is-in'); });
    }

    // The gaze — the ring on the next column's send button fixates like the demos' ring
    // (demos.js › Scene.jitter): every 1000 / GAZE_HZ ms it lands on a random point within
    // GAZE_PX of its spot, square-root distributed so it favours the centre. Only while the
    // ring is on screen and the tab is visible; never under reduced motion.
    var rings = Array.prototype.slice.call(section.querySelectorAll('.pill__ring'));
    var GAZE_PX = num('--gal-gaze-px', 3), GAZE_HZ = num('--gal-gaze-hz', 8);
    if (rings.length && !reduceMotion.matches) {
      var gazeRaf = 0, gazeNext = 0, gazeSeen = !('IntersectionObserver' in window);
      function gaze(now) {
        if (!gazeSeen || document.hidden) { gazeRaf = 0; return; }
        if (now >= gazeNext) {
          gazeNext = now + 1000 / GAZE_HZ;
          rings.forEach(function (ring) {
            var a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * GAZE_PX;
            ring.style.transform = 'translate(' + (Math.cos(a) * d).toFixed(2) + 'px,' + (Math.sin(a) * d).toFixed(2) + 'px)';
          });
        }
        gazeRaf = requestAnimationFrame(gaze);
      }
      function gazeWake() { if (gazeSeen && !document.hidden && !gazeRaf) gazeRaf = requestAnimationFrame(gaze); }
      if ('IntersectionObserver' in window) {
        var gio = new IntersectionObserver(function (entries) {
          gazeSeen = entries.some(function (e) { return e.isIntersecting; });
          gazeWake();
        }, { threshold: 0 });
        rings.forEach(function (ring) { gio.observe(ring); });
      }
      document.addEventListener('visibilitychange', gazeWake);
      gazeWake();
    }
  }

  /* ------------------------------------------------------------------------
     Early access form. Posts { email, agents } as JSON to /api/subscribe, the
     site's waitlist endpoint (foveafrontend › app/api/subscribe, Supabase
     table "leads"). 200 and 409 (already on the list) both count as done: the
     form hides and the status line takes focus; anything else keeps the form
     and shows the endpoint's message.
     ------------------------------------------------------------------------ */
  function initForm() {
    var form = document.getElementById('access-form');
    var status = document.getElementById('access-status');
    if (!form || !status) return;
    var button = form.querySelector('button[type="submit"]');
    function done(text) { form.classList.add('is-done'); status.textContent = text; status.focus(); }
    function fail(text) { status.textContent = text; if (button) button.disabled = false; status.focus(); }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var payload = { email: String(data.get('email') || '').trim() };
      var agents = String(data.get('agents') || '').trim();
      if (agents) payload.agents = agents;
      if (button) button.disabled = true;
      status.textContent = '';
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, status: res.status, body: body }; });
      }).then(function (r) {
        if (r.ok) done('Thanks. We’ll be in touch.');
        else if (r.status === 409) done('You’re already on the list. We’ll be in touch.');
        else fail((r.body && r.body.error) || 'Something went wrong. Please try again.');
      }).catch(function () {
        fail('Couldn’t reach the server. Please try again.');
      });
    });
  }

  function start() {
    initOriginButtons();
    initLighting();
    initShowcase();
    initGallery();
    initForm();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
