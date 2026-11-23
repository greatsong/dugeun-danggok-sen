/* 종이에 적고 → 디지털로 옮기는 부품
 * window.PaperDemo.mount(el, {mode: "paper" | "digital", data?})
 * 1450×690 기준으로 그리고 el 크기에 맞춰 줄인다. 장이 보일 때(.pane.on · .slide.active) 처음부터,
 * 끝나면 3초 멈췄다 다시, 누르면 처음부터. 외부 라이브러리 없음.
 * 문장 · %: 모의 학생 '서윤'(자료 이름 모의 학생)의 모의 활동지(demo28/data/pilot.sqlite3 sheets a35ad33a7024)
 * 근거 문장 '학급 일기 담당을 한 학기 맡음'은 시연콘티_1_학생.md 1장의 시연용 모의 문장.
 */
(function () {
  "use strict";
  var W = 1450, H = 690;

  var DATA = {
    name: "서윤",
    love: [
      ["친구 글 맞춤법·어색한 문장 고쳐 주기", "5"],
      ["문학 시간 소설 구절 필사해 보기", "10"],
      ["독서 동아리에서 읽을 책 골라 소개하기", "10"],
      ["학급 신문에 선생님 인터뷰 기사 쓰기", "10"],
      ["동아리 홍보 카드뉴스 만들어 올리기", "15"],
      ["시 낭송하고 감상문 쓰기", "15"],
      ["친구 사이 다툼에 나서서 말리기", "20"],
      ["과학 실험 조원 역할 나누고 일정 챙기기", "20"]
    ],
    lessLove: ["체육 시간 오래 달리기"],
    well: [
      ["친구 글 맞춤법·어색한 문장 고쳐 주기", "5", "친구 자기소개서 3편을 고쳐 줌"],
      ["긴 지문 읽고 세 줄로 요약하기", "5", ""],
      ["영상 자막에서 틀린 맞춤법 찾아내기", "10", ""],
      ["발표 자료 순서·흐름 다시 짜기", "15", ""]
    ],
    lessWell: ["많은 사람 앞에서 즉석 발표하기"],
    /* 네 칸: 두 목록에 다 적은 줄은 '좋아하고 잘하는 일'. 한쪽에만 적은 줄은 활동지 v2 안내
       ("한쪽 목록에만 쓴 것은 다른 쪽을 대강 짐작해서 찍어요")대로 짐작한 자리. */
    quads: [
      ["q1", "좋아하고 잘하는 일", "나를 가장 잘 보여 주는 일이에요.",
        ["친구 글 맞춤법·어색한 문장 고쳐 주기"]],
      ["q4", "좋아하지만 아직 서툰 일", "배워서 키우거나 취미로 이어 갈 수 있어요.",
        ["문학 시간 소설 구절 필사해 보기", "독서 동아리에서 읽을 책 골라 소개하기", "학급 신문에 선생님 인터뷰 기사 쓰기",
          "동아리 홍보 카드뉴스 만들어 올리기", "시 낭송하고 감상문 쓰기", "친구 사이 다툼에 나서서 말리기", "과학 실험 조원 역할 나누고 일정 챙기기"]],
      ["q2", "잘하지만 덜 좋아하는 일", "좋아하는 일을 돕는 힘이 될 수 있어요.",
        ["긴 지문 읽고 세 줄로 요약하기", "영상 자막에서 틀린 맞춤법 찾아내기", "발표 자료 순서·흐름 다시 짜기"]],
      ["q3", "덜 좋아하고 서툰 일", "직업을 고를 때 피하는 쪽으로 계산에 들어가요.",
        ["체육 시간 오래 달리기", "많은 사람 앞에서 즉석 발표하기"]]
    ]
  };
  var SCALE = ["1", "5", "10", "15", "20"];
  var STOP = { stop: true };

  function mk(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function seeded(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  // 손글씨 한 줄: 글자마다 span(처음엔 숨김)
  function hw(text, seed, done) {
    var box = mk("span", "pd-hw" + (done ? " done" : "")), rnd = seeded(seed || 7);
    for (var i = 0; i < text.length; i++) {
      var c = mk("span", "pd-c", text[i]);
      c.style.setProperty("--r", "rotate(" + ((rnd() - 0.5) * 5).toFixed(1) + "deg) translateY(" + ((rnd() - 0.5) * 3).toFixed(1) + "px)");
      box.appendChild(c);
    }
    return box;
  }
  // 손으로 그린 동그라미(살짝 겹쳐 닫힘)
  function ringPath(cx, cy, rx, ry, seed) {
    var rnd = seeded(seed || 3), d = "", n = 44, a0 = -2.5 + rnd() * 0.6, turn = Math.PI * 2 * 1.13;
    for (var i = 0; i <= n; i++) {
      var t = i / n, a = a0 + turn * t, wob = 1 + 0.05 * Math.sin(i * 0.9 + rnd()) + t * 0.07;
      d += (i ? "L" : "M") + (cx + rx * wob * Math.cos(a)).toFixed(1) + "," + (cy + ry * wob * Math.sin(a) - t * 3).toFixed(1);
    }
    return d;
  }
  var PEN = '<svg viewBox="0 0 66 66" width="66" height="66"><g transform="rotate(-38 33 33)">' +
    '<rect x="27" y="-8" width="12" height="52" rx="3" fill="#2f5fb3"/><rect x="27" y="-8" width="12" height="9" rx="3" fill="#1f2430"/>' +
    '<rect x="28.5" y="30" width="9" height="6" fill="#c9d4ea"/><path d="M27 44 L39 44 L33 58 Z" fill="#e9dfc8"/><path d="M31.2 54 L34.8 54 L33 58.5 Z" fill="#22377a"/></g></svg>';

  function mount(host, opts) {
    opts = opts || {};
    var mode = opts.mode === "digital" ? "digital" : "paper";
    var D = opts.data || DATA;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.innerHTML = "";
    var root = mk("div", "pd-root pd-" + mode);
    host.appendChild(root);
    var S = { tok: 0, vis: false, timers: [] };

    function fit() {
      var k = Math.min((host.clientWidth || W) / W, (host.clientHeight || H) / H) || 1;
      root.style.transform = "scale(" + k + ")";
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(host);

    function sleep(ms) {
      var t = S.tok;
      return new Promise(function (res, rej) {
        var id = setTimeout(function () { t === S.tok ? res() : rej(STOP); }, ms);
        S.timers.push(id);
      });
    }
    function rel(el) {
      var r = el.getBoundingClientRect(), R = root.getBoundingClientRect(), k = R.width / W || 1;
      return { x: (r.left - R.left) / k, y: (r.top - R.top) / k, w: r.width / k, h: r.height / k };
    }
    function next() { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); }); }

    // ── 종이 한 면 만들기 ──
    function sheetFace(side, mini, filled) {
      var front = side === "front";
      var face = mk("div", "pd-face " + (front ? "pd-front" : "pd-back"));
      face.style.padding = mini ? "" : "22px 34px";
      var head = mk("div", "pd-head");
      head.appendChild(mk("span", "pd-tag", "활동지 1 · " + (front ? "앞" : "뒤")));
      var ti = mk("span", "pd-title", front ? "좋아하는 것 50" : "잘하는 것 50");
      ti.appendChild(mk("small", null, front ? "Love" : "Well"));
      head.appendChild(ti);
      var refs = { rows: [], less: null, name: null };
      if (!mini) {
        var who = mk("span", "pd-who", "이름 ");
        var fill = mk("span", "pd-fill");
        if (front) { refs.name = hw(D.name, 11, false); fill.appendChild(refs.name); }
        else fill.appendChild(hw(D.name, 11, true));
        who.appendChild(fill);
        head.appendChild(who);
      }
      face.appendChild(head);
      if (!mini) {
        var how = mk("div", "pd-how");
        how.innerHTML = front
          ? "<b>대상보다 장면으로</b> 적어요 · <b>좋아함 %</b> = 우리 반 친구들과 비교해 상위 몇 %일지 동그라미"
          : "<b>해 봤고 잘한다고 느낀 장면</b> · <b>잘함 %</b>에 동그라미 · 근거 장면이 있으면 짧게";
        face.appendChild(how);
      }
      var list = front ? D.love : D.well, nrows = mini ? (front ? Math.max(8, list.length) : Math.max(6, list.length)) : (front ? 8 : 6);
      var cols = mini ? "40px 1fr 86px" : (front ? "56px 1fr 300px" : "56px 1fr 270px 300px");
      var tbl = mk("div", "pd-tbl");
      tbl.style.gridTemplateColumns = cols;
      var rowH = mini ? (front ? 50 : 54) : (front ? 46 : 52);
      var ths = mini ? ["", front ? "좋아하는 장면" : "잘하는 장면", "%"]
        : (front ? ["", "좋아하는 장면", "좋아함 %(상위)"] : ["", "잘하는 장면", "잘함 %(상위)", "근거 장면"]);
      ths.forEach(function (t) { tbl.appendChild(mk("div", "pd-th", t)); });
      for (var i = 0; i < nrows; i++) {
        var it = list[i], row = { cells: [] };
        var n = mk("div", "pd-n", String(i + 1)), t = mk("div", "pd-t");
        n.style.height = rowH + "px";
        if (it) { row.text = hw(it[0], 100 + i * 7 + (front ? 0 : 50), filled); t.appendChild(row.text); }
        tbl.appendChild(n); tbl.appendChild(t); row.t = t;
        var pc;
        if (mini) {
          pc = mk("div", "pd-pc");
          if (it) {
            row.pctText = hw(it[1] + "%", 300 + i, filled);
            pc.appendChild(row.pctText);
            row.pick = row.pctText;
          }
        } else {
          pc = mk("div", "pd-scale");
          SCALE.forEach(function (s) {
            var sp = mk("span", null, s);
            if (it && it[1] === s) { sp.className = "pd-pick"; row.pick = sp; }
            pc.appendChild(sp);
          });
        }
        tbl.appendChild(pc); row.pc = pc;
        if (it) {
          var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("class", "pd-ring");
          var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("pathLength", "1");
          if (filled) p.setAttribute("class", "done");
          svg.appendChild(p); pc.appendChild(svg); row.ring = p;
        }
        if (!front && !mini) {
          var b = mk("div", "pd-b");
          if (it && it[2]) { row.basis = hw(it[2], 500 + i, filled); b.appendChild(row.basis); }
          tbl.appendChild(b);
        }
        if (mini && it) {
          var tick = mk("span", "pd-tick", "✓");
          t.appendChild(tick);
          if (!front && it[2]) {
            // 작은 종이: 근거는 장면 아래 둘째 줄
            t.style.flexDirection = "column"; t.style.alignItems = "flex-start"; t.style.justifyContent = "center";
            row.basis = hw("근거: " + it[2], 520 + i, filled);
            row.basis.style.fontSize = "24px"; row.basis.style.marginTop = "2px"; row.basis.style.color = "#3b4f8f";
            t.appendChild(row.basis);
            n.style.height = "74px";
          }
        }
        refs.rows.push(row);
      }
      face.appendChild(tbl);
      var less = mk("div", "pd-less");
      less.appendChild(mk("b", null, front ? "덜 좋아하는 것" : "아직 서툰 것"));
      var line = mk("div", "pd-line"), lt = (front ? D.lessLove : D.lessWell)[0];
      if (lt) { refs.less = hw(lt, front ? 900 : 950, filled); line.appendChild(refs.less); }
      less.appendChild(line);
      if (mini) { var tk = mk("span", "pd-tick", "✓"); tk.style.right = "6px"; less.style.position = "relative"; less.appendChild(tk); }
      refs.lessBox = less;
      face.appendChild(less);
      if (!mini) face.appendChild(mk("div", "pd-foot", "")).innerHTML = "<span>" + (front ? "최소 50개 · 며칠에 걸쳐 채워도 돼요" : "학기마다 새로 적어요") + "</span><span>디지털로 옮겨 적는 초안</span>";
      face._refs = refs;
      return face;
    }
    function sheet(x, y, w, h, mini, filled) {
      var s = mk("div", "pd-sheet" + (mini ? " pd-mini" : ""));
      s.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px";
      var tilt = mk("div", "pd-tilt"); tilt.style.transform = "rotate(" + (mini ? -1.2 : -0.6) + "deg)";
      var card = mk("div", "pd-card3d");
      var f = sheetFace("front", mini, filled), b = sheetFace("back", mini, filled);
      card.appendChild(f); card.appendChild(b); tilt.appendChild(card); s.appendChild(tilt);
      return { el: s, card: card, front: f._refs, back: b._refs, frontFace: f };
    }
    function drawRing(row, seed, instant) {
      if (!row.ring || !row.pick) return;
      var pc = row.pc, sp = row.pick;
      var cx = sp.offsetLeft + sp.offsetWidth / 2, cy = sp.offsetTop + sp.offsetHeight / 2;
      if (sp.parentNode !== pc) { // 손글씨 % (작은 종이)
        cx = sp.offsetLeft + sp.offsetWidth / 2; cy = pc.offsetHeight / 2;
      }
      var rx = Math.max(19, sp.offsetWidth / 2 + 10), ry = Math.min(pc.offsetHeight / 2 - 4, 18);
      row.ring.setAttribute("d", ringPath(cx, cy, rx, ry, seed));
      if (instant) row.ring.setAttribute("class", "done");
    }

    // ── 펜 ──
    var pen;
    function penTo(x, y) { pen.style.transform = "translate(" + (x - 3) + "px," + (y - 62) + "px)"; }
    function penAt(el, end) {
      var r = rel(el);
      penTo(end ? r.x + r.w : r.x, r.y + r.h * 0.8);
    }
    async function write(box, ms) {
      var cs = box.children;
      for (var i = 0; i < cs.length; i++) {
        cs[i].classList.add("on");
        penAt(cs[i], true);
        await sleep(cs[i].textContent === " " ? ms * 0.4 : ms);
      }
    }
    async function circle(row, seed) {
      if (!row.ring) return;
      drawRing(row, seed);
      var r = rel(row.pick);
      penTo(r.x + r.w / 2 + 20, r.y + r.h * 0.2);
      await next();
      row.ring.setAttribute("class", "on");
      row.pick.classList.add("pd-picked");
      // 펜이 동그라미를 따라 한 바퀴
      for (var k = 0; k <= 6; k++) {
        var a = -2.3 + (k / 6) * Math.PI * 2.1;
        penTo(r.x + r.w / 2 + Math.cos(a) * (r.w / 2 + 12), r.y + r.h / 2 + Math.sin(a) * 18 + 8);
        await sleep(62);
      }
    }

    // ── 옆 안내 ──
    function side(x, y, w, steps) {
      var s = mk("div", "pd-side"); s.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px";
      s.appendChild(mk("span", "pd-mock", "모의 학생 · " + D.name));
      var st = steps.map(function (t, i) {
        var d = mk("div", "pd-step"); d.appendChild(mk("i", null, String(i + 1))); d.appendChild(mk("span", null, t)); s.appendChild(d); return d;
      });
      var cnt = mk("div", "pd-count"); s.appendChild(cnt);
      var fast = mk("span", "pd-fast", "빠르게 ×4"); s.appendChild(fast);
      root.appendChild(s);
      return {
        el: s, cnt: cnt, fast: fast,
        step: function (i) { st.forEach(function (d, k) { d.className = "pd-step" + (k === i ? " on" : k < i ? " done" : ""); }); }
      };
    }

    // ════════ 종이 모드 ════════
    async function runPaper() {
      var sh = sheet(26, 10, 1120, 670, false, false);
      root.appendChild(sh.el);
      pen = mk("div", "pd-pen"); pen.innerHTML = PEN; root.appendChild(pen);
      var sd = side(1186, 26, 250, ["앞면 · 좋아하는 것", "뒷면 · 잘하는 것"]);
      sd.step(0);
      var total = 0;
      function count(kind) { total++; sd.cnt.innerHTML = kind + " <b>" + total + "</b>줄 적음"; }
      sd.cnt.innerHTML = "좋아하는 장면 <b>0</b>줄 적음";
      await sleep(350);
      penAt(sh.front.name.children[0], false);
      await sleep(250);
      pen.classList.add("on");
      await sleep(300);
      await write(sh.front.name, 110);
      await sleep(350);
      var rows = sh.front.rows;
      for (var i = 0; i < rows.length; i++) {
        if (!rows[i].text) continue;
        penAt(rows[i].text.children[0], false);
        await sleep(170);
        await write(rows[i].text, 62);
        await sleep(160);
        await circle(rows[i], 40 + i);
        count("좋아하는 장면");
        await sleep(200);
      }
      if (sh.front.less) {
        penAt(sh.front.less.children[0], false); await sleep(200);
        await write(sh.front.less, 60); await sleep(300);
      }
      pen.classList.remove("on");
      await sleep(700);
      sh.card.classList.add("pd-flipped", "pd-lift");
      sd.step(1);
      total = 0; sd.cnt.innerHTML = "잘하는 장면 <b>0</b>줄 적음";
      await sleep(1500);
      pen.classList.add("on");
      var br = sh.back.rows;
      for (var j = 0; j < br.length; j++) {
        if (!br[j].text) continue;
        penAt(br[j].text.children[0], false);
        await sleep(170);
        await write(br[j].text, 62);
        await sleep(160);
        await circle(br[j], 70 + j);
        if (br[j].basis) {
          penAt(br[j].basis.children[0], false); await sleep(200);
          await write(br[j].basis, 58);
        }
        count("잘하는 장면");
        await sleep(220);
      }
      if (sh.back.less) {
        penAt(sh.back.less.children[0], false); await sleep(200);
        await write(sh.back.less, 60); await sleep(300);
      }
      pen.classList.remove("on");
      sd.step(2);
    }

    // ════════ 디지털 모드 ════════
    function phone(x, y) {
      var p = mk("div", "pd-phone"); p.style.left = x + "px"; p.style.top = y + "px";
      p.appendChild(mk("div", "pd-notch"));
      var top = mk("div", "pd-ptop"); top.innerHTML = "<div><em>★</em> 두근두근 탐험대</div><span>" + D.name + " (모의)</span>"; p.appendChild(top);
      p.appendChild(mk("div", "pd-ptitle", "나의 활동지 옮겨 적기"));
      var tabs = mk("div", "pd-tabs"), names = ["좋아하는 일", "잘하는 일", "덜 좋아하는 일", "아직 서툰 일"], tabEls = [], counts = [0, 0, 0, 0];
      names.forEach(function (n, i) {
        var t = mk("div", "pd-tab" + (i === 0 ? " on" : "")); t.appendChild(document.createTextNode(n));
        var c = mk("span", null, "0개"); t.appendChild(c); tabs.appendChild(t); tabEls.push({ el: t, c: c });
      });
      p.appendChild(tabs);
      var card = mk("div", "pd-card");
      var inp = mk("div", "pd-inp"), basis = mk("div", "pd-inp hide");
      var chips = mk("div", "pd-chips"), chipEls = {};
      ["1", "5", "10", "15", "20", "모름"].forEach(function (s) {
        var c = mk("span", "pd-chip", s === "모름" ? s : s + "%"); chips.appendChild(c); chipEls[s] = c;
      });
      var add = mk("span", "pd-add", "+ 한 줄 더하기");
      card.appendChild(inp); card.appendChild(chips); card.appendChild(basis); card.appendChild(add);
      p.appendChild(card);
      var list = mk("div", "pd-list"); p.appendChild(list);
      var save = mk("div", "pd-save"), st = mk("span", null, "아직 저장 전"), btn = mk("button", null, "저장하기");
      btn.type = "button"; save.appendChild(st); save.appendChild(btn); p.appendChild(save);
      var toast = mk("div", "pd-toast"); toast.innerHTML = "<b>✓</b>저장했어요."; p.appendChild(toast);
      root.appendChild(p);
      var PH = ["좋아하는 장면 한 줄", "잘하는 장면 한 줄", "덜 좋아하는 장면", "아직 서툰 장면"];
      var api = {
        el: p, inp: inp, list: list, btn: btn, st: st, toast: toast, tab: 0, items: [],
        setInp: function (box, text, cursor, ph) {
          box.innerHTML = "";
          if (text) box.appendChild(document.createTextNode(text)); else box.appendChild(mk("span", "ph", ph));
          if (cursor) box.appendChild(mk("span", "cur"));
        },
        tabTo: function (i) {
          api.tab = i;
          tabEls.forEach(function (t, k) { t.el.classList.toggle("on", k === i); });
          chips.classList.toggle("hide", i > 1);
          basis.classList.toggle("hide", i !== 1);
          list.innerHTML = "";
          api.setInp(inp, "", false, PH[i]);
          api.setInp(basis, "", false, "근거(있으면)");
        },
        type: async function (box, text, ms) {
          box.classList.add("focus");
          if (!ms) { api.setInp(box, text, true); return; }
          for (var i = 1; i <= text.length; i++) { api.setInp(box, text.slice(0, i), true); await sleep(text[i - 1] === " " ? ms * 0.5 : ms); }
        },
        chip: function (v) { Object.keys(chipEls).forEach(function (k) { chipEls[k].classList.toggle("on", k === v); }); },
        commit: async function (text, pct) {
          add.classList.add("press"); await sleep(140); add.classList.remove("press");
          var li = mk("div", "pd-li"); li.appendChild(mk("span", "tx", text));
          if (pct) li.appendChild(mk("span", "pc", pct + "%"));
          list.appendChild(li);
          while (list.children.length > 1 && list.scrollHeight > list.clientHeight + 1) list.removeChild(list.firstChild);
          api.items.push(text);
          counts[api.tab]++; tabEls[api.tab].c.textContent = counts[api.tab] + "개";
          tabEls[api.tab].el.classList.remove("bump"); void tabEls[api.tab].el.offsetWidth; tabEls[api.tab].el.classList.add("bump");
          inp.classList.remove("focus"); basis.classList.remove("focus");
          api.setInp(inp, "", false, PH[api.tab]); api.setInp(basis, "", false, "근거(있으면)");
          api.chip(null);
        }
      };
      api.tabTo(0);
      return api;
    }
    // 글 하나를 from → to로 날린다(가로 · 세로 따로 움직여 곡선)
    async function fly(from, to, node, ms, fadeEnd) {
      var fx = mk("div", "pd-flyx"), fy = mk("div", "pd-flyy");
      fy.appendChild(node); fx.appendChild(fy); root.appendChild(fx);
      fx.style.transitionDuration = ms + "ms"; fy.style.transitionDuration = ms + "ms";
      fx.style.transform = "translateX(" + from.x + "px)"; fy.style.transform = "translateY(" + from.y + "px)";
      await next();
      var r = fy.getBoundingClientRect(), R = root.getBoundingClientRect(), k = R.width / W || 1, w = r.width / k, h = r.height / k;
      var tx = to.cx != null ? to.cx - w / 2 : to.x, ty = to.cy != null ? to.cy - h / 2 : to.y;
      fx.style.transform = "translateX(" + tx + "px)";
      fy.style.transform = "translateY(" + ty + "px)" + (to.scale ? " scale(" + to.scale + ")" : "");
      await sleep(ms);
      if (fadeEnd) { fy.style.opacity = "0"; await sleep(140); }
      fx.remove();
    }

    async function runDigital() {
      var mini = sheet(16, 22, 522, 640, true, true);
      root.appendChild(mini.el);
      mini.front.rows.concat(mini.back.rows).forEach(function (r, k) { drawRing(r, 200 + k, true); });
      var ph = phone(578, 10);
      var sd = side(1018, 24, 420, ["종이에 쓴 줄 옮겨 적기", "저장하기", "네 칸으로 정리"]);
      sd.step(0);
      var total = D.love.length + D.lessLove.length + D.well.length + D.lessWell.length, moved = 0;
      function cnt() { sd.cnt.innerHTML = "옮긴 줄 <b>" + moved + "</b> / " + total; }
      cnt();
      // 네 칸 판(처음엔 숨김, 자리만 잡아 둠)
      var board = mk("div", "pd-board"), bh = mk("div", "pd-bhead");
      bh.innerHTML = "<b>나를 발견하기</b><span>좋아함 × 잘함 — 옮겨 적은 줄을 네 칸으로 정리</span>";
      board.appendChild(bh);
      var grid = mk("div", "pd-grid"), slots = {};
      D.quads.forEach(function (q) {
        var box = mk("section", "pd-q pd-" + q[0]), h4 = mk("h4", null, q[1]), c = mk("span", null, "0개");
        h4.appendChild(c); box.appendChild(h4); box.appendChild(mk("p", null, q[2]));
        var pills = mk("div", "pd-pills");
        q[3].forEach(function (t) { var pl = mk("span", "pd-pill", t); pills.appendChild(pl); slots[t] = { el: pl, c: c, q: q }; });
        box.appendChild(pills); grid.appendChild(box);
      });
      board.appendChild(grid); root.appendChild(board);

      await sleep(700);
      async function move(srcRow, text, pct, basisText, slow, tab, srcBasis) {
        if (ph.tab !== tab) { ph.tabTo(tab); await sleep(slow ? 450 : 250); }
        var holder = srcRow.t || srcRow;
        holder.classList.add("pd-row-hi");
        await sleep(slow ? 350 : 120);
        var from = rel(srcRow.text || srcRow), to = rel(ph.inp);
        var node = mk("span"); node.appendChild(hw(text, 1, true));
        await fly({ x: from.x - 12, y: from.y - 6 }, { x: to.x + 4, y: to.y + 2, scale: 0.86 }, node, slow ? 750 : 420, true);
        holder.classList.remove("pd-row-hi");
        await ph.type(ph.inp, text, slow ? 30 : 0);
        await sleep(slow ? 250 : 60);
        if (pct) { ph.chip(pct); await sleep(slow ? 420 : 150); }
        if (basisText) {
          if (srcBasis) {
            var fb = rel(srcBasis), tb = rel(ph.inp.parentNode.children[2]);
            var nb = mk("span"); nb.appendChild(hw(basisText, 2, true));
            await fly({ x: fb.x - 12, y: fb.y - 6 }, { x: tb.x + 4, y: tb.y + 2, scale: 0.86 }, nb, slow ? 650 : 400, true);
          }
          await ph.type(ph.inp.parentNode.children[2], basisText, slow ? 34 : 0);
          await sleep(slow ? 300 : 80);
        }
        await ph.commit(text, pct);
        (srcRow.t ? srcRow.t : holder.parentNode).classList.add("pd-moved");
        moved++; cnt();
        await sleep(slow ? 450 : 160);
      }
      var fr = mini.front.rows;
      for (var i = 0; i < D.love.length; i++) {
        var slow = i < 3;
        if (i === 3) sd.fast.classList.add("on");
        await move(fr[i], D.love[i][0], D.love[i][1], "", slow, 0);
      }
      if (D.lessLove[0]) await move({ text: mini.front.less, t: mini.front.lessBox }, D.lessLove[0], null, "", false, 2);
      sd.fast.classList.remove("on");
      await sleep(400);
      mini.card.classList.add("pd-flipped", "pd-lift");
      await sleep(1400);
      var wr = mini.back.rows;
      for (var j = 0; j < D.well.length; j++) {
        if (j === 1) sd.fast.classList.add("on");
        await move(wr[j], D.well[j][0], D.well[j][1], D.well[j][2], j === 0, 1, wr[j].basis);
      }
      if (D.lessWell[0]) await move({ text: mini.back.less, t: mini.back.lessBox }, D.lessWell[0], null, "", false, 3);
      sd.fast.classList.remove("on");
      // 저장하기
      sd.step(1);
      await sleep(600);
      ph.btn.classList.add("press"); await sleep(220); ph.btn.classList.remove("press");
      ph.toast.classList.add("on"); ph.st.textContent = "저장했어요";
      await sleep(1500);
      // 네 칸으로
      sd.step(2);
      var src = rel(ph.list);
      mini.el.style.transition = "opacity .5s, transform .5s"; mini.el.style.opacity = "0"; mini.el.style.transform = "translateX(-40px)";
      sd.el.style.transition = "opacity .5s"; sd.el.style.opacity = "0";
      ph.el.style.transform = "scale(.9)"; ph.el.style.opacity = "0.0";
      board.classList.add("on");
      await sleep(450);
      var order = [];
      D.quads.forEach(function (q) { q[3].forEach(function (t) { order.push(t); }); });
      // 휴대폰에 적은 순서대로 내보낸다
      var seen = {}, seq = [];
      ph.items.concat(order).forEach(function (t) { if (slots[t] && !seen[t]) { seen[t] = 1; seq.push(t); } });
      var flights = seq.map(function (t, k) {
        return (async function () {
          await sleep(k * 170);
          var sl = slots[t], to = rel(sl.el);
          var pill = mk("span", "pd-pill", t);
          pill.style.borderColor = "#f2cf55"; pill.style.background = "#fff8cf";
          await fly({ x: src.x + src.w / 2 - 150, y: src.y + src.h * 0.5 }, { x: to.x, y: to.y }, pill, 700, false);
          sl.el.classList.add("on");
          var n = parseInt(sl.c.textContent, 10) + 1; sl.c.textContent = n + "개";
        })();
      });
      await Promise.all(flights);
    }

    async function run() {
      root.innerHTML = "";
      if (mode === "paper") await runPaper(); else await runDigital();
      await sleep(3000);
      start();
    }
    function stop() {
      S.tok++;
      S.timers.forEach(clearTimeout); S.timers = [];
    }
    function start() {
      stop();
      run().catch(function (e) { if (e !== STOP) console.error(e); });
    }
    function visible() {
      var pane = host.closest(".pane"), slide = host.closest(".slide");
      return (!pane || pane.classList.contains("on")) && (!slide || slide.classList.contains("active")) && host.getClientRects().length > 0;
    }
    var poll = setInterval(function () {
      var v = visible();
      if (v && !S.vis) { S.vis = true; fit(); start(); }
      else if (!v && S.vis) { S.vis = false; stop(); }
    }, 150);
    root.addEventListener("click", function () { if (S.vis) start(); });
    var ctl = {
      restart: start,
      destroy: function () { clearInterval(poll); stop(); host.innerHTML = ""; }
    };
    // 글꼴이 늦게 오면 자리를 잘못 재므로, 손글씨 글꼴을 먼저 불러 본다(없어도 진행)
    if (document.fonts && document.fonts.load) {
      S.vis = true; // 첫 시작은 글꼴 뒤로
      Promise.race([
        Promise.all([document.fonts.load('38px "Nanum Pen Script"', "가나"), document.fonts.load('800 20px "Pretendard"', "가")]),
        new Promise(function (r) { setTimeout(r, 1500); })
      ]).then(function () { S.vis = false; });
    }
    return ctl;
  }

  window.PaperDemo = { mount: mount, data: DATA };
})();
