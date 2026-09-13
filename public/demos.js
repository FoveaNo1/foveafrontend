/* ==========================================================================
   Fovea — page-two demos (demos.css holds the form; this file, the beats)

   Four code-rendered demos over static desktop plates, one per showcase
   screen: the notch, the Island's panels, the gaze ring, the cursor and the
   key cap are DOM drawn over the plate. All form follows the Island in
   ../app-ui-v1 (Tokens.swift, NotchGeometry.swift, Island/Views); the beats
   follow the hand-off spec (fovea-site/agent.md in fovea-site.zip) and the
   notes on it.

   Scene      one demo's layers, and setters for everything that can change
   Demo       a pausable rAF clock that fires a script's beats and drivers;
              every demo fades in from black at its start and out at its end
   SCRIPTS    the four scripts: attach, choose, open, chase
   initDemos  gating: a demo plays only while its screen is in view, at most
              two at a time (one below 800px); reduced motion shows the final
              frame of each

   Coordinates are plate pixels (1672 × 941), which are also the Island's
   points (demos.css › --px). No dependencies. Without JavaScript each screen
   is its plate. For a look at any moment: foveaDemos[n].seek(ms) in the
   console, then .play().
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var narrow = window.matchMedia('(max-width: 799px)');

  var PLATE = { w: 1672, h: 941 };
  var PLATES = 'assets/plates/';
  var MARKS = 'assets/island/';
  var NOTCH_H = 25;

  // Island phases: body width (frame − 2 × ear radius), ear radius, bottom radius, density rank — NotchGeometry.swift › frames
  var PHASE = {
    resting: { w: 200, tr: 6, br: 14, rank: 0 },
    voice: { w: 200, tr: 6, br: 14, rank: 1 },
    list: { w: 482, tr: 19, br: 24, rank: 2 },
    review: { w: 522, tr: 19, br: 24, rank: 3 },
    slab: { w: 560, tr: 0, br: 20, rank: 4 }
  };
  // Geometry springs, ms — Tokens.Motion.Spring, all critically damped
  var SPRING = { open: 340, close: 300, convert: 280, hover: 180 };

  // Where the ring lands, and the region each referent thumbnail shows — plate px, measured on the plates
  var T = {
    A: { x: 452, y: 293, plate: 'desk-moodboard', crop: [350, 218, 205, 149] },   // "Small Numbers Big Ideas"
    B: { x: 677, y: 289, plate: 'desk-moodboard', crop: [570, 214, 215, 156] },   // "Play Anywhere"
    C: { x: 790, y: 298, plate: 'desk-code', crop: [580, 146, 420, 305] },        // the List { … } block
    notch: { x: 836, y: 14 }
  };

  var STATUS = { needs: 'Needs you', complete: 'Complete', working: 'Working', failed: 'Failed' };
  // The Agent list: the app's fixtures (Fixtures.swift › agentTasks) plus the task demo 02 routes to.
  // Order is the grouping: Needs you → Complete → Working → Failed, newest first within a group.
  function tasks(heroActivity) {
    return [
      { id: 'dictionary', dest: 'cursor', name: 'Dictionary polish', act: 'Choose a spacing option', state: 'needs' },
      { id: 'schema', dest: 'codex', name: 'Schema', act: 'Ready to review', state: 'complete' },
      { id: 'hero', dest: 'claude-code', name: 'Hero layout', act: heroActivity, state: 'working' },
      { id: 'onboarding', dest: 'claude-code', name: 'Fovea', act: 'Editing the empty state view', state: 'working' },
      { id: 'nil-check', dest: 'claude-code', name: 'Fovea', act: 'Build failed · 2 errors', state: 'failed' }
    ];
  }
  // The recent-chats panel (Fixtures.swift › chats, with the routed Chat first)
  var RECENTS = [
    { id: 'hero', dest: 'claude-code', name: 'Hero layout', time: '12m' },
    { id: 'dictionary', dest: 'cursor', name: 'Dictionary polish', time: '41m' },
    { id: 'launch', dest: 'chatgpt', name: 'Launch copy review', time: '2h' },
    { id: 'permissions', dest: 'claude-code', name: 'Capture permissions', time: '5h' },
    { id: 'routing', dest: 'codex', name: 'Agent routing', time: '9h' },
    { id: 'qa', dest: 'claude-code', name: 'Quick Answer layout', time: '11h' },
    { id: 'onboarding', dest: 'cursor', name: 'Onboarding polish', time: '14h' },
    { id: 'model', dest: 'chatgpt', name: 'Model routing', time: '17h' },
    { id: 'capture', dest: 'chatgpt', name: 'Capture flow', time: '20h' },
    { id: 'marketing', dest: 'cursor', name: 'Marketing review', time: '23h' }
  ];
  var TRANSCRIPT_01 = 'Use this and this, work them into this the way that paper from yesterday does it';
  var DIFF = {
    file: 'hero.css',
    lines: [
      ['ctx', '.hero__headline {'],
      ['del', '  white-space: nowrap;'],
      ['add', '  text-wrap: balance;'],
      ['del', '  font-size: clamp(2.25rem, 3.6vw, 4rem);'],
      ['add', '  font-size: clamp(2rem, 3.2vw, 4rem);'],
      ['ctx', '}']
    ]
  };

  var ARROW_UP = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 10.4V2M2.6 5.4 6 2l3.4 3.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_OUT = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4.4 3H9v4.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.6l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var PLUS_CIRCLE = '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6 3.6v4.8M3.6 6h4.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
  var MAGNIFIER = '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="5.2" cy="5.2" r="3.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 8l3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var DOC = '<svg viewBox="0 0 14 16" aria-hidden="true"><path d="M2.5 1.5h6l3 3v10h-9zM8.5 1.5v3h3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  var CURSOR = '<svg viewBox="0 0 14 21" aria-hidden="true"><path d="M1 1v15.4l3.9-3.5 2.6 6.1 2.6-1.1-2.6-6h5.1z" fill="#000" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function easeInOutCubic(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }
  function reflow(node) { return node.offsetWidth; }

  // Destination marks: official artwork; Claude keeps its colour, the others are white templates (IslandControls.swift)
  function mark(dest) {
    if (dest === 'claude-code') {
      var img = el('img', 'island__mark');
      img.src = MARKS + 'claude-code.png';
      img.alt = '';
      return img;
    }
    var s = el('span', 'island__mark island__mark--tint');
    s.style.setProperty('--mark', 'url(' + MARKS + dest + '.png)');
    return s;
  }
  // The state word; Working and Needs you shimmer (a working agent is never static)
  function statusEl(state) {
    var s = el('span', 'island__status island__status--' + state);
    if (state === 'working') s.appendChild(el('span', 'island__status-dot'));
    s.appendChild(el('span', state === 'working' || state === 'needs' ? 'island__shimmer' : null, STATUS[state]));
    return s;
  }

  /* ------------------------------------------------------------------------
     Scene — the layers of one demo, and setters for everything that changes.
     Setters only toggle classes, set text, or write a transform; the timing
     is in demos.css. Under `static` (a snap, or reduced motion) they finish
     instantly. Drivers are the per-frame pieces (typing, cursor paths, ring
     jitter, the waveforms); each is a function of the demo time that returns
     false when done.
     ------------------------------------------------------------------------ */
  function Scene(root) {
    this.root = root;
    this.static = false;
    this.t = 0;
    this.px = 1;
    this.drivers = [];
    this.phase = 'resting';
    this.content = null;
    this.ringAt = null;
    this.cursorAt = { x: 0, y: 0 };

    var css = getComputedStyle(root);
    function num(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
    this.K = {
      wordMs: num('--word-ms', 210), jitterPx: num('--ring-jitter-px', 3), jitterHz: num('--ring-jitter-hz', 10),
      fadeIn: num('--fade-in-ms', 600), fadeOut: num('--fade-out-ms', 500), fadeHold: num('--fade-hold-ms', 200)
    };

    var plateA = root.querySelector('img');
    plateA.classList.add('demo__plate--a');
    this.plateA = plateA;
    this.plateB = el('img', 'demo__plate demo__plate--b');
    this.blur = el('img', 'demo__plate demo__plate--blur');
    [this.plateB, this.blur].forEach(function (img) { img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; });

    this.scene = el('div', 'demo__scene');
    this.zoomEl = el('div', 'demo__zoom');
    this.notch = el('div', 'demo__notch');
    this.island = el('div', 'island is-resting');
    this.body = el('div', 'island__body');
    this.island.appendChild(this.body);
    this.ringEl = el('div', 'demo__ring');
    this.ringI = el('div', 'demo__ring-i');
    this.ringEl.appendChild(this.ringI);
    this.cursorEl = el('div', 'demo__cursor');
    this.cursorEl.innerHTML = CURSOR;
    this.dip = el('div', 'demo__dip');
    this.keyEl = el('div', 'demo__key', 'fn');
    this.keyEl.setAttribute('aria-hidden', 'true');

    var z = this.zoomEl;
    z.appendChild(plateA); z.appendChild(this.plateB); z.appendChild(this.blur);
    z.appendChild(this.notch); z.appendChild(this.island); z.appendChild(this.ringEl); z.appendChild(this.cursorEl);
    this.scene.appendChild(z); this.scene.appendChild(this.keyEl); this.scene.appendChild(this.dip);
    root.appendChild(this.scene);
    this.measure();
  }

  Scene.prototype.measure = function () {
    var w = this.root.getBoundingClientRect().width;
    if (!w) return;
    this.px = w / PLATE.w;
    // The zoom is capped so the widest Island (560) still fits the screen: below 800px the plate is wider than its screen
    var slot = this.root.parentNode ? this.root.parentNode.getBoundingClientRect().width : w;
    var cap = parseFloat(getComputedStyle(this.root).getPropertyValue('--demo-zoom-max')) || 2.2;
    var fit = .92 * (slot || w) / (560 * this.px);
    this.root.style.setProperty('--demo-zoom', Math.min(cap, fit).toFixed(3));
    if (this.ringAt) this.place(this.ringEl, this.ringAt.x, this.ringAt.y);
    this.place(this.cursorEl, this.cursorAt.x, this.cursorAt.y);
  };
  Scene.prototype.place = function (node, x, y) {
    node.style.transform = 'translate3d(' + (x * this.px).toFixed(2) + 'px,' + (y * this.px).toFixed(2) + 'px,0)';
  };
  // A DOM point in plate coordinates, whatever the zoom is doing right now
  Scene.prototype.point = function (node) {
    var r = node.getBoundingClientRect(), z = this.zoomEl.getBoundingClientRect();
    var k = z.width / (PLATE.w * this.px) || 1;
    return { x: (r.left + r.width / 2 - z.left) / (this.px * k), y: (r.top + r.height / 2 - z.top) / (this.px * k) };
  };
  Scene.prototype.snap = function (fn) {
    this.root.classList.add('is-static');
    this.static = true;
    this.drivers.length = 0;
    fn(this);
    reflow(this.root);
    this.static = false;
    this.root.classList.remove('is-static');
  };
  Scene.prototype.run = function (t) {
    this.t = t;
    for (var i = this.drivers.length - 1; i >= 0; i--) {
      if (!this.drivers[i](t)) this.drivers.splice(i, 1);
    }
  };
  Scene.prototype.after = function (ms, fn) {
    if (this.static) { fn(); return; }
    var t0 = this.t;
    this.drivers.push(function (t) { if (t - t0 < ms) return true; fn(); return false; });
  };

  /* The fade, plates and the camera */
  Scene.prototype.lit = function (on) { this.root.classList.toggle('is-lit', on); };
  Scene.prototype.plate = function (name, blurName) {
    var a = PLATES + name + '.jpg';
    if (this.plateA.getAttribute('src') !== a) this.plateA.src = a;
    this.plateB.classList.remove('is-on');
    var b = PLATES + (blurName || name) + '-blur.jpg';
    if (this.blur.getAttribute('src') !== b) this.blur.src = b;
  };
  Scene.prototype.crossfade = function (name) {
    var src = PLATES + name + '.jpg';
    if (this.plateB.getAttribute('src') !== src) this.plateB.src = src;
    this.plateB.classList.add('is-on');
  };
  Scene.prototype.zoom = function (close) {
    this.zoomEl.classList.toggle('is-close', close);
    this.blur.classList.toggle('is-on', close);
  };

  /* The key and the ring: one lifetime. The ring lands where the eye is and
     travels when it moves (look); between moves it fixates with a little jitter. */
  Scene.prototype.key = function (down, target) {
    this.keyEl.classList.toggle('is-on', down);
    if (down) {
      this.ringAt = target;
      this.ringEl.style.transition = 'none';
      this.place(this.ringEl, target.x, target.y);
      reflow(this.ringEl);
      this.ringEl.style.transition = '';
      this.ringEl.classList.add('is-on');
      this.jitter();
    } else {
      this.ringEl.classList.remove('is-on');
      this.ringAt = null;
      this.ringI.style.transform = '';
    }
  };
  Scene.prototype.look = function (target) {
    if (typeof target === 'function') target = target(this);
    this.ringAt = target;
    this.place(this.ringEl, target.x, target.y);
  };
  Scene.prototype.jitter = function () {
    if (this.static) return;
    var self = this, next = this.t, step = 1000 / this.K.jitterHz, r = this.K.jitterPx;
    this.drivers.push(function (t) {
      if (!self.ringAt) return false;
      if (t >= next) {
        next = t + step;
        var a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r;
        self.ringI.style.transform = 'translate(' + (Math.cos(a) * d).toFixed(2) + 'px,' + (Math.sin(a) * d).toFixed(2) + 'px)';
      }
      return true;
    });
  };

  /* The cursor */
  Scene.prototype.cursor = function (show, at) {
    if (at) { this.cursorAt = at; this.place(this.cursorEl, at.x, at.y); }
    this.cursorEl.classList.toggle('is-on', show);
  };
  // A path in plate space: straight, or a quadratic curve through the midpoint pushed by `bow`
  Scene.prototype.cursorTo = function (to, ms, bow, ease) {
    if (typeof to === 'function') to = to(this);
    var from = { x: this.cursorAt.x, y: this.cursorAt.y };
    if (this.static) { this.cursor(this.cursorEl.classList.contains('is-on'), to); return; }
    var self = this, t0 = this.t, f = ease || easeInOutCubic;
    var c = bow ? { x: (from.x + to.x) / 2 + bow.x, y: (from.y + to.y) / 2 + bow.y } : null;
    this.drivers.push(function (t) {
      var p = clamp((t - t0) / ms, 0, 1), e = f(p), x, y;
      if (c) {
        x = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * c.x + e * e * to.x;
        y = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * c.y + e * e * to.y;
      } else {
        x = from.x + (to.x - from.x) * e;
        y = from.y + (to.y - from.y) * e;
      }
      self.cursorAt = { x: x, y: y };
      self.place(self.cursorEl, x, y);
      return p < 1;
    });
  };

  /* The Island: phase geometry + content */
  Scene.prototype.setPhase = function (phase, content) {
    var from = PHASE[this.phase], to = PHASE[phase];
    var ms = (phase === 'list' || this.phase === 'list') ? SPRING.hover
      : to.rank === from.rank ? SPRING.convert : to.rank > from.rank ? SPRING.open : SPRING.close;
    var node = content ? this.buildContent(content) : null;
    var h = NOTCH_H;
    if (node) {
      this.body.appendChild(node);
      h = Math.ceil(node.offsetHeight / this.px);
    }
    var s = this.island.style;
    s.setProperty('--is-ms', ms);
    s.setProperty('--is-w', to.w);
    s.setProperty('--tr', to.tr);
    s.setProperty('--br', to.br);
    s.setProperty('--is-h', phase === 'resting' ? NOTCH_H : h);
    this.island.classList.toggle('is-resting', phase === 'resting');
    this.swapContent(node);
    this.phase = phase;
  };
  Scene.prototype.swapContent = function (node) {
    var old = this.content;
    if (old) {
      if (this.static) old.parentNode && old.parentNode.removeChild(old);
      else {
        old.classList.add('is-leaving');
        old.addEventListener('transitionend', function done() { old.removeEventListener('transitionend', done); old.parentNode && old.parentNode.removeChild(old); });
      }
    }
    if (node && !this.static) {
      node.classList.add('is-entering');
      reflow(node);
      node.classList.remove('is-entering');
    }
    if (node) node.classList.add('is-shown');
    this.content = node;
  };
  // Re-measure the current content (after typing, a new chip, the panel) so the body follows
  Scene.prototype.fit = function () {
    if (!this.content || this.phase === 'resting') return;
    var h = Math.ceil(this.content.offsetHeight / this.px);
    if (h !== parseFloat(this.island.style.getPropertyValue('--is-h'))) {
      this.island.style.setProperty('--is-ms', SPRING.convert);
      this.island.style.setProperty('--is-h', h);
    }
  };

  Scene.prototype.buildContent = function (c) {
    var node = el('div', 'island__content island__content--' + c.kind);
    node.parts = {};
    if (c.kind === 'voice') this.buildVoice(node);
    else if (c.kind === 'review') this.buildReview(node, c);
    else if (c.kind === 'list') this.buildList(node, c);
    else if (c.kind === 'slab') this.buildSlab(node, c);
    return node;
  };
  // Listening bars: heights from ListeningView.swift's formula at level .72, 40 fps, while alive() holds
  Scene.prototype.bars = function (n, min, max, cls, alive) {
    var wave = el('span', cls), bars = [], self = this, level = .72, last = -1;
    for (var i = 0; i < n; i++) { var b = el('span', 'island__bar'); wave.appendChild(b); bars.push(b); }
    function heights(t) {
      for (var i = 0; i < n; i++) {
        var x = i / (n - 1) * 2 - 1;
        var profile = .45 + .55 * (1 - x * x);
        var flutter = self.static ? 1 : .72 + .28 * Math.sin(t * 11 + i * 1.9);
        var idle = self.static ? 0 : .05 * (Math.sin(t * 5.5 + i * .8) + 1);
        var amount = clamp(level * profile * flutter + idle, 0, 1);
        bars[i].style.transform = 'scaleY(' + ((min + (max - min) * amount) / max).toFixed(3) + ')';
      }
    }
    heights(1.3);
    if (!this.static) {
      this.drivers.push(function (t) {
        if (!alive()) return false;
        var frame = Math.floor(t / 25);
        if (frame !== last) { last = frame; heights(t / 1000); }
        return true;
      });
    }
    return wave;
  };
  Scene.prototype.buildVoice = function (node) {
    var self = this;
    node.appendChild(this.bars(9, 4, 20, 'island__wave', function () { return node === self.content; }));
  };
  Scene.prototype.buildReview = function (node, c) {
    var transcript = el('p', 'island__transcript', c.text || '');
    var row = el('div', 'island__row');
    var chips = el('div', 'island__chips');
    var self = this;
    (c.chips || []).forEach(function (id) { chips.appendChild(self.buildChip(id, true)); });
    var trail = el('div', 'island__trail');
    var pill = el('div', 'island__pill');
    pill.appendChild(el('span', 'island__pill-in'));
    var send = el('div', 'island__send' + (c.send ? ' is-on' : ''));
    send.innerHTML = ARROW_UP;
    trail.appendChild(pill); trail.appendChild(send);
    row.appendChild(chips); row.appendChild(trail);
    node.appendChild(transcript); node.appendChild(row);
    node.parts = { transcript: transcript, chips: chips, pill: pill, send: send, selector: null };
    if (c.pill) { this.pillContent(node, c.pill); pill.classList.add('is-on'); }
  };
  // A referent thumbnail: the region the ring was on, cropped out of the plate (44 × 32); or the app's document tile
  Scene.prototype.buildChip = function (id, on) {
    var chip = el('div', 'island__chip' + (on ? ' is-on' : ''));
    if (id === 'doc') {
      chip.classList.add('island__chip--doc');
      chip.innerHTML = DOC;
    } else {
      var t = T[id], crop = t.crop;
      chip.style.backgroundImage = 'url(' + PLATES + t.plate + '.jpg)';
      chip.style.backgroundSize = 'calc(var(--px) * ' + (PLATE.w / crop[2] * 44).toFixed(2) + ') auto';
      chip.style.backgroundPosition = 'calc(var(--px) * ' + (-crop[0] / crop[2] * 44).toFixed(2) + ') calc(var(--px) * ' + (-crop[1] / crop[3] * 32).toFixed(2) + ')';
    }
    return chip;
  };
  Scene.prototype.buildList = function (node, c) {
    c.tasks.forEach(function (task) {
      var row = el('div', 'island__task' + (task.id === c.recent ? ' is-recent' : ''));
      row.setAttribute('data-id', task.id);
      row.appendChild(mark(task.dest));
      var text = el('div', 'island__task-text');
      text.appendChild(el('div', 'island__task-name', task.name));
      text.appendChild(el('div', 'island__task-act' + (task.state === 'working' ? ' island__shimmer' : ''), task.act));
      row.appendChild(text);
      row.appendChild(statusEl(task.state));
      node.appendChild(row);
    });
  };
  // A field answered by voice: the placeholder says so, the bars show while the key is held, the words follow
  Scene.prototype.buildField = function (placeholder) {
    var field = el('div', 'island__field');
    var text = el('span', 'island__field-text');
    text.setAttribute('data-placeholder', placeholder);
    var send = el('span', 'island__field-send');
    send.innerHTML = ARROW_UP;
    field.appendChild(text); field.appendChild(send);
    return { el: field, text: text, send: send, bars: null };
  };
  Scene.prototype.buildSlab = function (node, c) {
    var head = el('div', 'island__head');
    head.appendChild(mark(c.head.dest));
    head.appendChild(el('span', 'island__task-name', c.head.name));
    var status = statusEl(c.head.state);
    head.appendChild(status);
    node.appendChild(head);
    node.appendChild(el('div', 'island__rule'));
    node.parts = { head: head, headStatus: status };
    if (c.question) {
      var q = el('p', 'island__q', c.question);
      node.appendChild(q);
      node.parts.question = q;
      node.parts.answer = this.buildField('Hold fn to answer…');
      node.appendChild(node.parts.answer.el);
    }
    if (c.diff) {
      var diff = el('div', 'island__diff');
      diff.appendChild(el('div', 'island__diff-file', c.diff.file));
      c.diff.lines.forEach(function (ln, i) {
        var line = el('div', 'island__diff-line is-' + ln[0]);
        line.style.transitionDelay = (120 + i * 30) + 'ms';
        line.appendChild(el('span', 'island__diff-gutter', ln[0] === 'add' ? '+' : ln[0] === 'del' ? '−' : ' '));
        line.appendChild(el('span', null, ln[1]));
        diff.appendChild(line);
        if (ln[0] === 'add') node.parts.lastAdd = line;
      });
      node.appendChild(diff);
      var foot = el('div', 'island__foot' + (c.footer ? ' is-on' : ''));
      var button = el('div', 'island__button');
      button.innerHTML = ARROW_OUT + '<span>Take me there</span>';
      node.parts.follow = this.buildField('Hold fn to follow up…');
      foot.appendChild(button); foot.appendChild(node.parts.follow.el);
      node.appendChild(foot);
      node.parts.foot = foot;
    }
  };
  Scene.prototype.buildSelector = function (selectedId) {
    var sel = el('div', 'island__sel');
    var head = el('div', 'island__sel-head');
    head.appendChild(el('span', 'island__sel-chip', 'Recent · Last 24 hours'));
    var actions = el('span', 'island__sel-actions');
    [['New Chat', PLUS_CIRCLE], ['Search Chats', MAGNIFIER]].forEach(function (b) {
      var btn = el('span', 'island__sel-btn');
      btn.innerHTML = b[1] + '<span>' + b[0] + '</span>';
      actions.appendChild(btn);
    });
    head.appendChild(actions);
    sel.appendChild(head);
    var grid = el('div', 'island__sel-grid');
    RECENTS.forEach(function (r) {
      var row = el('div', 'island__sel-row' + (r.id === selectedId ? ' is-selected' : ''));
      row.appendChild(mark(r.dest));
      row.appendChild(el('span', 'island__sel-name', r.name));
      row.appendChild(el('span', 'island__sel-time', r.time));
      grid.appendChild(row);
    });
    sel.appendChild(grid);
    return sel;
  };

  /* Mutations of the live content */
  // Words arrive at speech pace; a phrase's last word lands, then its referent appears (the beats do that)
  Scene.prototype.type = function (phrase, target) {
    target = target || this.content.parts.transcript;
    var prefix = target.textContent ? target.textContent + ' ' : '';
    if (this.static) { target.textContent = prefix + phrase; return; }
    var self = this, words = phrase.split(' '), k = 0, t0 = this.t, wordMs = this.K.wordMs;
    this.drivers.push(function (t) {
      var n = Math.min(words.length, Math.floor((t - t0) / wordMs) + 1);
      if (n > k) { k = n; target.textContent = prefix + words.slice(0, k).join(' '); }
      if (k >= words.length) { self.fit(); return false; }
      return true;
    });
  };
  Scene.prototype.chip = function (id) {
    var chip = this.buildChip(id, this.static);
    this.content.parts.chips.appendChild(chip);
    if (!this.static) { reflow(chip); chip.classList.add('is-on'); }
    this.fit();
  };
  // The pill: 'resolving' (spinner + Choosing Chat) or the Chat's name; the width is reserved so nothing jumps
  Scene.prototype.pillContent = function (node, state) {
    var inner = node.parts.pill.firstChild;
    inner.textContent = '';
    if (state === 'resolving') {
      inner.appendChild(el('span', 'island__spin'));
      inner.appendChild(el('span', 'island__pill-name island__pill-name--dim', 'Choosing Chat'));
    } else {
      inner.appendChild(mark('claude-code'));
      inner.appendChild(el('span', 'island__pill-name', state));
      var chev = el('span', 'island__chev');
      chev.innerHTML = CHEVRON;
      inner.appendChild(chev);
    }
  };
  Scene.prototype.pill = function (state) {
    var node = this.content, pill = node.parts.pill, inner = pill.firstChild, self = this;
    if (this.static || !pill.classList.contains('is-on')) {
      this.pillContent(node, state);
      pill.classList.add('is-on');
      return;
    }
    inner.classList.add('is-swapping');
    this.after(90, function () { self.pillContent(node, state); reflow(inner); inner.classList.remove('is-swapping'); });
  };
  Scene.prototype.selector = function (open, selectedId) {
    var parts = this.content.parts;
    parts.pill.classList.toggle('is-open', open);
    if (open) {
      var sel = this.buildSelector(selectedId || 'hero');
      this.content.appendChild(sel);
      parts.selector = sel;
      if (!this.static) reflow(sel);
      sel.classList.add('is-on');
    } else if (parts.selector) {
      parts.selector.parentNode.removeChild(parts.selector);
      parts.selector = null;
    }
    this.fit();
  };
  Scene.prototype.send = function (on) { this.content.parts.send.classList.toggle('is-on', on); };
  Scene.prototype.press = function (node) {
    node = node || this.content.parts.send;
    if (this.static) return;
    node.classList.add('is-pressed');
    this.after(80, function () { node.classList.remove('is-pressed'); });
  };
  Scene.prototype.highlight = function (id) {
    var rows = this.content.querySelectorAll('.island__task');
    for (var i = 0; i < rows.length; i++) rows[i].classList.toggle('is-recent', rows[i].getAttribute('data-id') === id);
  };
  // Fields: which = 'answer' | 'follow'
  Scene.prototype.fieldListen = function (which, on) {
    var f = this.content.parts[which];
    f.el.classList.toggle('is-listening', on);
    if (on && !f.bars) {
      f.bars = this.bars(5, 3, 12, 'island__field-bars', function () { return f.el.classList.contains('is-listening'); });
      f.el.insertBefore(f.bars, f.send);
    } else if (!on && f.bars) {
      f.el.removeChild(f.bars);
      f.bars = null;
    }
  };
  Scene.prototype.fieldType = function (which, text) {
    this.fieldListen(which, false);
    this.type(text, this.content.parts[which].text);
  };
  Scene.prototype.fieldSend = function (which, on) { this.content.parts[which].send.classList.toggle('is-on', on); };
  Scene.prototype.fieldPress = function (which) { this.press(this.content.parts[which].send); };
  Scene.prototype.fieldClear = function (which) {
    var f = this.content.parts[which];
    f.text.textContent = '';
    f.send.classList.remove('is-on');
  };
  Scene.prototype.footer = function (on) { this.content.parts.foot.classList.toggle('is-on', on); };
  Scene.prototype.headStatus = function (state) {
    var parts = this.content.parts, s = statusEl(state);
    parts.head.replaceChild(s, parts.headStatus);
    parts.headStatus = s;
  };
  Scene.prototype.at = function (part) { var self = this; return function () { return self.point(self.content.parts[part]); }; };

  /* ------------------------------------------------------------------------
     Demo — one script on one scene. A rAF clock (dt capped at 64ms) fires the
     beats whose time has come and runs the scene's drivers. Every demo fades
     in from black at 0, fades out at `duration`, and under the black snaps
     back to its opening state before looping. Paused demos freeze mid-beat
     and resume where they were.
     ------------------------------------------------------------------------ */
  function Demo(root, script) {
    var self = this;
    this.root = root;
    this.script = script;
    this.scene = new Scene(root);
    var K = this.scene.K;
    this.total = script.duration + K.fadeOut + K.fadeHold;
    this.beats = script.beats.slice();
    this.beats.push({ at: 0, run: function (s) { s.lit(true); } });
    this.beats.push({ at: script.duration, run: function (s) { s.lit(false); } });
    this.beats.push({ at: this.total, run: function (s) { s.snap(script.opening); } });
    this.beats.sort(function (a, b) { return a.at - b.at; });
    this.t = 0; this.i = 0; this.last = 0; this.raf = 0; this.playing = false; this.ratio = 0;
    this.tick = function (now) { self.frame(now); };
    this.scene.snap(script.opening);   // black until it plays
  }
  Demo.prototype.frame = function (now) {
    this.raf = 0;
    if (!this.playing) return;
    var dt = this.last ? Math.min(64, now - this.last) : 16.7;
    this.last = now;
    this.t += dt;
    this.scene.t = this.t;
    while (this.i < this.beats.length && this.beats[this.i].at <= this.t) this.beats[this.i++].run(this.scene, this);
    this.scene.run(this.t);
    if (this.t >= this.total) {
      this.t -= this.total;
      this.i = 0;
      this.scene.t = this.t;
    }
    this.raf = requestAnimationFrame(this.tick);
  };
  Demo.prototype.play = function () {
    if (this.playing) return;
    this.playing = true;
    this.last = 0;
    this.root.classList.add('is-playing');
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  };
  Demo.prototype.pause = function () {
    if (!this.playing) return;
    this.playing = false;
    this.root.classList.remove('is-playing');
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  };
  // Jump to a moment: the opening state, then every beat up to it, instantly, and lit
  Demo.prototype.seek = function (ms) {
    var self = this;
    this.pause();
    this.scene.snap(function (s) {
      self.script.opening(s);
      self.i = 0;
      while (self.i < self.beats.length && self.beats[self.i].at <= ms) { s.t = self.beats[self.i].at; self.beats[self.i++].run(s, self); }
      s.lit(true);
    });
    this.t = ms;
    this.scene.t = ms;
  };
  Demo.prototype.seekEnd = function () { this.seek(this.script.duration); };

  /* ------------------------------------------------------------------------
     The scripts. Times in ms. Every beat is a state change; the durations are
     in demos.css. Demo 02 opens in 01's end state, 03 in 02's, 04 in 03's.
     ------------------------------------------------------------------------ */
  function reviewEnd01() { return { kind: 'review', text: TRANSCRIPT_01, chips: ['A', 'B', 'C', 'doc'], pill: null, send: false }; }
  function quiet(s, plate, blur) {
    s.plate(plate, blur);
    s.setPhase('resting');
    s.zoom(false);
    s.key(false);
    s.cursor(false, { x: 1300, y: 700 });
  }

  var SCRIPTS = {
    // 01 — "Nothing to attach." Several things, from several sources, one not on screen, in one sentence.
    // The ring rests on what the eye is on and travels when it moves.
    attach: {
      duration: 13600,
      opening: function (s) { quiet(s, 'desk-moodboard', 'desk-code'); },
      beats: [
        { at: 1200, run: function (s) { s.key(true, T.A); s.setPhase('voice', { kind: 'voice' }); } },
        { at: 1900, run: function (s) { s.setPhase('review', { kind: 'review', text: '', chips: [] }); s.type('Use this'); } },
        { at: 2500, run: function (s) { s.chip('A'); } },
        { at: 3100, run: function (s) { s.look(T.B); } },
        { at: 3600, run: function (s) { s.type('and this,'); } },
        { at: 4100, run: function (s) { s.chip('B'); } },
        { at: 4700, run: function (s) { s.crossfade('desk-code'); } },
        { at: 5100, run: function (s) { s.look(T.C); } },
        { at: 5600, run: function (s) { s.type('work them into this'); } },
        { at: 6500, run: function (s) { s.chip('C'); } },
        { at: 6900, run: function (s) { s.zoom(true); } },
        { at: 7700, run: function (s) { s.type('the way that paper from yesterday does it'); } },
        { at: 9500, run: function (s) { s.chip('doc'); } },          // a referent nothing is looking at: the ring stays put
        { at: 11100, run: function (s) { s.zoom(false); } },
        { at: 11900, run: function (s) { s.key(false); } }
      ]
    },

    // 02 — "Nothing to choose." The Chat is being chosen while the sentence is still being spoken;
    // the click on the pill shows the choice among the recent Chats. Nothing is sent here.
    choose: {
      duration: 10400,
      opening: function (s) { quiet(s, 'desk-code'); s.setPhase('review', reviewEnd01()); },
      beats: [
        { at: 900, run: function (s) { s.key(true, T.C); } },
        { at: 1100, run: function (s) { s.zoom(true); } },
        { at: 1600, run: function (s) { s.pill('resolving'); } },
        { at: 1700, run: function (s) { s.type('— and keep it responsive.'); } },
        { at: 3200, run: function (s) { s.pill('Hero layout'); } },
        { at: 3500, run: function (s) { s.send(true); } },
        { at: 3700, run: function (s) { s.key(false); } },
        { at: 4200, run: function (s) { s.cursor(true, { x: 1230, y: 440 }); s.cursorTo(s.at('pill'), 900, null, easeOutCubic); } },
        { at: 5100, run: function (s) { s.press(s.content.parts.pill); s.selector(true, 'hero'); } },
        { at: 5700, run: function (s) { s.cursorTo({ x: s.cursorAt.x + 70, y: s.cursorAt.y + 60 }, 700); } },
        { at: 6200, run: function (s) { s.cursor(false); } }
      ]
    },

    // 03 — "Nothing to open." Five things running and the screen shows none of them; a working agent is never static.
    open: {
      duration: 10500,
      opening: function (s) { quiet(s, 'desk-video'); },
      beats: [
        { at: 3000, run: function (s) { s.cursor(true); s.cursorTo(T.notch, 1700, { x: -350, y: 40 }); } },
        { at: 4900, run: function (s) { s.zoom(true); s.setPhase('list', { kind: 'list', tasks: tasks('Editing the hero layout'), recent: null }); } },
        { at: 7400, run: function (s) { s.cursorTo({ x: 640, y: 380 }, 1400); } },
        { at: 7500, run: function (s) { s.setPhase('resting'); } },
        { at: 7900, run: function (s) { s.zoom(false); } },
        { at: 8800, run: function (s) { s.cursor(false); } }
      ]
    },

    // 04 — "Nothing to chase." It comes to you: first to ask, then to deliver. Both answers are spoken.
    chase: {
      duration: 13600,
      opening: function (s) { quiet(s, 'desk-video'); },
      beats: [
        { at: 1200, run: function (s) {
          s.setPhase('slab', { kind: 'slab', head: { dest: 'claude-code', name: 'Hero layout', state: 'needs' }, question: 'The headline wraps at 1280 — shrink the type, or let it wrap?' });
          s.zoom(true);
        } },
        { at: 2600, run: function (s) { s.key(true, s.at('question')(s)); s.fieldListen('answer', true); } },
        { at: 3300, run: function (s) { s.fieldType('answer', 'Let it wrap.'); } },
        { at: 4200, run: function (s) { s.key(false); } },
        { at: 4300, run: function (s) { s.fieldSend('answer', true); } },
        { at: 4700, run: function (s) { s.fieldPress('answer'); } },
        { at: 4900, run: function (s) { s.setPhase('resting'); } },
        { at: 6600, run: function (s) { s.setPhase('slab', { kind: 'slab', head: { dest: 'claude-code', name: 'Hero layout', state: 'complete' }, diff: DIFF, footer: false }); } },
        { at: 7600, run: function (s) { s.footer(true); } },
        { at: 8600, run: function (s) { s.key(true, s.at('lastAdd')(s)); s.fieldListen('follow', true); } },
        { at: 9300, run: function (s) { s.fieldType('follow', 'Also check it at tablet width.'); } },
        { at: 10700, run: function (s) { s.key(false); } },
        { at: 10800, run: function (s) { s.fieldSend('follow', true); } },
        { at: 11200, run: function (s) { s.fieldPress('follow'); } },
        { at: 11400, run: function (s) { s.fieldClear('follow'); s.headStatus('working'); } }
      ]
    }
  };

  /* ------------------------------------------------------------------------
     initDemos — build every screen's demo, then let the viewport decide which
     ones run: a demo is eligible at 35% visibility, at most two play (one
     below 800px), the most visible first; the rest hold their frame. A hidden
     tab stops them all. Under reduced motion each shows its final frame.
     ------------------------------------------------------------------------ */
  function initDemos() {
    var roots = Array.prototype.slice.call(document.querySelectorAll('.demo[data-demo]'));
    var demos = [];
    roots.forEach(function (root) {
      var script = SCRIPTS[root.getAttribute('data-demo')];
      if (script) demos.push(new Demo(root, script));
    });
    if (!demos.length) return;
    window.foveaDemos = demos;

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { demos.forEach(function (d) { d.scene.measure(); }); });
      demos.forEach(function (d) { ro.observe(d.root); });
    } else {
      window.addEventListener('resize', function () { demos.forEach(function (d) { d.scene.measure(); }); });
    }

    if (reduceMotion.matches) { demos.forEach(function (d) { d.seekEnd(); }); return; }

    function arbitrate() {
      var cap = narrow.matches ? 1 : 2;
      var eligible = document.hidden ? [] : demos.filter(function (d) { return d.ratio >= .35; })
        .sort(function (a, b) { return b.ratio - a.ratio; }).slice(0, cap);
      demos.forEach(function (d) { if (eligible.indexOf(d) > -1) d.play(); else d.pause(); });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          demos.forEach(function (d) { if (d.root === entry.target) d.ratio = entry.isIntersecting ? entry.intersectionRatio : 0; });
        });
        arbitrate();
      }, { threshold: [0, .35, .6, 1] });
      demos.forEach(function (d) { io.observe(d.root); });
    } else {
      demos.forEach(function (d) { d.ratio = 1; });
      arbitrate();
    }
    document.addEventListener('visibilitychange', arbitrate);
    if (narrow.addEventListener) narrow.addEventListener('change', arbitrate);
    else narrow.addListener(arbitrate);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDemos);
  else initDemos();
})();
