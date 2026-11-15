import * as THREE from "https://esm.sh/three@0.165.0";
import { OrbitControls } from "https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("moon3d");

if (container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 5.6);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create procedural moon texture
  function createMoonTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d");

    const baseGradient = ctx.createRadialGradient(
      360,
      260,
      50,
      512,
      512,
      700
    );

    baseGradient.addColorStop(0, "#f4f7fb");
    baseGradient.addColorStop(0.38, "#cdd7e2");
    baseGradient.addColorStop(0.7, "#8d9aa8");
    baseGradient.addColorStop(1, "#596271");

    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // soft noise
    for (let i = 0; i < 6500; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const alpha = Math.random() * 0.08;

      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }

    // craters
    for (let i = 0; i < 95; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 34 + 8;

      const crater = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
      crater.addColorStop(0, "rgba(255,255,255,0.18)");
      crater.addColorStop(0.42, "rgba(40,55,70,0.22)");
      crater.addColorStop(0.75, "rgba(0,0,0,0.14)");
      crater.addColorStop(1, "rgba(255,255,255,0.08)");

      ctx.beginPath();
      ctx.fillStyle = crater;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // few big craters
    const bigCraters = [
      [690, 610, 80],
      [310, 420, 48],
      [720, 310, 42],
      [420, 720, 36],
      [260, 620, 55]
    ];

    bigCraters.forEach(([x, y, r]) => {
      const crater = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 4, x, y, r);
      crater.addColorStop(0, "rgba(255,255,255,0.2)");
      crater.addColorStop(0.4, "rgba(50,65,80,0.35)");
      crater.addColorStop(0.78, "rgba(0,0,0,0.22)");
      crater.addColorStop(1, "rgba(255,255,255,0.11)");

      ctx.beginPath();
      ctx.fillStyle = crater;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    return new THREE.CanvasTexture(canvas);
  }

  const moonTexture = createMoonTexture();
  moonTexture.colorSpace = THREE.SRGBColorSpace;

  const moonGeometry = new THREE.SphereGeometry(1.18, 128, 128);

  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    bumpMap: moonTexture,
    bumpScale: 0.08,
    roughness: 0.95,
    metalness: 0.02
  });

  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.x = 0.15;   // tiny right bias inside canvas
    scene.add(moon);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(-3, 2.5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x9fc7ff, 2.2, 10);
  rimLight.position.set(3, -2, 3);
  scene.add(rimLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.target.set(0.1, 0, 0);

  container.addEventListener("mousedown", () => {
    container.classList.add("grabbing");
    controls.autoRotate = false;
  });

  window.addEventListener("mouseup", () => {
    container.classList.remove("grabbing");

    setTimeout(() => {
      controls.autoRotate = true;
    }, 1400);
  });

  // Resize
  function resizeMoon() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener("resize", resizeMoon);

  // Animate
  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    moon.position.y = Math.sin(elapsed * 1.1) * 0.06;
    moon.rotation.z = Math.sin(elapsed * 0.35) * 0.025;

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}