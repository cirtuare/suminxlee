/* ============================================================
   TRID landing — interactions
   Vanilla JS. Nav state · scroll reveals · hero emotion widget
   · Up Next swipe deck · interactive interests graph.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav solid-on-scroll ---------- */
  const nav = $("#nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.style.background = "rgba(8,8,10,0.86)";
    else nav.style.background = "";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- scroll reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal:not(.in)").forEach((el) => io.observe(el));

  /* ============================================================
     HERO emotion widget
     ============================================================ */
  const scan = $("#heroScan");
  const recent = $("#heroRecent");
  const cap = $("#emoCap");
  const topInterest = $("#heroTopInterest");

  const EMO_TOPIC = {
    "😍": { topic: "SANA-WM 월드 모델링 연구", boost: "World Model" },
    "🔥": { topic: "서울대 UX 연구실 소개", boost: "UX 연구" },
    "🤔": { topic: "공과대학 SUMMER SCHOOL 교육 프로그램 모집", boost: "디자인시스템" },
    "😫": { topic: "Diffusion Transformer 기술적 깊이", boost: null },
    "👎": { topic: "교차모달 정서 불일치 감지 (CADD)", boost: null },
  };
  const capDefault = cap ? cap.innerHTML : "";
  let capTimer = null;

  function fireEmotion(emo, label) {
    if (!scan) return;
    // scan sweep
    scan.classList.add("on", "run");
    if (!reduce) {
      setTimeout(() => scan.classList.remove("run", "on"), 1000);
    } else {
      scan.classList.remove("run", "on");
    }
    const info = EMO_TOPIC[emo] || { topic: "New capture", boost: null };
    const negative = emo === "😫" || emo === "👎";

    // caption feedback
    if (cap) {
      cap.innerHTML = negative
        ? `${emo} <b>logged as a negative signal</b> — kept out of interests`
        : `${emo} <b>${info.topic}</b> — added to your interests`;
      clearTimeout(capTimer);
      capTimer = setTimeout(() => { cap.innerHTML = capDefault; }, 3200);
    }

    // add fresh recent row (positive lands in interests/recent; negative still logs to recent)
    if (recent) {
      const row = document.createElement("div");
      row.className = "mrow fresh";
      row.innerHTML = `<span class="em">${emo}</span><span class="t">${info.topic}</span><span class="lk">↗</span>`;
      recent.insertBefore(row, recent.firstChild);
      while (recent.children.length > 4) recent.removeChild(recent.lastChild);
    }
    // bump top interest label for positive boosts
    if (topInterest && info.boost) topInterest.textContent = info.boost;
  }

  $$(".emo").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.add("ping");
      setTimeout(() => btn.classList.remove("ping"), 500);
      fireEmotion(btn.dataset.emo, btn.dataset.label);
    });
  });

  // gentle auto-demo once when hero is first seen
  let demoed = false;
  const heroIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !demoed && !reduce) {
        demoed = true;
        setTimeout(() => {
          const b = $('.emo[data-emo="🔥"]');
          if (b && window.scrollY < 200) { b.classList.add("ping"); setTimeout(() => b.classList.remove("ping"), 500); fireEmotion("🔥"); }
        }, 1600);
      }
    });
  }, { threshold: 0.5 });
  if ($("#heroWidget")) heroIO.observe($("#heroWidget"));

  /* ============================================================
     UP NEXT — swipe deck
     ============================================================ */
  const QUEUE = [
    { kind: "PAPER", src: "arxiv.org", title: "SANA: Efficient High-Resolution Image Synthesis with Linear Diffusion Transformers", desc: "NVIDIA의 SANA 원본 논문으로, Deep Compression Autoencoder와 Linear Attention을 활용해 4K 이미지를 효율적으로 생성하는 Diffusion Transformer 아키텍처를 제안합니다.", tags: ["SANA", "Diffusion Transformer", "NVIDIA"] },
    { kind: "CODE", src: "github.com/NVlabs", title: "NVlabs/Sana — Official Repository", desc: "SANA 논문의 공식 구현 저장소. 추론 코드와 사전학습 가중치를 제공해 SANA-WM 월드 모델 연구의 출발점으로 삼기 좋습니다.", tags: ["GitHub", "오픈소스", "SANA"] },
    { kind: "PAPER", src: "arxiv.org", title: "SANA-WM: World Modeling with Diffusion Transformers", desc: "Diffusion Transformer 기반의 효율적인 월드 모델 연구. 영상 생성과 상호작용 가능한 환경 시뮬레이션을 다룹니다.", tags: ["SANA-WM", "World Model", "Video Generation"] },
    { kind: "REPO", src: "github.com/VoltAgent", title: "awesome-design-md", desc: "DESIGN.md 형식의 디자인 시스템 문서 모음. 마크다운 기반으로 디자인 개념을 텍스트로 구조화하는 패턴을 정리합니다.", tags: ["design-md", "디자인시스템", "VoltAgent"] },
    { kind: "LAB", src: "snu.ac.kr", title: "서울대 UX 연구실 — 인지적 인터페이스", desc: "인지적 인터페이스와 UX 연구방법론을 다루는 서울대학교 연구실 소개. 사용자 경험 연구의 교차점을 탐색합니다.", tags: ["UX 연구", "서울대학교", "인지적 인터페이스"] },
    { kind: "BOOK", src: "designbooks", title: "The Design of Everyday Things", desc: "사용자 중심 디자인의 고전. 인지적 인터페이스와 UX 연구의 기초를 다지는 데 도움이 됩니다.", tags: ["UX 연구", "사용자 경험"] },
  ];

  const deck = $("#deck");
  const deckBar = $("#deckBar");
  const deckNum = $("#deckNum");
  const tallyKeep = $("#tallyKeep");
  const tallyLater = $("#tallyLater");
  let idx = 0, keepN = 0, laterN = 0;
  const TOTAL = QUEUE.length;

  function setProgress() {
    const done = idx;
    if (deckBar) deckBar.style.width = (done / TOTAL * 100) + "%";
    if (deckNum) deckNum.textContent = done + " / " + TOTAL;
  }

  function cardHTML(item) {
    return `
      <span class="kind">${item.kind}</span>
      <h3>${item.title}</h3>
      <p class="src">${item.src}</p>
      <p class="desc">${item.desc}</p>
      <div class="tags">${item.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <div class="verdict keep">😍 KEEP</div>
      <div class="verdict pass">👎 PASS</div>
      <div class="verdict later">🤔 LATER</div>`;
  }

  function renderDeck() {
    if (!deck) return;
    deck.innerHTML = "";
    if (idx >= TOTAL) {
      const empty = document.createElement("div");
      empty.className = "deck-empty";
      empty.innerHTML = `<div class="big">🎉</div><div class="t">All caught up</div><div class="s">Kept ${keepN} · Later ${laterN} — sorted into your collections.</div><button class="btn btn-primary" id="deckRestart">Review again</button>`;
      deck.appendChild(empty);
      $("#deckRestart").addEventListener("click", restart);
      setProgress();
      return;
    }
    // render up to 3 stacked cards (back to front)
    const max = Math.min(3, TOTAL - idx);
    for (let i = max - 1; i >= 0; i--) {
      const item = QUEUE[idx + i];
      const card = document.createElement("div");
      card.className = "scard" + (i === 0 ? " top" : "");
      const scale = 1 - i * 0.04;
      const ty = i * 14;
      card.style.transform = `translateY(${ty}px) scale(${scale})`;
      card.style.zIndex = String(10 - i);
      card.style.opacity = i === 2 ? "0.6" : "1";
      card.innerHTML = cardHTML(item);
      deck.appendChild(card);
    }
    bindTop();
    setProgress();
  }

  function restart() { idx = 0; keepN = 0; laterN = 0; if (tallyKeep) tallyKeep.textContent = "0"; if (tallyLater) tallyLater.textContent = "0"; renderDeck(); }

  let drag = null;
  function bindTop() {
    const top = $(".scard.top", deck);
    if (!top) return;
    const onDown = (e) => {
      drag = { startX: e.clientX, startY: e.clientY, x: 0, y: 0, el: top };
      top.classList.add("grab");
      top.style.transition = "none";
      top.setPointerCapture && top.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!drag) return;
      drag.x = e.clientX - drag.startX;
      drag.y = e.clientY - drag.startY;
      const rot = drag.x / 18;
      top.style.transform = `translate(${drag.x}px, ${drag.y}px) rotate(${rot}deg)`;
      const kp = Math.max(0, Math.min(1, drag.x / 120));
      const ps = Math.max(0, Math.min(1, -drag.x / 120));
      const lt = Math.max(0, Math.min(1, -drag.y / 120));
      const upDominant = -drag.y > Math.abs(drag.x);
      $(".verdict.keep", top).style.opacity = upDominant ? 0 : kp;
      $(".verdict.pass", top).style.opacity = upDominant ? 0 : ps;
      $(".verdict.later", top).style.opacity = upDominant ? lt : 0;
    };
    const onUp = () => {
      if (!drag) return;
      const dx = drag.x, dy = drag.y;
      top.classList.remove("grab");
      const upDominant = -dy > Math.abs(dx) && -dy > 90;
      if (upDominant) commit("later");
      else if (dx > 110) commit("keep");
      else if (dx < -110) commit("pass");
      else {
        top.style.transition = "transform .3s cubic-bezier(.2,.7,.2,1)";
        top.style.transform = "translateY(0) scale(1)";
        $$(".verdict", top).forEach((v) => v.style.opacity = 0);
      }
      drag = null;
    };
    top.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function commit(verdict) {
    const top = $(".scard.top", deck);
    if (!top) return;
    top.style.transition = "transform .42s cubic-bezier(.4,0,.2,1), opacity .42s ease";
    let tx = 0, ty = 0, rot = 0;
    if (verdict === "keep") { tx = 600; rot = 22; keepN++; if (tallyKeep) bump(tallyKeep, keepN); }
    else if (verdict === "pass") { tx = -600; rot = -22; }
    else { ty = -640; laterN++; if (tallyLater) bump(tallyLater, laterN); }
    top.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
    top.style.opacity = "0";
    const fade = reduce ? 0 : 300;
    setTimeout(() => { idx++; renderDeck(); }, fade);
  }

  function bump(el, n) {
    el.textContent = String(n);
    el.style.transition = "none"; el.style.transform = "scale(1.4)";
    requestAnimationFrame(() => { el.style.transition = "transform .3s cubic-bezier(.2,.7,.2,1)"; el.style.transform = "scale(1)"; });
  }

  // keyboard support when deck in view
  let deckActive = false;
  if (deck) {
    new IntersectionObserver((es) => es.forEach((e) => deckActive = e.isIntersecting), { threshold: 0.4 }).observe(deck);
    window.addEventListener("keydown", (e) => {
      if (!deckActive || idx >= TOTAL) return;
      if (e.key === "ArrowRight") { e.preventDefault(); commit("keep"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); commit("pass"); }
      else if (e.key === "ArrowUp") { e.preventDefault(); commit("later"); }
    });
  }
  renderDeck();

  /* ============================================================
     INTERESTS graph
     ============================================================ */
  const POS = [
    { name: "SANA-WM", weight: 0.95, tags: ["World Model", "Video Generation", "NVIDIA"] },
    { name: "Diffusion Transformer", weight: 0.84, tags: ["SANA", "Video Generation", "NVIDIA"] },
    { name: "NVIDIA", weight: 0.8, tags: ["SANA-WM", "오픈소스", "GitHub"] },
    { name: "World Model", weight: 0.78, tags: ["SANA-WM", "인지적 인터페이스", "Video Generation"] },
    { name: "GitHub · design-md", weight: 0.62, tags: ["VoltAgent", "디자인시스템", "오픈소스"] },
    { name: "UX 연구 · 서울대", weight: 0.5, tags: ["인지적 인터페이스", "사용자 경험", "서울대학교"] },
  ];
  const NEG = [
    { name: "Cross-Modal Affective Dissonance", weight: 0.66, tags: ["감정 인식", "DACM", "멀티모달 학습"] },
    { name: "Reflective Journaling", weight: 0.46, tags: ["감정 인식", "저널링"] },
  ];

  const graphEl = $("#graph");
  const graphDetail = $("#graphDetail");
  const graphSeg = $("#graphSeg");
  let gMode = "pos", gSel = null;

  function gColors(pos) {
    return pos
      ? { accent: "#3DCCC7", ink: "var(--mint-ink)", soft: "var(--mint-soft)", ring: "rgba(61,204,199,.35)" }
      : { accent: "#ff5b62", ink: "#d23c41", soft: "rgba(255,91,98,0.12)", ring: "rgba(255,91,98,.30)" };
  }

  function build(clusters, W, H) {
    const cx = W / 2, cy = H / 2;
    const N = clusters.length;
    const Rx = W * 0.30, Ry = H * 0.32;
    const start = N === 2 ? 0 : -Math.PI / 2;
    return clusters.map((c, i) => {
      const ang = start + i * (2 * Math.PI / N);
      const hx = cx + Rx * Math.cos(ang);
      const hy = cy + Ry * Math.sin(ang);
      const hr = 19 + c.weight * 22;
      const tags = c.tags.slice(0, 3);
      const leaves = tags.map((t, j) => {
        const a = ang + (j - (tags.length - 1) / 2) * 0.8;
        const dist = hr + 34;
        return { label: t, x: hx + dist * Math.cos(a), y: hy + dist * Math.sin(a) };
      });
      return Object.assign({}, c, { hx, hy, hr, leaves });
    });
  }

  function renderGraph() {
    if (!graphEl) return;
    const pos = gMode === "pos";
    const data = pos ? POS : NEG;
    const W = Math.min(graphEl.parentElement.clientWidth, 880);
    const H = Math.round(W * 0.5);
    graphEl.style.width = W + "px";
    graphEl.style.height = H + "px";
    graphEl.style.setProperty("--ring", gColors(pos).ring);
    const cx = W / 2, cy = H / 2;
    const c = gColors(pos);
    const nodes = build(data, W, H);

    let svg = `<svg class="edges" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
    nodes.forEach((n) => {
      const dim = gSel && gSel !== n.name;
      svg += `<line x1="${cx}" y1="${cy}" x2="${n.hx}" y2="${n.hy}" stroke="${c.accent}" stroke-width="${1 + n.weight * 2.4}" opacity="${dim ? 0.08 : 0.4}"/>`;
      n.leaves.forEach((l) => {
        svg += `<line x1="${n.hx}" y1="${n.hy}" x2="${l.x}" y2="${l.y}" stroke="${c.accent}" stroke-width="1.2" opacity="${dim ? 0.05 : 0.22}"/>`;
      });
    });
    svg += "</svg>";

    let html = svg;
    // center
    html += `<div class="gnode" style="left:${cx}px;top:${cy}px;cursor:default">
      <div class="gdot" style="width:46px;height:46px;background:${c.soft};border:1.5px solid ${c.accent}">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="4" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="8" cy="4" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="12" cy="4" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="4" cy="8" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="8" cy="8" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="12" cy="8" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="4" cy="12" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="8" cy="12" r="1.3" stroke="${c.accent}" stroke-width="1.2"/><circle cx="12" cy="12" r="1.3" stroke="${c.accent}" stroke-width="1.2"/></svg>
      </div>
      <span class="glabel" style="font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--ink-50)">${pos ? "Boosted" : "Suppressed"}</span>
    </div>`;
    nodes.forEach((n) => {
      const dim = gSel && gSel !== n.name;
      n.leaves.forEach((l) => {
        html += `<div class="gnode leaf${dim ? " dim" : ""}" style="left:${l.x}px;top:${l.y}px">
          <div class="gdot" style="width:13px;height:13px;background:#fff;border:1.5px solid ${c.accent}"></div>
          <span class="glabel" style="color:var(--ink-70)">${l.label}</span></div>`;
      });
      html += `<div class="gnode${gSel === n.name ? " sel" : ""}${dim ? " dim" : ""}" data-name="${n.name}" style="left:${n.hx}px;top:${n.hy}px">
        <div class="gdot" style="width:${n.hr * 2}px;height:${n.hr * 2}px;background:${c.soft};border:1.5px solid ${c.accent}"></div>
        <span class="glabel" style="color:${c.ink}">${n.name}</span></div>`;
    });
    graphEl.innerHTML = html;
    $$(".gnode[data-name]", graphEl).forEach((el) => {
      el.addEventListener("click", () => { gSel = gSel === el.dataset.name ? null : el.dataset.name; renderGraph(); renderDetail(); });
    });
    renderDetail();
  }

  function renderDetail() {
    if (!graphDetail) return;
    const pos = gMode === "pos";
    const data = pos ? POS : NEG;
    const c = gColors(pos);
    const sel = gSel ? data.find((x) => x.name === gSel) : null;
    if (sel) {
      graphDetail.innerHTML = `<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <h3 style="font-size:17px;font-weight:700;letter-spacing:-.3px;margin:0;color:${c.ink}">${sel.name}</h3>
        <span class="meta">${Math.round(sel.weight * (pos ? 6 : 4))} captures · ${pos ? "boosts Up Next" : "pushed out of Up Next"}</span>
      </div>
      <div class="gd-tags">${sel.tags.map((t) => `<span style="color:${c.ink};background:${c.soft}">${t}</span>`).join("")}</div>`;
    } else {
      graphDetail.innerHTML = `<p class="meta" style="text-align:center">Tap a node to expand the topics that appear alongside it${pos ? "" : " — these get pushed out of your recommendations"}.</p>`;
    }
  }

  if (graphSeg) {
    $$("button", graphSeg).forEach((b) => {
      b.addEventListener("click", () => {
        gMode = b.dataset.mode; gSel = null;
        $$("button", graphSeg).forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        renderGraph();
      });
    });
  }
  let graphBuilt = false;
  function ensureGraph() { if (graphEl && !graphBuilt) { graphBuilt = true; renderGraph(); } }
  if (graphEl) {
    const gTarget = graphEl.closest(".graph-wrap") || graphEl;
    new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) ensureGraph(); });
    }, { threshold: 0.15 }).observe(gTarget);
    // build eagerly too (cheap, below the fold) so it's always populated
    if (document.readyState === "complete") ensureGraph();
    else window.addEventListener("load", ensureGraph);
    setTimeout(ensureGraph, 400);
  }
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (graphBuilt) renderGraph(); }, 180); });
})();
