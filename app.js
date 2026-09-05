/* Shipwright site — interactivity: 3D hero, animated process reel, screenshot tour. Vanilla JS. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, attrs = {}, html = "") => {
    const n = document.createElement(t);
    for (const k in attrs) n[k === "class" ? "className" : k] = attrs[k];
    if (html) n.innerHTML = html;
    return n;
  };
  const icon = (id, size = 18) => `<svg width="${size}" height="${size}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDark = () => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  };

  $("#year").textContent = new Date().getFullYear();

  // mobile nav
  const toggle = $("#navToggle"), links = $("#navLinks");
  toggle?.addEventListener("click", () => {
    const open = !links.classList.toggle("closed");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => { if (innerWidth <= 900) links.classList.add("closed"); }));

  // team roster
  [
    ["CE", "CEO", "#7c5cff"], ["CT", "CTO", "#5b8cff"], ["PM", "Product", "#34d3ee"], ["BA", "Analyst", "#3ad29f"],
    ["BE", "Backend", "#f6c454"], ["FE", "Frontend", "#ff7ac6"], ["QA", "QA", "#ff6b7d"], ["DO", "DevOps", "#9d7bff"],
    ["DS", "Designer", "#34d3ee"], ["SE", "Security", "#3ad29f"],
  ].forEach(([ini, role, c]) => $("#teamGrid")?.appendChild(el("div", { class: "card member" },
    `<div class="avatar" style="background:linear-gradient(135deg, ${c}, ${c}cc)">${ini}</div>
     <div><div style="font-weight:700">${role}</div><div class="faint" style="font-size:12px">agent</div></div>`)));

  // ---- process reel ----
  const STAGES = [
    { label: "Intake", icon: "i-doc", who: "PM", color: "#34d3ee", status: "Framing", cap: "A PM reads the ticket, frames the problem, and scopes the work." },
    { label: "Spec", icon: "i-pen", who: "PM", color: "#34d3ee", status: "Spec", cap: "The spec lands with machine-checkable acceptance criteria." },
    { label: "Build", icon: "i-cpu", who: "Engineers", color: "#3ad29f", status: "Building", cap: "Engineers build their slices in parallel git worktrees, then merge into one codebase." },
    { label: "Review", icon: "i-shield", who: "CTO", color: "#5b8cff", status: "In review", cap: "The CTO reviews correctness, security, and scope — before QA ever runs." },
    { label: "QA", icon: "i-flask", who: "QA", color: "#f6c454", status: "Verifying", cap: "QA boots the real app, drives a headless browser, and verifies every criterion." },
    { label: "Ship", icon: "i-rocket", who: "DevOps", color: "#9d7bff", status: "Shipped ✓", cap: "DevOps merges and deploys — behind the gate you own." },
  ];
  (function reel() {
    const root = $("#reel"); if (!root) return;
    root.className = "card reel";
    root.innerHTML = `
      <div class="reel-head">
        <div class="reel-mission"><span class="dot" id="rDot"></span><span class="k">M-224</span><span class="t">Realtime team chat widget</span></div>
        <div class="row" style="gap:8px;align-items:center">
          <span class="badge" id="rStatus">Framing</span>
          <button class="btn" id="rPlay" style="padding:5px 10px;font-size:12px">Pause</button>
        </div>
      </div>
      <div class="reel-body">
        <div class="reel-track"><div class="reel-line"><div class="reel-fill" id="rFill"></div></div><div class="reel-nodes" id="rNodes"></div></div>
        <div class="reel-cap" id="rCap"></div>
      </div>`;
    const nodes = $("#rNodes");
    STAGES.forEach((s) => nodes.appendChild(el("div", { class: "reel-node" },
      `<span class="circle">${icon(s.icon, 19)}</span><span class="lbl">${s.label}</span>`)));
    let step = reduce ? STAGES.length - 1 : 0, playing = !reduce, timer;
    const play = $("#rPlay");
    play.textContent = playing ? "Pause" : "Play";
    play.addEventListener("click", () => { playing = !playing; play.textContent = playing ? "Pause" : "Play"; playing ? start() : stop(); });
    function render() {
      const s = STAGES[step], done = step === STAGES.length - 1;
      $("#rFill").style.width = (step / (STAGES.length - 1)) * 100 + "%";
      $("#rDot").style.background = done ? "var(--green)" : "var(--brand)";
      const st = $("#rStatus"), col = done ? "var(--green)" : "var(--brand)";
      st.textContent = s.status; st.style.color = col;
      st.style.background = `color-mix(in srgb, ${col} 13%, transparent)`;
      st.style.borderColor = `color-mix(in srgb, ${col} 32%, var(--line))`;
      [...nodes.children].forEach((n, i) => {
        n.classList.toggle("done", i < step); n.classList.toggle("active", i === step);
        const c = n.querySelector(".circle");
        if (i === step) { c.style.background = s.color; c.style.color = "#fff"; c.style.outline = `3px solid color-mix(in srgb, ${s.color} 38%, transparent)`; c.innerHTML = icon(s.icon, 19); }
        else if (i < step) { c.style.background = "var(--green)"; c.style.color = "#fff"; c.style.outline = "none"; c.innerHTML = icon("i-check", 19); }
        else { c.style.background = "var(--panel-2)"; c.style.color = "var(--faint)"; c.style.outline = "none"; c.innerHTML = icon(STAGES[i].icon, 19); }
      });
      $("#rCap").innerHTML =
        `<span class="badge" style="flex:0 0 auto;color:${s.color};background:color-mix(in srgb, ${s.color} 13%, transparent);border-color:color-mix(in srgb, ${s.color} 32%, var(--line))"><span style="width:6px;height:6px;border-radius:50%;background:${s.color}"></span> ${s.who}</span>
         <span class="txt">${s.cap}</span>`;
    }
    function start() { stop(); if (reduce) return; timer = setInterval(() => { step = (step + 1) % STAGES.length; render(); }, 1650); }
    function stop() { if (timer) clearInterval(timer); }
    render(); if (playing) start();
  })();

  // ---- screenshot tour ----
  const SHOTS = [
    ["dashboard", "Dashboard", "Command center — live activity, spend, blockers, and every mission at a glance."],
    ["live-build", "Live Build", "Watch the pipeline run in real time — phases, the team, and one-click Run app on a shipped build."],
    ["tickets", "Ticket board", "A Jira-like board the team drives itself: To Do → In Progress → In Review → QA → Done."],
    ["models", "Models", "Bind any provider per agent — Anthropic, OpenAI-compatible, Ollama, or your Claude Code CLI seat."],
    ["team", "Team", "Ten role-locked specialists laid out by the agentic SDLC, each with its own model binding."],
    ["missions", "Missions", "Every mission with its stage, autonomy level, and full inspectable history."],
  ];
  (function tour() {
    const root = $("#tourWidget"); if (!root) return;
    root.className = "tour";
    root.innerHTML = `
      <div class="card">
        <div class="tour-chrome">
          <div class="tl"><span style="background:#ff5f57"></span><span style="background:#febc2e"></span><span style="background:#28c840"></span></div>
          <span class="chip tour-url" id="tUrl"></span>
          <button class="btn" id="tPlay" style="padding:4px 9px;font-size:12px">Pause</button>
        </div>
        <div class="tour-stage" id="tStage"></div>
        <div class="tour-cap"><span class="badge" id="tLabel" style="flex:0 0 auto"></span><span class="txt" id="tCap"></span></div>
      </div>
      <div class="tour-tabs" id="tTabs"></div>`;
    const stage = $("#tStage"), tabs = $("#tTabs");
    const shotSrc = (src) => `assets/shots/${src}${isDark() ? "-dark" : ""}.png`;
    SHOTS.forEach(([src, label], k) => {
      const img = el("img", { src: shotSrc(src), alt: `${label} screen`, loading: k === 0 ? "eager" : "lazy" });
      img.dataset.shot = src;
      if (k === 0) img.classList.add("on");
      stage.appendChild(img);
      const tab = el("button", { class: "tour-tab" + (k === 0 ? " on" : "") }, label);
      tab.addEventListener("click", () => { i = k; render(); if (playing) start(); });
      tabs.appendChild(tab);
    });
    // swap every tour image to the theme-matching variant when the site theme changes
    window.addEventListener("sw-themechange", () => {
      [...stage.children].forEach((im) => { if (im.dataset.shot) im.src = shotSrc(im.dataset.shot); });
    });
    let i = 0, playing = !reduce, timer, hover = false;
    root.addEventListener("mouseenter", () => (hover = true));
    root.addEventListener("mouseleave", () => (hover = false));
    const play = $("#tPlay");
    play.textContent = playing ? "Pause" : "Play";
    play.addEventListener("click", () => { playing = !playing; play.textContent = playing ? "Pause" : "Play"; playing ? start() : stop(); });
    function render() {
      const [, label, cap] = SHOTS[i];
      [...stage.children].forEach((im, k) => im.classList.toggle("on", k === i));
      [...tabs.children].forEach((t, k) => t.classList.toggle("on", k === i));
      $("#tLabel").textContent = label; $("#tCap").textContent = cap;
      $("#tUrl").textContent = `app.shipwright.dev/dashboard/${label.toLowerCase().replace(/\s+/g, "-")}`;
    }
    function start() { stop(); if (reduce) return; timer = setInterval(() => { if (!hover) { i = (i + 1) % SHOTS.length; render(); } }, 4200); }
    function stop() { if (timer) clearInterval(timer); }
    render(); if (playing) start();
  })();

  // ---- 3D hero (Three.js, progressive — degrades to the halo + pills if unavailable) ----
  (function hero3d() {
    const canvas = document.getElementById("hero3d");
    if (!canvas || typeof THREE === "undefined" || reduce) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.z = 4.4;
    const geo = new THREE.IcosahedronGeometry(1.55, 1);
    const grp = new THREE.Group();
    grp.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.55 })));
    grp.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x34d3ee, size: 0.07 })));
    scene.add(grp);
    const N = 150, pg = new THREE.BufferGeometry(), pos = new Float32Array(N * 3);
    for (let k = 0; k < N * 3; k++) pos[k] = (Math.random() - 0.5) * 8;
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const field = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x9d7bff, size: 0.03, transparent: true, opacity: 0.55 }));
    scene.add(field);
    let mx = 0, my = 0;
    addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(canvas); resize();
    let raf, running = true;
    const loop = (t) => {
      if (!running) return;
      grp.rotation.y += 0.004;
      grp.rotation.x = Math.sin(t * 0.0002) * 0.22;
      grp.position.x += (mx * 0.5 - grp.position.x) * 0.05;
      grp.position.y += (-my * 0.5 - grp.position.y) * 0.05;
      field.rotation.y -= 0.0012;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop); else cancelAnimationFrame(raf);
    });
  })();

  // ---- theme toggle (light / dark, persisted; defaults to system) ----
  (function theme() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const root = document.documentElement;
    const read = () => { try { return localStorage.getItem("sw-theme"); } catch { return null; } };
    let mode = read(); // "dark" | "light" | null (=system)
    const sysDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = () => (mode ? mode === "dark" : sysDark());
    const paint = () => {
      if (mode) root.setAttribute("data-theme", mode); else root.removeAttribute("data-theme");
      btn.innerHTML = `<svg width="17" height="17"><use href="#${dark() ? "i-sun" : "i-moon"}"/></svg>`;
      window.dispatchEvent(new Event("sw-themechange"));  // theme-aware images re-sync
    };
    paint();
    btn.addEventListener("click", () => {
      mode = dark() ? "light" : "dark";
      try { localStorage.setItem("sw-theme", mode); } catch { /* ignore */ }
      paint();
    });
    // follow the OS when on system (no explicit choice)
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!mode) paint(); });
  })();

  // ---- scroll-driven end-to-end demo ----
  (function story() {
    const stage = document.getElementById("stageScenes");
    const acts = [...document.querySelectorAll("#acts .act")];
    if (!stage || !acts.length) return;
    const scenes = [...stage.querySelectorAll(".scene")];
    const URL = { models: "dashboard/models", integrations: "dashboard/integrations", create: "dashboard/new-mission", build: "dashboard/live-build", dashboard: "dashboard", tickets: "dashboard/tickets", ship: "dashboard/live-build" };
    const urlEl = document.getElementById("stageUrl");
    let current = -1, tok = 0;
    const alive = (t) => t === tok;
    const keyOf = (i) => (scenes[i] ? scenes[i].dataset.scene : "");

    const show = (i) => {
      if (i === current) return;
      current = i; tok++;
      acts.forEach((a, k) => a.classList.toggle("active", k === i));
      scenes.forEach((s, k) => s.classList.toggle("on", k === i));
      if (urlEl) urlEl.textContent = `app.shipwright.dev/${URL[keyOf(i)] || "dashboard"}`;
      runScene(keyOf(i), tok);
    };

    const io = new IntersectionObserver((entries) => {
      let best = null;
      for (const e of entries) if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
      if (best) { const i = acts.indexOf(best.target); if (i >= 0) show(i); }
    }, { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    acts.forEach((a) => io.observe(a));
    show(0);

    function runScene(key, t) {
      if (key === "create") typeMission(t);
      else if (key === "build") streamConsole(t);
      else if (key === "dashboard") { countStats(t); streamFeed(t); }
      else if (key === "tickets") moveTickets(t);
      else if (key === "ship") runShip(t);
    }

    const FEED = [
      ["var(--green)", "shipped", "Rex · deployed M-224 — the chat widget is live"],
      ["var(--blue)", "review", "Kai · approved the code review for the feedback board"],
      ["var(--amber)", "qa", "Ivy · QA passed — every criterion green on M-233"],
      ["#3ad29f", "build", "Ada · pushed the reminder scheduling API (M-231)"],
      ["var(--cyan)", "plan", "Nova · broke the weekly digest into 5 tickets"],
    ];
    function streamFeed(t) {
      const box = document.getElementById("dshFeed"); if (!box) return;
      box.innerHTML = "";
      const add = (k) => {
        if (!alive(t) || k >= FEED.length) return;
        const [c, chip, text] = FEED[k];
        const idx = text.indexOf(" · ");
        const lead = idx > 0 ? text.slice(0, idx) : text;
        const rest = idx > 0 ? text.slice(idx) : "";
        const row = document.createElement("div");
        row.className = "dfeed show";
        row.innerHTML = `<span class="fdot" style="background:${c}"></span><div><div class="ftext"><b>${lead}</b>${rest}</div><span class="fchip" style="color:${c};background:color-mix(in srgb, ${c} 16%, transparent)">${chip}</span></div>`;
        box.appendChild(row);
        setTimeout(() => add(k + 1), reduce ? 0 : 600);
      };
      add(0);
    }

    function runShip(t) {
      const el = document.getElementById("runUrl"); if (!el) return;
      el.classList.remove("show");
      if (reduce) { el.classList.add("show"); return; }
      setTimeout(() => { if (alive(t)) el.classList.add("show"); }, 900);  // "Run app" → live URL
    }

    function typeMission(t) {
      const el = document.getElementById("mkTitle"); if (!el) return;
      const text = "Build a notes app with an API and UI";
      if (reduce) { el.textContent = text; return; }
      el.textContent = ""; let n = 0;
      (function step() { if (!alive(t)) return; el.textContent = text.slice(0, n); if (n++ <= text.length) setTimeout(step, 42); })();
    }

    const LINES = [
      ["#34d3ee", "Nova", "spec", "drafted the spec — 6 acceptance criteria"],
      ["#5b8cff", "Kai", "plan", "planned 4 tickets across backend + frontend"],
      ["#3ad29f", "Ada", "build", "implemented the notes API + storage"],
      ["#ff7ac6", "Sol", "build", "built the notes UI, editor, and list"],
      ["#5b8cff", "Kai", "review", "code review approved — scope & security clear"],
      ["#f6c454", "Ivy", "qa", "QA passed — booted the app, all criteria green"],
      ["#9d7bff", "Rex", "ship", "merged and deployed — the app is live"],
    ];
    function streamConsole(t) {
      const box = document.getElementById("cons"); if (!box) return;
      box.innerHTML = "";
      const add = (k) => {
        if (!alive(t) || k >= LINES.length) return;
        const [c, who, ph, msg] = LINES[k];
        const ln = document.createElement("div");
        ln.className = "ln show";
        ln.innerHTML = `<span class="ph">›</span><span class="who" style="color:${c}">${who}</span><span class="ph">${ph}</span><span>${msg}</span>`;
        box.appendChild(ln); box.scrollTop = box.scrollHeight;
        setTimeout(() => add(k + 1), reduce ? 0 : 520);
      };
      add(0);
    }

    function countStats(t) {
      stage.querySelectorAll('.scene[data-scene="dashboard"] .n').forEach((el) => {
        const isMoney = el.dataset.money != null;
        const target = Number(el.dataset.count ?? el.dataset.money ?? 0);
        const fmt = (v) => (isMoney ? `~$${v.toLocaleString()}` : String(v));
        if (reduce) { el.textContent = fmt(target); return; }
        const dur = 900, t0 = performance.now();
        (function tick(now) {
          if (!alive(t)) return;
          const p = Math.min(1, (now - t0) / dur);
          el.textContent = fmt(Math.round(target * p));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
      const heights = [30, 55, 40, 70, 50, 85, 65, 92];
      stage.querySelectorAll('.scene[data-scene="dashboard"] .spark i').forEach((b, k) => {
        const h = heights[k] || 50;
        if (reduce) { b.style.height = `${h}%`; return; }
        b.style.height = "0%";
        setTimeout(() => { if (alive(t)) b.style.height = `${h}%`; }, 80 + k * 55);
      });
    }

    function moveTickets(t) {
      const cols = [0, 1, 2, 3].map((c) => stage.querySelector(`.kb .body[data-col="${c}"]`));
      if (cols.some((c) => !c)) return;
      cols.forEach((c) => (c.innerHTML = ""));
      const card = (key, title) => {
        const d = document.createElement("div");
        d.className = "tk";
        d.innerHTML = `<span class="mini">${key}</span><div>${title}</div>`;
        return d;
      };
      cols[0].appendChild(card("SW-3", "Reminder settings UI"));
      cols[1].appendChild(card("SW-2", "Email delivery"));
      cols[3].appendChild(card("SW-5", "Notes worker"));
      const hero = card("SW-1", "Notes API");
      hero.style.outline = "2px solid var(--brand)";
      hero.style.outlineOffset = "1px";
      cols[0].appendChild(hero);
      if (reduce) { cols[3].appendChild(hero); return; }
      const seq = [1, 2, 3];
      let s = 0;
      (function hop() {
        if (!alive(t) || s >= seq.length) return;
        setTimeout(() => {
          if (!alive(t)) return;
          hero.style.opacity = "0.35";
          cols[seq[s]].appendChild(hero);
          requestAnimationFrame(() => { hero.style.opacity = "1"; });
          s++; hop();
        }, 950);
      })();
    }
  })();
})();
