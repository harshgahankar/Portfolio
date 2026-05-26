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
    const maxX = window.innerWidth < 768 ? 900 : 1200;
    const maxY = window.innerWidth < 768 ? 850 : 950;

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
