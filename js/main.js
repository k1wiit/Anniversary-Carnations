

import { initScene, getScene, getCamera, getRenderer } from './scene.js';
import { buildBouquet }                                 from './bouquet.js';
import { init3DParticles, initDOMPetals, updateParticles } from './particles.js';


let bouquet   = null;
let clock     = null;


const mouse   = { x: 0, y: 0 };
const current = { x: 0, y: 0 };


function init() {
  
  const { scene, camera, renderer } = initScene();

  
  bouquet = buildBouquet();
  scene.add(bouquet);

  
  init3DParticles(scene);

  
  initDOMPetals();

  
  clock = new THREE.Clock();

  
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove,  { passive: true });
  window.addEventListener('resize',    onResize,     { passive: true });

  
  requestAnimationFrame(animate);
}


function animate() {
  requestAnimationFrame(animate);

  const elapsed  = clock.getElapsedTime();
  const scene    = getScene();
  const camera   = getCamera();
  const renderer = getRenderer();

  
  current.x += (mouse.x - current.x) * 0.04;
  current.y += (mouse.y - current.y) * 0.04;

  
  if (bouquet) {
    bouquet.position.y = -1.5 + Math.sin(elapsed * 0.7) * 0.18;
    bouquet.rotation.y = current.x * 0.35;
    bouquet.rotation.x = current.y * 0.18;
  }

  
  const keyLight = scene.getObjectByName('keyLight');
  if (keyLight) {
    keyLight.position.set(
      Math.sin(elapsed * 0.45) * 7,
      3 + Math.cos(elapsed * 0.3) * 2,
      Math.cos(elapsed * 0.45) * 7
    );
  }

  
  updateParticles(elapsed);

  renderer.render(scene, camera);
}


function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
}

function onTouchMove(e) {
  if (!e.touches.length) return;
  const t = e.touches[0];
  mouse.x = (t.clientX / window.innerWidth  - 0.5) * 2;
  mouse.y = (t.clientY / window.innerHeight - 0.5) * 2;
}

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const camera   = getCamera();
  const renderer = getRenderer();

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}


init();