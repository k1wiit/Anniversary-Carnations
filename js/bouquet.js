


function petalShape(w, h) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-w * 0.7, h * 0.2,  -w * 0.8, h * 0.6,  -w * 0.35, h * 0.88);
  s.bezierCurveTo(-w * 0.15, h * 1.05,  0, h * 0.92,  0, h * 0.95);
  s.bezierCurveTo( 0, h * 0.92,   w * 0.15, h * 1.05,  w * 0.35, h * 0.88);
  s.bezierCurveTo( w * 0.8, h * 0.6,   w * 0.7, h * 0.2,  0, 0);
  return s;
}

function lerpColor(a, b, t) {
  return new THREE.Color(a).lerp(new THREE.Color(b), t);
}

export function makeCarnation(hueShift = 0) {
  const group = new THREE.Group();

  const outerColor = new THREE.Color(0xf0b8c8);
  const innerColor = new THREE.Color(0x8b2a45);
  outerColor.offsetHSL(hueShift, 0, 0);
  innerColor.offsetHSL(hueShift, 0, 0);

  const layers = [
    { n: 14, r: 0.18, y: 0.00, open: 1.15, pw: 0.30, ph: 0.55 },
    { n: 12, r: 0.14, y: 0.12, open: 0.90, pw: 0.27, ph: 0.50 },
    { n: 10, r: 0.10, y: 0.22, open: 0.68, pw: 0.24, ph: 0.45 },
    { n:  8, r: 0.07, y: 0.32, open: 0.46, pw: 0.20, ph: 0.38 },
    { n:  6, r: 0.04, y: 0.40, open: 0.24, pw: 0.15, ph: 0.30 },
  ];

  layers.forEach((cfg, li) => {
    const t   = li / (layers.length - 1);
    const col = lerpColor(outerColor, innerColor, t);
    const mat = new THREE.MeshStandardMaterial({
      color: col,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.0,
    });

    const shape = petalShape(cfg.pw, cfg.ph);
    const geo   = new THREE.ShapeGeometry(shape, 10);

    for (let i = 0; i < cfg.n; i++) {
      const azimuth = (i / cfg.n) * Math.PI * 2 + li * 0.25;
      const pivot = new THREE.Object3D();
      pivot.position.y = cfg.y;
      pivot.rotation.y = azimuth;

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = cfg.open;
      mesh.position.z = cfg.r;
      mesh.castShadow = true;

      pivot.add(mesh);
      group.add(pivot);
    }
  });

  const domeMat = new THREE.MeshStandardMaterial({
    color: innerColor,
    roughness: 0.4,
    metalness: 0.12,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), domeMat);
  dome.position.y = 0.42;
  group.add(dome);

  return group;
}

export function makeStem(topPos, bottomPos, bend = 0) {
  const mid = new THREE.Vector3(
    (topPos.x + bottomPos.x) / 2 + bend,
    (topPos.y + bottomPos.y) / 2,
    (topPos.z + bottomPos.z) / 2
  );
  const curve = new THREE.CatmullRomCurve3([bottomPos.clone(), mid, topPos.clone()]);
  const geo   = new THREE.TubeGeometry(curve, 20, 0.048, 7, false);
  const mat   = new THREE.MeshStandardMaterial({ color: 0x3a6b35, roughness: 0.8 });
  return new THREE.Mesh(geo, mat);
}

export function makeLeaf(size = 0.55, rotZ = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-size * 0.28, size * 0.4, -size * 0.18, size * 0.88, 0, size);
  shape.bezierCurveTo( size * 0.18, size * 0.88,  size * 0.28, size * 0.4, 0, 0);
  const geo  = new THREE.ShapeGeometry(shape, 6);
  const mat  = new THREE.MeshStandardMaterial({ color: 0x2d5a27, side: THREE.DoubleSide, roughness: 0.75 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.z = rotZ;
  return mesh;
}


function makeConeDetails(CONE_TOP_Y, CONE_BOT_Y, CONE_TOP_R, CONE_BOT_R, CONE_HEIGHT) {
  const group = new THREE.Group();
  const coneMidY = (CONE_TOP_Y + CONE_BOT_Y) / 2;

  
  const dotMat = new THREE.MeshStandardMaterial({
    color: 0xc87898,
    roughness: 0.5,
    metalness: 0.05,
    transparent: true,
    opacity: 0.75,
  });

  const DOT_ROWS = 5;
  const DOT_COLS = 20;
  const DOT_RADIUS = 0.030;

  for (let row = 0; row < DOT_ROWS; row++) {
    const t = 0.12 + (row / (DOT_ROWS - 1)) * 0.72;
    const y = CONE_TOP_Y - t * CONE_HEIGHT;
    const r = CONE_TOP_R + (CONE_BOT_R - CONE_TOP_R) * t + 0.025;
    const colOffset = row % 2 === 0 ? 0 : Math.PI / DOT_COLS;

    for (let col = 0; col < DOT_COLS; col++) {
      const angle = (col / DOT_COLS) * Math.PI * 2 + colOffset;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(DOT_RADIUS, 7, 7), dotMat);
      dot.position.set(Math.sin(angle) * r, y, Math.cos(angle) * r);
      group.add(dot);
    }
  }

  
  const scallopMat = new THREE.MeshStandardMaterial({
    color: 0xe8a8c0,
    roughness: 0.45,
    transparent: true,
    opacity: 0.88,
  });

  const SCALLOP_COUNT = 24;
  const SCALLOP_R = CONE_TOP_R + 0.03;

  for (let i = 0; i < SCALLOP_COUNT; i++) {
    const angle = (i / SCALLOP_COUNT) * Math.PI * 2;
    const scallop = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), scallopMat);
    scallop.scale.set(0.55, 0.28, 0.55);
    scallop.position.set(
      Math.sin(angle) * SCALLOP_R,
      CONE_TOP_Y + 0.005,
      Math.cos(angle) * SCALLOP_R
    );
    group.add(scallop);
  }

  
  
  
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0xd4a0b8,
    roughness: 0.6,
    transparent: true,
    opacity: 0.30,
    side: THREE.DoubleSide,
  });

  const STRIPE_COUNT = 10;
  const STRIPE_ARC   = (2 * Math.PI) / STRIPE_COUNT * 0.28; 

  for (let i = 0; i < STRIPE_COUNT; i++) {
    const startAngle = (i / STRIPE_COUNT) * Math.PI * 2;
    
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(
        CONE_TOP_R + 0.008,   
        CONE_BOT_R + 0.008,   
        CONE_HEIGHT,
        3,                    
        1,
        true,                 
        startAngle,
        STRIPE_ARC
      ),
      stripeMat
    );
    stripe.position.set(0, coneMidY, 0);
    group.add(stripe);
  }

  return group;
}


export function buildBouquet() {
  const bouquet = new THREE.Group();

  const configs = [
    { x:  0.00, y: 2.9,  z:  0.00, h:  0.00 },
    { x:  0.55, y: 2.75, z:  0.10, h:  0.03 },
    { x: -0.55, y: 2.75, z:  0.10, h: -0.03 },
    { x:  1.10, y: 2.45, z:  0.00, h:  0.05 },
    { x: -1.10, y: 2.45, z:  0.00, h: -0.05 },
    { x:  0.55, y: 2.35, z:  0.70, h:  0.02 },
    { x: -0.55, y: 2.35, z:  0.70, h: -0.02 },
    { x:  0.00, y: 2.30, z:  0.85, h:  0.04 },
    { x:  1.00, y: 2.20, z:  0.55, h: -0.04 },
    { x: -1.00, y: 2.10, z:  0.55, h:  0.06 },
    { x:  1.45, y: 1.90, z: -0.10, h: -0.06 },
    { x: -1.45, y: 1.90, z: -0.10, h:  0.02 },
    { x:  0.70, y: 1.80, z: -0.60, h: -0.02 },
    { x: -0.70, y: 1.80, z: -0.60, h:  0.04 },
    { x:  0.00, y: 1.75, z: -0.75, h: -0.04 },
  ];

  const CONE_TOP_Y  =  1.50;
  const CONE_BOT_Y  =  0.30;
  const CONE_TOP_R  =  1.55;
  const CONE_BOT_R  =  0.25;
  const CONE_HEIGHT = CONE_TOP_Y - CONE_BOT_Y;

  configs.forEach((cfg, i) => {
    const fg = new THREE.Group();
    fg.add(makeCarnation(cfg.h));

    const stemTopLocal = new THREE.Vector3(0, -0.05, 0);
    const spread = Math.sqrt(cfg.x * cfg.x + cfg.z * cfg.z) || 0.001;
    const nx = cfg.x / spread;
    const nz = cfg.z / spread;

    const STEM_TARGET_WORLD_Y = 0.65;
    const stemBotLocal = new THREE.Vector3(
      (nx * 0.12) - cfg.x,
      STEM_TARGET_WORLD_Y - cfg.y,
      (nz * 0.12) - cfg.z
    );

    fg.add(makeStem(stemTopLocal, stemBotLocal, 0));

    if (i % 2 === 0) {
      const leaf = makeLeaf(0.38, i % 4 === 0 ? 0.45 : -0.45);
      leaf.position.set(
        stemBotLocal.x * 0.45,
        stemBotLocal.y * 0.38,
        stemBotLocal.z * 0.45 + 0.04
      );
      fg.add(leaf);
    }

    fg.position.set(cfg.x, cfg.y, cfg.z);
    fg.rotation.z = cfg.x * 0.08;
    fg.rotation.x = cfg.z * 0.06;
    bouquet.add(fg);
  });

  
  const wrapMat = new THREE.MeshStandardMaterial({
    color: 0xf5dde8,
    roughness: 0.72,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const coneMidY = (CONE_TOP_Y + CONE_BOT_Y) / 2;
  const cone = new THREE.Mesh(
    new THREE.CylinderGeometry(CONE_TOP_R, CONE_BOT_R, CONE_HEIGHT, 32, 1, true),
    wrapMat
  );
  cone.position.set(0, coneMidY, 0);
  bouquet.add(cone);

  const innerMat = new THREE.MeshStandardMaterial({ color: 0xeaccda, roughness: 0.8, side: THREE.BackSide });
  const innerCone = new THREE.Mesh(
    new THREE.CylinderGeometry(CONE_TOP_R - 0.02, CONE_BOT_R - 0.02, CONE_HEIGHT, 32, 1, true),
    innerMat
  );
  innerCone.position.set(0, coneMidY, 0);
  bouquet.add(innerCone);

  
  bouquet.add(makeConeDetails(CONE_TOP_Y, CONE_BOT_Y, CONE_TOP_R, CONE_BOT_R, CONE_HEIGHT));

  
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xc45c7a, roughness: 0.35, metalness: 0.08 });
  const ribbon = new THREE.Mesh(
    new THREE.CylinderGeometry(CONE_BOT_R + 0.40, CONE_BOT_R + 0.30, 0.13, 32),
    ribbonMat
  );
  ribbon.position.set(0, CONE_BOT_Y + 0.50, 0);
  bouquet.add(ribbon);

  const bowMat = new THREE.MeshStandardMaterial({ color: 0xe07090, roughness: 0.35, metalness: 0.05 });
  [-1, 1].forEach(side => {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10), bowMat);
    lobe.scale.set(1.1, 0.40, 0.36);
    lobe.position.set(side * 0.25, CONE_BOT_Y + 0.60, 0.55);
    lobe.rotation.z = side * 0.30;
    bouquet.add(lobe);
  });
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 10), bowMat);
  knot.position.set(0, CONE_BOT_Y + 0.60, 0.56);
  bouquet.add(knot);

  bouquet.position.y = 0.4;
  return bouquet;
}