


const PETAL_COUNT   = 28;
const DOM_PETAL_COUNT = 12;
const PETAL_EMOJIS  = ['🌸', '🌺', '✿', '❀', '🌷'];

let _petalGroup = null;
let _petalData  = [];  
let _scene      = null;


export function init3DParticles(scene) {
  _scene = scene;
  _petalGroup = new THREE.Group();

  const colors = [0xe8a0b0, 0xc45c7a, 0xf5c5d5, 0xd4708a, 0xf0e0e8];

  for (let i = 0; i < PETAL_COUNT; i++) {
    
    const shape = new THREE.Shape();
    const sz = 0.08 + Math.random() * 0.12;
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-sz * 0.5, sz * 0.4, -sz * 0.45, sz * 0.9, 0, sz);
    shape.bezierCurveTo(sz * 0.45, sz * 0.9, sz * 0.5, sz * 0.4, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 5);
    const mat = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55 + Math.random() * 0.35,
      roughness: 0.8,
    });

    const mesh = new THREE.Mesh(geo, mat);

    
    const startY = -6 + Math.random() * 14;
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      startY,
      (Math.random() - 0.5) * 6 - 1
    );
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    _petalGroup.add(mesh);
    _petalData.push({
      mesh,
      speed:       0.008 + Math.random() * 0.018,
      wobble:      0.003 + Math.random() * 0.008,
      wobbleOffset: Math.random() * Math.PI * 2,
      startY,
      resetY: -6,
      topY:    9,
    });
  }

  scene.add(_petalGroup);
  return _petalGroup;
}


export function initDOMPetals() {
  const container = document.getElementById('dom-petals');
  if (!container) return;

  for (let i = 0; i < DOM_PETAL_COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'dom-petal';
    el.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];

    
    el.style.left     = `${5 + Math.random() * 90}%`;
    
    const dur  = 7 + Math.random() * 10;
    const delay = Math.random() * 12;
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay   = `${delay}s`;
    el.style.fontSize = `${0.9 + Math.random() * 1.1}rem`;

    container.appendChild(el);
  }
}



export function updateParticles(elapsed) {
  if (!_petalData.length) return;

  _petalData.forEach((p, idx) => {
    
    p.mesh.position.y += p.speed;

    
    p.mesh.position.x += Math.sin(elapsed * 0.7 + p.wobbleOffset + idx) * p.wobble;
    p.mesh.position.z += Math.cos(elapsed * 0.5 + p.wobbleOffset + idx * 0.7) * p.wobble * 0.6;

    
    p.mesh.rotation.x += 0.004;
    p.mesh.rotation.z += 0.003;

    
    if (p.mesh.position.y > p.topY) {
      p.mesh.position.y = p.resetY;
      p.mesh.position.x = (Math.random() - 0.5) * 10;
      p.mesh.position.z = (Math.random() - 0.5) * 6 - 1;
    }
  });
}