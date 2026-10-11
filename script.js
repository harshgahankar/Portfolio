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

/* Project Constellation — data-driven canvas + detail panel */
(function () {
  var section = document.getElementById("projects");
  if (!section || !section.classList.contains("constellation-section")) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileQ = window.matchMedia("(max-width: 920px)");

  /* Verified project data from this portfolio — edit here to add/remove/reorder. */
  var PROJECTS = [
    {
      name: "ClauseWise", cat: "AI CONTRACT ANALYSIS",
      desc: "AI-powered contract risk analysis platform",
      tags: ["Web", "AI", "Contracts"],
      img: "assets/Clausewise.png",
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
      img: "assets/siteops.png",
      alt: "SiteOps — smart construction site management system preview",
      live: "https://site-ops-web.vercel.app/",
      repo: "https://github.com/harshgahankar/SiteOps",
      status: "live", context: "Built at HackFusion 2026 · SPIT × UMIT",
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
      img: "assets/faillens.png",
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
      img: "assets/SkillOrbit.png",
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
      img: "assets/ThermaCity.png",
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
      img: "assets/Skillo.png",
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
      img: "assets/CyberResQ.png",
      alt: "CyberResQ — Cyber Security Awareness Platform preview",
      live: "https://cyberresq.onrender.com/",
      repo: "https://github.com/DevSignerOmkar/CyberResQ",
      status: "live", context: "Top 10 — Microsoft × Shikunj Agentic AI Hackathon · team of 4",
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
      img: "assets/CivicEye.png",
      alt: "Civic Eye — Real-Time Computer Vision for Public Safety preview",
      live: null,
      repo: "https://github.com/harshgahankar/Civic-Eye",
      status: "code", context: "1st Runner-up — Aether HackConquest '26 · 36-hr hackathon",
      features: [
        "Real-time detection on live camera feeds",
        "YOLO + OpenCV incident classification",
        "Tested on real datasets"
      ]
    }
  ];

  /* Fixed orbital slots (percent of canvas). Center slot holds the selection. */
  var SLOTS = [
    { x: 13, y: 38 }, { x: 30, y: 14 }, { x: 56, y: 10 }, { x: 82, y: 30 },
    { x: 76, y: 64 }, { x: 45, y: 84 }, { x: 13, y: 68 }
  ];
  var CX = 50, CY = 47;

  var canvas = document.getElementById("constCanvas");
  var world = document.getElementById("constWorld");
  var svg = document.getElementById("constSvg");
  var nodesEl = document.getElementById("constNodes");
  var starsEl = canvas.querySelector(".const-stars");
  var panelBody = document.getElementById("constPanelBody");
  var countEl = document.getElementById("constCount");
  var resetBtn = document.getElementById("constReset");
  if (!canvas || !world || !svg || !nodesEl || !panelBody) return;

  var selected = 0;
  var NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  /* --- static SVG: orbits, particles, links --- */
  [[500, 302, 390, 225], [500, 302, 285, 165], [500, 302, 180, 105]].forEach(function (o) {
    svg.appendChild(svgEl("ellipse", { cx: o[0], cy: o[1], rx: o[2], ry: o[3], "class": "orbit" }));
  });

  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var pi = 0; pi < 16; pi++) {
    svg.appendChild(svgEl("circle", {
      cx: Math.round(rnd() * 1000), cy: Math.round(rnd() * 640),
      r: (1 + rnd() * 1.6).toFixed(1), "class": "tw tw" + (pi % 3)
    }));
  }

  var linkG = svgEl("g", {});
  var dotG = svgEl("g", {});
  svg.appendChild(linkG);
  svg.appendChild(dotG);

  SLOTS.forEach(function (s, i) {
    var ax = CX * 10, ay = Math.round(CY * 6.4);
    var bx = s.x * 10, by = Math.round(s.y * 6.4);
    var mx = (ax + bx) / 2, my = (ay + by) / 2;
    var dx = bx - ax, dy = by - ay;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var off = (i % 2 === 0 ? 1 : -1) * (30 + (i % 3) * 14);
    var qx = Math.round(mx + (-dy / len) * off);
    var qy = Math.round(my + (dx / len) * off);
    var path = svgEl("path", {
      d: "M" + ax + " " + ay + " Q" + qx + " " + qy + " " + bx + " " + by,
      "class": "link", "data-slot": i, style: "--ld:" + (i * 0.08).toFixed(2) + "s"
    });
    linkG.appendChild(path);
    dotG.appendChild(svgEl("circle", { cx: bx, cy: by, r: 5, "class": "ep", "data-slot": i }));
  });
  dotG.appendChild(svgEl("circle", { cx: CX * 10, cy: Math.round(CY * 6.4), r: 7, "class": "ep" }));

  /* --- nodes --- */
  function nodeHTML(p, projIdx, slot, featured, order) {
    var tags = p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    return '<button type="button" class="const-node' + (featured ? " featured" : "") + '" data-i="' + projIdx + '"'
      + ' style="--nx:' + slot.x + "%;--ny:" + slot.y + "%;--d:" + (0.15 + order * 0.09).toFixed(2) + 's"'
      + ' aria-label="View ' + p.name + ' details">'
      + '<img src="' + p.img + '" alt="' + p.alt + '" loading="lazy" />'
      + '<span class="const-node-txt">' + (featured ? '<em class="featured-tag">FEATURED</em>' : "")
      + '<b>' + p.name + '</b><i>' + p.desc + '</i></span>'
      + '<span class="const-node-tags">' + tags + '</span>'
      + '<span class="const-node-dot" aria-hidden="true"></span></button>';
  }

  function renderNodes() {
    var others = [];
    for (var i = 0; i < PROJECTS.length; i++) { if (i !== selected) others.push(i); }
    var html = nodeHTML(PROJECTS[selected], selected, { x: CX, y: CY }, true, 0);
    html += others.map(function (projIdx, k) {
      return nodeHTML(PROJECTS[projIdx], projIdx, SLOTS[k], false, k + 1);
    }).join("");
    nodesEl.innerHTML = html;
  }

  function statusPill(p) {
    if (p.status === "live") return '<span class="live-pill live"><b></b>LIVE</span>';
    if (p.status === "soon") return '<span class="live-pill soon"><b></b>SOON</span>';
    if (p.status === "code") return '<span class="live-pill code"><b></b>CODE</span>';
    return "";
  }

  function renderPanel() {
    var p = PROJECTS[selected];
    countEl.innerHTML = pad(selected + 1) + " <span>/ " + pad(PROJECTS.length) + "</span>";
    var badges = p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    var links = (p.live ? '<a class="project-listing-btn project-listing-btn-visit" href="' + p.live + '" target="_blank" rel="noopener noreferrer">Live Demo <span>→</span></a>' : "")
      + (p.repo ? '<a class="project-listing-btn project-listing-btn-repo" href="' + p.repo + '" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a>' : "");
    var feats = p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("");
    panelBody.innerHTML =
      '<div class="const-cat-row"><span class="const-cat">' + p.cat + "</span>" + statusPill(p) + "</div>"
      + '<h3 class="const-name">' + p.name + "</h3>"
      + (p.context ? '<p class="const-context">' + p.context + "</p>" : "")
      + '<p class="const-desc">' + p.desc + "</p>"
      + '<div class="const-badges">' + badges + "</div>"
      + (links ? '<div class="const-links">' + links + "</div>" : "")
      + '<div class="const-preview"><img src="' + p.img + '" alt="' + p.alt + '" loading="lazy" /></div>'
      + '<p class="const-label">KEY FEATURES</p>'
      + '<ul class="const-feats">' + feats + "</ul>"
      + '<p class="const-label">TECH STACK</p>'
      + '<div class="const-stack">' + badges + "</div>";
  }

  function paintHot(projIdx) {
    var paths = linkG.querySelectorAll("path.link");
    var dots = dotG.querySelectorAll("circle.ep[data-slot]");
    if (projIdx < 0) {
      svg.classList.remove("focusing");
      paths.forEach(function (p) { p.classList.remove("hot"); });
      dots.forEach(function (d) { d.style.opacity = ""; });
      return;
    }
    svg.classList.add("focusing");
    /* find which slot holds this project (center = all links) */
    var others = [];
    for (var i = 0; i < PROJECTS.length; i++) { if (i !== selected) others.push(i); }
    var slotIdx = others.indexOf(projIdx);
    paths.forEach(function (p, k) {
      var hot = projIdx === selected || k === slotIdx;
      p.classList.toggle("hot", hot);
    });
    dots.forEach(function (d) {
      var k = parseInt(d.getAttribute("data-slot"), 10);
      d.style.opacity = (projIdx === selected || k === slotIdx) ? "1" : "0.25";
    });
  }

  function select(i, instant) {
    if (i === selected && !instant) return;
    selected = (i + PROJECTS.length) % PROJECTS.length;
    nodesEl.classList.remove("first");
    if (instant || reduceMotion) {
      renderNodes();
      renderPanel();
      paintHot(-1);
      return;
    }
    nodesEl.classList.add("swap");
    panelBody.classList.add("switching");
    setTimeout(function () {
      renderNodes();
      renderPanel();
      paintHot(-1);
      nodesEl.classList.remove("swap");
      panelBody.classList.remove("switching");
    }, 170);
  }

  /* --- events: select on tap/click, highlight on hover/focus --- */
  nodesEl.addEventListener("click", function (e) {
    if (dragMoved) return;
    var btn = e.target.closest(".const-node");
    if (btn) select(parseInt(btn.getAttribute("data-i"), 10));
  });

  function hotFromEvent(e, on) {
    var btn = e.target.closest ? e.target.closest(".const-node") : null;
    paintHot(on && btn ? parseInt(btn.getAttribute("data-i"), 10) : -1);
  }
  nodesEl.addEventListener("mouseover", function (e) { hotFromEvent(e, true); });
  nodesEl.addEventListener("mouseout", function (e) { hotFromEvent(e, false); });
  nodesEl.addEventListener("focusin", function (e) { hotFromEvent(e, true); });
  nodesEl.addEventListener("focusout", function (e) { hotFromEvent(e, false); });

  document.getElementById("constPrev").addEventListener("click", function () { select(selected - 1); });
  document.getElementById("constNext").addEventListener("click", function () { select(selected + 1); });

  /* --- drag to pan (desktop), gentle + bounded --- */
  var dragMoved = false;
  var dx = 0, dy = 0, sx = 0, sy = 0, ox = 0, oy = 0, dragging = false, captured = false;

  function applyWorld(mx, my) {
    world.style.transform = "translate(" + (dx + mx * 8).toFixed(1) + "px," + (dy + my * 6).toFixed(1) + "px)";
    starsEl.style.transform = "translate(" + (mx * -12).toFixed(1) + "px," + (my * -10).toFixed(1) + "px)";
  }

  if (!reduceMotion && !mobileQ.matches) {
    canvas.addEventListener("pointerdown", function (e) {
      dragging = true;
      dragMoved = false;
      captured = false;
      sx = e.clientX; sy = e.clientY; ox = dx; oy = dy;
      canvas.classList.add("grabbing");
      /* NOTE: no setPointerCapture here — capturing retargets the
         follow-up click to the canvas, breaking node selection. */
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var nx = Math.max(-70, Math.min(70, ox + e.clientX - sx));
      var ny = Math.max(-70, Math.min(70, oy + e.clientY - sy));
      if (Math.abs(nx - ox) + Math.abs(ny - oy) > 6) {
        dragMoved = true;
        if (!captured) {
          captured = true;
          try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
        }
      }
      dx = nx; dy = ny;
      resetBtn.hidden = (dx === 0 && dy === 0);
      requestParallax();
    });
    function endDrag() {
      dragging = false;
      canvas.classList.remove("grabbing");
      setTimeout(function () { dragMoved = false; }, 50);
    }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    resetBtn.addEventListener("click", function () {
      dx = 0; dy = 0;
      resetBtn.hidden = true;
      requestParallax();
    });
  } else if (resetBtn) {
    resetBtn.hidden = true;
  }

  /* --- mouse parallax (single lerped loop) --- */
  var mx = 0, my = 0, cx = 0, cy = 0, rafOn = false;
  function loop() {
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;
    applyWorld(cx, cy);
    if (Math.abs(mx - cx) > 0.0005 || Math.abs(my - cy) > 0.0005 || dragging) {
      requestAnimationFrame(loop);
    } else {
      rafOn = false;
    }
  }
  function requestParallax() {
    if (reduceMotion || mobileQ.matches) { applyWorld(0, 0); return; }
    if (!rafOn) { rafOn = true; requestAnimationFrame(loop); }
  }
  section.addEventListener("mousemove", function (e) {
    var r = section.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    requestParallax();
  });
  section.addEventListener("mouseleave", function () {
    mx = 0; my = 0;
    requestParallax();
  });

  /* --- init: feature first project, entrance on scroll --- */
  nodesEl.classList.add("first");
  renderNodes();
  renderPanel();
  paintHot(-1);

  if (reduceMotion) {
    section.classList.add("in");
  } else if ("IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          section.classList.add("in");
          seen.disconnect();
          setTimeout(function () { nodesEl.classList.remove("first"); }, 3200);
        }
      });
    }, { threshold: 0.2 });
    seen.observe(section);
  } else {
    section.classList.add("in");
    nodesEl.classList.remove("first");
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

/* Splash — HARSH stagger, once per session, load-gated */
(function () {
  var splash = document.getElementById("splash");
  if (!splash) return;

  function kill() {
    if (splash.parentNode) splash.parentNode.removeChild(splash);
    document.body.classList.remove("splashing");
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { kill(); return; }
    if (sessionStorage.getItem("hg-splash") === "seen") { kill(); return; }
  } catch (e) { /* storage unavailable — show once */ }

  document.body.classList.add("splashing");

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    splash.classList.add("done");
    try { sessionStorage.setItem("hg-splash", "seen"); } catch (e) {}
    try { window.dispatchEvent(new Event("hg:splash-done")); } catch (e) {}
    setTimeout(kill, 650);
  }

  splash.addEventListener("click", finish);

  var minTime = new Promise(function (res) { setTimeout(res, 5300); });
  var loaded = new Promise(function (res) {
    if (document.readyState === "complete") { res(); return; }
    window.addEventListener("load", res);
    setTimeout(res, 6000);
  });
  Promise.all([minTime, loaded]).then(finish);
  setTimeout(finish, 9000);
})();
