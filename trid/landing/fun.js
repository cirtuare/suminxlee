/* ============================================================
   TRID landing — "fun SaaS" interactions
   Count-up stats · 3D tilt cards · magnetic buttons ·
   hero cursor glow · parallax orbit. Progressive enhancement,
   all guarded for reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ensure hero video plays ---------- */
  (function () {
    const v = $(".hero-media video");
    if (!v) return;
    const go = () => { v.play().catch(() => {}); };
    go();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) go(); });
    ["pointerdown", "touchstart", "keydown"].forEach((ev) =>
      window.addEventListener(ev, go, { once: true, passive: true }));
  })();

  /* ---------- count-up stats ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    if (reduce || target === 0) { el.innerHTML = target + (suffix ? `<span class="suf">${suffix}</span>` : ""); return; }
    const dur = 1300, t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.round(target * ease(p));
      el.innerHTML = v + (suffix ? `<span class="suf">${suffix}</span>` : "");
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const band = $("#statsBand");
  if (band) {
    let done = false;
    new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !done) { done = true; $$(".n", band).forEach(countUp); } });
    }, { threshold: 0.4 }).observe(band);
  }

  /* ---------- 3D tilt on cards ---------- */
  if (!reduce && window.matchMedia("(hover:hover)").matches) {
    $$(".priv, .emo-tile").forEach((card) => {
      card.classList.add("tilt");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-6px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- magnetic primary buttons ---------- */
  if (!reduce && window.matchMedia("(hover:hover)").matches) {
    $$(".btn-primary").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- nav: always light now (whole page is airy) ---------- */
  (function () {
    const navEl = document.querySelector("#nav");
    if (!navEl) return;
    navEl.classList.add("nav-light");
    const theme = () => {
      navEl.style.background = window.scrollY > 16
        ? "rgba(206,219,232,0.78)" : "transparent";
    };
    window.addEventListener("scroll", theme, { passive: true });
    theme();
  })();

  /* ---------- scroll progress bar ---------- */
  (function () {
    const bar = document.createElement("div");
    bar.className = "scroll-prog";
    document.body.appendChild(bar);
    const upd = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    };
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd, { passive: true });
    upd();
  })();

  /* ---------- scroll-spy: highlight active nav link ---------- */
  (function () {
    const links = $$(".nav-links a");
    const pairs = links
      .map((a) => ({ a, sec: document.querySelector(a.getAttribute("href")) }))
      .filter((p) => p.sec);
    if (!pairs.length) return;
    const setActive = (id) =>
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
    const spy = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive("#" + e.target.id); });
    }, { threshold: 0, rootMargin: "-45% 0px -50% 0px" });
    pairs.forEach((p) => spy.observe(p.sec));
  })();

  /* ---------- 3D tilt on app screenshots ---------- */
  if (!reduce && window.matchMedia("(hover:hover)").matches) {
    $$(".shotwrap").forEach((wrap) => {
      const img = $(".shot", wrap);
      if (!img) return;
      wrap.addEventListener("pointerenter", () => { img.style.transition = "none"; });
      wrap.addEventListener("pointermove", (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform = `perspective(1300px) rotateY(${px * 4.5}deg) rotateX(${-py * 4.5}deg) translateY(-6px) scale(1.012)`;
      });
      wrap.addEventListener("pointerleave", () => {
        img.style.transition = "transform .45s cubic-bezier(.2,.7,.2,1)";
        img.style.transform = "";
      });
    });
  }

  /* ---------- hero: subtle pointer parallax disabled (video is full-bleed) ---------- */
})();
