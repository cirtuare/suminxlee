/* 관악캠퍼스 에이전트 둘러보기 — plain canvas, no dependencies.
   Data: data/map.json (network, buildings, places + the registration matrix `iso.H` metres -> illustration pixels),
         data/agents.json (per-agent day timelines), assets/ (isometric map image, jacket sprites).
   Everything is drawn in illustration-pixel space; the camera is (x, y, zoom) in that space. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const cv = $('map'), ctx = cv.getContext('2d');
const FF = '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';   // canvas text: same family as the page (self-hosted in assets/fonts)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hhmm = t => { const m = Math.floor(t); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const hash = n => { let h = (n + 1) * 2654435761 >>> 0; h ^= h >>> 15; return (h * 2246822519) >>> 0; };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, debug = /[?&]debug/.test(location.search);
const LIFT = 42;       // px: a building's label sits this far above its ground point (on the roof)
const SPREAD = 1.8;    // resting agents are spread on a spiral around the bench; metres -> a bit wider for the big sprites

let M, D, MAN, W = 0, H = 0, dpr = 1, fitZ = 1, HM, bgImg, haloImg, study = null;
const SP = {}, bld = {}, plc = {}; let agents = [];
const F = { years: new Set(), min: [] };  // left-panel filter: years shown, lowest preference score shown per item
const pass = a => F.years.has(a.y) && (D.prefs || []).every((_, k) => !(F.min[k] > 0) || (a.p && a.p[k] >= F.min[k]));
let placeHits = [], EX = {};  // EX: optional data/place_extras.json { "R001": { photo: "assets/places/R001.jpg" } }
const S = { hp: null, pp: null, t: 0, playing: !reduced, speed: 3, sel: null, follow: false, hover: null, n: null };
const cam = { x: 1000, y: 560, z: .7 }, tgt = { x: 1000, y: 560, z: .7 };
let cur = [], hits = [], lastPos = null, ins = { t: 0, b: 0, l: 0, r: 0 }, last = performance.now(), lastUi = 0;

const J = u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
const IMG = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error(src)); i.src = src; });
Promise.all([J('data/map.json'), J('data/agents.json'), J('assets/sprites/manifest.json'), J('data/place_extras.json').catch(() => ({}))]).then(async ([m, d, man, ex]) => {
  EX = ex || {};
  const jobs = [IMG(m.iso.src).then(i => bgImg = i), IMG('assets/sprites/halo.png').then(i => haloImg = i)];
  for (const pose of Object.keys(man.poses)) for (let v = 0; v < man.variants.length; v++) jobs.push(IMG(`assets/sprites/${pose}_${v}.png`).then(i => { (SP[pose] = SP[pose] || [])[v] = i; }));
  const glyphs = '0123456789동명z' + m.buildings.map(b => b.label || b.id + '동').join('') + d.agents.map(a => a.n).join('');
  jobs.push(Promise.race([document.fonts.load('800 16px "Pretendard Variable"', glyphs), new Promise(r => setTimeout(r, 1500))]).catch(() => {}));   // canvas does not wait for webfont chunks
  await Promise.all(jobs); init(m, d, man);
}).catch(() => { $('hint').textContent = '데이터를 불러오지 못했어요. web 폴더에서 python3 -m http.server 로 열어 주세요.'; });

/* projection: metres (x east, y north) -> illustration pixels */
const proj = (x, y) => { const w = HM[6] * x + HM[7] * y + HM[8]; return [(HM[0] * x + HM[1] * y + HM[2]) / w, (HM[3] * x + HM[4] * y + HM[5]) / w]; };

function init(m, d, man) {
  M = m; D = d; MAN = man; HM = M.iso.H;
  for (const b of M.buildings) { const [u, v] = proj(b.x, b.y); bld[b.id] = Object.assign(b, { u, v }); }
  for (const p of M.places) { const [u, v] = proj(p.x, p.y); plc[p.id] = Object.assign(p, { u, v }); }
  M.ip = M.nodes.map(n => proj(n[0], n[1]));
  agents = D.agents.map((a, i) => {
    a.i = i; const h = hash(i); a.h = h; a.vi = h % man.variants.length;  // jacket tone is cosmetic only
    const ox = ((h % 7) - 3) * .9, oy = (((h >> 3) % 7) - 3) * .9; a.iox = HM[0] * ox + HM[1] * oy; a.ioy = HM[3] * ox + HM[4] * oy;  // lane offset in pixels
    for (const s of a.g) {
      if (s.k === 'w') {
        s.ip = s.p.map(n => M.ip[n]); s.cum = [0]; const pts = s.p.map(n => M.nodes[n]);
        for (let j = 1; j < pts.length; j++) s.cum.push(s.cum[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
        s.len = s.cum[s.cum.length - 1];
      } else if (s.k === 's') { const p = plc[s.pl]; [s.iu, s.iv] = proj(p.x + s.dx * SPREAD, p.y + s.dy * SPREAD); }
    }
    a.g.sort((x, y) => x.a - y.a); return a;
  });
  // default view: the study area (places + class buildings) inside the picture
  const pts = M.places.map(p => [p.u, p.v]).concat(M.buildings.filter(b => b.cls).map(b => [b.u, b.v - LIFT])).filter(([u, v]) => u > 0 && u < M.iso.w && v > 0 && v < M.iso.h);
  study = { x0: Math.min(...pts.map(p => p[0])) - 110, x1: Math.max(...pts.map(p => p[0])) + 110, y0: Math.min(...pts.map(p => p[1])) - 150, y1: Math.max(...pts.map(p => p[1])) + 110 };
  const sl = $('slider'); sl.min = D.t0; sl.max = D.t1;
  let best = D.t0, bn = -1;  // start just before the busiest moment so the first screen is lively
  for (let t = D.t0; t < D.t1; t += 5) { let n = 0; for (const a of agents) { const w = where(a, t); if (w && w.mode !== 'c') n++; } if (n > bn) { bn = n; best = t; } }
  S.t = clamp(best - 4, D.t0, D.t1);
  buildSide(); $('hint').textContent = '에이전트를 눌러 보세요 👆';
  if (innerWidth < 760) syncSide(false);
  resize(); cam.x = tgt.x; cam.y = tgt.y; cam.z = tgt.z; setPlaying(S.playing); bind(); requestAnimationFrame(frame);
}

/* ---------- left drawer: conditions (read-only) + student filter ---------- */
const syncSide = open => { $('side').classList.toggle('closed', !open); const t = $('sideTab'); t.setAttribute('aria-expanded', open); t.setAttribute('aria-label', open ? '패널 접기' : '패널 열기'); };
const fill = e => e.style.setProperty('--p', (e.value - e.min) / (e.max - e.min) * 100 + '%');
const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
function buildSide() {
  const dt = new Date(D.date + 'T00:00:00');
  $('kvDate').textContent = `${D.date.replace(/-/g, '.')} (${'일월화수목금토'[dt.getDay()]})`;
  $('kvPop').textContent = `합성 학생 ${agents.length}명`;
  $('kvPlace').textContent = `야외 휴게공간 ${M.places.filter(p => p.kind === 'outdoor_rest').length}곳`;
  for (const y of [...new Set(agents.map(a => a.y))].sort((a, b) => a - b)) {
    F.years.add(y); const b = mk('button', 'btn sm', y + '학년'); b.type = 'button'; b.setAttribute('aria-pressed', true);
    b.onclick = () => { F.years.has(y) ? F.years.delete(y) : F.years.add(y); b.setAttribute('aria-pressed', F.years.has(y)); applyFilter(); }; $('years').append(b);
  }
  (D.prefs || []).forEach((pf, k) => {
    if (!['shade', 'table'].includes(pf.k)) return;  // the two items the v3 candidate rule and the place data actually use
    const v = agents.map(a => a.p && a.p[k]).filter(x => x != null), lo = Math.min(...v), hi = Math.max(...v); F.min[k] = lo;
    const row = mk('div', 'prow'), lab = mk('span', 'flab', `${pf.name} 성향 (${lo}–${hi}점)  `), val = mk('b', null, '전체'), inp = mk('input'), id = 'pf' + k;
    inp.type = 'range'; inp.id = id; inp.min = lo; inp.max = hi; inp.step = 1; inp.value = lo; inp.setAttribute('aria-label', `${pf.name} 성향 점수 최소값`); lab.append(val);
    fill(inp); inp.oninput = () => { fill(inp); F.min[k] = +inp.value; val.textContent = F.min[k] <= lo ? '전체' : `${F.min[k]}점 이상`; applyFilter(); };
    row.append(lab, inp); $('prefs').append(row);
  });
  $('btnReset').onclick = () => { $('years').querySelectorAll('button').forEach(b => b.getAttribute('aria-pressed') !== 'true' && b.click()); $('prefs').querySelectorAll('input').forEach(i => { i.value = i.min; i.dispatchEvent(new Event('input')); }); };
  applyFilter();
}
function applyFilter() { $('shown').textContent = `· ${agents.filter(pass).length}명 표시 중`; if (S.sel != null && !pass(agents[S.sel])) deselect(); }

/* ---------- agent state at time t ---------- */
function segAt(a, t) { for (let i = a.g.length - 1; i >= 0; i--) { const s = a.g[i]; if (t >= s.a && t < s.b) return s; } return null; }
function where(a, t) {
  const s = segAt(a, t); if (!s) return null;
  if (s.k === 'w') {
    const f = s.b > s.a ? (t - s.a) / (s.b - s.a) : 1, d = f * s.len, ip = s.ip; let j = 1;
    if (ip.length < 2) return { s, mode: 'w', u: ip[0][0] + a.iox, v: ip[0][1] + a.ioy, du: 1 };
    while (j < s.cum.length - 1 && s.cum[j] < d) j++;
    const c0 = s.cum[j - 1], c1 = s.cum[j], k = c1 > c0 ? (d - c0) / (c1 - c0) : 0, p0 = ip[j - 1], p1 = ip[j];
    return { s, mode: 'w', u: p0[0] + (p1[0] - p0[0]) * k + a.iox, v: p0[1] + (p1[1] - p0[1]) * k + a.ioy, du: p1[0] - p0[0] };
  }
  if (s.k === 's') return { s, mode: 's', u: s.iu, v: s.iv, du: 1 };
  const b = bld[s.bd] || { u: 0, v: 0 }; return { s, mode: 'c', u: b.u, v: b.v, bd: s.bd, du: 1 };
}

/* ---------- view ---------- */
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const mob = W < 760, side = !mob && !$('side').classList.contains('closed') ? 372 : 0, ov = mob ? { t: 96, b: 160 } : { t: 78, b: 108 };
  fitZ = Math.min((W - side - 16) / (study.x1 - study.x0), (H - ov.t - ov.b) / (study.y1 - study.y0));  // fit uses the overview insets only, so zoom levels stay stable
  ins = { t: ov.t, b: ov.b, l: side, r: 0 };
  if (S.sel != null && mob) { ins.t = 100; ins.b = Math.max(160, H - $('card').getBoundingClientRect().top + 12); } // keep the agent between the status pill and the card
  if (S.sel == null) { tgt.x = (study.x0 + study.x1) / 2; tgt.y = (study.y0 + study.y1) / 2; tgt.z = fitZ; if (cam.z === .7) { cam.x = tgt.x; cam.y = tgt.y; cam.z = tgt.z; } }
}
const maxZ = () => Math.max(1, fitZ * 1.25);   // max zoom = the 2000 px picture at its own size; deeper only gets soft
const cx = () => ins.l + (W - ins.l - ins.r) / 2, cy = () => ins.t + (H - ins.t - ins.b) / 2;
const w2s = (u, v) => [(u - cam.x) * cam.z + cx(), (v - cam.y) * cam.z + cy()];
const s2w = (px, py) => [(px - cx()) / cam.z + cam.x, (py - cy()) / cam.z + cam.y];

/* ---------- drawing ---------- */
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
/* white pictograms on the amenity markers (24x24 grid): rice bowl with chopsticks, coffee cup, shopping bag */
const ICON = {
  restaurants: { f: ['M3.5 12H20.5C20.5 16.8 17 20 12 20S3.5 16.8 3.5 12Z'], s: ['M8.5 9.2L17.5 3.2', 'M11.8 9.6L19.5 5.2', 'M9 22H15'] },
  cafes: { f: ['M5 9.5H17V15C17 17.5 15 19.5 12.5 19.5H9.5C7 19.5 5 17.5 5 15Z'], s: ['M17 10.8H18.2A2.3 2.3 0 0 1 18.2 15.4H17', 'M9 3.2C8 4.6 10 5.6 9 7.2', 'M13 3.2C12 4.6 14 5.6 13 7.2'] },
  convenience: { f: ['M5.5 9.5H18.5L17.4 19.5H6.6Z'], s: ['M9 9.5V8A3 3 0 0 1 15 8V9.5'] },
};
for (const k in ICON) ICON[k] = { f: ICON[k].f.map(d => new Path2D(d)), s: ICON[k].s.map(d => new Path2D(d)) };
function icon(g, kind, x, y, s) {
  const ic = ICON[kind]; if (!ic) return;
  g.save(); g.translate(x - s / 2, y - s / 2); g.scale(s / 24, s / 24); g.fillStyle = g.strokeStyle = '#fff'; g.lineWidth = 1.9; g.lineCap = g.lineJoin = 'round';
  for (const p of ic.f) g.fill(p); for (const p of ic.s) g.stroke(p); g.restore();
}
const agentSize = () => clamp((W < 760 ? 30 : 42) * Math.pow(cam.z / fitZ, .55), 28, 150);

function poseOf(c, tReal) {
  const a = c.a, s = c.s;
  if (c.mode === 'w') return ['walk' + (1 + (Math.floor(tReal * 5 + a.h % 7) % 2)), Math.abs(Math.sin(tReal * 10 + a.h % 7)) * .03];
  if (c.mode === 's') { const dur = s.b - s.a, age = S.t - s.a; if (dur < 2) return ['stand', 0]; return [age < Math.min(S.speed * 1.6, dur * .5) ? 'cheer' : 'sit', 0]; }
  return ['stand', 0];
}
function drawAgent(g, x, y, size, a, pose, bob, dir, sel, alpha) {
  const k = size / MAN.height, pm = MAN.poses[pose], img = SP[pose][a.vi];
  g.save(); g.globalAlpha = alpha; g.translate(x, y - bob * size);
  if (sel && haloImg) { const hk = k * (1 + Math.sin(performance.now() / 300) * .04), hm = MAN.halo; g.globalAlpha = alpha * .95; g.drawImage(haloImg, -hm.ax * hk, -hm.ay * hk, hm.w * hk, hm.h * hk); g.globalAlpha = alpha; }
  const sh = g.createRadialGradient(0, 0, 0, 0, 0, size * .34); sh.addColorStop(0, 'rgba(50,35,25,.34)'); sh.addColorStop(1, 'rgba(50,35,25,0)');
  g.save(); g.scale(1, .26); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, size * .34, 0, 7); g.fill(); g.restore();
  g.scale(dir * k, k); g.drawImage(img, -pm.ax, -pm.ay, pm.w, pm.h); g.restore();
}

function draw() {
  const g = ctx, z = cam.z; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.fillStyle = '#eee5d2'; g.fillRect(0, 0, W, H);
  const o = w2s(0, 0); g.drawImage(bgImg, o[0], o[1], M.iso.w * z, M.iso.h * z);
  if (debug) { g.strokeStyle = 'rgba(255,0,0,.55)'; g.lineWidth = 1.5; g.beginPath(); for (const [i, j] of M.edges) { const p = w2s(...M.ip[i]), q = w2s(...M.ip[j]); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); } g.stroke(); }
  // counts
  const inCls = {}, atPlace = {}; let nR = 0, nW = 0, nC = 0;
  for (const c of cur) { if (!c) continue; if (c.mode === 'c') { nC++; inCls[c.bd] = (inCls[c.bd] || 0) + 1; } else if (c.mode === 's') { nR++; atPlace[c.s.pl] = (atPlace[c.s.pl] || 0) + 1; } else nW++; }
  S.n = { rest: nR, walk: nW, cls: nC }; S.at = atPlace; placeHits = [];
  const rel = Math.pow(z / fitZ, .5);
  // building labels (class buildings; all of them when zoomed in)
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const bd of M.buildings) {
    if (!bd.cls && z < fitZ * 2.2) continue;
    const q = w2s(bd.u, bd.v - LIFT); if (q[0] < -60 || q[0] > W + 60 || q[1] < -40 || q[1] > H + 40) continue;
    if (!bd.cls && Math.hypot(q[0] - cx(), q[1] - cy()) > Math.min(W, H) * .42) continue;
    const fs = clamp(10.5 * rel, 10, 16), n = inCls[bd.id], label = bd.label || bd.id + '동';
    g.font = `800 ${fs}px ${FF}`; const tw = g.measureText(label).width + fs * .9;
    g.fillStyle = 'rgba(255,255,255,.7)'; rr(g, q[0] - tw / 2, q[1] - fs * .75, tw, fs * 1.5, fs * .75); g.fill();
    g.fillStyle = bd.cls ? '#34507f' : '#7d705d'; g.fillText(label, q[0], q[1] + 1);
    if (n) { const r = clamp(fs * .62, 8, 13); g.fillStyle = '#5f86bb'; g.beginPath(); g.arc(q[0] + tw / 2, q[1] - fs * .75, r, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `800 ${r * 1.05}px ${FF}`; g.fillText(n, q[0] + tw / 2, q[1] - fs * .75 + 1); }
  }
  // places: crowd glow + marker
  for (const p of M.places) {
    const q = w2s(p.u, p.v), n = atPlace[p.id] || 0; if (q[0] < -90 || q[0] > W + 90 || q[1] < -90 || q[1] > H + 90) continue;
    if (n) { const r = clamp((18 + 6 * n) * z, 22, 150), gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], r); gr.addColorStop(0, `rgba(224,120,100,${clamp(.22 + n * .04, .24, .55)})`); gr.addColorStop(1, 'rgba(224,120,100,0)'); g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], r, 0, 7); g.fill(); }
    const m = clamp(z * 1.3, 1, 3.4);
    if (p.kind === 'outdoor_rest') {
      g.fillStyle = 'rgba(0,0,0,.18)'; rr(g, q[0] - 6 * m, q[1] - 1.8 * m + 1.6 * m, 12 * m, 5 * m, 2 * m); g.fill();
      g.fillStyle = p.shade ? '#6aab82' : '#dcaa74'; g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1; rr(g, q[0] - 6 * m, q[1] - 2.6 * m, 12 * m, 5 * m, 2 * m); g.fill(); g.stroke();
      if (p.table) { g.fillStyle = '#f5d48e'; rr(g, q[0] - 2.4 * m, q[1] - 6 * m, 4.8 * m, 3 * m, m); g.fill(); g.stroke(); }
    } else { const R = clamp(7.5 * m, 10, 22); g.fillStyle = 'rgba(60,40,30,.16)'; g.beginPath(); g.arc(q[0], q[1] + R * .16, R, 0, 7); g.fill(); g.fillStyle = '#8c7fb8'; g.beginPath(); g.arc(q[0], q[1], R, 0, 7); g.fill(); g.lineWidth = 1.5; g.strokeStyle = 'rgba(255,255,255,.85)'; g.stroke(); icon(g, p.kind, q[0], q[1], R * 1.35); }
    placeHits.push({ id: p.id, x: q[0], y: q[1], r: Math.max(14, 7.5 * m) });
    if (p.id === (S.hp || S.pp)) { g.strokeStyle = 'rgba(217,120,106,.95)'; g.lineWidth = 2.5; g.beginPath(); g.arc(q[0], q[1], p.kind === 'outdoor_rest' ? 9 * m + 4 : clamp(7.5 * m, 10, 22) + 4, 0, 7); g.stroke(); }
    if (n >= 2 || (n && z > fitZ * 1.6)) {  // names live in the hover popup; the map only shows how many are resting here
      const fs = clamp(10 * rel, 10, 14), ly = q[1] + (p.kind === 'outdoor_rest' ? 12 + 5 * m : clamp(7.5 * m, 10, 22) + 11);
      g.font = `800 ${fs}px ${FF}`; g.lineWidth = 4; g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,253,246,.94)'; g.fillStyle = '#c4503f'; g.strokeText(n + '명', q[0], ly); g.fillText(n + '명', q[0], ly);
    }
  }
  // agents (far to near by image y; the selected one on top)
  const size = agentSize(), tReal = performance.now() / 1000; hits = []; const vis = [];
  for (const c of cur) { if (!c) continue; if (c.mode === 'c' && c.a.i !== S.sel) continue; vis.push(c); }
  vis.sort((p, q) => (p.a.i === S.sel) - (q.a.i === S.sel) || p.v - q.v);
  for (const c of vis) {
    const q = w2s(c.u, c.v), sel = c.a.i === S.sel, sz = sel ? size * 1.3 : size; if (q[0] < -80 || q[0] > W + 80 || q[1] < -40 || q[1] > H + 160) continue;
    const [pose, bob] = poseOf(c, tReal); drawAgent(g, q[0], q[1], sz, c.a, pose, bob, c.du < 0 ? -1 : 1, sel, c.mode === 'c' ? .8 : 1);
    if (c.mode === 's' && pose === 'sit') { const kk = ((tReal / .7 + c.a.h % 5) % 2) / 2; g.globalAlpha = 1 - kk; g.fillStyle = 'rgba(217,120,106,.95)'; g.font = `800 ${sz * .3}px ${FF}`; g.fillText('z', q[0] + sz * .34 + kk * 4, q[1] - sz * .8 - kk * sz * .4); g.globalAlpha = 1; }
    if (c.mode !== 'c') hits.push({ i: c.a.i, x: q[0], y: q[1] - sz * .5, r: Math.max(15, sz * .42), top: q[1] - sz * 1.05 });
    if (S.hover === c.a.i && !sel) { g.font = '700 13px ' + FF; const tw = g.measureText(c.a.n).width + 16; g.fillStyle = 'rgba(255,255,255,.82)'; rr(g, q[0] - tw / 2, q[1] - sz * 1.2 - 22, tw, 24, 12); g.fill(); g.fillStyle = '#3d322e'; g.fillText(c.a.n, q[0], q[1] - sz * 1.2 - 9); }
  }
  const tint = clamp((S.t - 1020) / 150, 0, 1) * .14; if (tint) { g.fillStyle = `rgba(255,150,90,${tint})`; g.fillRect(0, 0, W, H); }
}

/* ---------- frame loop ---------- */
function frame(ts) {
  const dt = Math.min(.1, (ts - last) / 1000); last = ts;
  if (S.playing) { S.t += dt * S.speed; if (S.t >= D.t1) { S.t = D.t1; setPlaying(false); } }
  cur = agents.map(a => { if (!pass(a)) return null; const w = where(a, S.t); if (w) w.a = a; return w; });
  if (S.sel != null) { const c = cur[S.sel]; if (c) lastPos = c; if (S.follow && lastPos) { tgt.x = lastPos.u; tgt.y = lastPos.v; } }
  const k = 1 - Math.exp(-dt * 5.5);
  cam.x += (tgt.x - cam.x) * k; cam.y += (tgt.y - cam.y) * k; cam.z *= Math.pow(tgt.z / cam.z, k);
  draw(); updateBubble(); updatePop();
  if (ts - lastUi > 120 || S.sel != null) { lastUi = ts; ui(); }
  requestAnimationFrame(frame);
}

/* ---------- UI ---------- */
function ui() {
  $('clock').textContent = hhmm(S.t);
  $('temp').textContent = `${D.temps[clamp(Math.floor(S.t / 60), 0, 23)]}°C`;
  if (S.n) { $('nRest').textContent = S.n.rest; $('nWalk').textContent = S.n.walk; $('nCls').textContent = S.n.cls; }
  const sl = $('slider'); if (document.activeElement !== sl || !sl.matches(':active')) sl.value = S.t; fill(sl);
  if (S.sel != null) cardState();
}
function setPlaying(p) { S.playing = p; const b = $('btnPlay'); b.innerHTML = `<svg class="ic"><use href="#i-${p ? 'pause' : 'play'}"/></svg>`; b.setAttribute('aria-label', p ? '일시정지' : '재생'); }
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2200); }

function select(i) {
  S.sel = i; document.body.classList.add('sel'); S.follow = true; lastPos = cur[i] || null; tgt.z = Math.min(fitZ * 2.7, maxZ());
  $('hint').hidden = true;
  const a = agents[i]; $('card').hidden = false; $('cName').textContent = a.n;
  $('cInfo').textContent = `${D.depts[a.d].name} · ${a.y}학년`;
  drawAvatar(a); cardState(); relayout();
}
function deselect() { S.sel = null; document.body.classList.remove('sel'); S.follow = false; $('card').hidden = true; $('bubble').hidden = true; tgt.x = (study.x0 + study.x1) / 2; tgt.y = (study.y0 + study.y1) / 2; tgt.z = fitZ; relayout(); }
function relayout() { const keep = [tgt.x, tgt.y, tgt.z]; resize(); if (S.sel != null) [tgt.x, tgt.y, tgt.z] = keep; }
function drawAvatar(a) {
  const c = $('avatar'), g = c.getContext('2d'), pm = MAN.poses.hero_halo, k = 150 / pm.h; g.clearRect(0, 0, c.width, c.height);
  g.drawImage(SP.hero_halo[a.vi], c.width / 2 - pm.ax * k, 160 - pm.ay * k, pm.w * k, pm.h * k);
}
function cardState() {
  const a = agents[S.sel], c = cur[S.sel], s = c ? c.s : null; let st = '오늘 일정을 마쳤어요', why = '';
  if (s) { if (s.k === 'w') st = `이동 중 → ${s.to}`; else if (s.k === 's') st = `휴식 중 · ${s.at}`; else st = s.s.includes('기다리') ? '수업 기다리는 중' : '수업 중'; why = s.why || ''; }
  else if (S.t < a.g[0].a) st = '아직 학교에 오기 전이에요';
  $('cState').textContent = st; $('cWhy').textContent = why ? `기록된 이유: ${why}` : '';
}
function updateBubble() {
  const b = $('bubble'); if (S.sel == null) { b.hidden = true; return; }
  const c = cur[S.sel] || lastPos; if (!c) { b.hidden = true; return; }
  const text = cur[S.sel] ? cur[S.sel].s.s : '오늘은 여기까지! 내일 또 만나요 👋';
  const q = w2s(c.u, c.v), size = agentSize() * 1.3;
  if (b.textContent !== text) b.textContent = text; b.hidden = false;
  const bw = b.offsetWidth, L = clamp(q[0], bw / 2 + 10, W - bw / 2 - 10), hb = $('pill').getBoundingClientRect().bottom + 8;
  b.style.left = L + 'px'; b.style.top = Math.max(b.offsetHeight + 12 + hb, q[1] - size * 1.2 - 12) + 'px'; b.style.setProperty('--tx', (q[0] - L) + 'px');
}
const KIND = { restaurants: '식당', cafes: '카페', convenience: '편의점', outdoor_rest: '야외 휴게공간' };
function updatePop() {
  const id = S.hp || S.pp, p = id && plc[id], el = $('pop');
  if (!p) { el.hidden = true; el.dataset.id = ''; return; }
  const out = p.kind === 'outdoor_rest', ex = EX[p.id] || {};
  if (el.dataset.id !== p.id) {  // static parts, rebuilt when the place changes
    el.dataset.id = p.id; el.classList.toggle('nophoto', !out); $('popName').textContent = p.name;
    const img = $('popImg'); img.hidden = !ex.photo; if (ex.photo) img.src = ex.photo; img.alt = p.name; $('popPhoto').querySelector('.ph').hidden = !!ex.photo;
    const kv = $('popKV'); kv.textContent = ''; const yn = v => v ? '있음' : '없음';
    (out ? [['그늘', `인공 그늘 ${yn(p.art)} · 자연 그늘 ${yn(p.nat)}`], ['좌석', p.seat || '정보 없음'], ['테이블', yn(p.table)], ['수용 인원', p.cap ? `${p.cap}명` : '정보 없음']] : [['종류', KIND[p.kind]]])
      .forEach(([k, v]) => kv.append(mk('dt', null, k), mk('dd', null, v)));
  }
  const n = (S.at && S.at[p.id]) || 0, now = $('popNow'); now.textContent = out || n ? (n ? `지금 ${n}명이 쉬는 중` : '지금은 비어 있어요') : ''; now.className = 'now' + (n ? ' has' : '');
  el.hidden = false;
  const q = w2s(p.u, p.v), w = el.offsetWidth, h = el.offsetHeight, top = q[1] - h - 20, minTop = $('pill').getBoundingClientRect().bottom + 8;
  el.style.left = clamp(q[0], w / 2 + 8, W - w / 2 - 8) + 'px'; el.style.top = (top < minTop ? q[1] + 22 : top) + 'px';
}
function pickPlace(px, py) { let best = null, bd = 1e9; for (const h of placeHits) { const d = Math.hypot(px - h.x, py - h.y); if (d < h.r && d < bd) { bd = d; best = h.id; } } return best; }
function pick(px, py) { let best = null, bd = 1e9; for (const h of hits) { const d = Math.hypot(px - h.x, py - h.y); if (d < h.r && d < bd) { bd = d; best = h.i; } } return best; }
const clampTarget = () => { tgt.x = clamp(tgt.x, 0, M.iso.w); tgt.y = clamp(tgt.y, 0, M.iso.h); };

function bind() {
  window.addEventListener('resize', resize);
  $('btnPlay').onclick = () => { if (!S.playing && S.t >= D.t1) S.t = D.t0; setPlaying(!S.playing); };
  $('btnRestart').onclick = () => { S.t = D.t0; };
  $('slider').oninput = e => { S.t = +e.target.value; };
  document.querySelectorAll('#speeds button').forEach(b => b.onclick = () => { S.speed = +b.dataset.speed; document.querySelectorAll('#speeds button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('btnClose').onclick = deselect;
  $('sideTab').onclick = () => { syncSide($('side').classList.contains('closed')); relayout(); };
  $('btnNext').onclick = () => { const a = agents[S.sel], n = a.g.find(s => (s.k === 'w' || s.k === 's') && s.a > S.t + .02); if (!n) { toast('오늘 이 학생의 이동은 여기까지예요'); return; } S.t = n.a + (n.k === 'w' ? .05 : 0); S.follow = true; };
  $('btnRandom').onclick = () => { const v = cur.filter(c => c && c.mode !== 'c'); if (!v.length) { S.t = 12 * 60 + 5; toast('북적이는 점심 시간으로 이동했어요'); return; } select(v[Math.floor(Math.random() * v.length)].a.i); };
  addEventListener('keydown', e => { if (e.key === 'Escape') { S.pp = null; deselect(); } if (e.key === ' ' && !/BUTTON|INPUT|SUMMARY/.test(document.activeElement.tagName)) { e.preventDefault(); $('btnPlay').click(); } });
  // pointer: drag to pan, wheel / pinch to zoom, tap to pick
  const ptr = new Map(); let moved = 0;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; });
  cv.addEventListener('pointermove', e => {
    const p = ptr.get(e.pointerId);
    if (!p) { const i = pick(e.clientX, e.clientY), pl = i == null ? pickPlace(e.clientX, e.clientY) : null; S.hover = i; S.hp = pl; cv.classList.toggle('hover', i != null || pl != null); return; }
    
    if (ptr.size === 2) {
      const [a, b] = [...ptr.values()]; ptr.set(e.pointerId, [e.clientX, e.clientY]); const [a2, b2] = [...ptr.values()], d = Math.hypot(a2[0] - b2[0], a2[1] - b2[1]), d0 = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d0 > 0) { tgt.z = clamp(tgt.z * d / d0, fitZ * .6, maxZ()); cam.z = tgt.z; } moved = 99; return;
    }
    const dx = e.clientX - p[0], dy = e.clientY - p[1]; ptr.set(e.pointerId, [e.clientX, e.clientY]); moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6) { S.follow = false; tgt.x -= dx / cam.z; tgt.y -= dy / cam.z; clampTarget(); cam.x = tgt.x; cam.y = tgt.y; }
  });
  cv.addEventListener('pointerup', e => { const had = ptr.has(e.pointerId); ptr.delete(e.pointerId); if (had && moved <= 6 && ptr.size === 0) { const i = pick(e.clientX, e.clientY); if (i != null) select(i); else { const pl = pickPlace(e.clientX, e.clientY); if (pl) S.pp = S.pp === pl ? null : pl; else { S.pp = null; if (S.sel != null) deselect(); } } } });
  cv.addEventListener('pointerleave', () => { S.hover = S.hp = null; cv.classList.remove('hover'); });
  cv.addEventListener('pointercancel', e => ptr.delete(e.pointerId));
  cv.addEventListener('wheel', e => {
    e.preventDefault(); const z = clamp(tgt.z * Math.exp(-e.deltaY * .0015), fitZ * .6, maxZ());
    if (S.follow) { tgt.z = z; return; }
    const [wx, wy] = s2w(e.clientX, e.clientY); tgt.z = z; cam.z = z; const [sx, sy] = w2s(wx, wy); tgt.x = cam.x += (sx - e.clientX) / cam.z; tgt.y = cam.y += (sy - e.clientY) / cam.z; clampTarget();
  }, { passive: false });
}

window.__campus = { S, cam, tgt, get agents() { return agents; }, select, deselect, setTime: t => { S.t = t; }, get cur() { return cur; }, get hits() { return hits; }, get placeHits() { return placeHits; }, get D() { return D; }, get M() { return M; } };
})();
