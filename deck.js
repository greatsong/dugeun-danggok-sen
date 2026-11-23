// 두근두근 당곡 · 서울시교육청 소개 · 슬라이드 동작(11-11 소개 덱 엔진을 그대로 쓰고 판 종류만 더함)
(function () {
  var MENUS = window.MENUS || {}, NOTES = window.NOTES || [];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var WHO = { hr: "hr", pr: "pr", sc: "sc", st: "st" };

  // ---- 학교 차원(8장) 판 ----
  var NATIVE = {};


  function chips(list) {
    return '<div class="chips">' + (list || []).map(function (c) { return '<div class="who ' + WHO[c[0]] + '"><b>' + esc(c[1]) + '</b>' + esc(c[2]) + '</div>'; }).join("") + '</div>';
  }
  function wow(it) {
    if (!it.wow) return "";
    return '<div class="wow"><span class="was">지금은</span><s>' + esc(it.wow[0]) + '</s><i>→</i><span class="now">이제는</span><b>' + esc(it.wow[1]) + '</b></div>';
  }
  function head(it) {
    var tag = it.tag ? '<span class="tag">' + esc(it.tag) + '</span>' : (it.live ? '<span class="tag live">운영 중</span>' : '');
    return wow(it) + '<div class="phead">' + esc(it.head || "") + tag + '</div>';
  }
  function paneHTML(it) {
    if (it.type === "shot") return head(it) + '<div class="shotbox" data-lb="' + it.img + '" data-cap="' + esc(it.head) + '"><img src="' + it.img + '" alt="' + esc(it.head) + '"></div>' + chips(it.chips);
    if (it.type === "doc") return head(it) + '<div class="docbox" data-lb="' + it.img + '" data-cap="' + esc(it.head) + '" style="--dw:' + (it.dw || 820) + 'px"><img src="' + it.img + '" alt=""></div>' + chips(it.chips);
    if (it.type === "text") return head(it) + '<div class="textbox"><div class="lab">' + esc(it.lab) + '<small>' + esc(it.labsmall) + '</small></div><p' + (it.text2 ? ' style="font-size:24px"' : '') + '>' + it.text + '</p>' +
      (it.text2 ? '<div class="lab" style="margin-top:18px;color:var(--green)">' + esc(it.lab2) + '<small>' + esc(it.lab2small) + '</small></div><p style="font-size:24px">' + esc(it.text2) + '</p>' : '') + '</div>' + chips(it.chips);
    if (it.type === "q") return head(it) + '<div class="qbox"><div class="qcard"><small>' + esc(it.q.small) + '</small>' + esc(it.q.text) + '<span class="k">' + esc(it.q.k) + '</span></div><div class="bubbles">' +
      it.bubbles.map(function (b) {
        if (Array.isArray(b)) return '<div class="bub ' + b[0] + '"><i>' + (b[0] === "fix" ? "개선할 점" : "좋았던 점") + '</i>' + esc(b[1]) + '</div>';
        return '<div class="bub">' + esc(b) + '</div>'; }).join("") + '</div><div style="font-size:18px;color:var(--mute);font-weight:700">' + esc(it.note) + '</div></div>' + chips(it.chips);
    if (it.type === "points") return head(it) + '<div class="ptbox">' + it.points.map(function (p, k) { return '<div class="pt"><span class="pn">' + (k + 1) + '</span><div><b>' + esc(p[0]) + '</b><p>' + esc(p[1]) + '</p></div></div>'; }).join("") + '</div>' + chips(it.chips);
    if (it.type === "pair") return head(it) + '<div class="pairbox">' + it.imgs.map(function (m, k) { return (k ? '<i class="parr">→</i>' : '') + '<figure class="' + (m[2] || "") + '" data-lb="' + m[0] + '" data-cap="' + esc(m[1]) + '"><img src="' + m[0] + '" alt="' + esc(m[1]) + '"><figcaption>' + esc(m[1]) + '</figcaption></figure>'; }).join("") + '</div>' + chips(it.chips);
    if (it.type === "studiostory") return head(it) + '<div class="ssbox"><div class="ss-think"><img class="mong" src="assets/mong/chorong.png" alt=""><p class="ss-q">어떤 영상이 필요할까?</p>' +
      it.story.map(function (r, k) { return '<div class="ss-bub" style="--k:' + k + '"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + '</div>'; }).join("") + '</div>' +
      '<div class="ss-mid"><span>두근두근<br>스튜디오</span><small>AI 초안 → 선생님 검수</small><i>→</i></div><div class="ss-out">' +
      it.story.map(function (r, k) { return '<a class="ss-fig" style="--k:' + k + '" href="' + r[4] + '" target="_blank" rel="noopener"><img src="' + r[2] + '" alt="' + esc(r[3]) + '"><span class="cap"><b>' + esc(r[3]) + '</b><u>' + esc(r[4].replace("https://", "")) + ' ↗</u></span></a>'; }).join("") + '</div></div>' + chips(it.chips);
    if (it.type === "iframe") return head(it) + '<div class="ifbox"><iframe src="' + it.src + '" title="' + esc(it.head) + '" loading="lazy"></iframe></div>' + chips(it.chips);
    if (it.type === "paperdemo") return head(it) + '<div class="pdhost" data-mode="' + it.mode + '"></div>' + chips(it.chips);
    if (it.type === "mapzoom") return '<div class="phead">' + esc(it.head) + '</div><div class="mzrow"><div class="mzwrap"><div class="mzbox" style="--cx:' + it.z[0] + '%;--cy:' + it.z[1] + '%;--z:' + it.z[2] + '" data-lb="assets/shot/map.jpg" data-cap="두근두근 당곡 항해 지도"><img src="assets/shot/map.jpg" alt="두근두근 당곡 항해 지도"></div></div>' +
      '<div class="mzcard">' + it.rows.map(function (r, k) { return '<div class="mzr" style="--k:' + k + '"><b class="t' + k + '">' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></div>'; }).join("") + '</div></div>';
    if (it.type === "newstar") return head(it) + '<div class="nsbox" data-lb="' + it.to + '" data-cap="' + esc(it.head) + '"><img class="ns-from" src="' + it.from + '" alt="처음 별자리"><img class="ns-to" src="' + it.to + '" alt="활동을 담은 뒤 별자리">' +
      '<div class="ns-burst" style="left:' + it.star[0] + '%;top:' + it.star[1] + '%"><i></i><i></i><i></i><b>★</b></div><div class="ns-tag" style="left:' + it.star[0] + '%;top:' + it.star[1] + '%">새로운 별 · ' + esc(it.starLabel) + '</div><span class="ns-step s1">처음</span><span class="ns-step s2">활동을 담은 뒤</span></div>' + chips(it.chips);
    if (it.type === "trio") return head(it) + '<div class="triobox' + (it.anim ? ' anim' : '') + '">' + it.imgs.map(function (m, k) { return '<figure style="--i:' + k + '" data-lb="' + m[0] + '" data-cap="' + esc(m[1]) + '"><img src="' + m[0] + '" alt="' + esc(m[1]) + ' 꿈 보드(모의 학생)"><figcaption>' + esc(m[1]) + '</figcaption></figure>'; }).join("") + '</div>' + chips(it.chips);
    if (it.type === "embed3d") return head(it) + '<div class="e3"><div class="e3stage"><p class="e3cap">점 하나 = 직업 특성(직업 923개의 하는 일 2,766개, 색 = 직업군) · 분홍 별 = 서윤이 좋아하는 일, 노란 별 = 잘하는 일 · 금빛 선 = 가장 닮은 직업 특성, 숫자 = 1,024개 숫자로 계산한 가까움(1에 가까울수록 비슷) · 끌어서 회전, 휠로 확대</p></div>' +
      '<div class="e3side"><p class="e3h">서윤의 특성 고르기</p><div class="e3list"></div><div class="e3k"><span>가까운 직업</span>' + [3, 5, 10, 20].map(function (k) { return '<button data-k="' + k + '"' + (k === 5 ? ' class="on"' : '') + '>' + k + '개</button>'; }).join("") + '</div><div class="e3top"></div></div></div>' + chips(it.chips);
    if (it.type === "native") return NATIVE[it.key];
    if (it.type === "chain") {
      var p = it.plan;
      return wow(it) + '<div class="phead">' + esc(it.title) + '<span class="tag">후기 · 결과는 모의</span></div>' +
        '<div class="chainrow"><div style="display:flex;flex-direction:column;gap:14px;min-height:0">' +
        '<div class="chain"><div class="col">' +
        '<div class="ccard st"><h4>💬 학생 후기 · 운영 개선 의견</h4>' + it.students.map(function (s) { return '<q>' + esc(s) + '</q>'; }).join("") + '</div>' +
        '<div class="ccard tc"><h4>📝 선생님 의견</h4><p>' + esc(it.teacher) + '</p></div></div>' +
        '<div class="arrow">→</div>' +
        '<div class="col"><div class="ccard ai" style="flex:1"><h4>✨ AI 개선안 · 선생님 승인</h4><ul>' + it.change.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul></div></div></div>' +
        '<div class="ccard pl"><h4>📘 2027 교육계획서 원고 · 다. 추진 계획</h4><div class="pline">' + esc(p.task) + ' · ' + esc(p.name) + '</div>' +
        (p.chg ? '<div class="pline" style="margin-top:6px;color:#5b3fd0"><span>개선 반영</span>' + esc(p.chg) + '</div>' : '') + '<div class="ptime">시기 ' + esc(p.timing) + '</div></div>' +
        '</div><div class="minidoc" data-lb="' + it.doc + '" data-cap="' + esc(it.label + ' 2027 교육계획서 원고(계획서 양식 예시)') + '"><img src="' + it.doc + '" alt=""><span class="lbl">원고 전체 보기</span></div></div>';
    }
    return "";
  }

  // ---- 메뉴 만들기 ----
  var menuState = {};
  document.querySelectorAll("section[data-menu]").forEach(function (sec) {
    var key = sec.dataset.menu, m = MENUS[key]; if (!m) return;
    var list = sec.querySelector(".mlist"), panel = sec.querySelector(".mpanel");
    m.items.forEach(function (it, i) {
      var b = document.createElement("button"); b.className = "mi"; b.style.setProperty("--dur", (m.dur || 7) + "s");
      b.innerHTML = '<span class="no">' + (i + 1) + '</span><img src="assets/mong/' + it.mong + '.png" alt=""><div><b>' + esc(it.label) + '</b><span>' + esc(it.sub || "") + '</span></div>' +
        (it.tag ? '<em>' + esc(it.tag) + '</em>' : (it.live ? '<em class="live">운영 중</em>' : '')) + '<i class="bar"></i>';
      list.appendChild(b);
      var pane = document.createElement("div"); pane.className = "pane"; pane.innerHTML = paneHTML(it); panel.appendChild(pane);
      if (it.type === "paperdemo" && window.PaperDemo) { var host = pane.querySelector(".pdhost"); requestAnimationFrame(function () { window.PaperDemo.mount(host, { mode: it.mode }); }); }
    });
    if (m.legend) { var lg = document.createElement("div"); lg.className = "legend"; lg.textContent = m.legend; list.appendChild(lg); }
    var st = menuState[sec.id] = { i: 0, n: m.items.length, timer: null, dur: (m.dur || 7) * 1000, sec: sec, key: key };
    [].slice.call(list.querySelectorAll(".mi")).forEach(function (b, i) { b.addEventListener("click", function (e) { e.stopPropagation(); select(sec.id, i); restart(sec.id); }); });
  });
  function select(id, i) {
    var st = menuState[id]; if (!st) return; st.i = i;
    var btns = st.sec.querySelectorAll(".mi"), panes = st.sec.querySelectorAll(".pane");
    btns.forEach(function (b, k) { b.classList.remove("on"); if (k === i) { void b.offsetWidth; b.classList.add("on"); } });
    panes.forEach(function (p, k) {
      p.classList.remove("on");
      if (k === i) {
        // 문서 이동 거리 계산
        p.querySelectorAll(".docbox img, .minidoc img").forEach(function (im) {
          var box = im.parentElement, w = box.classList.contains("minidoc") ? box.clientWidth - 20 : (parseFloat(getComputedStyle(box).getPropertyValue("--dw")) || 820);
          var h = im.naturalHeight ? w * im.naturalHeight / im.naturalWidth : w * 1.45;
          im.style.setProperty("--pan", Math.min(0, -(h - box.clientHeight + 40)) + "px");
        });
        void p.offsetWidth; p.classList.add("on");
      }
    });
  }
  // ---- 3차원 성운 시연(커리큘럼 위버 '교육과정 성운'과 같은 방식: 어두운 우주 · 빛나는 점 · 성운 안개 · 별자리 선) ----
  document.querySelectorAll(".e3").forEach(function (box) {
    var N = window.TRAITS, T = window.THREE; if (!N) return;
    var stage = box.querySelector(".e3stage"), list = box.querySelector(".e3list"), vec = box.querySelector(".e3vec"), top = box.querySelector(".e3top");
    var labels = document.createElement("div"); labels.className = "e3labels"; stage.appendChild(labels);
    var PAL = ["#F87171","#60A5FA","#818CF8","#4ADE80","#FACC15","#FB923C","#22D3EE","#C084FC","#2DD4BF","#A3E635","#A78BFA","#F472B6","#38BDF8","#34D399","#E879F9","#BEF264","#FB7185","#FDE047","#93C5FD","#F9A8D4","#86EFAC","#FCA5A5"];
    var gk = Object.keys(N.groups), gcol = {}; gk.forEach(function (g, i) { gcol[g] = PAL[i % PAL.length]; });
    var SC = 100, sel = 0, t0 = performance.now();
    var K = 5;
    function uniqTop(s) { return s.top.slice(0, K).map(function (o) { var t = N.traits[o.k]; return { job: N.jobs[t[3]].n, text: N.ttext[o.k], sim: o.sim, p: t, g: N.jobs[t[3]].g }; }); }
    function kindTag(k) { return k === "love" ? "♥" : k === "well" ? "★" : "♥★"; }
    N.stu.forEach(function (s, i) {
      var b = document.createElement("button"); b.className = "e3s k-" + s.kind; b.innerHTML = '<i>' + kindTag(s.kind) + '</i>' + esc(s.t);
      b.addEventListener("click", function (e) { e.stopPropagation(); pick(i); }); list.appendChild(b);
    });
    box.querySelectorAll(".e3k button").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); K = +b.dataset.k; box.querySelectorAll(".e3k button").forEach(function (x) { x.classList.toggle("on", x === b); }); pick(sel); }); });
    function fmtv(v) { return (v < 0 ? "−" : "") + Math.abs(v).toFixed(3); }
    if (!T) { stage.insertAdjacentHTML("beforeend", '<p class="e3cap">3D 그림을 불러오지 못했어요(인터넷 연결 확인).</p>'); }
    // ---- 장면 ----
    var renderer, scene, cam, nodePts, focusGroup, sentStar, sentHalo, hiLabels = [], gLabels = [];
    var target = new (T ? T.Vector3 : Object)(), want = new (T ? T.Vector3 : Object)(), yaw = 0.6, pitch = 0.28, dist = 330, wantDist = 330, drag = null, idle = 0;
    function glowTex(soft) {
      var c = document.createElement("canvas"); c.width = c.height = 128; var g = c.getContext("2d");
      var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(soft ? 0.25 : 0.12, "rgba(255,255,255," + (soft ? 0.45 : 0.85) + ")"); r.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c);
    }
    if (T) {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(2);
      renderer.domElement.className = "e3gl"; stage.insertBefore(renderer.domElement, stage.firstChild);
      scene = new T.Scene(); scene.fog = new T.FogExp2(0x070b1d, 0.0022);
      cam = new T.PerspectiveCamera(50, 1, 1, 5000);
      var dot = glowTex(false), haze = glowTex(true);
      // 먼 별
      (function () { var n = 700, pos = new Float32Array(n * 3); for (var i = 0; i < n; i++) { var r = 900 + Math.random() * 600, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); pos[i*3] = r*Math.sin(ph)*Math.cos(th); pos[i*3+1] = r*Math.sin(ph)*Math.sin(th); pos[i*3+2] = r*Math.cos(ph); }
        var geo = new T.BufferGeometry(); geo.setAttribute("position", new T.BufferAttribute(pos, 3));
        scene.add(new T.Points(geo, new T.PointsMaterial({ color: 0x8b95b8, size: 1.4, sizeAttenuation: false, transparent: true, opacity: .28, depthWrite: false, fog: false }))); })();
      // 직업 특성 점: 커리큘럼 위버 '교육과정 성운'과 같은 점(부드러운 원 · 흰 중심 45% · 불투명도 상한 0.85, 반짝임 없음)
      var n = N.traits.length, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), siz = new Float32Array(n), alp = new Float32Array(n), cc = new T.Color(), gsum = {};
      N.traits.forEach(function (tr, i) { var j = { g: N.jobs[tr[3]].g, p: tr };
        cc.set(gcol[j.g] || "#9CA3AF");
        pos[i*3] = j.p[0] * SC; pos[i*3+1] = j.p[1] * SC; pos[i*3+2] = j.p[2] * SC;
        col[i*3] = cc.r; col[i*3+1] = cc.g; col[i*3+2] = cc.b; siz[i] = 2.4 + Math.random() * 1.6; alp[i] = 0.78;
        var G = gsum[j.g] = gsum[j.g] || [0, 0, 0, 0]; G[0] += j.p[0]; G[1] += j.p[1]; G[2] += j.p[2]; G[3]++;
      });
      var geo = new T.BufferGeometry(); geo.setAttribute("position", new T.BufferAttribute(pos, 3)); geo.setAttribute("color", new T.BufferAttribute(col, 3));
      geo.setAttribute("size", new T.BufferAttribute(siz, 1)); geo.setAttribute("alpha", new T.BufferAttribute(alp, 1));
      var starMat = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uPR: { value: 2 } },
        vertexShader: "uniform float uPR; attribute float size; attribute float alpha; attribute vec3 color; varying vec3 vC; varying float vA; void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = clamp(size * (600.0 / -mv.z), 2.0, 40.0) * uPR; gl_Position = projectionMatrix * mv; }",
        fragmentShader: "varying vec3 vC; varying float vA; void main(){ vec2 uv = gl_PointCoord - vec2(0.5); float d = length(uv) * 2.0; if (d > 1.0) discard; float falloff = pow(max(0.0, 1.0 - d), 2.4); float core = smoothstep(0.3, 0.0, d); vec3 c = mix(vC, vec3(1.0), core * 0.45); gl_FragColor = vec4(c, min(falloff * vA, 0.85)); }" });
      nodePts = new T.Points(geo, starMat);
      scene.add(nodePts);
      // 직업군 안개 + 이름
      Object.keys(gsum).forEach(function (g) { var G = gsum[g]; if (G[3] < 40) return;
        var sp = { position: new T.Vector3(G[0] / G[3] * SC, G[1] / G[3] * SC, G[2] / G[3] * SC) };
        var el = document.createElement("div"); el.className = "e3g"; el.textContent = N.groups[g] || g; el.style.color = gcol[g]; labels.appendChild(el);
        gLabels.push({ el: el, p: sp.position.clone() });
      });
      focusGroup = new T.Group(); scene.add(focusGroup);
      N.stu.forEach(function (s) { var c = s.kind === "love" ? 0xf9a8d4 : s.kind === "well" ? 0xfde047 : 0xfdba74;
        var st = new T.Sprite(new T.SpriteMaterial({ map: dot, color: c, transparent: true, opacity: .9, depthWrite: false, blending: T.AdditiveBlending })); st.position.set(s.p[0] * SC, s.p[1] * SC, s.p[2] * SC); st.scale.set(9, 9, 1); st.material.opacity = .7; scene.add(st); });
      sentStar = new T.Sprite(new T.SpriteMaterial({ map: dot, color: 0xffffff, transparent: true, opacity: .9, depthWrite: false, blending: T.AdditiveBlending })); sentStar.scale.set(18, 18, 1); scene.add(sentStar);
      sentHalo = new T.Sprite(new T.SpriteMaterial({ map: haze, color: 0xffffff, transparent: true, opacity: .18, depthWrite: false, blending: T.AdditiveBlending })); sentHalo.scale.set(90, 90, 1); scene.add(sentHalo);
      var cv = renderer.domElement;
      cv.addEventListener("pointerdown", function (e) { e.stopPropagation(); drag = [e.clientX, e.clientY, yaw, pitch]; idle = performance.now(); cv.setPointerCapture(e.pointerId); });
      cv.addEventListener("pointermove", function (e) { if (!drag) return; yaw = drag[2] - (e.clientX - drag[0]) * 0.006; pitch = Math.max(-1.2, Math.min(1.2, drag[3] + (e.clientY - drag[1]) * 0.005)); });
      cv.addEventListener("pointerup", function () { drag = null; });
      cv.addEventListener("click", function (e) { e.stopPropagation(); });
      cv.addEventListener("wheel", function (e) { e.preventDefault(); e.stopPropagation(); wantDist = Math.max(120, Math.min(600, wantDist * (e.deltaY > 0 ? 1.1 : 0.9))); }, { passive: false });
    }
    var beams = [];
    function pick(i) {
      sel = i; t0 = performance.now();
      [].forEach.call(list.children, function (b, k) { b.classList.toggle("on", k === i); });
      var s = N.stu[i], tops = uniqTop(s);
      if (vec) vec.innerHTML = "";
      top.innerHTML = '<p class="e3h">가장 가까운 직업 ' + K + '개 <small>(숫자 1,024개로 계산한 가까움)</small></p>' + tops.map(function (o, k) { return '<div class="tj"><span>' + (k + 1) + '</span><b>' + esc(o.job) + '<small>' + esc(o.text.length > 26 ? o.text.slice(0, 26) + "…" : o.text) + '</small></b><em>' + o.sim.toFixed(2) + '</em></div>'; }).join("");
      if (!T) return;
      while (focusGroup.children.length) { var c = focusGroup.children.pop(); if (c.geometry) c.geometry.dispose(); }
      hiLabels.forEach(function (h) { h.el.remove(); }); hiLabels = []; beams = [];
      var sp = new T.Vector3(s.p[0] * SC, s.p[1] * SC, s.p[2] * SC);
      sentStar.position.copy(sp); sentHalo.position.copy(sp); want.copy(sp); wantDist = 170;
      var dot = sentStar.material.map;
      tops.forEach(function (o, k) {
        var jp = new T.Vector3(o.p[0] * SC, o.p[1] * SC, o.p[2] * SC), c = new T.Color(gcol[o.g] || "#fde68a");
        var lg = new T.BufferGeometry().setFromPoints([sp, jp]);
        var ln = new T.Line(lg, new T.LineBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending })); focusGroup.add(ln);
        var st = new T.Sprite(new T.SpriteMaterial({ map: dot, color: c, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); st.position.copy(jp); st.scale.set(0.1, 0.1, 1); focusGroup.add(st);
        var pul = new T.Sprite(new T.SpriteMaterial({ map: dot, color: 0xfff7cc, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); pul.scale.set(9, 9, 1); focusGroup.add(pul);
        beams.push({ ln: ln, st: st, pul: pul, a: sp, b: jp, k: k, w: o.sim });
        if (k >= 5) return;
        var el = document.createElement("div"); el.className = "e3j"; el.innerHTML = '<b>' + esc(o.job) + '</b><em>' + o.sim.toFixed(2) + '</em><small>' + esc(o.text.length > 30 ? o.text.slice(0, 30) + "…" : o.text) + '</small>'; labels.appendChild(el);
        hiLabels.push({ el: el, p: jp, k: k });
      });
      var se = document.createElement("div"); se.className = "e3me k-" + s.kind; se.textContent = kindTag(s.kind) + " " + s.t; labels.appendChild(se); hiLabels.push({ el: se, p: sp, k: -1 });
    }
    function place(el, p, W, H, show) {
      var v = p.clone().project(cam); var x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H;
      el.style.transform = "translate(" + x + "px," + y + "px)"; el.style.opacity = show && v.z < 1 ? "" : "0";
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (!T || !box.closest(".pane.on") || !box.closest(".slide.active")) return;
      var W = stage.clientWidth, H = stage.clientHeight; if (!W) return;
      if (renderer.domElement.width !== W * 2) { renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); }
      if (!drag && now - idle > 2500) yaw += 0.0018;
      target.lerp(want, 0.05); dist += (wantDist - dist) * 0.05;
      cam.position.set(target.x + dist * Math.cos(pitch) * Math.sin(yaw), target.y + dist * Math.sin(pitch), target.z + dist * Math.cos(pitch) * Math.cos(yaw)); cam.lookAt(target);
      var tt = (now - t0) / 1000, breathe = 1 + 0.12 * Math.sin(now / 420);
      sentHalo.scale.set(90 * breathe, 90 * breathe, 1);
      beams.forEach(function (bm) {
        var g = Math.max(0, Math.min(1, (tt - 0.5 - Math.min(bm.k, 6) * 0.2) / 0.8)); var fade = bm.k < 5 ? 1 : 0.55;
        bm.ln.material.opacity = g * fade * (0.25 + bm.w * 0.7); var s2 = g * fade * (7 + bm.w * 14); bm.st.scale.set(s2, s2, 1);
        var u = ((now / 1400) + bm.k * 0.27) % 1; bm.pul.position.lerpVectors(bm.a, bm.b, u); bm.pul.material.opacity = g * fade * 0.5 * (1 - Math.abs(u - 0.5) * 1.4);
      });
      renderer.render(scene, cam);
      gLabels.forEach(function (gl) { place(gl.el, gl.p, W, H, true); });
      hiLabels.forEach(function (h) { place(h.el, h.p, W, H, tt > 0.6 + Math.max(0, h.k) * 0.25); });
    }
    pick(0); requestAnimationFrame(frame);
  });
  // 자동으로 넘어가지 않는다. 메뉴를 누르거나 ↑↓ 키로만 바꾼다.
  function restart(id) { var st = menuState[id]; if (st) clearInterval(st.timer); }

  // ---- 크게 보기 ----
  var lb = document.getElementById("lightbox");
  function openLb(src, cap) { lb.querySelector("img").src = src; lb.querySelector("p").textContent = cap || ""; lb.classList.add("show"); }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-lb]");
    if (!t && e.target.tagName === "IMG" && e.target.closest(".slide") && !e.target.classList.contains("mong") && !e.target.closest("a, button, .mi, .role-chip, .ci")) { e.stopPropagation(); openLb(e.target.src, e.target.alt); return; }
    if (!t) return; e.stopPropagation(); openLb(t.dataset.lb, t.dataset.cap);
  }, true);
  lb.addEventListener("click", function (e) { e.stopPropagation(); lb.classList.remove("show"); });

  document.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function (e) { e.stopPropagation(); }); });

  // ---- 무대 크기 ----
  var stage = document.getElementById("stage");
  function fit() { var s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = "translate(-50%,-50%) scale(" + s + ")"; }
  addEventListener("resize", fit); fit();

  // ---- 넘기기 ----
  var slides = [].slice.call(document.querySelectorAll(".slide")), cur = 0, t0 = 0, settle = null;
  var notes = document.getElementById("notes"), count = document.getElementById("count"), bar = document.querySelector("#hud i"), timer = document.getElementById("timer");
  var plan = [], acc = 0; slides.forEach(function (s) { acc += +s.dataset.sec; plan.push(acc); });
  slides.forEach(function (s, i) { if (i > 0 && i < slides.length - 1) { var f = document.createElement("div"); f.className = "foot"; f.innerHTML = '<img src="assets/mong/dugeun.png" alt="">두근두근 당곡 · ' + (i + 1) + ' / ' + slides.length; s.appendChild(f); } });
  function fmt(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ":" + ("0" + t % 60).slice(-2); }
  function show(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle("active", k === i); s.classList.remove("settled"); });
    clearTimeout(settle); var target = slides[i]; settle = setTimeout(function () { target.classList.add("settled"); }, 1600);
    cur = i; count.textContent = (i + 1) + " / " + slides.length; bar.style.width = ((i + 1) / slides.length * 100) + "%";
    notes.innerHTML = "<h4>" + (i + 1) + "장 · 목표 " + slides[i].dataset.sec + "초 · 이 장까지 " + fmt(plan[i]) + "</h4>" + (NOTES[i] || "");
    try { history.replaceState(null, "", "#" + (i + 1)); } catch (e) {}
    if (!t0 && i > 0) t0 = Date.now();
    if (menuState[target.id]) { select(target.id, 0); restart(target.id); }
  }
  // 장 안의 .step 항목은 넘길 때마다 하나씩 나타난다(앞으로 가면 하나 더, 뒤로 가면 하나 숨김).
  function steps(i) { return [].slice.call(slides[i].querySelectorAll(".step")); }
  function go(d) {
    var st = steps(cur);
    if (d > 0) { var next = st.filter(function (x) { return !x.classList.contains("in"); })[0]; if (next) { next.classList.add("in"); return; } }
    if (d < 0) { var shown = st.filter(function (x) { return x.classList.contains("in"); }); if (shown.length) { shown[shown.length - 1].classList.remove("in"); return; } }
    var to = Math.max(0, Math.min(slides.length - 1, cur + d));
    if (to === cur) return;
    steps(to).forEach(function (x) { x.classList.toggle("in", d < 0); });
    show(to);
  }
  document.querySelectorAll("#nav [data-go]").forEach(function (el) { el.addEventListener("click", function () { go(+el.dataset.go); }); });
  addEventListener("message", function (e) { if (e.data && e.data.deckKey) dispatchEvent(new KeyboardEvent("keydown", { key: e.data.deckKey })); });
  addEventListener("keydown", function (e) {
    if (lb.classList.contains("show")) { if (e.key === "Escape" || e.key === " " || e.key === "Enter") lb.classList.remove("show"); return; }
    var k = e.key, st = menuState[slides[cur].id];
    if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter") { e.preventDefault(); go(1); }
    else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") { e.preventDefault(); go(-1); }
    else if ((k === "ArrowDown" || k === "ArrowUp") && st) { e.preventDefault(); select(slides[cur].id, (st.i + (k === "ArrowDown" ? 1 : st.n - 1)) % st.n); restart(slides[cur].id); }
    else if (k === "Home") show(0); else if (k === "End") show(slides.length - 1);
    else if (k === "f" || k === "F") { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); else document.exitFullscreen(); }
    else if (k === "n" || k === "N") notes.classList.toggle("show");
    else if (k === "t" || k === "T") t0 = Date.now();
  });
  var sx = null; addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); sx = null; });
  setInterval(function () { var el = t0 ? (Date.now() - t0) / 1000 : 0; timer.textContent = fmt(el) + " / " + fmt(acc); timer.classList.toggle("over", el > acc); }, 500);
  var start = parseInt((location.hash || "").slice(1), 10); show(isNaN(start) ? 0 : start - 1);
})();
