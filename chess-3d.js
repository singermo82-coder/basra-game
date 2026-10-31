import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';

// Better WebGL chess board with drag-to-rotate orbit controls.
// The chess engine still lives in chess-runtime.js; this file is render-only.
export function createChess3D({ mount, onSquare }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#171f24');
  scene.fog = new THREE.Fog('#171f24', 18, 30);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(7.9, 10.1, 8.7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.38;
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;cursor:grab';
  renderer.domElement.setAttribute('aria-label', 'رقعة شطرنج ثلاثية الأبعاد: اسحب لتدوير الطاولة واضغط على المربع للعب');
  mount.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;
  controls.minDistance = 9.2;
  controls.maxDistance = 15.5;
  controls.minPolarAngle = 0.58;
  controls.maxPolarAngle = 1.18;
  controls.minAzimuthAngle = -Math.PI * 0.85;
  controls.maxAzimuthAngle = Math.PI * 0.85;
  controls.target.set(0, 0.52, 0);
  controls.update();
  const initialPosition=camera.position.clone();
  const initialTarget=controls.target.clone();
  function toggleAutoRotate(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate}
  function resetView(){controls.autoRotate=false;camera.position.copy(initialPosition);controls.target.copy(initialTarget);controls.update()}

  const hemi = new THREE.HemisphereLight(0xfff0d8, 0x2b3d49, 2.1);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.85);
  key.position.set(-6, 10, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -12;
  key.shadow.camera.right = 12;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  key.shadow.bias = -0.0002;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xf5b567, 1.2);
  fill.position.set(8, 6, -7);
  scene.add(fill);

  const accent = new THREE.PointLight(0xd59b54, 0.95, 24, 2);
  accent.position.set(0, 7.2, 0);
  scene.add(accent);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(13, 64),
    new THREE.ShadowMaterial({ opacity: 0.18 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.62;
  floor.receiveShadow = true;
  scene.add(floor);

  const boardRoot = new THREE.Group();
  scene.add(boardRoot);

  const wood = new THREE.MeshStandardMaterial({ color: 0x5e351b, roughness: 0.44, metalness: 0.18 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xe2b764, roughness: 0.26, metalness: 0.72 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x546c73, roughness: 0.44, metalness: 0.05 });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xe6d7b7, roughness: 0.5, metalness: 0.03 });
  const selectedMat = new THREE.MeshStandardMaterial({ color: 0xf8d564, roughness: 0.45, metalness: 0.08 });
  const targetMat = new THREE.MeshStandardMaterial({ color: 0x66bf7e, roughness: 0.45, metalness: 0.04 });

  function slab(w, h, d, y, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    boardRoot.add(mesh);
    return mesh;
  }

  slab(9.8, 0.46, 9.8, -0.29, wood);
  slab(9.08, 0.10, 9.08, -0.01, trim);
  slab(8.70, 0.06, 8.70, 0.045, wood);

  for (const [x, z] of [[-4.32, -4.32], [4.32, -4.32], [-4.32, 4.32], [4.32, 4.32]]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.18, 20), trim);
    foot.position.set(x, -0.50, z);
    foot.castShadow = true;
    foot.receiveShadow = true;
    boardRoot.add(foot);
  }

  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sq = new THREE.Mesh(
        new THREE.BoxGeometry(0.995, 0.05, 0.995),
        (row + col) % 2 ? darkMat : lightMat
      );
      sq.position.set(col - 3.5, 0.09, row - 3.5);
      sq.receiveShadow = true;
      sq.castShadow = false;
      sq.userData.square = 'abcdefgh'[col] + (8 - row);
      boardRoot.add(sq);
      squares.push(sq);
    }
  }

  const pieces = new THREE.Group();
  boardRoot.add(pieces);

  const ivory = new THREE.MeshPhysicalMaterial({
    color: 0xfff3df,
    roughness: 0.18,
    metalness: 0.02,
    clearcoat: 0.92,
    clearcoatRoughness: 0.15,
    sheen: 0.4,
    sheenColor: new THREE.Color(0xfff4de)
  });
  const black = new THREE.MeshPhysicalMaterial({
    color: 0x1d2026,
    roughness: 0.19,
    metalness: 0.22,
    clearcoat: 0.94,
    clearcoatRoughness: 0.16,
    sheen: 0.12,
    sheenColor: new THREE.Color(0xc8ab77)
  });
  const ivoryAccent = new THREE.MeshStandardMaterial({ color: 0xd5b98a, metalness: 0.52, roughness: 0.23 });
  const blackAccent = new THREE.MeshStandardMaterial({ color: 0xcaa569, metalness: 0.63, roughness: 0.25 });

  function lathe(profile, material, segments = 32) {
    const geom = new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(...p)), segments);
    const mesh = new THREE.Mesh(geom, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function sphere(rad, y, material, x = 0, z = 0) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(rad, 24, 16), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    return mesh;
  }

  function cylinder(top, bottom, height, y, material, sides = 32) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, sides), material);
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function ring(radius, tube, y, material) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 14, 40), material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function createPiece(type, color) {
    const group = new THREE.Group();
    const mat = color === 'w' ? ivory : black;
    const accentMat = color === 'w' ? ivoryAccent : blackAccent;

    const baseProfile = [[0, 0], [0.38, 0], [0.40, 0.05], [0.34, 0.12], [0.31, 0.17], [0.27, 0.22], [0.23, 0.27], [0.21, 0.32]];
    group.add(lathe(baseProfile, mat));
    group.add(ring(0.28, 0.017, 0.055, accentMat));

    const tall = t => [[0.21, 0.32], [0.24, 0.38], [0.18, 0.46], [0.16, t - 0.18], [0.20, t - 0.12], [0.23, t - 0.08], [0.18, t - 0.03], [0, t - 0.03]];

    if (type === 'p') {
      group.add(lathe([[0.21, 0.32], [0.16, 0.39], [0.14, 0.48], [0.18, 0.57], [0.15, 0.64], [0, 0.64]], mat));
      group.add(sphere(0.18, 0.82, mat));
      group.add(ring(0.11, 0.01, 0.68, accentMat));
    }

    if (type === 'r') {
      group.add(lathe(tall(0.96), mat));
      group.add(cylinder(0.29, 0.26, 0.12, 0.94, mat));
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        const block = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.17, 0.15), mat);
        block.position.set(Math.cos(a) * 0.21, 1.05, Math.sin(a) * 0.21);
        block.castShadow = true;
        group.add(block);
      }
    }

    if (type === 'n') {
      group.add(lathe([[0.21, 0.32], [0.20, 0.42], [0.14, 0.48], [0, 0.48]], mat));
      const shape = new THREE.Shape();
      shape.moveTo(-0.18, 0.42);
      shape.lineTo(-0.14, 0.82);
      shape.lineTo(-0.01, 1.06);
      shape.lineTo(0.18, 1.00);
      shape.lineTo(0.22, 0.84);
      shape.lineTo(0.12, 0.77);
      shape.lineTo(0.25, 0.61);
      shape.lineTo(0.16, 0.48);
      shape.lineTo(0.15, 0.42);
      shape.closePath();
      const geom = new THREE.ExtrudeGeometry(shape, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.035, bevelSegments: 3 });
      const horse = new THREE.Mesh(geom, mat);
      horse.rotation.y = Math.PI / 2;
      horse.position.z = -0.1;
      horse.castShadow = true;
      group.add(horse);
      group.add(sphere(0.045, 0.84, accentMat, 0.09, 0.19));
      group.add(cylinder(0.015, 0.015, 0.12, 0.96, accentMat, 10));
    }

    if (type === 'b') {
      group.add(lathe(tall(1.02), mat));
      group.add(sphere(0.22, 1.00, mat));
      const cut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.18), scene.background);
      cut.position.set(0.03, 1.11, 0);
      group.add(cut);
      group.add(sphere(0.058, 1.23, accentMat));
    }

    if (type === 'q') {
      group.add(lathe(tall(1.14), mat));
      group.add(cylinder(0.28, 0.18, 0.15, 1.09, mat));
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        group.add(sphere(0.07, 1.22, accentMat, Math.cos(a) * 0.22, Math.sin(a) * 0.22));
      }
      group.add(sphere(0.11, 1.17, mat));
    }

    if (type === 'k') {
      group.add(lathe(tall(1.2), mat));
      group.add(cylinder(0.25, 0.18, 0.11, 1.16, mat));
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.36, 0.12), accentMat);
      v.position.y = 1.40;
      v.castShadow = true;
      group.add(v);
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.11, 0.12), accentMat);
      h.position.y = 1.45;
      h.castShadow = true;
      group.add(h);
      group.add(ring(0.08, 0.01, 1.24, accentMat));
    }

    group.scale.setScalar(0.93);
    return group;
  }

  let flipped = false;
  let selection = null;
  let targetSquares = new Set();

  function clearPieces() {
    while (pieces.children.length) {
      const child = pieces.children[0];
      pieces.remove(child);
      child.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
      });
    }
  }

  function update(chess, { selected, targets = [], flip = false } = {}) {
    flipped = flip;
    selection = selected || null;
    targetSquares = new Set(targets);
    clearPieces();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const id = 'abcdefgh'[col] + (8 - row);
        const p = chess.get(id);
        if (!p) continue;
        const mesh = createPiece(p.type, p.color);
        mesh.position.set(col - 3.5, 0.13, row - 3.5);
        pieces.add(mesh);
      }
    }

    for (const sq of squares) {
      const active = sq.userData.square === selection;
      const target = targetSquares.has(sq.userData.square);
      const col = sq.userData.square.charCodeAt(0) - 97;
      const row = 8 - Number(sq.userData.square[1]);
      sq.material = active ? selectedMat : target ? targetMat : ((row + col) % 2 ? darkMat : lightMat);
    }

    boardRoot.rotation.y = flipped ? Math.PI : 0;
  }

  function setTheme(theme) {
    const schemes = {
      walnut: [0xead0a5, 0x936338, 0x63371d, 0xaa7842, '#171f24'],
      marble: [0xf9f7ee, 0x858e9d, 0xc9c6be, 0xe1dfd6, '#202329'],
      royal: [0xeee5d1, 0x285b87, 0x204b75, 0xd7af59, '#10253b'],
      emerald: [0xe8e4cc, 0x347d5b, 0x1e5846, 0xbb984f, '#122722'],
      noir: [0xbdb7a8, 0x3a3d43, 0x202124, 0x77736c, '#121519']
    };
    const c = schemes[theme] || schemes.walnut;
    lightMat.color.setHex(c[0]);
    darkMat.color.setHex(c[1]);
    wood.color.setHex(c[2]);
    trim.color.setHex(c[3]);
    scene.background = new THREE.Color(c[4]);
    scene.fog.color = new THREE.Color(c[4]);
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downX = 0, downY = 0, dragged = false;

  function pickSquare(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height * 2 - 1));
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(squares, false);
    if (hits.length) onSquare(hits[0].object.userData.square);
  }

  function onDown(e) {
    downX = e.clientX;
    downY = e.clientY;
    dragged = false;
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onMove(e) {
    if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) dragged = true;
  }

  function onUp(e) {
    renderer.domElement.style.cursor = 'grab';
    if (!dragged) pickSquare(e);
  }

  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerup', onUp);
  renderer.domElement.addEventListener('pointerleave', () => { renderer.domElement.style.cursor = 'grab'; });

  let active = true;
  let raf = 0;
  const observer = new ResizeObserver(resize);
  observer.observe(mount);

  function resize() {
    if (!active) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (w && h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  function animate() {
    if (!active) return;
    raf = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  resize();
  animate();

  function dispose() {
    active = false;
    cancelAnimationFrame(raf);
    observer.disconnect();
    controls.dispose();
    renderer.domElement.removeEventListener('pointerdown', onDown);
    renderer.domElement.removeEventListener('pointermove', onMove);
    renderer.domElement.removeEventListener('pointerup', onUp);
    clearPieces();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { update, dispose, setTheme, toggleAutoRotate, resetView };
}
