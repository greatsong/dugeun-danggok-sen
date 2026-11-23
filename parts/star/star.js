"use strict";
// [발표 덱 정적 시연판 사본 2026-11-23] 원본: docs/design/꿈수업_자료/explorer/star.js. 서버 없이 data/*.json을 읽는다(모의 학생). 바꾼 곳은 「시연판」 주석.
// 꿈의 별자리(밤하늘 디자인, 별자리_줌_시안.html과 같은 규칙) — 자료는 /api/sheets/star 에서.
// 왼쪽 아래 오늘의 나 → 오른쪽 위 꿈. 고정 구조: 큰 갈래 4 · 중간 별 9. 학생이 고를 잎은 학기 순서로 앞쪽에,
// 같은 중간 별로 가는 잎끼리 한 줄로 이어 모든 별이 오늘의 나와 이어진다.
const NS = "http://www.w3.org/2000/svg",
  svg = document.getElementById("sky");
function el(t, a, p, x) {
  const e = document.createElementNS(NS, t);
  for (const k in a) e.setAttribute(k, a[k]);
  if (x != null) e.textContent = x;
  (p || svg).appendChild(e);
  return e;
}
const W = 1600, H = 1000, N = [140, 860], G = [1460, 140];
const D = [G[0] - N[0], G[1] - N[1]], LEN = Math.hypot(...D), d = [D[0] / LEN, D[1] / LEN], p = [-d[1], d[0]];
const at = (t, s) => [N[0] + t * D[0] + s * p[0], N[1] + t * D[1] + s * p[1]];
const COL = { path: "#6B9BFF", well: "#F5B84C", love: "#FF7A9C", port: "#4FD8C4" };
const CC = { 과목: "#B79CFF", 학교: "#8BE38B", 개인: "#FFB070" }, CATN = { 과목: "학교 과목", 학교: "학교 활동", 개인: "개인 활동" }, SYM = { 과목: "▲", 학교: "■", 개인: "●" };
const SEM = ["한 것", "1학년", "2학년 1학기", "2학년 2학기", "3학년 1학기", "3학년 2학기", "졸업 뒤"], T0 = 0.12, TS = 0.072, MT = 0.64, MS = 88;
const LANES = ["path", "well", "love", "port"];
const cut = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
const params = new URLSearchParams(location.search);
// (2026-11-23) 학생 본인 화면(/me/star)은 세션으로 내 별자리만. 하위 경로(BASE)에서도 열린다.
const BASE = (document.querySelector('meta[name="base"]') || {}).content || "";
const ME = true;   // 시연판: 학생 본인 화면(/me/star)과 같게
const VER = params.get("v") === "first" ? "first" : "now";   // 시연판: 처음(1번째 판) · 지금(2번째 판)
const PHONE = matchMedia("(max-width: 760px)").matches;

async function load() {
  // 시연판: 상대 경로 JSON(처음 = first.json, 지금 = now.json, 다른 직업 = now_job<번호>.json)
  const job = VER === "now" && /^\d+$/.test(params.get("job") || "") ? params.get("job") : "";
  const q = "data/" + (VER === "first" ? "first" : job ? "now_job" + job : "now") + ".json";
  const r = await fetch(q, { credentials: "same-origin" });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "불러오지 못했어요.");
  return data;
}

function draw(S) {
  if (S.preview) document.body.classList.add("preview");   // 학생이 고른 직업이 아니면 흐린 미리보기(3-way 2차)
  document.getElementById("who").textContent = S.student + (S.term ? " · " + S.term : "");
  if (ME) {   // 학생 화면 용어(2026-11-23 임시 추천안)
    document.querySelector("header .n").textContent = "나를 발견하기 · 나와 맞는 직업 찾기 ·";
  }
  const BIG = [["b0", "가는 길", "path"], ["b1", "★ 잘할 힘", "well"], ["b2", "♥ 좋아할 힘", "love"], ["b3", ME ? "내 활동 모음" : "포트폴리오", "port"]].map(([id, label, lane], i) => ({ id, label, lane, to: "dream", xy: at(0.83, (-1.5 + i) * 150) }));
  // 중간 별을 갈래 순서(가는 길 · 잘할 힘 · 좋아할 힘 · 포트폴리오)로 줄 세우기
  const order = S.mids.map((m, k) => k).sort((a, b) => LANES.indexOf(S.mids[a].lane) - LANES.indexOf(S.mids[b].lane) || a - b);
  const slot = {};
  order.forEach((k, j) => (slot[k] = j));
  const MID = S.mids.map((m, k) => ({ id: "m" + k, label: m.label, lane: m.lane, to: m.to, row: slot[k], xy: at(MT, (-4 + slot[k]) * MS) }));
  const LEAF = S.leaves.map((l, i) => {
    const row = slot[l.mid], t = T0 + l.sem * TS, f = 0.45 + 0.55 * t / MT;
    return { id: "l" + i, label: l.label, cat: l.cat, sem: l.sem, done: l.done, note: l.note || "", mid: "m" + l.mid, to: "m" + l.mid, from: "me", lane: S.mids[l.mid].lane, xy: at(t, (-4 + row) * 100 * f + 22 * (l.sem % 2 ? 1 : -1)) };
  });
  // 모든 별은 나와 이어진다: 같은 중간 별로 가는 잎을 학기 순서로 한 줄(나 → 먼저 할 별 → … → 중간 별)
  MID.forEach((m) => {
    const row = LEAF.filter((l) => l.mid === m.id).sort((a, b) => a.sem - b.sem);
    row.forEach((l, j) => {
      l.from = j ? row[j - 1].id : "me";
      l.to = j < row.length - 1 ? row[j + 1].id : m.id;
    });
  });
  // 이름표 겹치면 밀기
  (function relax() {
    const tw0 = (t) => [...t].reduce((w, c) => w + (/[ㄱ-힝「」]/.test(c) ? 13 : 7.8), 0);
    const box = (l) => { const w = tw0((l.done ? "✓ ▲ " : "▲ ") + cut(l.label, 16)) + 22; return [l.xy[0] - w / 2 - 4, l.xy[1] - 15, l.xy[0] + w / 2 + 4, l.xy[1] + 15]; };
    const fixed = MID.map((m) => { const w = tw0(m.label) + 30; return [m.xy[0] - w / 2, m.xy[1] - 17, m.xy[0] + w / 2, m.xy[1] + 17]; });
    const hit = (A, B) => A[0] < B[2] && B[0] < A[2] && A[1] < B[3] && B[1] < A[3];
    for (let it = 0; it < 160; it++) {
      let moved = false;
      for (let a = 0; a < LEAF.length; a++) {
        const A = box(LEAF[a]);
        for (const F of fixed) if (hit(A, F)) { LEAF[a].xy = [LEAF[a].xy[0] - d[0] * 6, LEAF[a].xy[1] - d[1] * 6]; moved = true; }
        for (let b = a + 1; b < LEAF.length; b++) { const B = box(LEAF[b]); if (hit(A, B)) { const L = LEAF[b]; L.xy = [L.xy[0] + p[0] * 7, L.xy[1] + p[1] * 7]; moved = true; } }
      }
      if (!moved) break;
    }
  })();
  const byId = {};
  [...BIG, ...MID, ...LEAF].forEach((n) => (byId[n.id] = n));
  const world = el("g", {});
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 150; i++) el("circle", { cx: (rnd() * W).toFixed(0), cy: (rnd() * H).toFixed(0), r: (rnd() * 1.3 + 0.3).toFixed(2), fill: "#DDE3FF", opacity: (0.12 + rnd() * 0.42).toFixed(2) }, world);
  SEM.forEach((txt, i) => {
    const t = T0 + i * TS, f = 0.45 + 0.55 * t / MT, a = at(t, -470 * f), b = at(t, 470 * f);
    el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#FFD76A", "stroke-opacity": i ? 0.18 : 0.28, "stroke-dasharray": "2 9", "stroke-width": 1.3 }, world);
    el("text", { x: a[0] - 6, y: a[1] - 4, "text-anchor": "end", "font-size": 12.5, "font-weight": 700, fill: "#FFE9A8", "fill-opacity": 0.7, class: "lab" }, world, txt);
  });
  const gL = el("g", { "stroke-linecap": "round", fill: "none" }, world), gN = el("g", {}, world), lines = {}, LINKS = [];
  let MODE = "straight";
  function pathD(a, b) {
    if (MODE === "straight") return `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len;
    const side = (mx - N[0]) * p[0] + (my - N[1]) * p[1];
    if ((nx * p[0] + ny * p[1]) * side < 0) { nx = -nx; ny = -ny; }
    const k = 0.16 * len * Math.min(1, Math.abs(side) / 160);
    return `M${a[0]} ${a[1]} Q${mx + nx * k} ${my + ny * k} ${b[0]} ${b[1]}`;
  }
  function line(a, b, col, w, op, key, dash) {
    const e = el("path", { stroke: col, "stroke-width": w, "stroke-opacity": op, ...(dash ? { "stroke-dasharray": dash } : {}) }, gL);
    e.dataset.op = op;
    LINKS.push([e, a, b]);
    (lines[key] = lines[key] || []).push(e);
  }
  const redraw = () => LINKS.forEach(([e, a, b]) => e.setAttribute("d", pathD(a, b)));
  LEAF.forEach((l) => line(l.xy, byId[l.to].xy, COL[l.lane], 1.1, 0.42, l.id));
  MID.forEach((m) => line(m.xy, byId[m.to].xy, COL[m.lane], 1.7, 0.7, m.id));
  BIG.forEach((b) => line(b.xy, G, COL[b.lane], 2.8, 0.9, b.id));
  LEAF.filter((l) => l.from === "me").forEach((l) => line(N, l.xy, "#FFD76A", 1.3, l.done ? 0.6 : 0.32, l.id + "me", "2 6"));
  redraw();
  const nodeG = {};
  const tw = (t, fs) => [...t].reduce((w, c) => w + (/[ㄱ-힝「」]/.test(c) ? fs * 1.0 : fs * 0.6), 0);
  function pill(g, x, y, text, o) {
    const fs = o.fs || 13, w = tw(text, fs) + (o.pad || 22), h = o.h || 26;
    if (o.glow) el("rect", { x: x - w / 2 - 8, y: y - h / 2 - 8, width: w + 16, height: h + 16, rx: (h + 16) / 2, fill: o.glow, opacity: 0.18 }, g);
    el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: o.rx ?? h / 2, fill: o.fill, "fill-opacity": o.fo ?? 1, stroke: o.stroke || "none", "stroke-width": o.sw || 1 }, g);
    el("text", { x, y: y + fs * 0.36, "text-anchor": "middle", "font-size": fs, "font-weight": o.fw || 700, fill: o.color, class: "lab" }, g, text);
  }
  LEAF.forEach((l) => {
    const g = el("g", { class: "nd", tabindex: 0, role: "button", "aria-label": `${l.label}, ${SEM[l.sem]}` }, gN);
    nodeG[l.id] = g;
    const [x, y] = l.xy, c = CC[l.cat], t = cut(l.label, 16);
    if (l.done) pill(g, x, y, `✓ ${SYM[l.cat]} ${t}`, { fill: "#FFD76A", color: "#2A1D00", glow: "#FFD76A", fw: 800 });
    else pill(g, x, y, `${SYM[l.cat]} ${t}`, { fill: c, fo: 0.18, stroke: c, sw: 1.2, color: "#F4F1FF" });
  });
  MID.forEach((m) => {
    const g = el("g", { class: "nd", tabindex: 0, role: "button", "aria-label": m.label }, gN);
    nodeG[m.id] = g;
    const c = COL[m.lane];
    pill(g, ...m.xy, m.label, { fill: c, fo: 0.26, stroke: c, sw: 1.4, color: "#fff", fs: 13.5, fw: 800, h: 30, rx: 8 });
  });
  BIG.forEach((b) => {
    const g = el("g", { class: "nd", tabindex: 0, role: "button", "aria-label": b.label }, gN);
    nodeG[b.id] = g;
    const c = COL[b.lane];
    pill(g, ...b.xy, b.label, { fill: c, color: "#0B1230", fs: 15.5, fw: 900, h: 38, rx: 10, glow: c, pad: 30 });
  });
  const defs = el("defs", {}, svg);
  { const lg = el("linearGradient", { id: "gold", x1: 0, y1: 0, x2: 0, y2: 1 }, defs); el("stop", { offset: "0%", "stop-color": "#FFF3A6" }, lg); el("stop", { offset: "55%", "stop-color": "#FFD23F" }, lg); el("stop", { offset: "100%", "stop-color": "#F5A300" }, lg); }
  function sparkle(g, x, y, r, delay) {
    const e = el("path", { d: `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`, fill: "#FFF7CC", class: "tw" }, g);
    e.style.animationDelay = delay + "s";
  }
  function bigStar(g, x, y, R, label, fs) {
    el("circle", { cx: x, cy: y, r: R * 1.9, fill: "#FFD76A", opacity: 0.1 }, g);
    el("circle", { cx: x, cy: y, r: R * 1.35, fill: "#FFD76A", opacity: 0.14 }, g);
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.5 : R; pts.push((x + rr * Math.cos(a)).toFixed(1) + "," + (y + rr * Math.sin(a)).toFixed(1)); }
    el("polygon", { points: pts.join(" "), fill: "url(#gold)", stroke: "#E08A00", "stroke-width": R * 0.16, "stroke-linejoin": "round" }, g);
    el("polygon", { points: pts.join(" "), fill: "none", stroke: "#FFF6C2", "stroke-width": R * 0.05, "stroke-linejoin": "round", opacity: 0.8 }, g);
    el("ellipse", { cx: x - R * 0.22, cy: y - R * 0.28, rx: R * 0.16, ry: R * 0.26, fill: "#FFFFFF", opacity: 0.75, transform: `rotate(-25 ${x - R * 0.22} ${y - R * 0.28})` }, g);
    sparkle(g, x + R * 1.05, y - R * 0.85, R * 0.22, 0);
    sparkle(g, x - R * 1.1, y - R * 0.35, R * 0.16, 0.7);
    sparkle(g, x + R * 0.9, y + R * 0.75, R * 0.14, 1.3);
    const w = tw(label, fs) + fs * 2.2, h = fs * 1.9, ty = y + R * 0.62;
    el("rect", { x: x - w / 2, y: ty, width: w, height: h, rx: h / 2, fill: "#2A1D00", stroke: "#FFD23F", "stroke-width": 2 }, g);
    el("text", { x, y: ty + h / 2 + fs * 0.36, "text-anchor": "middle", "font-size": fs, "font-weight": 900, fill: "#FFE27A", class: "lab" }, g, label);
  }
  bigStar(el("g", {}, gN), G[0], G[1] - 6, 62, S.dream, 20);
  bigStar(el("g", {}, gN), N[0], N[1] - 8, 30, "오늘의 나", 14);
  // 소개 카드 · 균형
  const card = document.getElementById("card");
  let minimized = PHONE;   // 휴대폰: 처음엔 안내 카드를 접어 별자리를 가리지 않게
  function toggleBtn() {
    const b = document.createElement("button");
    b.className = "tog";
    b.type = "button";
    b.setAttribute("aria-expanded", String(!minimized));
    b.setAttribute("aria-label", minimized ? "안내 펴기" : "안내 접기");
    b.textContent = minimized ? "▾" : "▴";
    b.onclick = (e) => { e.stopPropagation(); minimized = !minimized; card.classList.toggle("min", minimized); b.textContent = minimized ? "▾" : "▴"; b.setAttribute("aria-expanded", String(!minimized)); b.setAttribute("aria-label", minimized ? "안내 펴기" : "안내 접기"); };
    card.classList.toggle("min", minimized);
    return b;
  }
  function intro() {
    card.replaceChildren(toggleBtn());
    const h = document.createElement("h2");
    h.textContent = S.dream;
    const p1 = document.createElement("p");
    p1.textContent = S.why + " · " + S.one;
    const p2 = document.createElement("p");
    p2.textContent = "왼쪽 아래 노란 별이 오늘의 나, 오른쪽 위 큰 별이 꿈이에요. 나에게서 멀수록 나중에 할 일이에요. 노란 별은 이미 해 본 일이에요.";
    const p3 = document.createElement("p");
    p3.textContent = S.note;
    if (!S.verified) p3.className = "draft";
    card.append(h, p1, p2, p3);
    for (const t of [S.ai_note, S.off_note]) {   // 학생이 직업을 안 썼거나 목록 밖 직업일 때(11-22 밤 e2e · 3-way)
      if (!t) continue;
      const p4 = document.createElement("p");
      p4.className = "draft";
      p4.textContent = t;
      card.append(p4);
    }
    if (S.suggest && S.suggest.length) {
      const p5 = document.createElement("p");
      p5.textContent = "목표와 가까운 목록 직업: " + S.suggest.map((x) => x.name).join(" · ") + " — 아래 ‘다른 직업으로 보기’에서 골라 보세요.";
      card.append(p5);
    }
  }
  intro();
  const gauge = document.getElementById("gauge");
  const cnt = (c) => LEAF.filter((l) => l.cat === c).length, done = (c) => LEAF.filter((l) => l.cat === c && l.done).length;
  gauge.replaceChildren();
  const gb = document.createElement("b");
  gb.textContent = "세 가지 균형 · " + LEAF.length + "개";
  const lg = document.createElement("div");
  lg.className = "lg";
  for (const [cls, name] of [["c1", "학교 과목"], ["c2", "학교 활동"], ["c3", "개인 활동"], ["c4", "해 본 것"]]) {
    const s = document.createElement("span"), i = document.createElement("i");
    i.className = cls;
    s.append(i, name);
    lg.append(s);
  }
  gauge.append(gb, lg);
  for (const c of ["과목", "학교", "개인"]) {
    const row = document.createElement("div");
    row.className = "gr";
    const a = document.createElement("span"), bar = document.createElement("span"), fill = document.createElement("i"), n = document.createElement("span");
    a.textContent = SYM[c] + " " + CATN[c];
    bar.className = "bar";
    fill.style.width = Math.round((100 * cnt(c)) / Math.max(1, LEAF.length)) + "%";
    bar.append(fill);
    n.textContent = cnt(c) + (done(c) ? " · ✓" + done(c) : "");
    row.append(a, bar, n);
    gauge.append(row);
  }
  // 길 밝히기
  function chain(id) {
    const s = new Set([id]);
    let c = byId[id];
    while (c && c.to && c.to !== "dream") { s.add(c.to); c = byId[c.to]; }
    const down = (x) => [...LEAF, ...MID].filter((n) => n.to === x).forEach((n) => { s.add(n.id); down(n.id); });
    down(id);
    return s;
  }
  function focus(id) {
    const s = chain(id);
    gL.querySelectorAll("path").forEach((e) => e.setAttribute("stroke-opacity", 0.05));
    s.forEach((i) => { (lines[i] || []).forEach((e) => e.setAttribute("stroke-opacity", 1)); (lines[i + "me"] || []).forEach((e) => e.setAttribute("stroke-opacity", 1)); });
    Object.entries(nodeG).forEach(([k, g]) => g.setAttribute("opacity", s.has(k) ? 1 : 0.25));
    const n = byId[id];
    minimized = false;
    card.replaceChildren(toggleBtn());
    const h = document.createElement("h2"), p1 = document.createElement("p");
    h.textContent = (n.done ? "✓ " : "") + n.label;
    if (n.cat) {
      const back = [];
      for (let c = n; c && c.cat; c = byId[c.from]) back.unshift(cut(c.label, 14));
      const ahead = [];
      for (let c = byId[n.to]; c && c.cat; c = byId[c.to]) ahead.push(cut(c.label, 14));
      const m = byId[n.mid], big = byId[m.to];
      p1.textContent = SEM[n.sem] + " · " + CATN[n.cat] + " · " + (n.done ? "이미 해 본 것" : "해 볼 것") + (n.note ? " · " + n.note : "");
      const p2 = document.createElement("p");
      p2.textContent = "오늘의 나 → " + back.join(" → ") + (ahead.length ? " → " + ahead.join(" → ") : "") + " → " + m.label + " → " + big.label + " → " + S.dream;
      card.append(h, p1, p2);
    } else {
      const k = n.id.startsWith("m") ? LEAF.filter((x) => x.mid === n.id).length : MID.filter((x) => x.to === n.id).length;
      p1.textContent = "이 별로 모이는 별 " + k + "개";
      card.append(h, p1);
    }
  }
  function clear() {
    gL.querySelectorAll("path").forEach((e) => e.setAttribute("stroke-opacity", e.dataset.op));
    Object.values(nodeG).forEach((g) => g.removeAttribute("opacity"));
    intro();
  }
  Object.entries(nodeG).forEach(([id, g]) => {
    g.addEventListener("mouseenter", () => focus(id));
    g.addEventListener("focus", () => focus(id));
    g.addEventListener("mouseleave", () => { if (!focused) clear(); });
    g.addEventListener("blur", () => { if (!focused) clear(); });
  });
  // 확대 · 이동
  const stage = document.getElementById("stage");
  let k = 1, tx = 0, ty = 0, fitK = 1;
  function apply() {
    world.setAttribute("transform", `translate(${tx},${ty}) scale(${k})`);
    document.getElementById("zl").textContent = Math.round((k / fitK) * 100) + "%";
  }
  function fit() {
    const r = stage.getBoundingClientRect(), top = PHONE ? card.getBoundingClientRect().bottom + 8 : 86,   /* 시연판: 위 띠 26px */ bot = PHONE ? 130 : 16;
    if (!PHONE) {   // 시연판: 밀려난 잎까지 모두 보이게, 그려진 별들의 테두리 상자에 맞춤(오른쪽 확대 단추 자리는 비움)
      const bb = gN.getBBox(), pad = 14, L = 20, R = r.width - 76, top2 = top + 6;
      fitK = Math.min((R - L) / (bb.width + 2 * pad), (r.height - top2 - bot) / (bb.height + 2 * pad));
      k = fitK;
      tx = L + (R - L - bb.width * k) / 2 - bb.x * k;
      ty = top2 + (r.height - top2 - bot - bb.height * k) / 2 - bb.y * k;
      return apply();
    }
    fitK = Math.min(r.width / W, (r.height - top - bot) / H);
    k = fitK;
    tx = (r.width - W * k) / 2;
    ty = top + (r.height - top - bot - H * k) / 2;
    apply();
  }
  function zoomAt(f, cx, cy) {
    const nk = Math.max(fitK * 0.5, Math.min(fitK * 5, k * f));
    tx = cx - ((cx - tx) * nk) / k;
    ty = cy - ((cy - ty) * nk) / k;
    k = nk;
    apply();
  }
  stage.addEventListener("wheel", (e) => { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
  // 끌어서 이동 · 두 손가락 확대(핀치) · 살짝 누르면 그 별의 길 보기(휴대폰)
  let drag = null, moved = 0, focused = null;
  const pts = new Map();
  let pinch = null;
  stage.addEventListener("pointerdown", (e) => {
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    stage.setPointerCapture(e.pointerId);
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k };
      drag = null;
    } else { drag = { x: e.clientX, y: e.clientY, tx, ty }; moved = 0; }
    stage.classList.add("drag");
  });
  stage.addEventListener("pointermove", (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && pts.size === 2) {
      const [a, b] = [...pts.values()];
      const dd = Math.hypot(a[0] - b[0], a[1] - b[1]);
      zoomAt((pinch.k * dd) / pinch.d / k, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      moved = 99;
      return;
    }
    if (!drag) return;
    moved = Math.max(moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y));
    tx = drag.tx + e.clientX - drag.x; ty = drag.ty + e.clientY - drag.y; apply();
  });
  const end = (e) => {
    const wasTap = drag && moved < 8 && pts.size === 1;
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 1) { const [p0] = [...pts.values()]; drag = { x: p0[0], y: p0[1], tx, ty }; return; }
    drag = null; stage.classList.remove("drag");
    if (wasTap && e.type === "pointerup") {
      const hit = document.elementsFromPoint(e.clientX, e.clientY).map((x) => x.closest && x.closest(".nd")).find(Boolean);
      const id = hit && Object.keys(nodeG).find((k2) => nodeG[k2] === hit);
      if (id) { focused = id; focus(id); } else if (focused) { focused = null; clear(); }
    }
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  const ctr = () => { const r = stage.getBoundingClientRect(); return [r.width / 2, r.height / 2]; };
  document.getElementById("zin").onclick = () => zoomAt(1.3, ...ctr());
  document.getElementById("zout").onclick = () => zoomAt(1 / 1.3, ...ctr());
  document.getElementById("fit").onclick = fit;
  const ls = document.getElementById("ls"), lc = document.getElementById("lc");
  function setMode(m) { MODE = m; ls.setAttribute("aria-pressed", m === "straight"); lc.setAttribute("aria-pressed", m === "curve"); redraw(); }
  ls.onclick = () => setMode("straight");
  lc.onclick = () => setMode("curve");
  addEventListener("resize", fit);
  fit();
  // 다른 직업으로 바꿔 보기(학생이 써 본 직업)
  const pick = document.getElementById("pick");
  if (S.choices.length > 1 && VER === "now") {   // 시연판: 다른 직업 자료는 지금 판만
    const sel = document.createElement("select");
    sel.setAttribute("aria-label", "다른 직업으로 별자리 보기");
    for (const c of S.choices) {
      const o = document.createElement("option");
      o.value = c.i;
      o.textContent = c.name;
      if (c.i === S.job_i) o.selected = true;
      sel.append(o);
    }
    sel.onchange = () => { if (sel.value === String(S.job_i) && !params.get("job")) return; params.set("job", sel.value); params.set("v", "now"); location.search = params.toString(); };
    sel.style.fontSize = "16px";
    pick.append(PHONE ? "" : "다른 직업으로 보기 ", sel);
  }
  // 목록으로 보기(휴대폰에서 글씨가 작을 때) — 같은 자료를 학기 순서로
  const list = document.getElementById("list"), lb = document.getElementById("listbtn");
  lb.onclick = () => {
    const open = list.hidden;
    list.hidden = !open;
    lb.setAttribute("aria-expanded", String(open));
    lb.textContent = open ? "별자리" : "목록";
    if (!open) return;
    list.replaceChildren();
    const h2 = document.createElement("h2");
    h2.textContent = "꿈: " + S.dream;
    list.append(h2);
    SEM.forEach((name, si) => {
      const xs = LEAF.filter((l) => l.sem === si);
      if (!xs.length) return;
      const h3 = document.createElement("h3");
      h3.textContent = si === 0 ? "이미 해 본 일" : name;
      list.append(h3);
      xs.forEach((l) => {
        const row = document.createElement("div"), dot = document.createElement("i"), t = document.createElement("div"), sm = document.createElement("small");
        row.className = "li" + (l.done ? " done" : "");
        dot.style.background = l.done ? "#FFD76A" : CC[l.cat];
        t.textContent = (l.done ? "✓ " : "") + l.label;
        sm.textContent = CATN[l.cat] + " · " + byId[l.mid].label + (l.note ? " · " + l.note : "");
        t.append(sm);
        row.append(dot, t);
        list.append(row);
      });
    });
  };
}

load()
  .then(draw)
  .catch((err) => {
    const card = document.getElementById("card");
    card.replaceChildren();
    const h = document.createElement("h2"), p = document.createElement("p");
    h.textContent = "별자리를 그리지 못했어요";
    p.textContent = err.message + (ME ? "" : " 교사 검토 화면을 연 브라우저에서 열어 주세요.");
    if (ME) {   // 학생 화면 용어(2026-11-23 임시 추천안)
    document.querySelector("header .n").textContent = "나를 발견하기 · 나와 맞는 직업 찾기 ·";
  }
    card.append(h, p);
  });

// 시연판: 처음 · 지금 전환 단추
(function verSwitch() {
  for (const [id, v] of [["vfirst", "first"], ["vnow", "now"]]) {
    const b = document.getElementById(id);
    b.setAttribute("aria-pressed", String(VER === v));
    b.onclick = () => { if (VER === v) return; params.set("v", v); params.delete("job"); location.search = params.toString(); };
  }
})();
