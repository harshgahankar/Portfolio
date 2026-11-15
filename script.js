/* Interactive moon */
const moon = document.getElementById("moon");

if (moon) {
  let isMoonDragging = false;
  let moonStartX = 0;
  let moonStartY = 0;
  let rotateX = 0;
  let rotateY = 0;

  moon.addEventListener("mousedown", (e) => {
    isMoonDragging = true;
    moonStartX = e.clientX;
    moonStartY = e.clientY;
    moon.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isMoonDragging) return;

    const dx = e.clientX - moonStartX;
    const dy = e.clientY - moonStartY;

    rotateY += dx * 0.08;
    rotateX -= dy * 0.08;

    moon.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    moonStartX = e.clientX;
    moonStartY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isMoonDragging = false;
    moon.style.cursor = "grab";
  });

  moon.addEventListener("mousemove", (e) => {
    if (isMoonDragging) return;

    const rect = moon.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    moon.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });

  moon.addEventListener("mouseleave", () => {
    if (!isMoonDragging) {
      moon.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  });
}

/* Explore Personality draggable canvas */
const canvas = document.getElementById("dragCanvas");
const resetBtn = document.getElementById("resetBtn");

if (canvas && resetBtn) {
  let isDragging = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let moveX = 0;
  let moveY = 0;

  function updateCanvas() {
    canvas.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
  }

  function getBounds() {
    let maxX, maxY;
    if (window.innerWidth < 480) {
      maxX = 600;
      maxY = 550;
    } else if (window.innerWidth < 768) {
      maxX = 900;
      maxY = 850;
    } else {
      maxX = 1200;
      maxY = 950;
    }

    return {
      minX: -maxX,
      maxX: maxX,
      minY: -maxY,
      maxY: maxY
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  canvas.addEventListener("pointerdown", function (e) {
    isDragging = true;
    startMouseX = e.clientX - moveX;
    startMouseY = e.clientY - moveY;
    canvas.style.transition = "none";
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!isDragging) return;

    const bounds = getBounds();

    moveX = clamp(e.clientX - startMouseX, bounds.minX, bounds.maxX);
    moveY = clamp(e.clientY - startMouseY, bounds.minY, bounds.maxY);

    updateCanvas();
  });

  canvas.addEventListener("pointerup", function (e) {
    isDragging = false;
    canvas.style.transition = "transform 0.15s ease-out";
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}
  });

  canvas.addEventListener("pointercancel", function () {
    isDragging = false;
    canvas.style.transition = "transform 0.15s ease-out";
  });

  resetBtn.addEventListener("click", function () {
    moveX = 0;
    moveY = 0;
    canvas.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    updateCanvas();
  });

  updateCanvas();
}

/* Skills tooltip */
const tooltip = document.getElementById("skillTooltip");
const bubbles = document.querySelectorAll(".skill-bubble");

if (tooltip && bubbles.length) {
  bubbles.forEach((bubble) => {
    bubble.addEventListener("mousemove", (e) => {
      tooltip.textContent = bubble.dataset.tip;
      tooltip.style.left = `${e.clientX + 16}px`;
      tooltip.style.top = `${e.clientY + 16}px`;
      tooltip.style.opacity = "1";
      tooltip.style.transform = "translateY(0)";
    });

    bubble.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
      tooltip.style.transform = "translateY(8px)";
    });
  });
}

/* Reveal animation on scroll */
const revealItems = document.querySelectorAll(
  ".project-card, .experience-card, .win-card, .stats-grid div, .about-copy, .photo-stack"
);

revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

/* Projects horizontal scroll on vertical page scroll */

const projectsSection = document.querySelector(".projects-horizontal-section");
const projectsTrack = document.getElementById("projectsTrack");

function handleProjectsHorizontalScroll() {
  if (!projectsSection || !projectsTrack) return;

  if (window.innerWidth <= 768) {
    projectsTrack.style.transform = "translateX(0px)";
    return;
  }

  const sectionTop = projectsSection.offsetTop;
  const sectionHeight = projectsSection.offsetHeight;
  const viewportHeight = window.innerHeight;

  const scrollStart = sectionTop;
  const scrollEnd = sectionTop + sectionHeight - viewportHeight;

  const currentScroll = window.scrollY;

  let progress = (currentScroll - scrollStart) / (scrollEnd - scrollStart);
  progress = Math.max(0, Math.min(1, progress));

  const trackWidth = projectsTrack.scrollWidth;
  const windowWidth = window.innerWidth;

  const maxTranslate = trackWidth - windowWidth + windowWidth * 0.12;

  projectsTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
}

window.addEventListener("scroll", handleProjectsHorizontalScroll);
window.addEventListener("resize", handleProjectsHorizontalScroll);
handleProjectsHorizontalScroll();

/* Skills filter buttons */

const skillButtons = document.querySelectorAll(".skills-filter-btn");
const softwareSkills = document.querySelectorAll(".software-skill");
const designSkills = document.querySelectorAll(".design-skill");

function updateSkills(filter) {
  if (filter === "software") {
    softwareSkills.forEach(skill => skill.classList.remove("skill-hidden"));
    designSkills.forEach(skill => skill.classList.add("skill-hidden"));
  }

  if (filter === "design") {
    designSkills.forEach(skill => skill.classList.remove("skill-hidden"));
    softwareSkills.forEach(skill => skill.classList.add("skill-hidden"));
  }
}

skillButtons.forEach(button => {
  button.addEventListener("click", () => {
    skillButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");
    updateSkills(filter);
  });
});

/* default state */
updateSkills("software");

/* Bubble roaming animation */
(function () {
  var container = document.querySelector(".skills-bubbles-area");
  var bubbles = document.querySelectorAll(".skill-bubble-new");
  if (!container || !bubbles.length) return;

  var state = {};
  var animId = null;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    var rect = container.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    bubbles.forEach(function (bubble) {
      var cs = getComputedStyle(bubble);
      var left = parseFloat(cs.left);
      var top = parseFloat(cs.top);

      if (isNaN(left) || (left === 0 && cs.right && cs.right !== "auto" && parseFloat(cs.right) > 0)) {
        left = w - parseFloat(cs.right) - bubble.offsetWidth;
      }
      if (isNaN(top)) top = 0;

      var size = bubble.offsetWidth || 110;
      var speed = rand(0.3, 0.9);
      var angle = rand(0, Math.PI * 2);

      state[bubble.dataset.index || (bubble.dataset.index = Object.keys(state).length)] = {
        x: left,
        y: top,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        el: bubble,
        stopped: false,
      };

      bubble.style.left = left + "px";
      bubble.style.top = top + "px";
      bubble.style.right = "auto";
    });
  }

  function tick() {
    var rect = container.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    var keys = Object.keys(state);

    keys.forEach(function (key) {
      var s = state[key];
      var el = s.el;
      if (s.stopped) return;
      if (el.classList.contains("skill-hidden")) return;

      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0) { s.x = 0; s.vx *= -1; }
      if (s.x > w - s.size) { s.x = w - s.size; s.vx *= -1; }
      if (s.y < 0) { s.y = 0; s.vy *= -1; }
      if (s.y > h - s.size) { s.y = h - s.size; s.vy *= -1; }
    });

    for (var i = 0; i < keys.length; i++) {
      for (var j = i + 1; j < keys.length; j++) {
        var a = state[keys[i]];
        var b = state[keys[j]];
        if (a.el.classList.contains("skill-hidden") || b.el.classList.contains("skill-hidden")) continue;

        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = (a.size + b.size) / 2;

        if (dist < minDist && dist > 0) {
          var overlap = minDist - dist;
          var nx = dx / dist;
          var ny = dy / dist;

          a.x += nx * overlap / 2;
          a.y += ny * overlap / 2;
          b.x -= nx * overlap / 2;
          b.y -= ny * overlap / 2;

          var relVn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (relVn < 0) {
            a.vx -= relVn * nx;
            a.vy -= relVn * ny;
            b.vx += relVn * nx;
            b.vy += relVn * ny;
          }
        }
      }
    }

    keys.forEach(function (key) {
      var s = state[key];
      if (s.el.classList.contains("skill-hidden")) return;
      if (s.x < 0) s.x = 0;
      if (s.x > w - s.size) s.x = w - s.size;
      if (s.y < 0) s.y = 0;
      if (s.y > h - s.size) s.y = h - s.size;
      s.el.style.left = s.x + "px";
      s.el.style.top = s.y + "px";
    });

    animId = requestAnimationFrame(tick);
  }

  bubbles.forEach(function (bubble) {
    bubble.addEventListener("mouseenter", function () {
      for (var key in state) {
        if (state[key].el === bubble) {
          state[key].stopped = true;
          break;
        }
      }
    });
    bubble.addEventListener("mouseleave", function () {
      for (var key in state) {
        if (state[key].el === bubble) {
          var s = state[key];
          s.stopped = false;
          var speed = rand(0.3, 0.9);
          var angle = rand(0, Math.PI * 2);
          s.vx = Math.cos(angle) * speed;
          s.vy = Math.sin(angle) * speed;
          break;
        }
      }
    });
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  init();
  tick();
})();

/* Hero mouse parallax (giant text drifts opposite, person follows subtly) */
(function () {
  var hero = document.querySelector(".hero");
  var giant = document.querySelector(".hero-giant");
  if (!hero || !giant) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function render() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    hero.style.setProperty("--gpx", (-cx * 26).toFixed(2) + "px");
    hero.style.setProperty("--gpy", (-cy * 18).toFixed(2) + "px");
    hero.style.setProperty("--ppx", (cx * 16).toFixed(2) + "px");
    hero.style.setProperty("--ppy", (cy * 10).toFixed(2) + "px");
    if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
      raf = requestAnimationFrame(render);
    } else {
      raf = null;
    }
  }

  hero.addEventListener("mousemove", function (e) {
    var r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;
    ty = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(render);
  });

  hero.addEventListener("mouseleave", function () {
    tx = 0; ty = 0;
    if (!raf) raf = requestAnimationFrame(render);
  });
})();

/* Hero-left text FX: letter wave on name + typewriter role */
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Split hero name into hoverable letters (keeps <br> breaks) */
  var nameEl = document.querySelector(".hero-name");
  if (nameEl) {
    var frag = document.createDocumentFragment();
    var letterIndex = 0;
    Array.from(nameEl.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        Array.from(node.textContent).forEach(function (ch) {
          var s = document.createElement("span");
          s.className = "hl";
          s.textContent = ch === " " ? " " : ch;
          s.style.transitionDelay = (letterIndex * 28) + "ms";
          letterIndex++;
          frag.appendChild(s);
        });
      } else {
        frag.appendChild(node.cloneNode(false));
      }
    });
    nameEl.innerHTML = "";
    nameEl.appendChild(frag);

    /* auto wave every 6s so visitors discover the hover effect */
    if (!reduceMotion) {
      var letters = nameEl.querySelectorAll(".hl").length;
      setInterval(function () {
        nameEl.classList.add("waving");
        setTimeout(function () {
          nameEl.classList.remove("waving");
        }, letters * 28 + 450);
      }, 6000);
    }
  }

  /* 2. Typewriter for the role lines */
  var roleEl = document.querySelector(".hero-role");
  if (roleEl) {
    var lines = ["Web Designer &", "UIUX Creator"];
    if (reduceMotion) {
      roleEl.innerHTML = "Web Designer &<br>UIUX Creator";
      return;
    }
    roleEl.innerHTML = "";
    var caret = document.createElement("span");
    caret.className = "type-caret";
    var li = 0, ci = 0, currentLine = null;

    function newLine() {
      if (li > 0) roleEl.appendChild(document.createElement("br"));
      currentLine = document.createElement("span");
      roleEl.appendChild(currentLine);
      roleEl.appendChild(caret);
    }

    function type() {
      if (li >= lines.length) return; /* done — caret keeps blinking */
      if (!currentLine) newLine();
      if (ci < lines[li].length) {
        currentLine.textContent += lines[li][ci];
        ci++;
        setTimeout(type, 34 + Math.random() * 46);
      } else {
        li++; ci = 0; currentLine = null;
        setTimeout(type, 320);
      }
    }

    /* start after the splash lifts (or shortly after load if no splash) */
    var typingStarted = false;
    function startTyping() {
      if (typingStarted) return;
      typingStarted = true;
      setTimeout(type, 400);
    }
    window.addEventListener("hg:splash-done", startTyping);
    setTimeout(function () {
      if (!document.body.classList.contains("splashing")) startTyping();
    }, 1500);
  }
})();

/* Projects stack UX: reveal, progress pill, stuck-card depth */
(function () {
  var section = document.querySelector(".projects-stack-section");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var allItems = Array.prototype.slice.call(section.querySelectorAll(".stack-item"));
  /* CTA card joins the deck but stays out of the 01–08 count */
  var items = allItems.filter(function (it) { return !it.querySelector(".stack-cta"); });
  if (!items.length) return;
  section.classList.add("js");

  /* card entrance */
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.querySelector(".stack-card").classList.add("in");
        reveal.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  allItems.forEach(function (it) { reveal.observe(it); });

  /* current card + progress pill */
  var pill = section.querySelector(".stack-progress");
  var count = pill && pill.querySelector(".stack-progress-count");
  var bar = pill && pill.querySelector(".stack-progress-bar > span");

  function pad(n) { return String(n).padStart(2, "0"); }

  var current = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var idx = items.indexOf(en.target);
      if (idx < 0) return;
      items.forEach(function (it) { it.classList.remove("current"); });
      allItems.forEach(function (it) { it.classList.remove("current"); });
      en.target.classList.add("current");
      if (count) count.textContent = pad(idx + 1) + " / " + pad(items.length);
      if (bar) bar.style.width = ((idx + 1) / items.length * 100) + "%";
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  items.forEach(function (it) { current.observe(it); });

  /* pill only visible while inside the section */
  if (pill && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      pill.classList.toggle("show", entries[0].isIntersecting);
    }, { threshold: 0.04 }).observe(section);
  }

  /* stuck cards shrink + dim slightly as the next one covers them */
  var ticking = false;
  function depth() {
    ticking = false;
    if (window.innerWidth <= 768) {
      allItems.forEach(function (it) {
        it.style.setProperty("--ss", 1);
        it.style.setProperty("--sb", 1);
      });
      return;
    }
    allItems.forEach(function (it, i) {
      var card = it.querySelector(".stack-card");
      if (!card || i === allItems.length - 1) {
        it.style.setProperty("--ss", 1);
        it.style.setProperty("--sb", 1);
        return;
      }
      var r = card.getBoundingClientRect();
      var nr = allItems[i + 1].getBoundingClientRect();
      var cover = Math.max(0, Math.min(1, (r.bottom - nr.top) / r.height));
      it.style.setProperty("--ss", (1 - cover * 0.05).toFixed(4));
      it.style.setProperty("--sb", (1 - cover * 0.18).toFixed(4));
    });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(depth); }
  }, { passive: true });
  window.addEventListener("resize", depth);
  depth();
})();

/* Experience shelf: reveal + archive filter */
(function () {
  var section = document.getElementById("experience");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  section.classList.add("js");

  var cards = section.querySelectorAll(".podium-card, .arch-row");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(function (c) { io.observe(c); });
  } else {
    cards.forEach(function (c) { c.classList.add("in"); });
  }

  var btns = section.querySelectorAll(".arch-filter-btn");
  var rows = section.querySelectorAll(".arch-row");
  var count = document.getElementById("archCount");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      var n = 0;
      rows.forEach(function (r) {
        var show = f === "all" || r.getAttribute("data-cat") === f;
        r.classList.toggle("arch-hidden", !show);
        if (show) n++;
      });
      if (count) count.textContent = "— SHOWING " + n + " OF " + rows.length;
    });
  });
})();

/* Project Cartridge Console — shelf of cartridges, console screen, detail panel */
(function () {
  var section = document.getElementById("projects");
  if (!section || !section.classList.contains("cart-section")) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Verified project data from this portfolio — edit here to add/remove/reorder. */
  var PROJECTS = [
    {
      name: "ClauseWise", cat: "AI CONTRACT ANALYSIS",
      desc: "AI-powered contract risk analysis platform",
      tags: ["Web", "AI", "Contracts"],
      img: "assets/Clausewise.webp",
      alt: "ClauseWise — AI-powered contract risk analysis platform preview",
      live: "https://clause-wise-org.vercel.app/",
      repo: "https://github.com/harshgahankar/ClauseWise",
      status: "live", context: null,
      features: [
        "Flags risky clauses with AI explanations",
        "Built for fast, readable contract reviews",
        "Live on Vercel · public repo"
      ]
    },
    {
      name: "SiteOps", cat: "MANAGEMENT APPLICATION",
      desc: "Smart construction site management system",
      tags: ["App", "Geofencing", "IoT"],
      img: "assets/siteops.webp",
      alt: "SiteOps — smart construction site management system preview",
      live: "https://site-ops-web.vercel.app/",
      repo: "https://github.com/harshgahankar/SiteOps",
      status: "live", context: "Built at HackFusion 2026 · SPIT × UMIT",
      sticker: "HACKFUSION",
      features: [
        "Worker & contractor dashboards",
        "Geofencing + face-recognition attendance",
        "Wage tracking built in"
      ]
    },
    {
      name: "Faillens AI", cat: "AI DEBUGGING AGENT",
      desc: "API failure detection & debugging agent",
      tags: ["API", "AI", "Debugging"],
      img: "assets/faillens.webp",
      alt: "Faillens AI — API failure detection and debugging agent preview",
      live: "https://faillensai.onrender.com/",
      repo: "https://github.com/DevSignerOmkar/faillensai",
      status: "live", context: null,
      features: [
        "Catches API failures in real time",
        "AI-assisted root-cause & debugging hints",
        "Live on Render · public repo"
      ]
    },
    {
      name: "SkillOrbit", cat: "AI RECRUITMENT PLATFORM",
      desc: "AI recruitment platform that ranks and explains candidate–job fit",
      tags: ["AI/ML", "Vector Search", "Recruitment"],
      img: "assets/SkillOrbit.webp",
      alt: "SkillOrbit — AI recruitment platform preview",
      live: "https://skill-oribit-2.vercel.app/",
      repo: "https://github.com/hansagusaiwal/SkillOrbit",
      status: "live", context: null,
      features: [
        "Ranks candidates against job descriptions",
        "Explains every fit score with AI reasoning",
        "Vector search under the hood"
      ]
    },
    {
      name: "ThermaCity", cat: "CLIMATE ANALYTICS",
      desc: "Urban heat island analysis & mitigation planning tool for Mumbai, India",
      tags: ["AI/ML", "GIS", "Thermal"],
      img: "assets/ThermaCity.webp",
      alt: "ThermaCity — urban heat island analysis tool for Mumbai preview",
      live: "https://heat-mitigation.vercel.app/",
      repo: "https://github.com/srushtidedaniya24-web/Heat-Mitigation",
      status: "live", context: null,
      features: [
        "Ward-level heat-island analysis for Mumbai",
        "Mitigation planning toolkit",
        "GIS-powered thermal maps"
      ]
    },
    {
      name: "Skillo", cat: "AI ASSESSMENT PLATFORM",
      desc: "AI-powered intelligent assessment & academic integrity platform",
      tags: ["AI/ML", "Integrity", "Assessment"],
      img: "assets/Skillo.webp",
      alt: "Skillo — AI-powered intelligent assessment and academic integrity platform preview",
      live: null,
      repo: "https://github.com/RutujaaaPathak/Skilio",
      status: "soon", context: null,
      features: [
        "AI-generated assessments in minutes",
        "Academic integrity checks baked in",
        "Source open on GitHub"
      ]
    },
    {
      name: "CyberResQ", cat: "CYBER SECURITY AWARENESS PLATFORM",
      desc: "Platform that educates users about cyber threats, crimes, and effective prevention measures.",
      tags: ["Web", "Cyber Safety", "Awareness"],
      img: "assets/CyberResQ.webp",
      alt: "CyberResQ — Cyber Security Awareness Platform preview",
      live: "https://cyberresq.onrender.com/",
      repo: "https://github.com/DevSignerOmkar/CyberResQ",
      status: "live", context: "Top 10 — Microsoft × Shikunj Agentic AI Hackathon · team of 4",
      sticker: "TOP 10",
      features: [
        "Learn threats, crimes & prevention hands-on",
        "Interactive awareness modules",
        "Live on Render · public repo"
      ]
    },
    {
      name: "Civic Eye", cat: "REAL-TIME COMPUTER VISION FOR PUBLIC SAFETY",
      desc: "CivicEye uses real-time AI vision to detect and classify public safety incidents, enabling faster and more reliable emergency response.",
      tags: ["OpenCV", "YOLO", "Real Time"],
      img: "assets/CivicEye.webp",
      alt: "Civic Eye — Real-Time Computer Vision for Public Safety preview",
      live: null,
      repo: "https://github.com/harshgahankar/Civic-Eye",
      status: "code", context: "1st Runner-up — Aether HackConquest '26 · 36-hr hackathon",
      sticker: "RUNNER-UP",
      features: [
        "Real-time detection on live camera feeds",
        "YOLO + OpenCV incident classification",
        "Tested on real datasets"
      ]
    }
  ];

  /* Cartridge accent colours, by project order. */
  var COLORS = ["#FF7A18", "#2dd4bf", "#facc15", "#a78bfa", "#f87171", "#60a5fa", "#4ade80", "#f472b6"];

  var shelf = document.getElementById("cartShelf");
  var consoleEl = document.getElementById("cartConsole");
  var dock = document.getElementById("cartDock");
  var dockCart = document.getElementById("cartDockCart");
  var screen = document.getElementById("cartScreen");
  var screenImg = document.getElementById("cartScreenImg");
  var hudName = document.getElementById("cartHudName");
  var hudStatus = document.getElementById("cartHudStatus");
  var hudDesc = document.getElementById("cartHudDesc");
  var press = document.getElementById("cartPress");
  var screenBg = document.getElementById("cartScreenBg");
  var bootName = document.getElementById("cartBootName");
  var readout = document.getElementById("cartReadout");
  var startBtn = document.getElementById("cartStart");
  var panelBody = document.getElementById("cartPanelBody");
  var countEl = document.getElementById("cartCount");
  if (!shelf || !consoleEl || !dock || !dockCart || !screen || !panelBody) return;

  var N = PROJECTS.length;
  var loaded = -1;      /* index of the cartridge in the console, -1 = empty */
  var token = 0;        /* bumps on every load/eject so stale timers no-op */
  var fly = null;       /* cartridge clone currently flying to the console */

  function pad(n) { return String(n).padStart(2, "0"); }

  function later(fn, ms) {
    var t = token;
    setTimeout(function () { if (t === token) fn(); }, ms);
  }

  function removeFly() {
    if (fly && fly.parentNode) fly.parentNode.removeChild(fly);
    fly = null;
  }

  /* --- markup builders --- */
  function cartHTML(p, i) {
    var flag = p.status === "soon" ? '<span class="cart-ribbon soon">COMING SOON</span>'
      : p.status === "code" ? '<span class="cart-ribbon code">DEV KIT</span>' : "";
    return '<span class="cart" style="--c:' + COLORS[i % COLORS.length] + '">'
      + '<span class="cart-grip"></span>'
      + '<span class="cart-label"><img src="' + p.img + '" alt="" draggable="false" />'
      + '<span class="cart-label-name">' + p.name + "</span></span>"
      + '<span class="cart-foot"><i>' + pad(i + 1) + '</i><b class="cart-led ' + p.status + '"></b></span>'
      + flag
      + (p.sticker ? '<span class="cart-sticker">' + p.sticker + "</span>" : "")
      + "</span>";
  }

  function statusPill(p) {
    if (p.status === "live") return '<span class="live-pill live"><b></b>LIVE</span>';
    if (p.status === "soon") return '<span class="live-pill soon"><b></b>SOON</span>';
    if (p.status === "code") return '<span class="live-pill code"><b></b>CODE</span>';
    return "";
  }

  function panelHTML(i) {
    if (i < 0) {
      return '<div class="cart-empty"><p class="cart-cat">CONSOLE EMPTY</p>'
        + '<h3 class="cart-name">No cartridge loaded</h3>'
        + '<p class="cart-cs-text">Pick a project from the shelf to read its file.</p></div>';
    }
    var p = PROJECTS[i];
    var badges = p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    var links = (p.live ? '<a class="project-listing-btn project-listing-btn-visit" href="' + p.live + '" target="_blank" rel="noopener noreferrer">Live Demo <span>→</span></a>' : "")
      + (p.repo ? '<a class="project-listing-btn project-listing-btn-repo" href="' + p.repo + '" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a>' : "");
    var feats = p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("");
    /* Case-study structure: Problem -> My role -> Stack -> Outcome.
       Add `problem`, `role` and `outcome` to a project above to override the defaults. */
    var outcome = (p.outcome ? '<p class="cart-cs-text">' + p.outcome + "</p>" : "")
      + (!p.outcome && p.context ? '<p class="cart-cs-text cart-cs-win">' + p.context + "</p>" : "")
      + '<ul class="cart-feats">' + feats + "</ul>";
    var steps = [
      ["PROBLEM", '<p class="cart-cs-text">' + (p.problem || p.desc) + "</p>"],
      p.role ? ["MY ROLE", '<p class="cart-cs-text">' + p.role + "</p>"] : null,
      ["STACK", '<div class="cart-stack">' + badges + "</div>"],
      ["OUTCOME", outcome]
    ].filter(Boolean);
    var cs = steps.map(function (st, k) {
      return '<div class="cart-cs-step"><p class="cart-step-label"><b>' + pad(k + 1) + "</b>" + st[0] + "</p>" + st[1] + "</div>";
    }).join("");
    return '<div class="cart-cat-row"><span class="cart-cat">' + p.cat + "</span>" + statusPill(p) + "</div>"
      + '<h3 class="cart-name">' + p.name + "</h3>"
      + (links ? '<div class="cart-links">' + links + "</div>" : "")
      + '<div class="cart-cs">' + cs + "</div>";
  }

  /* --- shelf --- */
  shelf.innerHTML = PROJECTS.map(function (p, i) {
    return '<button type="button" class="cart-pick" data-i="' + i + '" aria-pressed="false"'
      + ' style="--d:' + (0.1 + i * 0.07).toFixed(2) + 's"'
      + ' aria-label="Load ' + p.name + " — " + p.desc + '">' + cartHTML(p, i) + "</button>";
  }).join("");
  var picks = shelf.querySelectorAll(".cart-pick");

  /* --- everything that follows the loaded index, minus the animation --- */
  function sync(animatePanel) {
    var p = loaded >= 0 ? PROJECTS[loaded] : null;

    picks.forEach(function (b, i) {
      var on = i === loaded;
      b.classList.toggle("out", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    countEl.innerHTML = p ? pad(loaded + 1) + " <span>/ " + pad(N) + "</span>" : "-- <span>/ " + pad(N) + "</span>";

    if (p) {
      var dest = p.live || p.repo;
      readout.innerHTML = pad(loaded + 1) + "/" + pad(N) + " · " + p.name.toUpperCase()
        + "<span>START → " + (p.live ? "LIVE DEMO" : "SOURCE CODE") + "</span>";
      if (dest) {
        startBtn.href = dest;
        startBtn.setAttribute("aria-disabled", "false");
        startBtn.setAttribute("aria-label", (p.live ? "Open the live demo of " : "Open the source code of ") + p.name);
      }
    } else {
      readout.innerHTML = "NO CARTRIDGE<span>PICK ONE FROM THE SHELF</span>";
      startBtn.removeAttribute("href");
      startBtn.setAttribute("aria-disabled", "true");
      startBtn.removeAttribute("aria-label");
    }

    if (animatePanel && !reduceMotion) {
      var idx = loaded;
      panelBody.classList.add("switching");
      setTimeout(function () {
        if (idx === loaded) panelBody.innerHTML = panelHTML(idx);
        panelBody.classList.remove("switching");
      }, 180);
    } else {
      panelBody.innerHTML = panelHTML(loaded);
    }
  }

  /* --- screen --- */
  function boot(i) {
    var p = PROJECTS[i];
    bootName.textContent = "LOADING " + p.name.toUpperCase();
    hudName.textContent = p.name;
    hudDesc.textContent = p.desc;
    hudStatus.innerHTML = statusPill(p);
    press.href = p.live || p.repo;
    press.setAttribute("aria-label", (p.live ? "Open the live demo of " : "Open the source code of ") + p.name);
    screenBg.src = p.img;
    screenImg.src = p.img;
    screenImg.alt = p.alt;
    if (reduceMotion) { screen.setAttribute("data-state", "on"); return; }
    screen.setAttribute("data-state", "blank");
    void screen.offsetWidth; /* restart the loading bar */
    screen.setAttribute("data-state", "booting");
    later(function () { screen.setAttribute("data-state", "on"); }, 850);
  }

  /* --- drop the cartridge from the raised position into the slot --- */
  function seat(i) {
    dockCart.innerHTML = cartHTML(PROJECTS[i], i);
    dockCart.className = "cart-dock-cart raised";
    void dockCart.offsetWidth;
    dockCart.className = "cart-dock-cart seated";
    later(function () {
      consoleEl.classList.remove("thunk");
      void consoleEl.offsetWidth;
      consoleEl.classList.add("thunk");
    }, 170);
    boot(i);
  }

  /* fromRect: where the cartridge starts flying from (defaults to its shelf spot) */
  function load(i, fromRect) {
    i = (i + N) % N;
    if (i === loaded) return;
    token++;
    removeFly();
    var hadOne = loaded >= 0;
    var from = fromRect || picks[i].getBoundingClientRect();
    loaded = i;
    sync(true);

    if (reduceMotion) {
      dockCart.innerHTML = cartHTML(PROJECTS[i], i);
      dockCart.className = "cart-dock-cart seated";
      boot(i);
      return;
    }

    if (hadOne) dockCart.className = "cart-dock-cart ejecting";
    screen.setAttribute("data-state", "blank");

    var to = dock.getBoundingClientRect();
    fly = document.createElement("div");
    fly.className = "cart-fly";
    fly.style.left = from.left + "px";
    fly.style.top = from.top + "px";
    fly.style.width = from.width + "px";
    fly.style.height = from.height + "px";
    fly.innerHTML = cartHTML(PROJECTS[i], i);
    document.body.appendChild(fly);
    void fly.offsetWidth;
    fly.style.transform = "translate(" + (to.left - from.left) + "px," + (to.top - from.top) + "px) scale("
      + (to.width / from.width) + "," + (to.height / from.height) + ")";

    later(function () { removeFly(); seat(i); }, 440);
  }

  function eject() {
    if (loaded < 0) return;
    token++;
    removeFly();
    loaded = -1;
    dockCart.className = "cart-dock-cart ejecting";
    screen.setAttribute("data-state", "idle");
    sync(true);
  }

  /* --- click / keyboard --- */
  var suppressClick = false;
  shelf.addEventListener("click", function (e) {
    if (suppressClick) return;
    var btn = e.target.closest(".cart-pick");
    if (btn) load(parseInt(btn.getAttribute("data-i"), 10));
  });

  document.getElementById("cartPrev").addEventListener("click", function () { load(loaded < 0 ? N - 1 : loaded - 1); });
  document.getElementById("cartNext").addEventListener("click", function () { load(loaded < 0 ? 0 : loaded + 1); });
  document.getElementById("cartEject").addEventListener("click", eject);
  startBtn.addEventListener("click", function (e) { if (!startBtn.getAttribute("href")) e.preventDefault(); });

  /* --- drag a cartridge into the console (mouse / pen only; touch taps) --- */
  var drag = null;

  function overConsole(e) {
    var r = consoleEl.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 24 && e.clientY <= r.bottom;
  }

  if (!reduceMotion) {
    shelf.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch" || e.button !== 0) return;
      var btn = e.target.closest(".cart-pick");
      if (!btn || btn.classList.contains("out")) return;
      drag = { btn: btn, i: parseInt(btn.getAttribute("data-i"), 10), sx: e.clientX, sy: e.clientY, el: null };
    });

    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.el) {
        if (dx * dx + dy * dy < 64) return;
        var r = drag.btn.getBoundingClientRect();
        var el = document.createElement("div");
        el.className = "cart-fly dragging";
        el.style.left = r.left + "px";
        el.style.top = r.top + "px";
        el.style.width = r.width + "px";
        el.style.height = r.height + "px";
        el.innerHTML = cartHTML(PROJECTS[drag.i], drag.i);
        document.body.appendChild(el);
        drag.el = el;
        drag.btn.classList.add("lifted");
        section.classList.add("dragging");
      }
      drag.el.style.transform = "translate(" + dx + "px," + dy + "px) rotate(-4deg)";
      consoleEl.classList.toggle("drop-ready", overConsole(e));
    });

    function endDrag(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (!d.el) return; /* plain click: handled by the click listener */
      suppressClick = true;
      setTimeout(function () { suppressClick = false; }, 60);
      section.classList.remove("dragging");
      consoleEl.classList.remove("drop-ready");

      if (e.type === "pointerup" && overConsole(e)) {
        var rect = d.el.getBoundingClientRect();
        d.el.parentNode.removeChild(d.el);
        d.btn.classList.remove("lifted");
        load(d.i, rect);
      } else {
        d.el.classList.add("returning");
        d.el.style.transform = "none";
        setTimeout(function () {
          if (d.el.parentNode) d.el.parentNode.removeChild(d.el);
          d.btn.classList.remove("lifted");
        }, 260);
      }
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  }

  /* --- init: empty console, then auto-load the first cartridge on scroll-in --- */
  sync(false);

  if (reduceMotion || !("IntersectionObserver" in window)) {
    section.classList.add("in");
    load(0);
  } else {
    section.classList.add("js-anim");
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        section.classList.add("in");
        seen.disconnect();
        later(function () { load(0); }, 1100);
      });
    }, { threshold: 0.2 });
    seen.observe(section);
  }
})();

/* Proof-of-work counters */
(function () {
  var section = document.getElementById("milestones");
  if (!section) return;
  var nums = section.querySelectorAll(".count[data-count]");
  if (!nums.length) return;

  function render(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    el.textContent = (el.getAttribute("data-prefix") || "") + target + (el.getAttribute("data-suffix") || "");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    nums.forEach(render);
    return;
  }

  var done = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting || done) return;
      done = true;
      var t0 = null, dur = 1400;
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var pre = el.getAttribute("data-prefix") || "";
        var suf = el.getAttribute("data-suffix") || "";
        el.textContent = pre + "0" + suf;
      });
      function tick(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var eased = 1 - Math.pow(1 - k, 3);
        nums.forEach(function (el) {
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          el.textContent = (el.getAttribute("data-prefix") || "") + Math.round(target * eased) + (el.getAttribute("data-suffix") || "");
        });
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe(section);
})();

/* Splash — HARSH stagger, once per session, 1.8s, load-gated */
(function () {
  var splash = document.getElementById("splash");
  if (!splash) return;

  function kill() {
    if (splash.parentNode) splash.parentNode.removeChild(splash);
    document.body.classList.remove("splashing");
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { kill(); return; }
  } catch (e) { /* show splash */ }

  /* show once per browser session */
  try {
    if (sessionStorage.getItem("hg-splash-seen")) { kill(); return; }
    sessionStorage.setItem("hg-splash-seen", "1");
  } catch (e) { /* storage blocked: show splash */ }

  document.body.classList.add("splashing");

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    splash.classList.add("done");
    try { window.dispatchEvent(new Event("hg:splash-done")); } catch (e) {}
    setTimeout(kill, 650);
  }

  splash.addEventListener("click", finish);

  var minTime = new Promise(function (res) { setTimeout(res, 1800); });
  var loaded = new Promise(function (res) {
    if (document.readyState === "complete") { res(); return; }
    window.addEventListener("load", res);
    setTimeout(res, 3500);
  });
  Promise.all([minTime, loaded]).then(finish);
  setTimeout(finish, 5000);
})();

/* Mobile menu: full-screen overlay */
(function () {
  var btn = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!menu.classList.contains("open")) menu.hidden = true; }, 350);
    }
  }

  btn.addEventListener("click", function () { setOpen(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) { setOpen(false); btn.focus(); }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (q) { if (q.matches) setOpen(false); });
})();

/* Highlight the nav link for the section in view */
(function () {
  var links = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
  if (!links.length || !("IntersectionObserver" in window)) return;
  var ids = ["projects", "skills", "experience", "milestones", "contact"];
  var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var visible = {};

  function paint() {
    var current = null;
    sections.forEach(function (s) { if (visible[s.id]) current = s.id; });
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
    paint();
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { io.observe(s); });
})();

/* Personality: drag hint, nudge, tap-to-focus, mobile swipe carousel */
(function () {
  var section = document.getElementById("personality");
  var canvas = document.getElementById("dragCanvas");
  var hint = document.getElementById("dragHint");
  var mobile = document.getElementById("personalityMobile");
  if (!section || !canvas) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* hide the hint once the visitor has dragged */
  function dismiss() { if (hint) hint.classList.add("gone"); }
  canvas.addEventListener("pointerdown", dismiss, { once: true });

  /* nudge the cards once when the section first comes into view */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      canvas.classList.add("nudge");
      setTimeout(function () { canvas.classList.remove("nudge"); }, 1700);
    }, { threshold: 0.5 });
    io.observe(section);
  }

  /* touch: tap a card to focus it (hover replacement) */
  canvas.addEventListener("click", function (e) {
    var card = e.target.closest(".hobby-purple-card, .fun-card, .routine-new-card");
    canvas.querySelectorAll(".tapped").forEach(function (c) { if (c !== card) c.classList.remove("tapped"); });
    if (card) card.classList.toggle("tapped");
  });

  /* mobile: build a swipeable carousel from the same content */
  if (!mobile) return;
  function group(title, pairs) {
    return '<div class="pm-group"><h3 class="pm-title">' + title + '</h3><div class="pm-track">'
      + pairs.map(function (p) {
        return '<article class="pm-card">' + (p.img ? '<img src="' + p.img.getAttribute("src") + '" alt="' + (p.img.getAttribute("alt") || "") + '" loading="lazy" />' : "")
          + (p.h ? "<h4>" + p.h + "</h4>" : "") + (p.t ? "<p>" + p.t + "</p>" : "") + "</article>";
      }).join("") + "</div></div>";
  }
  function pairsFrom(cardSel) {
    return Array.prototype.map.call(canvas.querySelectorAll(cardSel), function (c) {
      var img = c.nextElementSibling && c.nextElementSibling.tagName === "IMG" ? c.nextElementSibling : null;
      return { img: img, h: c.querySelector("h3").textContent, t: c.querySelector("p").textContent.trim() };
    });
  }
  var routine = Array.prototype.map.call(canvas.querySelectorAll(".routine-new-card"), function (c) {
    return { img: c.querySelector("img"), h: c.querySelector("p").textContent };
  });
  mobile.innerHTML =
    '<div class="pm-head"><h2>EXPLORE MY PERSONALITY</h2><p>SWIPE →</p></div>'
    + group("My hobbies", pairsFrom(".hobby-purple-card"))
    + group("5 fun facts about me", pairsFrom(".fun-card"))
    + group("A typical day in my life", routine);
})();

/* Consistent scroll-reveal across sections */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  var sel = [
    ".skills-main-title", ".skills-top-buttons",
    ".experience-zigzag-heading", ".exp-sec-sub", ".exp-group-title", ".arch-filters",
    ".milestones-new-heading", ".proof-sub", ".impact-tile", ".proof-group-title", ".leader-spotlight", ".fame-marquee",
    ".contact-top-bar", ".final-contact-left", ".final-contact-right",
    ".pm-group"
  ].join(",");
  var items = document.querySelectorAll(sel);
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("sr-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) {
    /* stagger siblings that share a parent */
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--sr-d", Math.min(sib, 4) * 0.07 + "s");
    el.classList.add("sr");
    io.observe(el);
  });
})();
