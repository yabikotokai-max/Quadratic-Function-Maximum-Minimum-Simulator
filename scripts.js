(() => {
'use strict';
const A = 3, C = 2, EPS = 1e-6;           // y = (x-A)^2 + C
const f = x => (x - A) ** 2 + C;
const $ = s => document.querySelector(s);
const fmt = n => String(+n.toFixed(2));
const COL = {pink:'#ff2d95', cyan:'#22e4ff', green:'#39ff88', gold:'#ffd23f'};

/* ---------- 解析 ---------- */
function analyze(k, w) {
  const r = k + w, mid = k + w / 2;
  let minC, minX, maxC, maxX;
  if (k > A) { minC = 0; minX = k; }
  else if (r < A) { minC = 2; minX = r; }
  else { minC = 1; minX = A; }
  if (Math.abs(mid - A) < EPS) { maxC = 1; maxX = k; }
  else if (mid < A) { maxC = 0; maxX = k; }
  else { maxC = 2; maxX = r; }
  let boundary = null;
  if (Math.abs(k - A) < EPS) boundary = 'ここで最小値の場合分けが切り替わります（軸が左端に重なる）';
  else if (Math.abs(r - A) < EPS) boundary = 'ここで最小値の場合分けが切り替わります（軸が右端に重なる）';
  else if (Math.abs(mid - A) < EPS) boundary = 'ここで最大値の場合分けが切り替わります（軸が定義域の中央）';
  return {k, w, r, mid, minC, minX, maxC, maxX, boundary};
}

/* ---------- 描画 ---------- */
function draw(cv, k, w, o) {
  const dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return;
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  const P = 34, x0 = -3, x1 = 9, y0 = -2, y1 = 30;
  const X = x => P + (x - x0) / (x1 - x0) * (W - 2 * P);
  const Y = y => H - P - (y - y0) / (y1 - y0) * (H - 2 * P);
  const r = k + w;
  g.font = '10px "SF Mono",Consolas,monospace';

  // grid
  g.lineWidth = 1; g.strokeStyle = 'rgba(148,163,184,.10)'; g.fillStyle = 'rgba(148,163,184,.6)';
  for (let x = -2; x <= 9; x++) { g.beginPath(); g.moveTo(X(x), Y(y0)); g.lineTo(X(x), Y(y1)); g.stroke(); g.fillText(x, X(x) - 3, Y(0) + 13); }
  for (let y = 0; y <= 30; y += 5) { g.beginPath(); g.moveTo(X(x0), Y(y)); g.lineTo(X(x1), Y(y)); g.stroke(); if (y) g.fillText(y, X(0) - 20, Y(y) + 3); }
  g.strokeStyle = 'rgba(226,232,240,.5)';
  g.beginPath(); g.moveTo(X(x0), Y(0)); g.lineTo(X(x1), Y(0)); g.moveTo(X(0), Y(y0)); g.lineTo(X(0), Y(y1)); g.stroke();

  const curve = (a, b) => { g.beginPath(); for (let x = a; x <= b + 1e-9; x += 0.05) { x === a ? g.moveTo(X(x), Y(f(x))) : g.lineTo(X(x), Y(f(x))); } g.stroke(); };
  g.save(); g.beginPath(); g.rect(P, Y(y1), W - 2 * P, Y(y0) - Y(y1)); g.clip();

  // 軸 x=3 (細線) と頂点
  g.setLineDash([2, 5]); g.strokeStyle = 'rgba(148,163,184,.4)';
  g.beginPath(); g.moveTo(X(A), Y(y0)); g.lineTo(X(A), Y(y1)); g.stroke(); g.setLineDash([]);
  // 全体放物線（減光）
  g.lineWidth = 2; g.strokeStyle = 'rgba(148,163,184,.35)'; curve(x0, x1);
  // シャッターマスク
  g.fillStyle = 'rgba(2,6,23,.78)';
  g.fillRect(P, Y(y1), X(k) - P, Y(y0) - Y(y1));
  g.fillRect(X(r), Y(y1), W - P - X(r), Y(y0) - Y(y1));
  // 定義域内スポットライト
  const grad = g.createLinearGradient(0, Y(y1), 0, Y(y0));
  grad.addColorStop(0, 'rgba(34,228,255,.10)'); grad.addColorStop(1, 'rgba(34,228,255,0)');
  g.fillStyle = grad; g.fillRect(X(k), Y(y1), X(r) - X(k), Y(y0) - Y(y1));
  g.shadowColor = COL.cyan; g.shadowBlur = 16; g.lineWidth = 3; g.strokeStyle = '#e8fbff'; curve(k, r);
  g.shadowBlur = 0;
  // 定義域境界 x=k, x=k+w
  g.setLineDash([6, 5]); g.lineWidth = 1.5; g.strokeStyle = COL.gold;
  [k, r].forEach(x => { g.beginPath(); g.moveTo(X(x), Y(y0)); g.lineTo(X(x), Y(y1)); g.stroke(); });
  // 場合分け境界（ネオングリーン破線）
  if (o.boundary) {
    g.shadowColor = COL.green; g.shadowBlur = 18; g.strokeStyle = COL.green; g.lineWidth = 2.5; g.setLineDash([9, 6]);
    g.beginPath(); g.moveTo(X(A), Y(y0)); g.lineTo(X(A), Y(y1)); g.stroke(); g.shadowBlur = 0;
  }
  g.setLineDash([]);
  // 頂点
  g.fillStyle = '#fff'; g.beginPath(); g.arc(X(A), Y(C), 3.5, 0, 7); g.fill();
  g.restore();

  g.fillStyle = COL.gold; g.fillText('x=' + fmt(k), X(k) + 4, Y(y0) - 4); g.fillText('x=' + fmt(r), X(r) + 4, Y(y0) - 16);
  g.fillStyle = 'rgba(226,232,240,.8)'; g.fillText('頂点(3, 2)', X(A) + 8, Y(C) + 14);

  // ピン
  (o.pins || []).forEach(p => {
    const px = X(p.x), py = Y(f(p.x));
    g.save(); g.shadowColor = p.c; g.shadowBlur = 20; g.strokeStyle = p.c; g.lineWidth = 2;
    g.beginPath(); g.arc(px, py, 10, 0, 7); g.stroke();
    g.fillStyle = p.c; g.beginPath(); g.arc(px, py, 4.5, 0, 7); g.fill(); g.restore();
    const t = `${p.tag} (${fmt(p.x)}, ${fmt(f(p.x))})`;
    g.font = '11px "SF Mono",Consolas,monospace';
    const tw = g.measureText(t).width + 16, th = 22;
    let bx = Math.min(Math.max(px - tw / 2, 4), W - tw - 4);
    let by = p.up ? py - 38 : py + 18;
    by = Math.min(Math.max(by, 4), H - th - 4);
    g.fillStyle = 'rgba(15,23,42,.88)'; g.strokeStyle = p.c;
    g.beginPath(); g.roundRect ? g.roundRect(bx, by, tw, th, 8) : g.rect(bx, by, tw, th); g.fill(); g.stroke();
    g.fillStyle = '#fff'; g.fillText(t, bx + 8, by + 15);
  });
}

/* ---------- シミュレーター ---------- */
const sim = {k: 1, w: 3, dMax: null, dMin: null, raf: 0, lastB: null};
const kR = $('#kRange'), wR = $('#wRange'), ind = $('#indicator');
const simCv = $('#simCanvas');

function pinsSim(a) {
  const pins = [{x: sim.dMax, c: COL.pink, tag: 'MAX', up: true}, {x: sim.dMin, c: COL.cyan, tag: 'MIN', up: false}];
  if (a.maxC === 1) pins.push({x: a.r, c: COL.pink, tag: 'MAX', up: true});
  return pins;
}
function frame() {
  const a = analyze(sim.k, sim.w);
  sim.dMax += (a.maxX - sim.dMax) * 0.25; sim.dMin += (a.minX - sim.dMin) * 0.25;
  const done = Math.abs(a.maxX - sim.dMax) < 0.002 && Math.abs(a.minX - sim.dMin) < 0.002;
  if (done) { sim.dMax = a.maxX; sim.dMin = a.minX; }
  draw(simCv, sim.k, sim.w, {pins: pinsSim(a), boundary: a.boundary});
  sim.raf = done ? 0 : requestAnimationFrame(frame);
}
function updateSim() {
  let w = +wR.value, k = +kR.value;
  kR.max = 8 - w; if (k > 8 - w) { k = 8 - w; kR.value = k; }
  sim.k = k; sim.w = w;
  const a = analyze(k, w);
  if (sim.dMax === null) { sim.dMax = a.maxX; sim.dMin = a.minX; }
  $('#kOut').textContent = fmt(k); $('#wOut').textContent = fmt(w);
  $('#domainChip').textContent = `定義域  ${fmt(k)} ≦ x ≦ ${fmt(a.r)}`;
  const minTxt = ['軸が定義域の左外にある場合', '軸が定義域の内部にある場合', '軸が定義域の右外にある場合'][a.minC];
  const maxTxt = a.maxC === 1 ? `最大値は x = ${fmt(k)}, ${fmt(a.r)} の両方のとき` : `最大値は x = ${fmt(a.maxX)} のとき`;
  $('#status').innerHTML = `現在は【<b>${minTxt}</b>】。よって 最小値は x = <b>${fmt(a.minX)}</b> のとき、${maxTxt.replace(/x = ([\d.\-, ]+)/, 'x = <b>$1</b>')}。`;
  document.querySelectorAll('#minCases li').forEach(li => li.classList.toggle('on', +li.dataset.c === a.minC));
  document.querySelectorAll('#maxCases li').forEach(li => li.classList.toggle('on', +li.dataset.c === a.maxC));
  $('#maxVal').textContent = `${fmt(f(a.maxX))}  ( x = ${a.maxC === 1 ? fmt(k) + ', ' + fmt(a.r) : fmt(a.maxX)} )`;
  $('#minVal').textContent = `${fmt(f(a.minX))}  ( x = ${fmt(a.minX)} )`;
  if (a.boundary) {
    if (sim.lastB !== a.boundary) { ind.classList.remove('show'); void ind.offsetWidth; ind.textContent = a.boundary; ind.classList.add('show'); }
  } else ind.classList.remove('show');
  sim.lastB = a.boundary;
  if (!sim.raf) sim.raf = requestAnimationFrame(frame);
}
kR.addEventListener('input', updateSim); wR.addEventListener('input', updateSim);

/* ---------- クイズ ---------- */
const quiz = {q: null, total: 0, right: 0, answered: false};
const quizCv = $('#quizCanvas');

function newQuiz() {
  let k, w, type, a;
  do {
    k = Math.floor(Math.random() * 9) - 2; w = 1 + Math.floor(Math.random() * 5);
    type = Math.random() < 0.5 ? 'min' : 'max';
    a = analyze(k, w);
  } while (k + w > 8 || (type === 'max' && a.maxC === 1));
  const ans = type === 'min' ? a.minX : a.maxX;
  const pool = [...new Set([k, a.r, A, k + w / 2].map(fmt))].filter(v => +v !== ans);
  while (pool.length < 2) { const v = fmt(Math.floor(Math.random() * 10) - 2); if (+v !== ans && !pool.includes(v)) pool.push(v); }
  pool.sort(() => Math.random() - 0.5);
  const opts = [fmt(ans), pool[0], pool[1]].sort(() => Math.random() - 0.5);
  quiz.q = {k, w, type, a, ans: fmt(ans)}; quiz.answered = false;
  $('#question').innerHTML = `2次関数 <em>y = (x − 3)² + 2</em> の <em>${k} ≦ x ≦ ${k + w}</em> における【<em>${type === 'min' ? '最小' : '最大'}値をとる x の値</em>】を求めよ。`;
  const box = $('#choices'); box.innerHTML = '';
  opts.forEach(v => { const b = document.createElement('button'); b.className = 'choice'; b.textContent = 'x = ' + v; b.dataset.v = v; b.onclick = () => answer(b); box.appendChild(b); });
  $('#feedback').className = 'feedback'; $('#feedback').innerHTML = '';
  $('#quizCard').classList.remove('ok', 'ng'); $('#nextBtn').classList.add('hidden');
  draw(quizCv, k, w, {pins: [], boundary: null});
}
function answer(btn) {
  if (quiz.answered) return; quiz.answered = true;
  const q = quiz.q, ok = btn.dataset.v === q.ans, a = q.a;
  quiz.total++; if (ok) quiz.right++;
  $('#score').textContent = `正解 ${quiz.right} / ${quiz.total}`;
  document.querySelectorAll('.choice').forEach(b => { b.disabled = true; if (b.dataset.v === q.ans) b.classList.add('right'); });
  if (!ok) btn.classList.add('wrong');
  const card = $('#quizCard'); void card.offsetWidth; card.classList.add(ok ? 'ok' : 'ng');
  let why;
  if (q.type === 'min') why = a.minC === 0 ? `軸 x=3 が定義域の左外なので、右上がり区間。左端 x=${q.k} が最小。` : a.minC === 2 ? `軸 x=3 が定義域の右外なので、右下がり区間。右端 x=${fmt(a.r)} が最小。` : `軸 x=3 が定義域に含まれるので、頂点 x=3 が最小。`;
  else why = a.maxC === 0 ? `定義域の中央が軸より左。軸から遠い左端 x=${q.k} で最大。` : `定義域の中央が軸より右。軸から遠い右端 x=${fmt(a.r)} で最大。`;
  const fb = $('#feedback'); fb.className = 'feedback ' + (ok ? 'ok' : 'ng');
  fb.innerHTML = `<strong>${ok ? 'SUCCESS — 正解' : 'ERROR — 不正解'}</strong>${why}（グラフのピンで確認）`;
  draw(quizCv, q.k, q.w, {pins: [q.type === 'min' ? {x: a.minX, c: COL.cyan, tag: 'MIN', up: false} : {x: a.maxX, c: COL.pink, tag: 'MAX', up: true}], boundary: null});
  $('#nextBtn').classList.remove('hidden');
}
$('#nextBtn').onclick = newQuiz;

/* ---------- タブ ---------- */
const tabs = document.querySelector('.tabs');
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => { const on = x === t; x.classList.toggle('active', on); x.setAttribute('aria-selected', on); });
  tabs.classList.toggle('quiz', t.dataset.tab === 'quiz');
  $('#sim').classList.toggle('hidden', t.dataset.tab !== 'sim');
  $('#quiz').classList.toggle('hidden', t.dataset.tab !== 'quiz');
  if (t.dataset.tab === 'quiz') newQuiz(); else updateSim();
}));

window.addEventListener('resize', () => {
  if (!$('#sim').classList.contains('hidden')) updateSim();
  else if (quiz.q) { const q = quiz.q; draw(quizCv, q.k, q.w, {pins: [], boundary: null}); }
});
updateSim();
})();
