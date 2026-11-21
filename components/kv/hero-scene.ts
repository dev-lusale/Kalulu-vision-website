/**
 * Kalulu Vision 3D hero scene (vanilla three.js, loaded on demand).
 *
 * The official logo PNG is used as-is for the front face (exact shape and orange
 * gradient preserved). Depth comes from stacked, darkened copies of the same
 * silhouette behind it — an extrusion that never redraws the mark.
 */
import * as THREE from "three";

export interface HeroSceneHandle { dispose(): void }

interface Options { mobile: boolean; reducedMotion: boolean; onReady?: () => void }

function radialTexture(inner: string, outer: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: Options): HeroSceneHandle {
  const { mobile, reducedMotion } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const baseZ = 9;
  camera.position.set(0, 0, reducedMotion ? baseZ : baseZ + 2.5);

  // ── Lights ────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 4, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xff8a00, 40, 20, 1.6);
  rim.position.set(-3, 1.5, 2);
  scene.add(rim);
  const under = new THREE.PointLight(0xff4d16, 25, 18, 1.8);
  under.position.set(2.5, -2.5, 1.5);
  scene.add(under);

  // ── Logo (front face = untouched PNG; layers behind give depth) ─────────
  const logo = new THREE.Group();
  scene.add(logo);
  const loader = new THREE.TextureLoader();
  const tex = loader.load("/brand/logo-1024.png", () => { opts.onReady?.(); });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const size = 3.2;
  const plane = new THREE.PlaneGeometry(size, size);
  const layers = mobile ? 10 : 18;
  const depth = 0.34;
  for (let i = layers; i >= 1; i--) {
    const t = i / layers;
    const shade = new THREE.Color().setRGB(0.42 - t * 0.22, 0.16 - t * 0.09, 0.03, THREE.SRGBColorSpace);
    const m = new THREE.MeshBasicMaterial({ map: tex, color: shade, transparent: true, alphaTest: 0.5, depthWrite: true });
    const mesh = new THREE.Mesh(plane, m);
    mesh.position.z = -t * depth;
    logo.add(mesh);
  }
  const front = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.08 }));
  front.position.z = 0.002;
  logo.add(front);

  // soft orange halo behind the mark
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTexture("rgba(255,138,0,0.55)", "rgba(255,77,22,0)"),
    blending: THREE.NormalBlending, depthWrite: false, transparent: true,
  }));
  halo.scale.set(5.2, 5.2, 1);
  halo.position.z = -0.8;
  logo.add(halo);

  // ── Layout / interaction ─────────────────────────────────
  function resize() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the logo comfortably inside narrow viewports
    const narrow = camera.aspect < 0.9;
    camera.fov = narrow ? 44 : 32;
    logo.scale.setScalar(narrow ? 0.95 : 1);
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const target = { x: 0, y: 0 };
  function onPointer(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  }
  if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  let running = !reducedMotion;
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(canvas);
  const onVis = () => { running = !document.hidden && !reducedMotion; if (running) loop(); };
  document.addEventListener("visibilitychange", onVis);

  let last = performance.now();
  let elapsed = 0;
  let raf = 0;
  const intro = { t: 0 };

  function frame() {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    const t = elapsed;
    intro.t = Math.min(1, intro.t + dt / 1.8);
    const ease = 1 - Math.pow(1 - intro.t, 3);

    camera.position.z = baseZ + 2.5 * (1 - ease);
    camera.position.x += (target.x * 0.25 - camera.position.x) * 0.04;
    camera.position.y += (-target.y * 0.15 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // subtle: a slow turn plus a little pointer response
    logo.rotation.y += ((target.x * 0.28 + Math.sin(t * 0.35) * 0.22 - 0.12) - logo.rotation.y) * 0.05;
    logo.rotation.x += ((target.y * 0.14) - logo.rotation.x) * 0.05;
    logo.position.y = Math.sin(t * 0.7) * 0.06;
    const s = (0.85 + 0.15 * ease) * (camera.aspect < 0.9 ? 0.95 : 1);
    logo.scale.setScalar(s);
    halo.material.opacity = 0.32 + Math.sin(t * 1.1) * 0.06;

    rim.position.x = -3 + Math.sin(t * 0.6) * 1.2;

    renderer.render(scene, camera);
  }

  function loop() {
    cancelAnimationFrame(raf);
    const step = () => {
      if (!running) return;
      if (visible) frame(); else last = performance.now();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  if (reducedMotion) {
    // one still frame, final composition
    intro.t = 1;
    const render = () => { camera.position.set(0, 0, baseZ); camera.lookAt(0, 0, 0); logo.rotation.set(0.05, -0.25, 0); renderer.render(scene, camera); };
    if (tex.image) render(); else loader.manager.onLoad = render;
    const ro2 = new ResizeObserver(render); ro2.observe(canvas);
  } else {
    loop();
  }

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      tex.dispose();
      renderer.dispose();
    },
  };
}
