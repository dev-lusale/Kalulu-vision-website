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
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  }));
  halo.scale.set(6.5, 6.5, 1);
  halo.position.z = -0.8;
  logo.add(halo);

  // ── Floating elements ────────────────────────────────────
  const orange = new THREE.MeshStandardMaterial({ color: 0xff8a00, metalness: 0.55, roughness: 0.28, emissive: 0x3a1200, emissiveIntensity: 0.4 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xffb52e, metalness: 0.5, roughness: 0.3 });
  const navy = new THREE.MeshStandardMaterial({ color: 0x1a2440, metalness: 0.7, roughness: 0.25 });
  const wire = new THREE.MeshBasicMaterial({ color: 0xff8a00, wireframe: true, transparent: true, opacity: 0.35 });
  const floaters: { mesh: THREE.Mesh; base: THREE.Vector3; speed: number; phase: number; spin: THREE.Vector3 }[] = [];
  const specs: [THREE.BufferGeometry, THREE.Material, [number, number, number], number][] = [
    [new THREE.IcosahedronGeometry(0.38, 0), orange, [-2.25, 1.15, -0.6], 1],
    [new THREE.TorusGeometry(0.32, 0.1, 16, 48), amber, [2.15, 1.45, -0.9], 1],
    [new THREE.OctahedronGeometry(0.3, 0), navy, [2.2, -1.3, 0.2], 1],
    [new THREE.SphereGeometry(0.18, 24, 24), orange, [-1.95, -1.45, 0.4], 1],
    [new THREE.IcosahedronGeometry(0.9, 1), wire, [-2.6, -0.1, -2.6], 1],
    [new THREE.TorusKnotGeometry(0.22, 0.065, 80, 12), navy, [1.5, 2.1, -1.8], 1],
    [new THREE.SphereGeometry(0.11, 16, 16), amber, [2.7, 0.15, -0.3], 1],
  ];
  for (const [geo, mat, pos] of mobile ? specs.slice(0, 4) : specs) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    scene.add(mesh);
    floaters.push({
      mesh, base: mesh.position.clone(), speed: 0.4 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2,
      spin: new THREE.Vector3(Math.random() * 0.4, Math.random() * 0.5, Math.random() * 0.3),
    });
  }

  // ── Particles ────────────────────────────────────────────
  const count = mobile ? 220 : 650;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0xff8a00), c2 = new THREE.Color(0xffffff), c3 = new THREE.Color(0xffb52e);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    const c = [c1, c2, c3][i % 3];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const pMat = new THREE.PointsMaterial({
    size: mobile ? 0.045 : 0.035, vertexColors: true, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false, map: radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)"),
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

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
    camera.position.x += (target.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-target.y * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    logo.rotation.y += ((target.x * 0.42 + Math.sin(t * 0.5) * 0.12) - logo.rotation.y) * 0.06;
    logo.rotation.x += ((target.y * 0.22) - logo.rotation.x) * 0.06;
    logo.position.y = Math.sin(t * 0.9) * 0.08;
    const s = (0.85 + 0.15 * ease) * (camera.aspect < 0.9 ? 0.95 : 1);
    logo.scale.setScalar(s);
    halo.material.opacity = 0.75 + Math.sin(t * 1.4) * 0.12;

    for (const f of floaters) {
      f.mesh.position.y = f.base.y + Math.sin(t * f.speed + f.phase) * 0.22;
      f.mesh.position.x = f.base.x + Math.cos(t * f.speed * 0.6 + f.phase) * 0.12;
      f.mesh.rotation.x += f.spin.x * dt;
      f.mesh.rotation.y += f.spin.y * dt;
      f.mesh.rotation.z += f.spin.z * dt;
    }
    const arr = pGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += dt * 0.12 * (1 + (i % 5) * 0.2);
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
    }
    pGeo.attributes.position.needsUpdate = true;
    points.rotation.y = t * 0.02;
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
