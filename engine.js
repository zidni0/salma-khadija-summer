/* === LEARNKIT — UNIVERSAL INTERACTIVE LEARNING ENGINE ===
 * Vanilla JS, no deps. Touch + mouse (Pointer Events).
 * Exposes window.LearnKit.init(). Auto-inits on DOMContentLoaded.
 * Course content is supplied in content.js as window.LEARNKIT.
 * Schema: { id, title, subtitle, sequential, unitLabel, lessonLabel,
 *           theme, mascot, units:[ { title, lessons:[ { title, intro,
 *           winText, tags, phases:[...] } ] } ] }
 */
(function () {
  'use strict';
  if (window.LearnKit) return;
  var SG = {};

  /* ---------- utils ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function loadObj(k) { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } }
  function saveObj(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function questionText(g) { return g && (g.prompt != null ? g.prompt : g.q); }
  function codeBadge(g) {
    if (!g || !g.code) return null;
    return el('div', 'sg-q-code', esc(g.code));
  }
  function appendBadge(host, g) {
    var badge = codeBadge(g);
    if (badge) host.appendChild(badge);
    return badge;
  }

  /* ---------- storage keys (per-deployment, namespaced by course id) ---------- */
  var COURSE_ID = (window.LEARNKIT && window.LEARNKIT.id) ? String(window.LEARNKIT.id) : "default";
  var NS = "learnkit:" + COURSE_ID + ":";
  var STORAGE_KEY = NS + "progress";
  var DONE_KEY = NS + "done";
  var STREAK_KEY = NS + "streak";
  var XP_KEY = NS + "xp";
  var completed = loadObj(STORAGE_KEY);
  var done = loadObj(DONE_KEY);

  /* ---------- COURSE (loaded from window.LEARNKIT in content.js) ---------- */
  var CFG = window.LEARNKIT || {};
  // flatten units->lessons into an ordered list of {ui,li,unit,lesson}
  function lessons() {
    var out = [];
    (CFG.units || []).forEach(function (u, ui) {
      (u.lessons || []).forEach(function (l, li) { out.push({ ui: ui, li: li, unit: u, lesson: l }); });
    });
    return out;
  }
  function lessonKey(p) { return p.ui + "-" + p.li; }
  function lessonSubjects(l) {
    if (l.tags && l.tags.length) return l.tags;
    var seen = {}, out = [];
    (l.phases || []).forEach(function (ph) { if (ph.subject && !seen[ph.subject]) { seen[ph.subject] = 1; out.push(ph.subject); } });
    return out.length ? out : ["Lesson"];
  }

  /* ---------- AUDIO ---------- */
  var audioCtx;
  function ac() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx; }
  function tone(o) {
    o = o || {}; var c = ac(), t0 = c.currentTime + (o.when || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(o.freq || 440, t0);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(o.vol || 0.18, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (o.dur || 0.15));
    osc.connect(g).connect(c.destination); osc.start(t0); osc.stop(t0 + (o.dur || 0.15) + 0.02);
  }
  var sound = {
    play: function (n) {
      try {
        if (n === 'correct') { tone({ freq: 523.25, dur: 0.12, type: 'triangle' }); tone({ freq: 659.25, dur: 0.12, type: 'triangle', when: 0.1 }); tone({ freq: 783.99, dur: 0.2, type: 'triangle', when: 0.2 }); }
        else if (n === 'wrong') { tone({ freq: 220, dur: 0.18, type: 'sawtooth', vol: 0.1 }); tone({ freq: 180, dur: 0.22, type: 'sawtooth', vol: 0.1, when: 0.1 }); }
        else if (n === 'levelUp') { [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { tone({ freq: f, dur: 0.16, type: 'triangle', when: i * 0.09 }); }); }
        else if (n === 'click') { tone({ freq: 880, dur: 0.05, type: 'square', vol: 0.07 }); }
      } catch (e) {}
    }
  };
  document.addEventListener('pointerdown', function () { ac(); }, { once: true });

  /* ---------- READ ALOUD (Web Speech) ---------- */
  var synth = window.speechSynthesis || null;
  var sgVoice = null;
  function sgPickVoice() {
    if (!synth) return;
    var vs = synth.getVoices(); if (!vs || !vs.length) return;
    var pref = ['Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira',
      'Aria Online (Natural)', 'Jenny Online (Natural)', 'Libby Online (Natural)', 'Google UK English Female',
      'Karen', 'Serena', 'Daniel', 'Google हिन्दी'];
    for (var i = 0; i < pref.length; i++) { for (var j = 0; j < vs.length; j++) { if (vs[j].name && vs[j].name.indexOf(pref[i]) !== -1) { sgVoice = vs[j]; return; } } }
    for (var k = 0; k < vs.length; k++) { if (/en[-_]?US/i.test(vs[k].lang)) { sgVoice = vs[k]; return; } }
    for (var k = 0; k < vs.length; k++) { if (/^en/i.test(vs[k].lang)) { sgVoice = vs[k]; return; } }
    sgVoice = vs[0];
  }
  if (synth) { sgPickVoice(); if ('onvoiceschanged' in synth) synth.onvoiceschanged = sgPickVoice; }
  SG.speak = {
    _btn: null, _chunks: [],
    toggle: function (text, btn) {
      if (this._btn) { this.stop(); if (this._btn === btn) return; }
      if (!synth || !text) return;
      this._btn = btn; if (btn) { btn.classList.add('speaking'); if (btn.classList.contains('sg-speak-btn')) btn.textContent = '⏹ Stop'; }
      var parts = String(text).replace(/\s+/g, ' ').match(/[^.!?;:]+[.!?;:]*/g) || [String(text)];
      this._chunks = parts.slice();
      var self = this;
      function step() {
        if (!self._chunks.length) { self._clear(); return; }
        var u = new SpeechSynthesisUtterance(self._chunks.shift().trim());
        u.rate = 0.85; u.pitch = 1.0; u.volume = 1;
        if (sgVoice) { try { u.voice = sgVoice; } catch (e) {} }
        u.onend = step; u.onerror = step;
        try { synth.speak(u); } catch (e) { self._clear(); }
      }
      try { synth.cancel(); } catch (e) {}
      step();
    },
    _clear: function () { var b = this._btn; if (b) { b.classList.remove('speaking'); if (b.classList.contains('sg-speak-btn')) b.textContent = '🔊 Read aloud'; } this._btn = null; this._chunks = []; },
    stop: function () { if (synth) { try { synth.cancel(); } catch (e) {} } this._clear(); },
    isOn: function () { return !!this._btn; }
  };

  /* ---------- ILLUSTRATIONS (inline SVG) ---------- */
  var ILL_C = { math: '#e0624f', science: '#3fae6a', ela: '#3a8fd0', social: '#9a6bb8', amber: '#d9a441', ink: '#4a4438', line: '#c9bda6' };
  var SCENES = {
    pv: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Place value chart"><g font-family="inherit" font-weight="700" text-anchor="middle"><rect x="24" y="26" width="44" height="50" rx="8" fill="#fff3f0" stroke="#e0624f" stroke-width="3"/><text x="46" y="60" font-size="24" fill="#e0624f">3</text><text x="46" y="98" font-size="11" fill="#9a7b74">Th</text><rect x="78" y="26" width="44" height="50" rx="8" fill="#fff3f0" stroke="#e0624f" stroke-width="3"/><text x="100" y="60" font-size="24" fill="#e0624f">4</text><text x="100" y="98" font-size="11" fill="#9a7b74">H</text><rect x="132" y="26" width="44" height="50" rx="8" fill="#fff3f0" stroke="#e0624f" stroke-width="3"/><text x="154" y="60" font-size="24" fill="#e0624f">2</text><text x="154" y="98" font-size="11" fill="#9a7b74">T</text><rect x="186" y="26" width="44" height="50" rx="8" fill="#fff3f0" stroke="#e0624f" stroke-width="3"/><text x="208" y="60" font-size="24" fill="#e0624f">7</text><text x="208" y="98" font-size="11" fill="#9a7b74">O</text></g></svg>',
    energy: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Forms of energy"><circle cx="46" cy="46" r="20" fill="#ffe9a8" stroke="#d9a441" stroke-width="3"/><g stroke="#d9a441" stroke-width="3" stroke-linecap="round"><line x1="46" y1="14" x2="46" y2="4"/><line x1="46" y1="88" x2="46" y2="78"/><line x1="14" y1="46" x2="4" y2="46"/><line x1="88" y1="46" x2="78" y2="46"/><line x1="24" y1="24" x2="17" y2="17"/><line x1="68" y1="68" x2="75" y2="75"/></g><path d="M138 18 L116 70 L138 70 L128 104 L168 54 L146 54 Z" fill="#ffd24a" stroke="#e08a2b" stroke-width="2.5" stroke-linejoin="round"/><rect x="186" y="40" width="14" height="34" rx="3" fill="#fff" stroke="#3fae6a" stroke-width="3"/><rect x="190" y="58" width="6" height="12" fill="#3fae6a"/><line x1="193" y1="34" x2="193" y2="40" stroke="#3fae6a" stroke-width="3"/></svg>',
    eye: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Eye and light"><path d="M70 62 Q120 22 170 62 Q120 102 70 62 Z" fill="#fff" stroke="#3fae6a" stroke-width="3"/><circle cx="120" cy="62" r="16" fill="#3fae6a"/><circle cx="126" cy="56" r="5" fill="#fff"/><line x1="14" y1="62" x2="98" y2="62" stroke="#d9a441" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#d9a441"/></marker></defs></svg>',
    ship: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Explorer ship"><path d="M30 78 H150 L138 100 H42 Z" fill="#c4865a" stroke="#8a5a36" stroke-width="2.5"/><line x1="90" y1="78" x2="90" y2="20" stroke="#7a5236" stroke-width="3"/><path d="M90 24 L138 46 L90 56 Z" fill="#fdfdfd" stroke="#9a6bb8" stroke-width="2.5"/><path d="M90 24 L52 46 L90 56 Z" fill="#f4eef9" stroke="#9a6bb8" stroke-width="2.5"/><path d="M0 104 Q30 96 60 104 T120 104 T180 104 T240 104" fill="none" stroke="#3a8fd0" stroke-width="3"/><path d="M150 96 Q176 90 200 96 L194 104 Q176 100 156 104 Z" fill="#8a5a36" stroke="#5a3a22" stroke-width="2"/></svg>',
    grid: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Area model"><rect x="30" y="22" width="180" height="80" fill="none" stroke="#e0624f" stroke-width="3"/><line x1="120" y1="22" x2="120" y2="102" stroke="#e0624f" stroke-width="3"/><line x1="30" y1="62" x2="210" y2="62" stroke="#e0624f" stroke-width="3"/><rect x="30" y="22" width="90" height="40" fill="#fdeef0"/><rect x="120" y="22" width="90" height="40" fill="#fff3f0"/><rect x="30" y="62" width="90" height="40" fill="#fff3f0"/><rect x="120" y="62" width="90" height="40" fill="#fdeef0"/><text x="75" y="46" font-size="14" text-anchor="middle" fill="#e0624f" font-weight="700">20</text><text x="165" y="86" font-size="14" text-anchor="middle" fill="#e0624f" font-weight="700">6</text></svg>',
    pie: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Fraction pie"><path d="M120 24 A50 50 0 1 1 70 74 L120 74 Z" fill="#9a6bb8"/><path d="M120 24 A50 50 0 0 1 170 74 L120 74 Z" fill="#e8ddf2"/><circle cx="120" cy="74" r="50" fill="none" stroke="#6b4a82" stroke-width="3"/><line x1="120" y1="74" x2="120" y2="24" stroke="#6b4a82" stroke-width="3"/><line x1="120" y1="74" x2="170" y2="74" stroke="#6b4a82" stroke-width="3"/></svg>',
    numline: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Number line"><line x1="20" y1="62" x2="220" y2="62" stroke="#4a4438" stroke-width="3"/><path d="M214 56 L224 62 L214 68" fill="none" stroke="#4a4438" stroke-width="3"/><g stroke="#4a4438" stroke-width="2"><line x1="40" y1="56" x2="40" y2="68"/><line x1="90" y1="56" x2="90" y2="68"/><line x1="140" y1="56" x2="140" y2="68"/><line x1="190" y1="56" x2="190" y2="68"/></g><g font-size="11" text-anchor="middle" fill="#4a4438"><text x="40" y="86">0</text><text x="90" y="86">1</text><text x="140" y="86">2</text><text x="190" y="86">3</text></g><circle cx="115" cy="62" r="6" fill="#e0624f"/></svg>',
    strata: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Rock layers"><path d="M0 96 H240 L210 78 H30 Z" fill="#c9b48a" stroke="#8a6a3a" stroke-width="2"/><path d="M30 78 H210 L195 60 H45 Z" fill="#b89368" stroke="#8a6a3a" stroke-width="2"/><path d="M45 60 H195 L180 42 H60 Z" fill="#a87f52" stroke="#8a6a3a" stroke-width="2"/><path d="M60 42 H180 V26 H60 Z" fill="#9a7340" stroke="#8a6a3a" stroke-width="2"/><path d="M104 86 q6 -8 14 -4 l-3 10 z" fill="#6b4a2a"/><circle cx="150" cy="68" r="3" fill="#6b4a2a"/></svg>',
    branches: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Branches of government"><rect x="95" y="12" width="50" height="22" rx="6" fill="#9a6bb8" stroke="#6b4a82" stroke-width="2"/><text x="120" y="27" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">GOV</text><line x1="120" y1="34" x2="50" y2="64" stroke="#9a6bb8" stroke-width="2.5"/><line x1="120" y1="34" x2="120" y2="64" stroke="#9a6bb8" stroke-width="2.5"/><line x1="120" y1="34" x2="190" y2="64" stroke="#9a6bb8" stroke-width="2.5"/><rect x="20" y="64" width="60" height="26" rx="6" fill="#f4eef9" stroke="#9a6bb8" stroke-width="2"/><rect x="90" y="64" width="60" height="26" rx="6" fill="#f4eef9" stroke="#9a6bb8" stroke-width="2"/><rect x="160" y="64" width="60" height="26" rx="6" fill="#f4eef9" stroke="#9a6bb8" stroke-width="2"/><g font-size="9" text-anchor="middle" fill="#6b4a82" font-weight="700"><text x="50" y="80">Legislative</text><text x="120" y="80">Executive</text><text x="190" y="80">Judicial</text></g></svg>',
    protractor: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Angle and protractor"><path d="M30 96 A80 80 0 0 1 190 96" fill="#f4eef9" stroke="#9a6bb8" stroke-width="2.5"/><line x1="30" y1="96" x2="210" y2="96" stroke="#4a4438" stroke-width="2.5"/><line x1="110" y1="96" x2="170" y2="40" stroke="#e0624f" stroke-width="3"/><circle cx="110" cy="96" r="4" fill="#e0624f"/><path d="M128 90 A24 24 0 0 1 132 110" fill="none" stroke="#e0624f" stroke-width="2"/></svg>',
    wave: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Wave"><line x1="10" y1="62" x2="230" y2="62" stroke="#c9bda6" stroke-width="2" stroke-dasharray="4 4"/><path d="M10 62 Q35 20 60 62 T110 62 T160 62 T210 62" fill="none" stroke="#3fae6a" stroke-width="3"/><line x1="35" y1="62" x2="35" y2="32" stroke="#d9a441" stroke-width="2.5"/><line x1="85" y1="62" x2="85" y2="32" stroke="#d9a441" stroke-width="2.5"/><text x="60" y="118" font-size="10" text-anchor="middle" fill="#4a4438">wavelength</text><text x="28" y="26" font-size="10" fill="#d9a441">amplitude</text></svg>',
    canal: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Erie Canal boat"><path d="M0 30 H70 V104 H0 Z" fill="#9a7340"/><path d="M170 30 H240 V104 H170 Z" fill="#9a7340"/><rect x="0" y="98" width="240" height="6" fill="#8a6a3a"/><path d="M70 70 H170 L160 92 H80 Z" fill="#c4865a" stroke="#8a5a36" stroke-width="2"/><rect x="112" y="30" width="16" height="40" fill="#7a5236"/><path d="M70 84 Q100 78 120 84 T170 84" fill="none" stroke="#3a8fd0" stroke-width="2.5"/></svg>',
    lantern: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Lantern of freedom"><circle cx="120" cy="62" r="48" fill="#fff7d6" opacity="0.55"/><rect x="104" y="34" width="32" height="8" rx="2" fill="#6b4a2a"/><rect x="98" y="42" width="44" height="44" rx="8" fill="#ffd24a" stroke="#b8861f" stroke-width="3"/><line x1="120" y1="22" x2="120" y2="34" stroke="#6b4a2a" stroke-width="3"/><rect x="106" y="86" width="28" height="8" rx="2" fill="#6b4a2a"/><path d="M118 50 L112 64 L120 64 L114 78 L130 60 L122 60 Z" fill="#fff7d6"/></svg>',
    ellis: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Ellis Island"><rect x="50" y="44" width="120" height="56" fill="#e8e0d0" stroke="#8a7a5a" stroke-width="2.5"/><polygon points="40,44 110,8 180,44" fill="#c4865a" stroke="#8a5a36" stroke-width="2.5"/><rect x="68" y="58" width="14" height="24" fill="#6b4a82"/><rect x="102" y="58" width="14" height="24" fill="#6b4a82"/><rect x="136" y="58" width="14" height="24" fill="#6b4a82"/><rect x="148" y="22" width="8" height="26" fill="#9a6bb8"/><path d="M152 22 L168 30 L152 38 Z" fill="#d9a441"/><rect x="150" y="20" width="4" height="10" fill="#6b4a2a"/></svg>',
    signal: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Dolphin signal"><path d="M0 96 Q60 70 120 96 T240 96" fill="none" stroke="#3a8fd0" stroke-width="2.5" opacity="0.5"/><path d="M70 90 Q95 60 150 78 Q140 96 110 96 Q80 96 70 90 Z" fill="#3a8fd0" stroke="#2a6a9a" stroke-width="2"/><path d="M150 78 q20 -6 30 6" fill="none" stroke="#2a6a9a" stroke-width="2"/><path d="M120 64 q0 -16 14 -16 q-14 0 -14 -16" fill="none" stroke="#3fae6a" stroke-width="2.5"/><path d="M150 50 q0 -12 10 -12 q-10 0 -10 -12" fill="none" stroke="#3fae6a" stroke-width="2.5"/></svg>',
    flag: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Flag"><line x1="70" y1="14" x2="70" y2="110" stroke="#4a4438" stroke-width="4"/><circle cx="70" cy="14" r="4" fill="#d9a441"/><path d="M70 22 H180 L160 44 L180 66 H70 Z" fill="#9a6bb8" stroke="#6b4a82" stroke-width="2.5"/><path d="M82 30 H168 M82 38 H168 M82 46 H160" stroke="#fff" stroke-width="2"/></svg>',
    senses: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Senses"><g stroke="#3fae6a" stroke-width="2.5" fill="none"><path d="M20 56 Q40 36 60 56 Q40 76 20 56"/><circle cx="40" cy="56" r="8"/></g><g stroke="#3a8fd0" stroke-width="2.5" fill="none"><path d="M100 40 q-10 0 -10 12 v8 a8 8 0 0 0 16 0 v-8 q0 -12 -6 -12"/><line x1="104" y1="44" x2="120" y2="44"/><line x1="104" y1="52" x2="120" y2="52"/><line x1="104" y1="60" x2="118" y2="60"/></g><path d="M180 70 q-22 -28 -44 0 q22 16 44 0 Z" fill="#fff" stroke="#9a6bb8" stroke-width="2.5"/><circle cx="158" cy="62" r="7" fill="#9a6bb8"/></svg>',
    map: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Map"><path d="M30 30 Q60 16 110 24 Q160 14 200 34 Q224 60 206 86 Q170 104 120 96 Q70 104 40 84 Q14 58 30 30 Z" fill="#dce6c8" stroke="#7a8a4a" stroke-width="2.5"/><path d="M150 60 Q176 50 196 64 Q210 80 194 92 Q174 100 158 90 Q146 76 150 60 Z" fill="#b8d0e8" stroke="#3a8fd0" stroke-width="2"/><path d="M118 58 l0 -16 a4 4 0 0 1 8 0 l0 16 a4 4 0 1 1 -8 0" fill="#e0624f"/><circle cx="122" cy="50" r="3" fill="#fff"/></svg>',
    book: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Open book"><path d="M120 40 Q90 28 30 34 V96 Q90 90 120 102 Q150 90 210 96 V34 Q150 28 120 40 Z" fill="#3a8fd0" stroke="#2a6a9a" stroke-width="2.5"/><path d="M120 40 V102" stroke="#2a6a9a" stroke-width="2.5"/><g stroke="#fff" stroke-width="2" opacity="0.8"><line x1="46" y1="50" x2="100" y2="46"/><line x1="46" y1="62" x2="100" y2="58"/><line x1="46" y1="74" x2="100" y2="70"/><line x1="140" y1="46" x2="194" y2="50"/><line x1="140" y1="58" x2="194" y2="62"/><line x1="140" y1="70" x2="194" y2="74"/></g></svg>',
    flask: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Science flask"><path d="M104 16 H136 V44 L168 92 Q172 104 158 104 H82 Q68 104 72 92 L104 44 Z" fill="#e8f5ee" stroke="#3fae6a" stroke-width="3"/><rect x="104" y="16" width="32" height="8" fill="#3fae6a"/><path d="M82 84 Q120 74 158 84 L168 92 Q172 104 158 104 H82 Q68 104 72 92 Z" fill="#3fae6a" opacity="0.55"/><circle cx="110" cy="90" r="4" fill="#3fae6a"/><circle cx="132" cy="86" r="3" fill="#3fae6a"/></svg>',
    cap: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Graduation cap"><polygon points="120,28 210,62 120,96 30,62" fill="#3a3a3a" stroke="#1a1a1a" stroke-width="2"/><path d="M70 74 V96 Q120 116 170 96 V74" fill="#4a4a4a" stroke="#1a1a1a" stroke-width="2"/><line x1="210" y1="62" x2="210" y2="92" stroke="#d9a441" stroke-width="3"/><circle cx="210" cy="96" r="5" fill="#d9a441"/></svg>',
    gear: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Engineering design"><g fill="none" stroke="#3fae6a" stroke-width="3"><circle cx="90" cy="62" r="30"/><circle cx="90" cy="62" r="10"/></g><g fill="#3fae6a"><rect x="86" y="22" width="8" height="14"/><rect x="86" y="88" width="8" height="14"/><rect x="50" y="58" width="14" height="8"/><rect x="116" y="58" width="14" height="8"/><rect x="62" y="34" width="12" height="12" transform="rotate(45 68 40)"/><rect x="106" y="78" width="12" height="12" transform="rotate(45 112 84)"/><rect x="62" y="78" width="12" height="12" transform="rotate(45 68 84)"/><rect x="106" y="34" width="12" height="12" transform="rotate(45 112 40)"/></g><line x1="150" y1="62" x2="220" y2="62" stroke="#4a4438" stroke-width="3"/><path d="M150 40 H210 V84 H150" fill="none" stroke="#9a6bb8" stroke-width="2.5"/><path d="M160 40 V84 M175 40 V84 M190 40 V84 M205 40 V84" stroke="#9a6bb8" stroke-width="2"/></svg>',
    ruler: '<svg viewBox="0 0 240 124" class="sg-ill-svg" role="img" aria-label="Measurement"><rect x="20" y="46" width="200" height="36" rx="6" fill="#fdeef0" stroke="#e0624f" stroke-width="3"/><g stroke="#e0624f" stroke-width="2.5"><line x1="40" y1="46" x2="40" y2="62"/><line x1="60" y1="46" x2="60" y2="70"/><line x1="80" y1="46" x2="80" y2="62"/><line x1="100" y1="46" x2="100" y2="70"/><line x1="120" y1="46" x2="120" y2="62"/><line x1="140" y1="46" x2="140" y2="70"/><line x1="160" y1="46" x2="160" y2="62"/><line x1="180" y1="46" x2="180" y2="70"/><line x1="200" y1="46" x2="200" y2="62"/></g><g font-size="9" fill="#9a7b74" text-anchor="middle"><text x="40" y="78">0</text><text x="60" y="78">1</text><text x="100" y="78">3</text><text x="140" y="78">5</text><text x="180" y="78">7</text></g></svg>'
  };
  var ILL_KEYS = [
    ['place value', 'pv'], ['expanded', 'pv'],
    ['energy', 'energy'], ['conversion', 'energy'],
    ['vision', 'eye'], ['light', 'eye'], ['reflect', 'eye'],
    ['explor', 'ship'],
    ['area model', 'grid'], ['multiplication', 'grid'], ['divide', 'grid'], ['division', 'grid'], ['remainder', 'grid'],
    ['fraction', 'pie'], ['mixed number', 'pie'],
    ['decimal', 'numline'], ['round', 'numline'], ['number line', 'numline'], ['comparing', 'numline'],
    ['rock', 'strata'], ['fossil', 'strata'], ['erosion', 'strata'], ['weathering', 'strata'],
    ['government', 'branches'], ['branch', 'branches'], ['citizen', 'branches'], ['right', 'branches'], ['responsibilit', 'branches'],
    ['angle', 'protractor'], ['protractor', 'protractor'],
    ['wave', 'wave'], ['amplitude', 'wave'], ['wavelength', 'wave'], ['sound', 'wave'],
    ['canal', 'canal'], ['erie', 'canal'], ['industrial', 'canal'], ['transport', 'canal'],
    ['underground', 'lantern'], ['slavery', 'lantern'], ['abolition', 'lantern'],
    ['immigr', 'ellis'], ['ellis', 'ellis'],
    ['dolphin', 'signal'], ['communicat', 'signal'], ['signal', 'signal'],
    ['colony', 'flag'], ['new netherland', 'flag'], ['revolution', 'flag'], ['loyalist', 'flag'], ['patriot', 'flag'], ['suffrage', 'flag'], ['women', 'flag'],
    ['sense', 'senses'], ['process', 'senses'],
    ['topograph', 'map'], ['map', 'map'], ['geograph', 'map'], ['borough', 'map'], ['brooklyn', 'map'], ['county', 'map'],
    ['simile', 'book'], ['metaphor', 'book'], ['idiom', 'book'], ['adage', 'book'], ['proverb', 'book'], ['root', 'book'], ['affix', 'book'], ['meaning', 'book'], ['vowel', 'book'],
    ['opinion', 'book'], ['informative', 'book'], ['narrative', 'book'], ['article', 'book'], ['source', 'book'], ['note', 'book'], ['presentation', 'book'], ['research', 'book'], ['summary', 'book'], ['central idea', 'book'], ['paragraph', 'book'], ['structure', 'book'], ['dialogue', 'book'], ['close reading', 'book'], ['evidence', 'book'], ['linking', 'book'], ['word', 'book'],
    ['review', 'cap'], ['capstone', 'cap'], ['skill', 'cap'],
    ['engineering', 'gear'], ['design', 'gear'],
    ['measurement', 'ruler'], ['perimeter', 'ruler'], ['conversion', 'ruler']
  ];
  SG.ill = function (subject, title) {
    var t = (title || '').toLowerCase();
    var pick = '';
    for (var i = 0; i < ILL_KEYS.length; i++) { if (t.indexOf(ILL_KEYS[i][0]) !== -1) { pick = ILL_KEYS[i][1]; break; } }
    if (!pick) {
      var s = (subject || '').toLowerCase();
      pick = (s.indexOf('math') !== -1) ? 'numline' : (s.indexOf('sci') !== -1) ? 'flask' : (s.indexOf('ela') !== -1 || s.indexOf('english') !== -1 || s.indexOf('read') !== -1) ? 'book' : (s.indexOf('social') !== -1) ? 'map' : 'book';
    }
    var svg = SCENES[pick] || SCENES.book;
    return '<div class="sg-ill">' + svg + '</div>';
  };

  /* ---------- CONFETTI ---------- */
  var ccCanvas, ccCtx, ccRAF, ccParts = [];
  function ensureConfetti() {
    if (ccCanvas) return ccCanvas;
    ccCanvas = document.getElementById('sg-confetti');
    if (!ccCanvas) { ccCanvas = el('canvas'); ccCanvas.id = 'sg-confetti'; document.body.appendChild(ccCanvas); }
    ccCtx = ccCanvas.getContext('2d');
    return ccCanvas;
  }
  SG.confetti = function (opts) {
    opts = opts || {};
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = ensureConfetti(); cv.width = window.innerWidth; cv.height = window.innerHeight;
    var colors = ['#10b981', '#7c3aed', '#fbbf24', '#ef4444', '#3b82f6', '#f97316', '#ec4899'];
    var count = opts.count || 130, ox = opts.x || cv.width / 2, oy = opts.y || cv.height * 0.35;
    for (var i = 0; i < count; i++) {
      ccParts.push({ x: ox, y: oy, vx: (Math.random() - 0.5) * 14, vy: Math.random() * -14 - 4,
        size: Math.random() * 8 + 4, rot: Math.random() * Math.PI * 2, ts: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)] });
    }
    var start = performance.now(), dur = opts.duration || 3000;
    cancelAnimationFrame(ccRAF);
    (function frame(now) {
      var elapsed = now - start;
      if (elapsed > dur) { ccCtx.clearRect(0, 0, cv.width, cv.height); ccParts = []; return; }
      ccCtx.clearRect(0, 0, cv.width, cv.height);
      for (var i = 0; i < ccParts.length; i++) { var p = ccParts[i]; p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.ts;
        ccCtx.save(); ccCtx.translate(p.x, p.y); ccCtx.rotate(p.rot); ccCtx.fillStyle = p.color;
        ccCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4); ccCtx.restore(); }
      ccRAF = requestAnimationFrame(frame);
    })(performance.now());
  };

  /* ---------- PRAISE ---------- */
  var PRAISE = {
    correct: ['Awesome!', 'You got it!', 'Brilliant!', 'Nailed it!', 'Smarty-pants!'],
    streak: ['Streak on fire! 🔥', "You're unstoppable!", 'Daily hero!'],
    levelUp: ['Level up! 🚀', 'New level unlocked!'],
    wrong: ['Almost! Try again.', "Not yet — you've got this!", 'Good guess — let’s review.', 'So close!']
  };
  var PEMOJI = { correct: ['🎉', '🌟', '💫', '✨', '🥳'], streak: ['🔥', '⚡', '🌈'], levelUp: ['🚀', '🏆', '🎊'], wrong: ['💪', '🌱', '💡'] };
  var praiseEl;
  SG.praise = {
    show: function (type) {
      if (!praiseEl) return;
      praiseEl.querySelector('.p-emoji').textContent = rnd(PEMOJI[type] || PEMOJI.correct);
      praiseEl.querySelector('.p-text').textContent = rnd(PRAISE[type] || PRAISE.correct);
      praiseEl.classList.add('show'); praiseEl.classList.remove('show'); void praiseEl.offsetWidth; praiseEl.classList.add('show');
      clearTimeout(SG.praise._t); SG.praise._t = setTimeout(function () { praiseEl.classList.remove('show'); }, 1500);
    }
  };

  /* ---------- MASCOT ---------- */
  var mascotEl, mascotSays;
  var MLINES = { neutral: ['Hi! Ready to play?', 'Pick a day!', "Let's learn!"], happy: ['Yay!', 'You did it!', 'So proud!'], think: ['Hmm, try once more?', 'That was tricky!', "We'll get it."], excited: ['WOW!', 'Incredible!', 'Champion!'] };
  SG.mascot = {
    setMood: function (m) {
      if (!mascotEl) return;
      mascotEl.className = 'mood-' + m;
      if (mascotSays) mascotSays.textContent = rnd(MLINES[m] || MLINES.neutral);
      if (m === 'happy' || m === 'excited') { clearTimeout(SG.mascot._t); SG.mascot._t = setTimeout(function () { SG.mascot.setMood('neutral'); }, 2500); }
    }
  };

  /* ---------- RING ---------- */
  SG.ring = {
    svg: function (pct) {
      var r = 18, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
      return '<svg class="day-ring" viewBox="0 0 44 44"><circle class="ring-bg" cx="22" cy="22" r="' + r + '" fill="none" stroke-width="4"/><circle class="ring-fg" cx="22" cy="22" r="' + r + '" fill="none" stroke-width="4" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"/><text x="22" y="26" text-anchor="middle">' + Math.round(pct) + '%</text></svg>';
    },
    set: function (svg, pct) {
      var c = svg.querySelector('.ring-fg'); if (!c) return;
      var r = 18, circ = 2 * Math.PI * r;
      c.style.strokeDasharray = circ; c.style.strokeDashoffset = circ - (pct / 100) * circ;
      var t = svg.querySelector('text'); if (t) t.textContent = Math.round(pct) + '%';
      if (pct >= 100) c.classList.add('ring-done');
    }
  };

  /* ---------- STREAK + XP ---------- */
  var streak = loadObj(STREAK_KEY), xp = loadObj(XP_KEY); xp.total = xp.total || 0; xp.level = xp.level || 1;
  SG.streak = {
    count: function () { return streak.count || 0; },
    bump: function (dayKey) {
      var today = new Date().toISOString().slice(0, 10);
      if (streak.lastDay === today) return;
      var y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak.count = (streak.lastDay === y) ? (streak.count || 0) + 1 : 1;
      streak.lastDay = today; saveObj(STREAK_KEY, streak);
      if (streak.count % 5 === 0) { SG.confetti({ count: 70 }); SG.praise.show('streak'); sound.play('levelUp'); }
    }
  };
  SG.xp = {
    add: function (n) {
      var need = xp.level * 100; xp.total += n;
      var leveled = false;
      while (xp.total >= need) { xp.total -= need; xp.level++; leveled = true; need = xp.level * 100; }
      saveObj(XP_KEY, xp);
      if (leveled) { sound.play('levelUp'); SG.mascot.setMood('excited'); SG.praise.show('levelUp'); SG.confetti({ count: 120 }); }
    }
  };

  /* ---------- progress (lessons done / total) ---------- */
  function updateProgress() {
    var ls = lessons(), total = ls.length, doneN = 0;
    ls.forEach(function (p) { if (done[lessonKey(p)]) doneN++; });
    var pct = total ? Math.round((doneN / total) * 100) : 0;
    var fill = document.getElementById('lk-progress-fill');
    var txt = document.getElementById('lk-progress-text');
    if (fill) fill.style.width = pct + '%';
    if (txt) txt.textContent = doneN + ' / ' + total + ' lessons (' + pct + '%)';
  }

  /* ---------- onWin (per lesson) ---------- */
  function onWin(lkey, ringSvg) {
    if (!done[lkey]) {
      done[lkey] = true; saveObj(DONE_KEY, done);
      updateProgress();
      SG.streak.bump(lkey); SG.xp.add(20);
      var card = document.querySelector(".day-game-card[data-day='" + lkey + "']");
      if (card) card.classList.add('done');
      if (ringSvg) SG.ring.set(ringSvg, 100);
      sound.play('correct');
      setTimeout(function () { SG.praise.show('correct'); SG.mascot.setMood('happy'); }, 90);
      setTimeout(function () { SG.confetti({ count: 100 }); }, 180);
      if (CFG.sequential !== false) setTimeout(function () { unlockNext(lkey); }, 1400);
    } else {
      sound.play('correct'); SG.praise.show('correct'); if (ringSvg) SG.ring.set(ringSvg, 100);
    }
  }

  function unlockNext(lkey) {
    var ls = lessons(), idx = -1;
    for (var i = 0; i < ls.length; i++) { if (lessonKey(ls[i]) === lkey) { idx = i; break; } }
    if (idx < 0 || idx + 1 >= ls.length) return;
    var next = ls[idx + 1], nextKey = lessonKey(next);
    var old = document.querySelector(".day-game-card[data-day='" + nextKey + "']");
    if (!old) return;
    var fresh = buildLessonCard(next);
    old.parentNode.replaceChild(fresh, old);
    revealObserve(fresh.parentNode);
    setTimeout(function () { fresh.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
  }

  /* ============================================================
     RENDERERS — each: function(stage, content, ctx)
     ctx = { setRing, onWin }
     ============================================================ */

  function ringPctOf(part, total) { return total ? Math.round((part / total) * 100) : 0; }

  // 1. SCRATCH
  function renderScratch(stage, c, ctx) {
    appendBadge(stage, c);
    var box = el('div', 'sg-scratch');
    var answer = el('div', 'answer', esc(c.fact));
    var canvas = el('canvas');
    box.appendChild(answer); box.appendChild(canvas); stage.appendChild(box);
    setTimeout(init, 30);
    function init() {
      var w = box.clientWidth || 320, h = 150;
      canvas.width = w; canvas.height = h;
      var g = canvas.getContext('2d');
      var grad = g.createLinearGradient(0, 0, w, h); grad.addColorStop(0, '#DFBD69'); grad.addColorStop(1, '#926F34');
      g.fillStyle = grad; g.fillRect(0, 0, w, h);
      g.fillStyle = '#5a4a1a'; g.font = '600 14px "Merriweather Sans",sans-serif';
      g.textAlign = 'center'; g.fillText('👆 Wipe to reveal!', w / 2, h / 2);
      var drawing = false, wiped = 0, won = false;
      function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
      function wipe(e) {
        if (!drawing || won) return; var p = pos(e);
        g.globalCompositeOperation = 'destination-out';
        g.beginPath(); g.arc(p.x, p.y, 22, 0, Math.PI * 2); g.fill(); wiped++;
        if (wiped > 22 && !won) { won = true; ctx.setRing(100); ctx.onWin(); }
      }
      canvas.addEventListener('pointerdown', function (e) { drawing = true; wipe(e); });
      canvas.addEventListener('pointermove', wipe);
      window.addEventListener('pointerup', function () { drawing = false; });
    }
  }

  // 2. WORD SEARCH (pointer drag)
  function renderWordSearch(stage, c, ctx) {
    appendBadge(stage, c);
    var SIZE = 10, words = c.words.slice();
    var grid = [], found = new Set(), sel = [], startCell = null, dragging = false;
    function place() {
      grid = []; for (var r = 0; r < SIZE; r++) { grid.push([]); for (var k = 0; k < SIZE; k++) grid[r].push(null); }
      var dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
      words.forEach(function (w) {
        for (var t = 0; t < 300; t++) {
          var d = dirs[Math.floor(Math.random() * dirs.length)];
          var r = Math.floor(Math.random() * SIZE), col = Math.floor(Math.random() * SIZE);
          var er = r + d[0] * (w.length - 1), ec = col + d[1] * (w.length - 1);
          if (er < 0 || er >= SIZE || ec < 0 || ec >= SIZE) continue;
          var ok = true;
          for (var k = 0; k < w.length; k++) { var cc = grid[r + d[0] * k][col + d[1] * k]; if (cc && cc !== w[k]) { ok = false; break; } }
          if (!ok) continue;
          for (var k = 0; k < w.length; k++) grid[r + d[0] * k][col + d[1] * k] = w[k];
          return;
        }
      });
      for (var r = 0; r < SIZE; r++) for (var col = 0; col < SIZE; col++) if (!grid[r][col]) grid[r][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    place();
    var gridEl = el('div', 'sg-ws-grid'); gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ', 34px)';
    var cells = [];
    for (var r = 0; r < SIZE; r++) for (var col = 0; col < SIZE; col++) { var d = el('div', 'sg-ws-cell', grid[r][col]); d.dataset.r = r; d.dataset.c = col; cells.push(d); gridEl.appendChild(d); }
    var wordsEl = el('div', 'sg-ws-words'); words.forEach(function (w) { var s = el('span'); s.textContent = w; s.dataset.w = w; wordsEl.appendChild(s); });
    stage.appendChild(gridEl); stage.appendChild(wordsEl);
    function idx(r, cc) { return r * SIZE + cc; }
    function clearSel() { sel.forEach(function (x) { x.classList.remove('sel'); }); sel = []; }
    function between(a, b) {
      var r1 = +a.dataset.r, c1 = +a.dataset.c, r2 = +b.dataset.r, c2 = +b.dataset.c;
      var dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
      if (dr !== 0 && dc !== 0 && Math.abs(r2 - r1) !== Math.abs(c2 - c1)) return null;
      var len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1)); var out = [];
      for (var k = 0; k <= len; k++) { var r = r1 + dr * k, cc = c1 + dc * k; if (r < 0 || r >= SIZE || cc < 0 || cc >= SIZE) return null; out.push(cells[idx(r, cc)]); }
      return out;
    }
    function cellFromPoint(x, y) { var el2 = document.elementFromPoint(x, y); if (el2 && el2.classList.contains('sg-ws-cell')) return el2; return null; }
    gridEl.addEventListener('pointerdown', function (e) {
      var t = e.target; if (!t.classList.contains('sg-ws-cell')) return;
      dragging = true; startCell = t; clearSel(); t.classList.add('sel'); sel = [t]; e.preventDefault();
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return; var t = cellFromPoint(e.clientX, e.clientY);
      if (!t || !t.classList.contains('sg-ws-cell')) return;
      var path = between(startCell, t); if (path) { clearSel(); path.forEach(function (x) { x.classList.add('sel'); }); sel = path; }
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return; dragging = false;
      var word = sel.map(function (x) { return x.textContent; }).join('');
      var rev = word.split('').reverse().join('');
      var match = words.indexOf(word) >= 0 ? word : (words.indexOf(rev) >= 0 ? rev : null);
      if (match && !found.has(match)) {
        sel.forEach(function (x) { x.classList.add('found'); });
        found.add(match);
        var span = wordsEl.querySelector('span[data-w="' + match + '"]'); if (span) span.classList.add('done');
        sound.play('correct'); SG.praise.show('correct');
        ctx.setRing(ringPctOf(found.size, words.length));
        if (found.size === words.length) ctx.onWin();
      }
      clearSel();
    });
  }

  // 3. MATCH (click pairs)
  function renderMatch(stage, c, ctx) {
    var pairs = (c.pairs || []).map(function (p) {
      if (Array.isArray(p)) return p;
      if (p.left !== undefined && p.right !== undefined) return [p.left, p.right, p.code];
      return [String(p[0]), String(p[1]), p.code];
    });
    var n = pairs.length;
    var left = shuffle(pairs.map(function (p, i) { return { i: i, text: p[0], code: p[2] }; }));
    var right = shuffle(pairs.map(function (p, i) { return { i: i, text: p[1] }; }));
    var selL = null, selR = null, locked = 0;
    var wrap = el('div', 'sg-match');
    var lc = el('div'); lc.appendChild(el('div', 'col-title', 'Words'));
    var ulL = el('ul'); left.forEach(function (it) { var li = el('li'); li.dataset.i = it.i; li.innerHTML = (it.code ? '<div class="sg-card-code">' + esc(it.code) + '</div>' : '') + '<span>' + esc(it.text) + '</span>'; ulL.appendChild(li); }); lc.appendChild(ulL);
    var rc = el('div'); rc.appendChild(el('div', 'col-title', 'Meanings'));
    var ulR = el('ul'); right.forEach(function (it) { var li = el('li'); li.dataset.i = it.i; li.innerHTML = '<span>' + esc(it.text) + '</span>'; ulR.appendChild(li); }); rc.appendChild(ulR);
    wrap.appendChild(lc); wrap.appendChild(rc); stage.appendChild(wrap);
    ulL.addEventListener('click', function (e) { var li = e.target.closest('li'); if (!li || li.classList.contains('score')) return; if (selL) ulL.querySelector('li[data-i="' + selL + '"]').removeAttribute('data-selected'); li.setAttribute('data-selected', 'true'); selL = li.dataset.i; tryMatch(); });
    ulR.addEventListener('click', function (e) { var li = e.target.closest('li'); if (!li || li.classList.contains('score')) return; if (selR) ulR.querySelector('li[data-i="' + selR + '"]').removeAttribute('data-selected'); li.setAttribute('data-selected', 'true'); selR = li.dataset.i; tryMatch(); });
    function tryMatch() {
      if (selL === null || selR === null) return;
      var lE = ulL.querySelector('li[data-i="' + selL + '"]'), rE = ulR.querySelector('li[data-i="' + selR + '"]');
      if (selL === selR) {
        lE.classList.add('score'); rE.classList.add('score'); lE.removeAttribute('data-selected'); rE.removeAttribute('data-selected');
        sound.play('correct'); locked++; ctx.setRing(ringPctOf(locked, n));
        if (locked === n) { SG.praise.show('correct'); ctx.onWin(); }
      } else {
        [lE, rE].forEach(function (x) { x.classList.add('shake'); setTimeout(function () { x.classList.remove('shake'); }, 400); x.removeAttribute('data-selected'); });
        sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think');
      }
      selL = null; selR = null;
    }
  }

  // 4. DRAG SORT (pointer reorder)
  function renderDragSort(stage, c, ctx) {
    var items = shuffle(c.items);
    var list = el('div', 'sg-sort');
    var nodeFor = function (it) { var n2 = el('div', 'sg-sort-item'); if (it.code) n2.appendChild(el('div', 'sg-card-code', esc(it.code))); n2.appendChild(document.createTextNode(it.text)); n2.dataset.order = it.order; return n2; };
    items.forEach(function (it) { list.appendChild(nodeFor(it)); });
    var checkBtn = el('button', 'sg-btn accent', 'Check Order');
    list.appendChild(checkBtn);
    stage.appendChild(list);
    var dragNode = null, startTop = 0, pointerStart = 0, dragH = 0, placeholder = null;
    list.addEventListener('pointerdown', function (e) {
      var it = e.target.closest('.sg-sort-item'); if (!it || it === checkBtn) return;
      dragNode = it; dragH = it.offsetHeight; startTop = it.offsetTop; pointerStart = e.clientY;
      it.classList.add('dragging'); it.setPointerCapture(e.pointerId); e.preventDefault();
    });
    list.addEventListener('pointermove', function (e) {
      if (!dragNode) return; var dy = e.clientY - pointerStart;
      dragNode.style.transform = 'translateY(' + dy + 'px)';
      var siblings = Array.prototype.filter.call(list.children, function (x) { return x !== dragNode && x !== checkBtn; });
      var curTop = startTop + dy;
      for (var i = 0; i < siblings.length; i++) { var s = siblings[i]; if (s.offsetTop > curTop + dragH / 2) break; }
      // move dragNode to position before siblings[i]
      var ref = siblings[i] || null;
      if (ref && ref.previousElementSibling !== dragNode) list.insertBefore(dragNode, ref);
      else if (!ref && list.lastElementChild.previousElementSibling !== dragNode) list.insertBefore(dragNode, checkBtn);
    });
    function endDrag() {
      if (!dragNode) return; dragNode.style.transform = ''; dragNode.classList.remove('dragging'); dragNode = null;
    }
    list.addEventListener('pointerup', endDrag); list.addEventListener('pointercancel', endDrag);
    checkBtn.addEventListener('click', function () {
      sound.play('click');
      var orderNodes = Array.prototype.filter.call(list.children, function (x) { return x.classList.contains('sg-sort-item'); });
      var allOk = true;
      orderNodes.forEach(function (n2, i) { if (+n2.dataset.order === i) { n2.classList.add('correct'); } else { n2.classList.remove('correct'); allOk = false; } });
      if (allOk) { ctx.setRing(100); ctx.onWin(); }
      else { sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
    });
  }

  // 5. FLIP CARDS
  function renderFlip(stage, c, ctx) {
    var cards = c.cards, seen = 0;
    var grid = el('div', 'sg-flip-grid');
    cards.forEach(function (card) {
      var f = el('div', 'sg-flip');
      var frontHtml = (card.code ? '<div class="sg-card-code">' + esc(card.code) + '</div>' : '') + esc(card.front);
      f.innerHTML = '<div class="flip-inner"><div class="flip-front">' + frontHtml + '</div><div class="flip-back">' + esc(card.back) + '</div></div>';
      f.addEventListener('click', function () { if (f.classList.contains('flipped')) return; f.classList.add('flipped', 'seen'); sound.play('click'); seen++; ctx.setRing(ringPctOf(seen, cards.length)); if (seen === cards.length) { SG.praise.show('correct'); ctx.onWin(); } });
      grid.appendChild(f);
    });
    stage.appendChild(grid);
  }

  // 6. HANGMAN
  function renderHangman(stage, c, ctx) {
    appendBadge(stage, c);
    var answer = c.word.toLowerCase(), guessed = [], wrong = 0, MAX = 6, over = false, won = false;
    var wrap = el('div', 'sg-hang');
    var hint = el('div', 'sg-hang-hint', 'Hint: ' + esc(c.hint));
    var wordEl = el('div', 'sg-hang-word'); var lives = el('div', 'sg-hang-lives'); var kb = el('div', 'sg-hang-kb'); var msg = el('div', 'sg-hang-msg');
    wrap.appendChild(hint); wrap.appendChild(lives); wrap.appendChild(wordEl); wrap.appendChild(kb); wrap.appendChild(msg);
    stage.appendChild(wrap);
    function render() {
      wordEl.textContent = answer.split('').map(function (l) { return guessed.indexOf(l) >= 0 ? l.toUpperCase() : '_'; }).join(' ');
      lives.textContent = 'Lives: ' + Array.from({ length: MAX }, function (_, i) { return i < wrong ? '💔' : '❤️'; }).join(' ');
      kb.innerHTML = '';
      won = answer.split('').every(function (l) { return guessed.indexOf(l) >= 0; }); over = wrong >= MAX;
      'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (l) {
        var b = el('button'); b.textContent = l.toUpperCase(); b.disabled = guessed.indexOf(l) >= 0 || over || won;
        if (guessed.indexOf(l) >= 0) b.classList.add(answer.indexOf(l) >= 0 ? 'correct' : 'wrong');
        if (!over && !won) b.addEventListener('click', function () { guess(l); });
        kb.appendChild(b);
      });
      if (won) { msg.textContent = 'You won! 🎉'; ctx.setRing(100); ctx.onWin(); }
      else if (over) { msg.textContent = 'The word was: ' + answer.toUpperCase() + ' — try a new day!'; sound.play('wrong'); SG.mascot.setMood('think'); }
      else { msg.textContent = ''; }
    }
    function guess(l) {
      if (guessed.indexOf(l) >= 0 || over || won) return; guessed.push(l);
      if (answer.indexOf(l) >= 0) { sound.play('correct'); ctx.setRing(ringPctOf(answer.split('').filter(function (x) { return guessed.indexOf(x) >= 0; }).length, answer.split('').filter(function (x, i, a) { return a.indexOf(x) === i; }).length)); }
      else { wrong++; sound.play('wrong'); SG.praise.show('wrong'); }
      render();
    }
    render();
  }

  // 7. FILL BLANK (click-to-fill, touch friendly)
  function renderFillBlank(stage, c, ctx) {
    appendBadge(stage, c);
    var parts = c.sentence.split('*'), blanks = c.blanks, answers = new Array(blanks.length).fill(null), checked = false;
    var sentenceEl = el('div', 'sg-fb-sentence'); var slots = [];
    parts.forEach(function (p, i) { sentenceEl.appendChild(document.createTextNode(p)); if (i < blanks.length) { var s = el('span', 'sg-fb-slot', '____'); s.dataset.i = i; s.addEventListener('click', function () { answers[i] = null; s.textContent = '____'; s.classList.remove('filled', 'wrong'); checkUsed(); }); sentenceEl.appendChild(s); slots.push(s); } });
    var bank = el('div', 'sg-fb-bank');
    shuffle(blanks).forEach(function (w) { var wd = el('span', 'sg-fb-word', esc(w)); wd.dataset.w = w; wd.addEventListener('click', function () { var empty = answers.indexOf(null); if (empty < 0) return; fillSlot(empty, w, slots[empty]); }); bank.appendChild(wd); });
    var ctrl = el('div', 'sg-fb-controls');
    var checkBtn = el('button', 'sg-btn', 'Check'); var status = el('div', 'game-status'); ctrl.appendChild(checkBtn);
    stage.appendChild(sentenceEl); stage.appendChild(bank); stage.appendChild(ctrl); stage.appendChild(status);
    function fillSlot(i, w, s) { var prev = answers.indexOf(w); if (prev >= 0) { answers[prev] = null; slots[prev].textContent = '____'; slots[prev].classList.remove('filled', 'wrong'); } answers[i] = w; s.textContent = w; s.classList.add('filled'); s.classList.remove('wrong'); checkUsed(); }
    function checkUsed() { bank.querySelectorAll('.sg-fb-word').forEach(function (x) { x.classList.toggle('used', answers.indexOf(x.dataset.w) >= 0); }); }
    checkBtn.addEventListener('click', function () {
      sound.play('click'); var ok = 0; checked = true;
      slots.forEach(function (s, i) { s.classList.remove('wrong'); if (answers[i] === blanks[i]) { s.classList.add('filled'); ok++; } else { s.classList.add('wrong'); } });
      if (ok === blanks.length) { status.textContent = 'Correct! 🎉'; status.className = 'game-status ok'; ctx.setRing(100); ctx.onWin(); }
      else { status.textContent = ok + ' of ' + blanks.length + ' correct — try again!'; status.className = 'game-status no'; sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
    });
  }

  // 8a. TRUE/FALSE (sequential statements; distinct from MCQ)
  function renderTrueFalse(stage, c, ctx) {
    var qs = c.statements, i = 0, score = 0, answered = false;
    var scoreEl = el('div', 'sg-quiz-score', 'Score: 0 / ' + qs.length);
    var prog = el('div', 'sg-quiz-prog');
    var qEl = el('div', 'sg-quiz-q');
    var opts = el('div', 'sg-quiz-opts row tf');
    var nextWrap = el('div', 'sg-quiz-controls');
    var nextBtn = el('button', 'sg-btn', 'Next ›'); nextBtn.style.display = 'none'; nextWrap.appendChild(nextBtn);
    stage.appendChild(scoreEl); stage.appendChild(prog); stage.appendChild(qEl); stage.appendChild(opts); stage.appendChild(nextWrap);
    function render() {
      answered = false; prog.textContent = 'Statement ' + (i + 1) + ' of ' + qs.length;
      var cur = qs[i];
      qEl.innerHTML = ''; appendBadge(qEl, cur); qEl.appendChild(document.createTextNode(cur.t || ''));
      opts.innerHTML = '';
      [true, false].forEach(function (val) {
        var b = el('button', 'sg-tf-opt'); b.innerHTML = '<span class="txt">' + esc(val ? 'True' : 'False') + '</span><span class="ic"></span>';
        b.addEventListener('click', function () { select(val, b); });
        opts.appendChild(b);
      });
      nextBtn.style.display = 'none';
    }
    function select(val, btn) {
      if (answered) return; answered = true;
      var correct = val === qs[i].a;
      if (correct) { btn.classList.add('correct'); btn.querySelector('.ic').textContent = '✓'; score++; scoreEl.textContent = 'Score: ' + score + ' / ' + qs.length; sound.play('correct'); SG.praise.show('correct'); }
      else {
        btn.classList.add('incorrect'); btn.querySelector('.ic').textContent = '✗';
        var other = btn === opts.children[0] ? opts.children[1] : opts.children[0];
        other.classList.add('correct'); other.querySelector('.ic').textContent = '✓';
        sound.play('wrong'); SG.mascot.setMood('think');
      }
      Array.prototype.forEach.call(opts.children, function (x) { x.classList.add('disabled'); });
      ctx.setRing(ringPctOf(i + 1, qs.length));
      nextBtn.style.display = '';
    }
    nextBtn.addEventListener('click', function () { sound.play('click'); i++; if (i < qs.length) render(); else { qEl.textContent = 'Done! ' + score + ' / ' + qs.length + ' correct 🎉'; opts.innerHTML = ''; nextBtn.style.display = 'none'; prog.textContent = ''; ctx.onWin(); } });
    render();
  }

  // 8b. SCRAMBLE (tap word tiles to rebuild a sentence)
  function renderScramble(stage, c, ctx) {
    appendBadge(stage, c);
    var correct = c.words.slice();
    var placed = new Array(correct.length).fill(null);
    var slots = [], poolTiles = [];
    var board = el('div', 'sg-scram');
    var slotRow = el('div', 'sg-scram-slots');
    correct.forEach(function (w, s) {
      var sl = el('div', 'sg-scram-slot');
      sl.addEventListener('click', function () {
        if (!placed[s]) return;
        var rw = placed[s]; placed[s] = null; sl.textContent = ''; sl.classList.remove('filled', 'wrong');
        poolTiles.forEach(function (t) { if (t.dataset.w === rw && t.classList.contains('used')) t.classList.remove('used'); });
        sound.play('click');
      });
      slotRow.appendChild(sl); slots.push(sl);
    });
    var pool = el('div', 'sg-scram-pool');
    shuffle(correct).forEach(function (w) {
      var t = el('span', 'sg-scram-word', esc(w)); t.dataset.w = w;
      t.addEventListener('click', function () {
        if (t.classList.contains('used')) return;
        var empty = placed.indexOf(null); if (empty < 0) return;
        placed[empty] = w; slots[empty].textContent = w; slots[empty].classList.add('filled'); slots[empty].classList.remove('wrong'); t.classList.add('used'); sound.play('click');
      });
      pool.appendChild(t); poolTiles.push(t);
    });
    var ctrl = el('div', 'sg-fb-controls'); var checkBtn = el('button', 'sg-btn', 'Check'); var status = el('div', 'game-status'); ctrl.appendChild(checkBtn);
    board.appendChild(slotRow); board.appendChild(pool); board.appendChild(ctrl); board.appendChild(status);
    stage.appendChild(board);
    checkBtn.addEventListener('click', function () {
      sound.play('click'); var ok = 0;
      slots.forEach(function (sl, i) { sl.classList.remove('wrong'); if (placed[i] === correct[i]) { sl.classList.add('filled'); ok++; } else { sl.classList.add('wrong'); } });
      if (ok === correct.length) { status.textContent = 'Sentence rebuilt! 🎉'; status.className = 'game-status ok'; ctx.setRing(100); ctx.onWin(); }
      else { status.textContent = ok + ' of ' + correct.length + ' in the right place — try again!'; status.className = 'game-status no'; sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
    });
  }

  // 8c. TIMELINE (tap event, then tap the era slot it belongs in)
  function renderTimeline(stage, c, ctx) {
    var eras = c.eras, events = c.events, placed = 0, sel = null;
    var wrap = el('div', 'sg-tl');
    var track = el('div', 'sg-tl-track');
    eras.forEach(function (label, ei) {
      var slot = el('div', 'sg-tl-slot');
      slot.appendChild(el('div', 'sg-tl-era', esc(label)));
      var drop = el('div', 'sg-tl-drop'); slot.appendChild(drop);
      slot.addEventListener('click', function () {
        if (!sel) return;
        var card = sel, ev = events[+card.dataset.i];
        if (ev.era === ei) {
          drop.appendChild(card); card.classList.add('placed'); card.classList.remove('sel'); sound.play('correct'); SG.praise.show('correct');
          placed++; ctx.setRing(ringPctOf(placed, events.length)); sel = null;
          if (placed === events.length) ctx.onWin();
        } else { card.classList.add('shake'); setTimeout(function () { card.classList.remove('shake'); }, 400); sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
      });
      track.appendChild(slot);
    });
    var pool = el('div', 'sg-tl-pool');
    shuffle(events.map(function (e, i) { return { e: e, i: i }; })).forEach(function (o) {
      var card = el('div', 'sg-tl-card');
      if (o.e.code) card.appendChild(el('div', 'sg-card-code', esc(o.e.code)));
      card.appendChild(document.createTextNode(o.e.text));
      card.dataset.i = o.i;
      card.addEventListener('click', function () {
        if (card.classList.contains('placed')) return;
        if (sel) sel.classList.remove('sel');
        sel = card; card.classList.add('sel'); sound.play('click');
      });
      pool.appendChild(card);
    });
    wrap.appendChild(track); wrap.appendChild(pool); stage.appendChild(wrap);
  }

  // 8d. CATEGORIZE (tap item, then tap the bin it belongs in)
  function renderCategorize(stage, c, ctx) {
    // Normalize alternate schema: categories/category to bins/bin
    var bins = c.bins || c.categories || [];
    var rawItems = c.items || [];
    var items = rawItems.map(function (it) {
      var bin = it.bin;
      if (bin === undefined && it.category !== undefined) bin = bins.indexOf(it.category);
      if (bin === undefined || bin === -1) bin = 0;
      return { text: it.text, bin: bin, code: it.code };
    });
    var placed = 0, sel = null;
    var wrap = el('div', 'sg-cat');
    var binRow = el('div', 'sg-cat-bins');
    bins.forEach(function (label, bi) {
      var bin = el('div', 'sg-cat-bin');
      bin.appendChild(el('div', 'sg-cat-bin-head', esc(label)));
      var body = el('div', 'sg-cat-bin-body'); bin.appendChild(body);
      bin.addEventListener('click', function () {
        if (!sel) return;
        var card = sel, it = items[+card.dataset.i];
        if (it.bin === bi) {
          body.appendChild(card); card.classList.add('placed'); card.classList.remove('sel'); sound.play('correct'); SG.praise.show('correct');
          placed++; ctx.setRing(ringPctOf(placed, items.length)); sel = null;
          if (placed === items.length) ctx.onWin();
        } else { card.classList.add('shake'); setTimeout(function () { card.classList.remove('shake'); }, 400); sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
      });
      binRow.appendChild(bin);
    });
    var pool = el('div', 'sg-cat-pool');
    shuffle(items.map(function (it, i) { return { it: it, i: i }; })).forEach(function (o) {
      var card = el('div', 'sg-cat-card');
      if (o.it.code) card.appendChild(el('div', 'sg-card-code', esc(o.it.code)));
      card.appendChild(document.createTextNode(o.it.text));
      card.dataset.i = o.i;
      card.addEventListener('click', function () {
        if (card.classList.contains('placed')) return;
        if (sel) sel.classList.remove('sel');
        sel = card; card.classList.add('sel'); sound.play('click');
      });
      pool.appendChild(card);
    });
    wrap.appendChild(binRow); wrap.appendChild(pool); stage.appendChild(wrap);
  }

  // 8e. TWO TRUTHS & A LIE (tap the false statement)
  function renderTwoTruths(stage, c, ctx) {
    var stmts = c.statements, solved = false;
    var wrap = el('div', 'sg-ttl');
    appendBadge(wrap, c);
    wrap.appendChild(el('div', 'sg-ttl-prompt', 'One statement is FALSE. Tap the lie.'));
    var grid = el('div', 'sg-ttl-grid');
    stmts.forEach(function (s) {
      var b = el('button', 'sg-ttl-item');
      b.innerHTML = (s.code ? '<div class="sg-card-code">' + esc(s.code) + '</div>' : '') + '<span class="ic"></span><span class="txt">' + esc(s.t) + '</span>';
      b.addEventListener('click', function () {
        if (solved) return;
        if (!s.a) {
          b.classList.add('correct'); b.querySelector('.ic').textContent = '✓'; solved = true;
          sound.play('correct'); SG.praise.show('correct'); ctx.setRing(100); ctx.onWin();
          Array.prototype.forEach.call(grid.children, function (x) { x.classList.add('disabled'); });
        } else {
          b.classList.add('incorrect'); b.querySelector('.ic').textContent = '✗'; b.classList.add('shake');
          setTimeout(function () { if (solved) return; b.classList.remove('incorrect', 'shake'); b.querySelector('.ic').textContent = ''; }, 650);
          sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think');
        }
      });
      grid.appendChild(b);
    });
    wrap.appendChild(grid); stage.appendChild(wrap);
  }

  // 8f. LABEL THE DIAGRAM (tap a label, then tap the matching slot/hotspot)
  function renderLabelDiagram(stage, c, ctx) {
    var slots = c.slots, labels = c.labels, placed = 0, sel = null;
    var wrap = el('div', 'sg-label');
    appendBadge(wrap, c);
    var dia = el('div', 'sg-label-diagram');
    slots.forEach(function (sl, si) {
      (function (si) {
        var box = el('div', 'sg-label-slot');
        box.innerHTML = '<span class="sg-label-hint">' + esc(sl.hint) + '</span><span class="sg-label-tag"></span>';
        box.addEventListener('click', function () {
          if (!sel) return;
          var lab = sel, item = labels[+lab.dataset.i];
          if (item.slot === si) {
            box.classList.add('filled'); box.querySelector('.sg-label-tag').textContent = item.label;
            lab.classList.add('placed'); lab.classList.remove('sel'); sound.play('correct'); SG.praise.show('correct');
            placed++; ctx.setRing(ringPctOf(placed, labels.length)); sel = null;
            if (placed === labels.length) ctx.onWin();
          } else { lab.classList.add('shake'); setTimeout(function () { lab.classList.remove('shake'); }, 400); sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
        });
        dia.appendChild(box);
      })(si);
    });
    var pool = el('div', 'sg-label-pool');
    shuffle(labels.map(function (l, i) { return { l: l, i: i }; })).forEach(function (o) {
      var chip = el('span', 'sg-label-chip', esc(o.l.label)); chip.dataset.i = o.i;
      chip.addEventListener('click', function () {
        if (chip.classList.contains('placed')) return;
        if (sel) sel.classList.remove('sel');
        sel = chip; chip.classList.add('sel'); sound.play('click');
      });
      pool.appendChild(chip);
    });
    wrap.appendChild(dia); wrap.appendChild(pool); stage.appendChild(wrap);
  }

  // 8g. VENN DIAGRAM SORT (tap item, then tap left-only / both / right-only / neither)
  function renderVenn(stage, c, ctx) {
    var left = c.left, right = c.right, items = c.items, placed = 0, sel = null;
    var wrap = el('div', 'sg-venn');
    var dia = el('div', 'sg-venn-diagram');
    dia.innerHTML = '<div class="sg-venn-circ left"></div><div class="sg-venn-circ right"></div>' +
      '<div class="sg-venn-lab left">' + esc(left) + '</div><div class="sg-venn-lab right">' + esc(right) + '</div>';
    var regions = {};
    function makeRegion(cls, set, label) {
      var r = el('div', 'sg-venn-region ' + cls);
      r.innerHTML = '<span class="sg-venn-rlabel">' + esc(label) + '</span><div class="sg-venn-drop"></div>';
      r.addEventListener('click', function () {
        if (!sel) return;
        var card = sel, it = items[+card.dataset.i];
        if (it.set === set) {
          r.querySelector('.sg-venn-drop').appendChild(card); card.classList.add('placed'); card.classList.remove('sel');
          sound.play('correct'); SG.praise.show('correct'); placed++; ctx.setRing(ringPctOf(placed, items.length)); sel = null;
          if (placed === items.length) ctx.onWin();
        } else { card.classList.add('shake'); setTimeout(function () { card.classList.remove('shake'); }, 400); sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
      });
      return r;
    }
    var rL = makeRegion('rleft', 0, left + ' only');
    var rBoth = makeRegion('rboth', 2, 'Both');
    var rR = makeRegion('rright', 1, right + ' only');
    dia.appendChild(rL); dia.appendChild(rBoth); dia.appendChild(rR);
    var neither = makeRegion('neither', 3, 'Neither');
    wrap.appendChild(dia); wrap.appendChild(neither);
    var pool = el('div', 'sg-venn-pool');
    shuffle(items.map(function (it, i) { return { it: it, i: i }; })).forEach(function (o) {
      var card = el('div', 'sg-venn-card');
      if (o.it.code) card.appendChild(el('div', 'sg-card-code', esc(o.it.code)));
      card.appendChild(document.createTextNode(o.it.text));
      card.dataset.i = o.i;
      card.addEventListener('click', function () {
        if (card.classList.contains('placed')) return;
        if (sel) sel.classList.remove('sel');
        sel = card; card.classList.add('sel'); sound.play('click');
      });
      pool.appendChild(card);
    });
    wrap.appendChild(pool); stage.appendChild(wrap);
  }

  // 8h. NUMBER LINE (tap the correct dot; supports single or multi-question)
  function renderNumberLine(stage, c, ctx) {
    var qs = c.questions ? c.questions : [{ prompt: c.prompt, marks: c.marks, a: c.a }];
    var qi = 0, wrap = el('div', 'sg-nl');
    function renderQ() {
      wrap.innerHTML = '';
      var q = qs[qi];
      appendBadge(wrap, q);
      wrap.appendChild(el('div', 'sg-nl-prompt', esc(questionText(q) || '')));
      var line = el('div', 'sg-nl-line');
      q.marks.forEach(function (m, mi) {
        (function (mi) {
          var dot = el('button', 'sg-nl-dot');
          dot.innerHTML = '<span class="sg-nl-peg"></span><span class="sg-nl-lab">' + esc(m.l) + '</span>';
          dot.addEventListener('click', function () {
            if (dot.classList.contains('locked')) return;
            if (mi === q.a) {
              dot.classList.add('correct'); sound.play('correct'); SG.praise.show('correct');
              Array.prototype.forEach.call(line.querySelectorAll('.sg-nl-dot'), function (d) { d.classList.add('locked'); });
              qi++;
              ctx.setRing(ringPctOf(qi, qs.length));
              if (qi >= qs.length) { ctx.onWin(); }
              else { setTimeout(function () { sound.play('click'); renderQ(); }, 600); }
            } else {
              dot.classList.add('shake'); sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think');
              setTimeout(function () { dot.classList.remove('shake'); }, 400);
            }
          });
          line.appendChild(dot);
        })(mi);
      });
      wrap.appendChild(line); stage.appendChild(wrap);
    }
    renderQ();
  }

  // 8i. HIGHER / LOWER (reveal a card, guess if next is higher or lower; survive the chain)
  function renderHigherLower(stage, c, ctx) {
    var cards = c.cards, i = 0, solved = false;
    var wrap = el('div', 'sg-nl');
    appendBadge(wrap, c);
    wrap.appendChild(el('div', 'sg-nl-prompt', esc(c.prompt || 'Will the next card be higher or lower?')));
    var stage2 = el('div', 'sg-hl-stage'); wrap.appendChild(stage2);
    var ctrl = el('div', 'sg-hl-ctrl');
    var hi = el('button', 'sg-hl-btn up', '▲ Higher'); var lo = el('button', 'sg-hl-btn down', '▼ Lower');
    ctrl.appendChild(hi); ctrl.appendChild(lo); wrap.appendChild(ctrl); stage.appendChild(wrap);
    function showPair() {
      stage2.innerHTML = '';
      var cur = el('div', 'sg-hl-card cur', esc(cards[i].label));
      var next = el('div', 'sg-hl-card next', i < cards.length - 1 ? '?' : '★');
      stage2.appendChild(cur); stage2.appendChild(el('div', 'sg-hl-vs', 'vs')); stage2.appendChild(next);
      hi.disabled = false; lo.disabled = false;
    }
    function guess(isHigher) {
      if (solved || i >= cards.length - 1) return;
      var ok = isHigher ? (cards[i + 1].val > cards[i].val) : (cards[i + 1].val < cards[i].val);
      if (ok) {
        sound.play('correct'); SG.praise.show('correct');
        var next = stage2.querySelector('.next'); next.textContent = cards[i + 1].label; next.classList.add('reveal');
        i++; ctx.setRing(ringPctOf(i, cards.length - 1));
        if (i >= cards.length - 1) { solved = true; hi.disabled = true; lo.disabled = true; setTimeout(function () { ctx.onWin(); }, 500); }
        else { setTimeout(function () { sound.play('click'); showPair(); }, 700); }
      } else {
        sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think');
        var card = stage2.querySelector('.cur'); card.classList.add('shake'); setTimeout(function () { card.classList.remove('shake'); }, 400);
      }
    }
    hi.addEventListener('click', function () { guess(true); });
    lo.addEventListener('click', function () { guess(false); });
    showPair();
  }

  // 8j. FRACTION BAR (tap segments to build a target fraction; single or multi-question)
  function renderFractionBar(stage, c, ctx) {
    var qs = c.questions ? c.questions : [{ prompt: c.prompt, denom: c.denom, target: c.target }];
    var qi = 0, wrap = el('div', 'sg-fb2');
    function renderQ() {
      wrap.innerHTML = '';
      var q = qs[qi];
      appendBadge(wrap, q);
      wrap.appendChild(el('div', 'sg-fb2-prompt', esc(questionText(q) || '')));
      var bar = el('div', 'sg-fb2-bar');
      var segs = [];
      for (var s = 0; s < q.denom; s++) {
        (function (si) {
          var seg = el('button', 'sg-fb2-seg');
          seg.addEventListener('click', function () {
            if (seg.classList.contains('locked')) return;
            seg.classList.toggle('filled');
            sound.play('click');
            var filled = segs.filter(function (x) { return x.classList.contains('filled'); }).length;
            if (filled === q.target) {
              segs.forEach(function (x) { x.classList.add('locked'); });
              Array.prototype.forEach.call(bar.querySelectorAll('.sg-fb2-seg'), function (x) { if (x.classList.contains('filled')) x.classList.add('correct'); });
              sound.play('correct'); SG.praise.show('correct');
              qi++; ctx.setRing(ringPctOf(qi, qs.length));
              if (qi >= qs.length) { ctx.onWin(); }
              else { setTimeout(function () { sound.play('click'); renderQ(); }, 650); }
            }
          });
          bar.appendChild(seg); segs.push(seg);
        })(s);
      }
      wrap.appendChild(bar); stage.appendChild(wrap);
    }
    renderQ();
  }

  // 8k. CROSSWORD (mini grid; type each clue's answer, letters fill the grid)
  function renderCrossword(stage, c, ctx) {
    appendBadge(stage, c);
    var cols = c.cols, rows = c.rows, words = c.words;
    var blocked = {}; c.blocks.forEach(function (i) { blocked[i] = true; });
    var letter = {}; words.forEach(function (w) { w.answer.split('').forEach(function (ch, k) { letter[w.cells[k]] = ch; }); });
    var solved = 0, wrap = el('div', 'sg-cw');
    var grid = el('div', 'sg-cw-grid'); grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    var cellEls = [];
    for (var i = 0; i < cols * rows; i++) {
      (function (i) {
        if (blocked[i]) { var b = el('div', 'sg-cw-blk'); grid.appendChild(b); cellEls.push(null); return; }
        var cell = el('div', 'sg-cw-cell'); cellEls.push(cell); grid.appendChild(cell);
      })(i);
    }
    wrap.appendChild(grid);
    var clues = el('div', 'sg-cw-clues');
    var across = el('div', 'sg-cw-col'), down = el('div', 'sg-cw-col');
    across.appendChild(el('div', 'sg-cw-head', 'Across')); down.appendChild(el('div', 'sg-cw-head', 'Down'));
    words.forEach(function (w) {
      var row = el('div', 'sg-cw-clue');
      row.appendChild(el('span', 'sg-cw-num', w.num + (w.dir === 'across' ? 'A' : 'D')));
      row.appendChild(el('span', 'sg-cw-txt', esc(w.clue)));
      var inp = el('input', 'sg-cw-inp'); inp.setAttribute('autocomplete', 'off'); inp.size = Math.max(3, w.answer.length);
      var ok = el('span', 'sg-cw-ok');
      inp.addEventListener('input', function () {
        var v = inp.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (v === w.answer.toUpperCase()) {
          inp.disabled = true; inp.classList.add('done'); ok.textContent = '✓'; sound.play('correct'); SG.praise.show('correct');
          w.cells.forEach(function (ci, k) { if (cellEls[ci]) { cellEls[ci].textContent = w.answer[k]; cellEls[ci].classList.add('filled'); } });
          solved++; ctx.setRing(ringPctOf(solved, words.length));
          if (solved === words.length) ctx.onWin();
        }
      });
      row.appendChild(inp); row.appendChild(ok);
      (w.dir === 'across' ? across : down).appendChild(row);
    });
    clues.appendChild(across); clues.appendChild(down); wrap.appendChild(clues); stage.appendChild(wrap);
  }

  // 8l. CLOZE (passage with per-blank drop-down choices)
  function renderCloze(stage, c, ctx) {
    appendBadge(stage, c);
    var parts = c.text.split('*'), blanks = c.blanks, done = 0;
    var wrap = el('div', 'sg-cloze');
    var body = el('div', 'sg-cloze-body');
    parts.forEach(function (part, i) {
      body.appendChild(el('span', 'sg-cloze-txt', esc(part)));
      if (i < blanks.length) {
        (function (bi) {
          var sel = el('select', 'sg-cloze-sel');
          sel.appendChild(el('option', '', '— choose —'));
          blanks[bi].options.forEach(function (opt, oi) {
            var o = el('option', '', esc(opt)); o.value = String(oi); sel.appendChild(o);
          });
          sel.addEventListener('change', function () {
            if (sel.classList.contains('done')) return;
            if (Number(sel.value) === blanks[bi].a) {
              sel.classList.add('done'); sel.disabled = true; sound.play('correct'); SG.praise.show('correct');
              done++; ctx.setRing(ringPctOf(done, blanks.length));
              if (done === blanks.length) ctx.onWin();
            } else { sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think'); }
          });
          body.appendChild(sel);
        })(i);
      }
    });
    wrap.appendChild(body); stage.appendChild(wrap);
  }

  // 8m. MAZE (tap adjacent open cells to route start -> goal)
  function renderMaze(stage, c, ctx) {
    var rows = c.rows, cols = c.cols, start = c.start, goal = c.goal;
    var wall = {}; c.walls.forEach(function (i) { wall[i] = true; });
    var path = [start], solved = false;
    var wrap = el('div', 'sg-nl');
    appendBadge(wrap, c);
    wrap.appendChild(el('div', 'sg-nl-prompt', esc(c.prompt || 'Tap a next cell to build a path to the goal.')));
    var grid = el('div', 'sg-maze'); grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    var cellEls = [];
    function idx(r, cc) { return r * cols + cc; }
    function adj(a, b) { var dr = Math.floor(a / cols) - Math.floor(b / cols), dc = (a % cols) - (b % cols); return (Math.abs(dr) + Math.abs(dc)) === 1; }
    function paint() {
      cellEls.forEach(function (e, i) {
        if (!e) return;
        e.className = 'sg-maze-cell';
        if (i === start) e.classList.add('start');
        if (i === goal) e.classList.add('goal');
        if (path.indexOf(i) !== -1) e.classList.add('path');
        e.textContent = i === start ? '▶' : (i === goal ? '★' : '');
      });
    }
    for (var i = 0; i < rows * cols; i++) {
      (function (i) {
        if (wall[i]) { grid.appendChild(el('div', 'sg-maze-wall')); cellEls.push(null); return; }
        var cell = el('button', 'sg-maze-cell');
        cell.addEventListener('click', function () {
          if (solved) return;
          if (i === goal && adj(path[path.length - 1], goal)) { path.push(goal); solved = true; sound.play('correct'); SG.praise.show('correct'); paint(); ctx.setRing(100); ctx.onWin(); return; }
          if (wall[i]) return;
          var last = path[path.length - 1];
          if (i === last) return;
          // backtrack: tapping a cell already in path truncates to it
          var pi = path.indexOf(i);
          if (pi !== -1) { path = path.slice(0, pi + 1); sound.play('click'); paint(); return; }
          if (adj(last, i)) { path.push(i); sound.play('click'); paint(); }
        });
        grid.appendChild(cell); cellEls.push(cell);
      })(i);
    }
    wrap.appendChild(grid); stage.appendChild(wrap); paint();
  }

  // 8n. CRYPTO HACK (correct answers reveal characters of a hidden phrase)
  function renderCryptoHack(stage, c, ctx) {
    var hidden = c.hidden.toUpperCase(), clues = c.clues, revealed = new Array(hidden.length).fill(false), solved = 0;
    var wrap = el('div', 'sg-nl');
    wrap.appendChild(el('div', 'sg-nl-prompt', 'Crack the clues to reveal the hidden phrase!'));
    var strip = el('div', 'sg-crypt-strip');
    hidden.split('').forEach(function (ch, i) {
      var box = el('span', 'sg-crypt-box' + (ch === ' ' ? ' sp' : ''));
      box.textContent = ch === ' ' ? ' ' : '_'; box.dataset.i = i;
      strip.appendChild(box);
    });
    wrap.appendChild(strip);
    var list = el('div', 'sg-crypt-list');
    clues.forEach(function (cl, ci) {
      var row = el('div', 'sg-crypt-row');
      var qWrap = el('div', 'sg-crypt-q');
      appendBadge(qWrap, cl);
      qWrap.appendChild(document.createTextNode(cl.prompt || ''));
      row.appendChild(qWrap);
      var opts = el('div', 'sg-crypt-opts'); var answered = false;
      cl.options.forEach(function (txt, oi) {
        var b = el('button', 'sg-mis-opt'); b.innerHTML = '<span class="txt">' + esc(txt) + '</span><span class="ic"></span>';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          if (oi === cl.a) {
            b.classList.add('correct'); b.querySelector('.ic').textContent = '✓'; sound.play('correct'); SG.praise.show('correct');
            cl.show.forEach(function (pos) { revealed[pos] = true; strip.querySelector('[data-i="' + pos + '"]').textContent = hidden[pos]; strip.querySelector('[data-i="' + pos + '"]').classList.add('on'); });
            Array.prototype.forEach.call(opts.children, function (x) { x.classList.add('disabled'); });
            solved++; ctx.setRing(ringPctOf(solved, clues.length));
            if (revealed.every(function (v) { return v; })) ctx.onWin();
          } else {
            b.classList.add('incorrect'); b.querySelector('.ic').textContent = '✗'; sound.play('wrong'); SG.praise.show('wrong'); SG.mascot.setMood('think');
            setTimeout(function () { if (answered && oi !== cl.a) { b.classList.remove('incorrect'); b.querySelector('.ic').textContent = ''; answered = false; } }, 600);
          }
        });
        opts.appendChild(b);
      });
      row.appendChild(opts); list.appendChild(row);
    });
    wrap.appendChild(list); stage.appendChild(wrap);
  }

  // 8. QUIZ (multiple choice; covers T/F with 2 options)
  function renderQuiz(stage, c, ctx) {
    var qs = c.questions, i = 0, score = 0, answered = false;
    var scoreEl = el('div', 'sg-quiz-score', 'Score: 0 / ' + qs.length);
    var prog = el('div', 'sg-quiz-prog');
    var qEl = el('div', 'sg-quiz-q');
    var opts = el('div', 'sg-quiz-opts');
    var nextWrap = el('div', 'sg-quiz-controls');
    var nextBtn = el('button', 'sg-btn', 'Next ›'); nextBtn.style.display = 'none'; nextWrap.appendChild(nextBtn);
    stage.appendChild(scoreEl); stage.appendChild(prog); stage.appendChild(qEl); stage.appendChild(opts); stage.appendChild(nextWrap);
    function render() {
      answered = false; prog.textContent = 'Question ' + (i + 1) + ' of ' + qs.length;
      var cur = qs[i];
      qEl.innerHTML = ''; appendBadge(qEl, cur); qEl.appendChild(document.createTextNode(questionText(cur) || ''));
      opts.innerHTML = '';
      cur.options.forEach(function (txt, idx) {
        var b = el('button', 'sg-quiz-opt'); b.innerHTML = '<span class="txt">' + esc(txt) + '</span><span class="ic"></span>';
        b.addEventListener('click', function () { select(idx, b); });
        opts.appendChild(b);
      });
      opts.classList.toggle('row', qs[i].options.length === 2);
      nextBtn.style.display = 'none';
    }
    function select(idx, btn) {
      if (answered) return; answered = true;
      var correct = idx === qs[i].a;
      if (correct) { btn.classList.add('correct'); btn.querySelector('.ic').textContent = '✓'; score++; scoreEl.textContent = 'Score: ' + score + ' / ' + qs.length; sound.play('correct'); SG.praise.show('correct'); }
      else { btn.classList.add('incorrect'); btn.querySelector('.ic').textContent = '✗'; opts.children[qs[i].a].classList.add('correct'); opts.children[qs[i].a].querySelector('.ic').textContent = '✓'; sound.play('wrong'); SG.mascot.setMood('think'); }
      Array.prototype.forEach.call(opts.children, function (x) { x.classList.add('disabled'); });
      ctx.setRing(ringPctOf(i + 1, qs.length));
      nextBtn.style.display = '';
    }
    nextBtn.addEventListener('click', function () { sound.play('click'); i++; if (i < qs.length) render(); else { qEl.textContent = 'Done! You scored ' + score + ' / ' + qs.length + ' 🎉'; opts.innerHTML = ''; nextBtn.style.display = 'none'; prog.textContent = ''; ctx.onWin(); } });
    render();
  }

  /* ---------- MISSION engine (story-advancing multi-stage quest) ----------
   * A mission = sequence of "gates". Each gate is one drill tied to the day's
   * subjects. Solving a gate powers up one city block, reveals the next story
   * beat, and advances the character. All gates done = day won.
   * Gate drill types: 'quiz' (MC), 'input' (type answer), 'seek' (tap all correct).
   */
  /* ---------- MISSION engine (phase-runner: lesson → drill → practice → activity) ----------
   * content.phases = [ {kind, subject, title, ...}, ... ]
   *   kind 'lesson'   : { blocks:[ {h, p, example, tip}... ] }
   *   kind 'drill'    : { questions:[ {prompt, options, a, okMsg}... ] }   (5-6, one at a time)
   *   kind 'practice' : { mode:'flash'|'quiz', items:[ {front,back} | {prompt,options,a} ] }
   *   kind 'activity' : { stages:[ {type, subject, story, prompt, ...}... ] }  (quiz/input/seek gates)
   */
  function renderMission(stage, c, ctx) {
    // compat: old entries used { stages:[...] } — wrap as a single activity phase
    var phases = c.phases || (c.stages ? [{ kind: 'activity', title: c.title, stages: c.stages }] : []);
    var pi = 0;
    var wrap = el('div', 'sg-mission');
    var head = el('div', 'sg-mis-head');
    head.innerHTML = '<div class="sg-mis-title">🗺️ ' + esc(c.title) + '</div><div class="sg-mis-intro">' + esc(c.intro) + '</div>';
    wrap.appendChild(head);

    // phase track
    var track = el('div', 'sg-phase-track');
    phases.forEach(function (ph, i) {
      var b = el('div', 'sg-phase-dot ' + (i === 0 ? 'cur' : 'lock'));
      b.innerHTML = '<span class="phd-ic">' + phaseIcon(ph.kind) + '</span><span class="phd-lbl">' + esc(ph.subject || '') + '</span>';
      track.appendChild(b);
    });
    wrap.appendChild(track);

    // back-nav row (review a previous phase if stuck)
    var navRow = el('div', 'sg-phase-nav');
    var backBtn = el('button', 'sg-btn sg-mini sg-back-btn', '‹ Back');
    backBtn.addEventListener('click', function () { sound.play('click'); prevPhase(); });
    navRow.appendChild(backBtn);
    wrap.appendChild(navRow);

    var scene = el('div', 'sg-mis-scene'); wrap.appendChild(scene);
    var feedback = el('div', 'sg-mis-fb'); wrap.appendChild(feedback);

    function setPhaseState(i, state) {
      var b = track.children[i];
      b.className = 'sg-phase-dot ' + state;
      b.querySelector('.phd-ic').textContent = state === 'done' ? '✓' : phaseIcon(phases[i].kind);
    }
    function fbOk(msg) { feedback.className = 'sg-mis-fb ok'; feedback.textContent = '✅ ' + msg; }
    function fbNo(msg) { feedback.className = 'sg-mis-fb no'; feedback.textContent = '🌱 ' + msg; }
    function fbClear() { feedback.textContent = ''; feedback.className = 'sg-mis-fb'; }
    function ringOf(part, total) { ctx.setRing(total ? Math.round((part / total) * 100) : 0); }

    // ---------- reusable gate renderers (render into `host`, call onDone) ----------
    function quizInto(host, g, onDone) {
      var promptText = questionText(g) || '';
      appendBadge(host, g);
      var q = el('div', 'sg-mis-q', esc(promptText));
      var opts = el('div', 'sg-mis-opts');
      var answered = false;
      g.options.forEach(function (txt, idx) {
        var b = el('button', 'sg-mis-opt'); b.innerHTML = '<span class="txt">' + esc(txt) + '</span><span class="ic"></span>';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var ok = idx === g.a;
          if (ok) { b.classList.add('correct'); b.querySelector('.ic').textContent = '✓'; sound.play('correct'); SG.praise.show('correct'); }
          else { b.classList.add('incorrect'); b.querySelector('.ic').textContent = '✗'; opts.children[g.a].classList.add('correct'); opts.children[g.a].querySelector('.ic').textContent = '✓'; sound.play('wrong'); SG.mascot.setMood('think'); }
          Array.prototype.forEach.call(opts.children, function (x) { x.classList.add('disabled'); });
          fbOk(ok ? (g.okMsg || 'Correct!') : 'Answer shown — tap Next.');
          var next = el('button', 'sg-btn sg-next-btn', 'Next ›');
          next.addEventListener('click', function () { sound.play('click'); onDone(ok); });
          host.appendChild(next);
        });
        opts.appendChild(b);
      });
      host.appendChild(q);
      var qs = el('button', 'sg-q-speak'); qs.type = 'button'; qs.innerHTML = '🔊'; qs.setAttribute('aria-label', 'Read question aloud');
      qs.addEventListener('click', function (e) { e.preventDefault(); var t = promptText; if (g.options) t += '. ' + g.options.join(', '); SG.speak.toggle(t, qs); });
      host.appendChild(qs);
      host.appendChild(opts);
    }

    function inputInto(host, g, onDone) {
      var promptText = questionText(g) || '';
      appendBadge(host, g);
      var q = el('div', 'sg-mis-q', esc(promptText));
      var qs = el('button', 'sg-q-speak'); qs.type = 'button'; qs.innerHTML = '🔊'; qs.setAttribute('aria-label', 'Read question aloud');
      qs.addEventListener('click', function (e) { e.preventDefault(); SG.speak.toggle(promptText, qs); });
      var row = el('div', 'sg-mis-input-row');
      var inp = el('input', 'sg-mis-input'); inp.type = 'text'; inp.setAttribute('autocomplete', 'off'); inp.placeholder = 'Type your answer…';
      var btn = el('button', 'sg-btn', 'Check ▸');
      row.appendChild(inp); row.appendChild(btn);
      host.appendChild(q); host.appendChild(qs); host.appendChild(row); inp.focus();
      function check() {
        var v = String(inp.value).trim().toLowerCase().replace(/[,\."'!?;]/g, '').replace(/\s+/g, ' ');
        var accept = (g.accept || []).map(function (a) { return String(a).toLowerCase().replace(/[,\."'!?;]/g, '').replace(/\s+/g, ' '); });
        if (!v) return;
        var isOk = accept.some(function (a) { return v === a || v.indexOf(a) !== -1 || a.indexOf(v) !== -1; });
        if (isOk) {
          sound.play('correct'); SG.praise.show('correct'); fbOk(g.okMsg || 'Got it!');
          inp.disabled = true; btn.disabled = true;
          var next = el('button', 'sg-btn sg-next-btn', 'Next ›');
          next.addEventListener('click', function () { sound.play('click'); onDone(true); });
          host.appendChild(next);
        } else { sound.play('wrong'); SG.mascot.setMood('think'); fbNo('Not quite — try again 💪'); inp.classList.add('shake'); setTimeout(function () { inp.classList.remove('shake'); }, 350); }
      }
      btn.addEventListener('click', check);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    }

    function seekInto(host, g, onDone) {
      var promptText = questionText(g) || '';
      appendBadge(host, g);
      var q = el('div', 'sg-mis-q', esc(promptText));
      var grid = el('div', 'sg-mis-seek');
      var found = {};
      host.appendChild(q); host.appendChild(grid);
      g.items.forEach(function (it, idx) {
        var b = el('button', 'sg-mis-tile'); b.innerHTML = '<span class="tile-ic">' + esc(it.label) + '</span>';
        var isCorrect = g.correct.indexOf(idx) !== -1;
        b.addEventListener('click', function () {
          if (b.classList.contains('correct') || b.classList.contains('wrong-tap')) return;
          if (isCorrect) {
            b.classList.add('correct'); found[idx] = true; sound.play('correct');
            if (Object.keys(found).length === g.correct.length) { fbOk(g.okMsg || 'Found them all!'); var next = el('button', 'sg-btn sg-next-btn', 'Next ›'); next.addEventListener('click', function () { sound.play('click'); onDone(true); }); host.appendChild(next); }
            else { fbOk('Keep going — ' + (g.correct.length - Object.keys(found).length) + ' more!'); }
          } else { b.classList.add('wrong-tap'); sound.play('wrong'); SG.mascot.setMood('think'); fbNo('Not one — try another.'); }
        });
        grid.appendChild(b);
      });
    }

    // ---------- generic engine dispatcher (reuse the 8 RENDERERS as gates/practice) ----------
    function engineInto(host, kind, c, onWin) {
      var sub = el('div', 'sg-engine-host');
      host.appendChild(sub);
      var r = RENDERERS[kind];
      if (!r) { host.appendChild(el('div', 'sg-mis-fb no', '(engine "' + kind + '" missing)')); return; }
      r(sub, c, { setRing: ctx.setRing, onWin: onWin });
    }

    // ---------- phase renderers ----------
    function renderLesson(ph) {
      var blocks = ph.blocks || [];
      var card = el('div', 'sg-lesson');
      card.innerHTML = '<div class="sg-les-subj">' + esc(ph.subject) + '</div><h3 class="sg-les-title">' + esc(ph.title) + '</h3>';
      var illWrap = el('div', 'sg-les-ill'); illWrap.innerHTML = SG.ill(ph.subject, ph.title);
      if (illWrap.firstChild) card.appendChild(illWrap.firstChild);
      var speakBtn = el('button', 'sg-speak-btn'); speakBtn.type = 'button'; speakBtn.textContent = '🔊 Read aloud';
      speakBtn.setAttribute('aria-label', 'Read this lesson aloud');
      card.appendChild(speakBtn);
      speakBtn.addEventListener('click', function () {
        var txt = esc(ph.title) + '. ';
        var bs = body.querySelectorAll('.sg-les-block');
        Array.prototype.forEach.call(bs, function (blk) {
          Array.prototype.forEach.call(blk.querySelectorAll('.sg-les-h, .sg-les-p, .sg-les-example, .sg-les-tip'), function (n) { txt += n.textContent + '. '; });
        });
        SG.speak.toggle(txt, speakBtn);
      });
      var body = el('div', 'sg-les-body'); card.appendChild(body);
      var btns = el('div', 'sg-les-btns'); card.appendChild(btns);
      scene.innerHTML = ''; scene.appendChild(card); fbClear();

      function renderBlock(bk) {
        var b = el('div', 'sg-les-block sg-reveal');
        // Fallback: typed block schema used in some course files.
        var h = bk.h, p = bk.p, example = bk.example, tip = bk.tip, diagram = bk.diagram;
        if (bk.type === 'text' && bk.text) p = bk.text;
        if (bk.type === 'example' && bk.text) example = bk.text;
        if (bk.type === 'tip' && bk.text) tip = bk.text;
        if (bk.type === 'vocab' && bk.word) { h = 'Vocabulary: ' + bk.word; p = bk.def; }
        if (h) b.appendChild(el('div', 'sg-les-h', esc(h)));
        if (p) b.appendChild(el('p', 'sg-les-p', esc(p)));
        if (diagram) { var d = el('div', 'sg-les-diagram'); d.innerHTML = diagram; b.appendChild(d); }
        if (example) { var ex = el('div', 'sg-les-example'); ex.innerHTML = '💡 <b>Example:</b> ' + esc(example); b.appendChild(ex); }
        if (tip) { var tp = el('div', 'sg-les-tip'); tp.innerHTML = '✅ <b>Tip:</b> ' + esc(tip); b.appendChild(tp); }
        body.appendChild(b);
        requestAnimationFrame(function () { b.classList.add('is-visible'); });
        return b;
      }

      var shown = 0;
      function renderCtrl() {
        btns.innerHTML = '';
        if (shown < blocks.length) {
          var moreLabel = shown === 0 ? 'Start reading ▸' : 'Show next part ▸';
          var more = el('button', 'sg-btn sg-go-btn', moreLabel);
          more.addEventListener('click', function () {
            sound.play('click');
            var blk = renderBlock(blocks[shown]); shown++;
            setTimeout(function () { blk.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 70);
            renderCtrl();
          });
          btns.appendChild(more);
        } else {
          var go = el('button', 'sg-btn sg-go-btn', 'Start ' + labelForNext(phases, pi) + ' ▸');
          go.addEventListener('click', function () { sound.play('click'); nextPhase(); });
          btns.appendChild(go);
        }
      }

      // reveal the first block right away so there is something to read
      if (blocks.length) { renderBlock(blocks[0]); shown = 1; }
      renderCtrl();
    }

    function renderDrill(ph) {
      scene.innerHTML = '';
      scene.appendChild(el('div', 'sg-phase-label', esc(ph.subject) + ' · Drill — ' + esc(ph.title)));
      var host = el('div', 'sg-drill-host'); scene.appendChild(host);
      if (ph.questions) {
        var qs = ph.questions, qi = 0, score = 0;
        var bar = el('div', 'sg-drill-bar', 'Question 1 of ' + qs.length + ' · Score 0');
        scene.appendChild(bar); scene.appendChild(host);
        function renderQ() {
          bar.textContent = 'Question ' + (qi + 1) + ' of ' + qs.length + ' · Score ' + score;
          host.innerHTML = ''; if (SG.speak) SG.speak.stop();
          var q = qs[qi];
          // Multiple-choice drill (default engine schema)
          if (q.options && q.options.length) {
            quizInto(host, q, function (ok) { if (ok) score++; qi++; if (qi < qs.length) renderQ(); else drillDone(); });
          } else {
            // Free-text / typed answer fallback
            var accept = q.accept || (q.a !== undefined ? [String(q.a)] : []);
            inputInto(host, { prompt: q.prompt || q.q, accept: accept, okMsg: q.okMsg || 'Correct!' }, function (ok) { if (ok) score++; qi++; if (qi < qs.length) renderQ(); else drillDone(); });
          }
          ringOf(qi, qs.length);
        }
        function drillDone() {
          ringOf(qi, qs.length);
          host.innerHTML = '<div class="sg-drill-done">Drill done! You scored ' + score + ' / ' + qs.length + ' 🎉</div>';
          var next = el('button', 'sg-btn sg-go-btn', 'On to ' + labelForNext(phases, pi) + ' ▸');
          next.addEventListener('click', function () { sound.play('click'); nextPhase(false); });
          host.appendChild(next);
          if (score === qs.length) { SG.mascot.setMood('happy'); SG.confetti({ count: 60 }); }
        }
        renderQ();
      } else {
        // single-engine drill (fillBlank / quizMC / match / etc.)
        engineInto(host, ph.engine || 'quizMC', ph, function () {
          host.innerHTML = '<div class="sg-drill-done">Drill complete! 🎉</div>';
          var next = el('button', 'sg-btn sg-go-btn', 'On to ' + labelForNext(phases, pi) + ' ▸');
          next.addEventListener('click', function () { sound.play('click'); nextPhase(false); });
          host.appendChild(next);
          SG.mascot.setMood('happy'); SG.confetti({ count: 60 });
        });
      }
    }

    function renderPractice(ph) {
      var items = ph.items, ii = 0;
      scene.innerHTML = '';
      scene.appendChild(el('div', 'sg-phase-label', esc(ph.subject) + ' · Recap — ' + esc(ph.title)));
      var host = el('div', 'sg-practice-host'); scene.appendChild(host);
      if (ph.mode === 'flash') {
        function showCard() {
          var card = el('div', 'sg-flashcard');
          card.innerHTML = '<div class="sg-fc-face sg-fc-front">' + esc(items[ii].front) + '</div><div class="sg-fc-face sg-fc-back">' + esc(items[ii].back) + '</div>';
          card.addEventListener('click', function () { card.classList.toggle('flipped'); sound.play('click'); });
          host.innerHTML = ''; host.appendChild(card);
          var cnt = el('div', 'sg-flash-ctrl');
          var prev = el('button', 'sg-btn sg-mini', '‹ Prev'); prev.disabled = ii === 0;
          var prog = el('span', 'sg-flash-prog', (ii + 1) + ' / ' + items.length);
          var nextB = el('button', 'sg-btn sg-mini', ii === items.length - 1 ? 'Done ▸' : 'Next ›');
          prev.addEventListener('click', function () { if (ii > 0) { ii--; showCard(); } });
          nextB.addEventListener('click', function () { if (ii < items.length - 1) { ii++; showCard(); } else { sound.play('correct'); practiceDone(); } });
          cnt.appendChild(prev); cnt.appendChild(prog); cnt.appendChild(nextB);
          host.appendChild(cnt);
          ringOf(ii, items.length);
        }
        showCard();
      } else if (ph.mode === 'quiz') { // quiz recap
        var qi = 0, score = 0;
        function showQ() {
          host.innerHTML = ''; if (SG.speak) SG.speak.stop();
          quizInto(host, items[qi], function (ok) { if (ok) score++; qi++; if (qi < items.length) showQ(); else { host.innerHTML = '<div class="sg-drill-done">Recap done! ' + score + ' / ' + items.length + ' 🎉</div>'; var n = el('button', 'sg-btn sg-go-btn', 'On to ' + labelForNext(phases, pi) + ' ▸'); n.addEventListener('click', function () { sound.play('click'); nextPhase(false); }); host.appendChild(n); practiceDone(); } });
          ringOf(qi, items.length);
        }
        showQ();
      } else { // any other engine mode: match / fillBlank / flip / wordSearch / dragSort / hangman / scratch / quizMC
        engineInto(host, ph.mode, ph, practiceDone);
      }
      function practiceDone() { ringOf(1, 1); if (!host.querySelector('.sg-go-btn')) { var n = el('button', 'sg-btn sg-go-btn', 'On to ' + labelForNext(phases, pi) + ' ▸'); n.addEventListener('click', function () { sound.play('click'); nextPhase(false); }); host.appendChild(n); } }
    }

    function renderActivity(ph) {
      var gates = ph.stages, gi = 0, solved = 0;
      var sub = el('div', 'sg-mis-story');
      var host = el('div', 'sg-act-host');
      var gtrack = el('div', 'sg-mis-track');
      gates.forEach(function (g, i) {
        var b = el('div', 'sg-mis-block ' + (i === 0 ? 'cur' : 'lock'));
        b.innerHTML = '<span class="blk-ic">' + (i === 0 ? '📍' : '🔒') + '</span><span class="blk-idx">' + (i + 1) + '</span>';
        gtrack.appendChild(b);
      });
      scene.innerHTML = '';
      scene.appendChild(el('div', 'sg-phase-label', '🎯 Activity — ' + esc(ph.title || c.title)));
      scene.appendChild(gtrack); scene.appendChild(sub); scene.appendChild(host);
      function setBlockState(i, state) { var b = gtrack.children[i]; b.className = 'sg-mis-block ' + state; b.querySelector('.blk-ic').textContent = state === 'done' ? '⚡' : (state === 'cur' ? '📍' : '🔒'); }
      function showStory() { var g = gates[gi]; sub.innerHTML = '<span class="sg-mis-subj">' + esc(g.subject || ph.subject || '') + '</span> ' + esc(g.story || g.prompt || g.text || ''); }
      function renderGate() {
        var raw = gates[gi];
        var g = raw;
        // Fallback: plain { text, answer } stages become typed input gates
        if (!g.type && (g.answer !== undefined || g.accept)) {
          g = {
            type: 'input',
            subject: raw.subject || ph.subject || '',
            story: raw.story || 'Solve this.',
            prompt: raw.prompt || raw.text || '',
            accept: raw.accept || (raw.answer !== undefined ? [String(raw.answer)] : []),
            okMsg: raw.okMsg || 'Correct!'
          };
        }
        gates[gi] = g; // persist normalized gate for showStory
        fbClear(); showStory(); host.innerHTML = ''; if (SG.speak) SG.speak.stop();
        if (g.type === 'quiz') quizInto(host, g, gateDone);
        else if (g.type === 'input') inputInto(host, g, gateDone);
        else if (g.type === 'seek') seekInto(host, g, gateDone);
        else engineInto(host, g.type, g, gateDone);
        ringOf(solved, gates.length);
      }
      function gateDone() {
        setBlockState(gi, 'done'); solved++; gi++;
        if (gi >= gates.length) { host.innerHTML = '<div class="sg-mis-win">' + (c.winText || '🎉 Mission complete!') + '</div>'; sub.textContent = ''; ringOf(1, 1); ctx.onWin(); return; }
        setBlockState(gi, 'cur'); setTimeout(function () { sound.play('click'); renderGate(); }, 420);
      }
      renderGate();
    }

    // ---------- phase driver ----------
    function renderPhase() {
      var ph = phases[pi];
      if (SG.speak) SG.speak.stop();
      navRow.style.visibility = pi > 0 ? 'visible' : 'hidden';
      if (pi > 0) backBtn.textContent = '‹ Back to ' + labelForPrev(phases, pi);
      if (ph.kind === 'lesson') renderLesson(ph);
      else if (ph.kind === 'drill') renderDrill(ph);
      else if (ph.kind === 'practice') renderPractice(ph);
      else if (ph.kind === 'activity') renderActivity(ph);
    }
    function nextPhase() {
      if (pi > 0) setPhaseState(pi - 1, 'done');
      if (pi >= phases.length - 1) return; // safety
      pi++; setPhaseState(pi, 'cur'); renderPhase();
    }
    function prevPhase() {
      if (pi <= 0) return;
      setPhaseState(pi, 'lock'); pi--; setPhaseState(pi, 'cur'); renderPhase();
    }

    setPhaseState(0, 'cur');
    renderPhase();
    stage.appendChild(wrap);
  }

  function phaseIcon(kind) { return { lesson: '📖', drill: '✏️', practice: '🔄', activity: '🎯' }[kind] || '•'; }
  function labelForNext(phases, pi) {
    for (var j = pi + 1; j < phases.length; j++) { if (phases[j].kind === 'activity') return 'the activity'; return phases[j].title || phases[j].kind; }
    return 'next';
  }
  function labelForPrev(phases, pi) { return pi > 0 ? (phases[pi - 1].title || phases[pi - 1].kind) : 'start'; }

  var RENDERERS = { scratch: renderScratch, wordSearch: renderWordSearch, match: renderMatch, dragSort: renderDragSort, flip: renderFlip, hangman: renderHangman, fillBlank: renderFillBlank, quizMC: renderQuiz, trueFalse: renderTrueFalse, scramble: renderScramble, timeline: renderTimeline, categorize: renderCategorize, twoTruths: renderTwoTruths, labelDiagram: renderLabelDiagram, venn: renderVenn, numberLine: renderNumberLine, higherLower: renderHigherLower, fractionBar: renderFractionBar, crossword: renderCrossword, cloze: renderCloze, maze: renderMaze, cryptoHack: renderCryptoHack, mission: renderMission };

  /* ---------- ripple ---------- */
  function attachRipple(btn) {
    btn.addEventListener('pointerdown', function (e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var r = btn.getBoundingClientRect(); var sp = el('span', 'ripple'); var d = Math.max(r.width, r.height);
      sp.style.width = sp.style.height = d + 'px';
      var x = (e.clientX || 0) - (r.left + d / 2), y = (e.clientY || 0) - (r.top + d / 2);
      sp.style.left = x + 'px'; sp.style.top = y + 'px';
      sp.addEventListener('animationend', function () { sp.remove(); }); btn.appendChild(sp);
    });
  }

  /* ---------- build day-game-card ---------- */
  function pairClass(day) {
    // determine ribbon class from the two subjects
    var a = day[0][0], b = day[1][0];
    var has = function (s) { return a === s || b === s; };
    if (has('Math') && has('Science')) return 'math-sci';
    if (has('ELA') && has('Social Studies')) return 'ela-ss';
    if (has('Math') && has('ELA')) return 'math-ela';
    return 'sci-ss';
  }
  function subjectClass(name) { return { Math: 'math', ELA: 'ela', Science: 'science', 'Social Studies': 'social' }[name] || 'math'; }

  // a lesson is unlocked if every earlier lesson (linear order across units) is
  // done, OR if sequential gating is off (CFG.sequential === false).
  function priorLessonDone(p) {
    if (CFG.sequential === false) return true;
    var ls = lessons();
    for (var i = 0; i < ls.length; i++) {
      if (lessonKey(ls[i]) === lessonKey(p)) break;
      if (!done[lessonKey(ls[i])]) return false;
    }
    return true;
  }

  function globalLessonIndex(p) {
    var ls = lessons(), n = 0;
    for (var i = 0; i < ls.length; i++) { if (lessonKey(ls[i]) === lessonKey(p)) return n; n++; }
    return n;
  }

  function buildLessonCard(p) {
    var lkey = lessonKey(p), l = p.lesson;
    var isDone = !!done[lkey];
    var unlocked = isDone || priorLessonDone(p);
    var subs = lessonSubjects(l);
    var ribbonCls = subs.length >= 2 ? pairClass([[subs[0]], [subs[1]]]) : (subjectClass(subs[0]) + "-only");
    var card = el('div', 'day-game-card sg-reveal ' + ribbonCls + (isDone ? ' done' : '') + (unlocked ? '' : ' locked'));
    card.dataset.day = lkey; card.style.setProperty('--i', p.li);
    var ribbon = el('div', 'day-ribbon'); card.appendChild(ribbon);

    var header = el('div', 'day-header');
    var dots = '<span class="day-subj-dots">' + subs.map(function (s) { return '<i class="dot dot-' + subjectClass(s) + '"></i>'; }).join('') + '</span>';
    var streakCount = SG.streak.count();
    var lbl = CFG.lessonLabel || 'Lesson';
    header.innerHTML = '<span class="day-label">' + esc(lbl) + ' ' + (globalLessonIndex(p) + 1) + '</span>' + dots +
      '<span class="day-streak' + (streakCount ? '' : ' empty') + '">🔥 ' + streakCount + '</span>' + SG.ring.svg(isDone ? 100 : 0);
    card.appendChild(header);

    if (l.title) card.appendChild(el('div', 'game-title', '🎯 ' + esc(l.title)));
    if (l.intro) card.appendChild(el('div', 'game-hint', esc(l.intro)));

    var tags = el('div', 'subject-tags');
    subs.forEach(function (s) { var t = el('span', 'gtag ' + subjectClass(s)); t.textContent = s; tags.appendChild(t); });
    card.appendChild(tags);

    if (!unlocked) {
      var ov = el('div', 'day-lock-overlay');
      ov.innerHTML = '<div class="lock-ic">🔒</div><div class="lock-title">Locked</div><div class="lock-msg">Finish the previous lesson to unlock.</div>';
      card.appendChild(ov);
      return card;
    }

    var stage = el('div', 'game-stage'); card.appendChild(stage);
    var ringSvg = header.querySelector('svg.day-ring');
    var ctx = {
      setRing: function (pct) { SG.ring.set(ringSvg, pct); },
      onWin: function () { onWin(lkey, ringSvg); }
    };
    setTimeout(function () { var r = RENDERERS.mission; if (r) r(stage, l, ctx); }, 0);
    return card;
  }

  /* ---------- render all units ---------- */
  function renderLessons() {
    var container = document.getElementById('learnkit-cards');
    if (!container) return;
    container.innerHTML = '';
    container.classList.add('summer-weeks');
    var unitLabel = CFG.unitLabel || 'Unit';
    (CFG.units || []).forEach(function (u, ui) {
      var panel = el('div', 'week-panel'); panel.dataset.weekPanel = ui;
      panel.appendChild(el('div', 'week-panel-title', esc(u.title || (unitLabel + ' ' + (ui + 1)))));
      u.lessons.forEach(function (l, li) { panel.appendChild(buildLessonCard({ ui: ui, li: li, unit: u, lesson: l })); });
      container.appendChild(panel);
    });
    revealObserve(container);
  }

  /* ---------- scroll reveal (IntersectionObserver) ---------- */
  function revealObserve(root) {
    var els = root.querySelectorAll('.sg-reveal, .sg-stagger');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- unit nav (scroll-snap, scrollIntoView) ---------- */
  function buildUnitNav() {
    var nav = document.getElementById('unit-nav'); if (!nav) return;
    nav.innerHTML = '';
    var unitLabel = CFG.unitLabel || 'Unit';
    (CFG.units || []).forEach(function (u, ui) {
      var b = el('button', 'week-btn' + (ui === 0 ? ' active' : ''));
      b.type = 'button'; b.dataset.week = String(ui);
      b.textContent = u.title || (unitLabel + ' ' + (ui + 1));
      nav.appendChild(b);
    });
  }
  function wireUnitNav() {
    var nav = document.getElementById('unit-nav'); if (!nav) return;
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.week-btn'); if (!btn) return;
      var w = btn.dataset.week;
      nav.querySelectorAll('.week-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.querySelector(".week-panel[data-week-panel='" + w + "']");
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      sound.play('click');
    });
    var cards = document.getElementById('learnkit-cards');
    if (cards && 'IntersectionObserver' in window) {
      var panels = cards.querySelectorAll('.week-panel');
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { var w = en.target.dataset.weekPanel; nav.querySelectorAll('.week-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.week === w); }); } });
      }, { threshold: 0.5, root: cards });
      panels.forEach(function (p) { pio.observe(p); });
    }
  }

  /* ---------- reset ---------- */
  function wireReset() {
    var btn = document.getElementById('reset-progress'); if (!btn) return;
    attachRipple(btn);
    btn.addEventListener('click', function () {
      if (!confirm('Reset all progress for this course?')) return;
      completed = {}; done = {}; streak = {}; saveObj(STORAGE_KEY, completed); saveObj(DONE_KEY, done); saveObj(STREAK_KEY, streak);
      updateProgress(); renderLessons(); sound.play('click'); SG.mascot.setMood('neutral');
    });
  }

  /* ---------- build overlay elements (praise, confetti) ---------- */
  function buildOverlays() {
    var root = document.getElementById('learnkit-root'); if (!root) return;
    if (!document.getElementById('sg-praise')) {
      praiseEl = el('div'); praiseEl.id = 'sg-praise';
      praiseEl.innerHTML = '<div class="p-emoji">🎉</div><div class="p-text">Awesome!</div>';
      root.appendChild(praiseEl);
    } else praiseEl = document.getElementById('sg-praise');
    ensureConfetti();
  }

  /* ---------- ripple for all sg-btn ---------- */
  function wireRipples() {
    document.querySelectorAll('.sg-btn').forEach(attachRipple);
  }

  function applyTheme() {
    var t = CFG.theme;
    if (!t || t === "neutral") return;
    var r = document.documentElement;
    if (typeof t === 'object') { Object.keys(t).forEach(function (k) { r.style.setProperty(k, t[k]); }); }
  }

  /* ---------- INIT ---------- */
  SG.init = function () {
    if (!document.getElementById('learnkit-cards')) return;
    applyTheme();
    var ttl = document.getElementById("lk-title"), sub = document.getElementById("lk-subtitle");
    if (ttl && CFG.title) ttl.textContent = CFG.title;
    if (sub && CFG.subtitle) sub.textContent = CFG.subtitle;
    if (CFG.title) document.title = CFG.title;
    buildOverlays();
    buildUnitNav();
    renderLessons();
    wireUnitNav();
    wireReset();
    updateProgress();
    wireRipples();
    var obs = new MutationObserver(function () { document.querySelectorAll(".sg-btn:not([data-rip])").forEach(function (b) { b.dataset.rip = "1"; attachRipple(b); }); });
    var cards = document.getElementById('learnkit-cards'); if (cards) obs.observe(cards, { childList: true, subtree: true });
  };

  window.LearnKit = SG;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', SG.init);
  else SG.init();
})();
