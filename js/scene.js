


let _scene, _camera, _renderer;

export function initScene() {
  
  _scene = new THREE.Scene();

  
  const w = window.innerWidth;
  const h = window.innerHeight;
  _camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
  _camera.position.set(0, 1.5, 14);
  _camera.lookAt(0, 0, 0);

  
  const canvas = document.getElementById('three-canvas');
  _renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  _renderer.setSize(w, h);
  _renderer.shadowMap.enabled = true;
  _renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  _renderer.setClearColor(0x0a0608, 1);

  
  _setupLights();

  return { scene: _scene, camera: _camera, renderer: _renderer };
}

function _setupLights() {
  
  const ambient = new THREE.AmbientLight(0xf5dde8, 0.55);
  _scene.add(ambient);

  
  const keyLight = new THREE.PointLight(0xe87fa0, 2.2, 28);
  keyLight.name = 'keyLight';
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 512;
  keyLight.shadow.mapSize.height = 512;
  _scene.add(keyLight);

  
  const fillLight = new THREE.PointLight(0xf0a8c0, 1.0, 22);
  fillLight.position.set(-6, 2, 5);
  fillLight.name = 'fillLight';
  _scene.add(fillLight);

  
  const rimLight = new THREE.PointLight(0xffffff, 0.7, 20);
  rimLight.position.set(2, -4, -6);
  rimLight.name = 'rimLight';
  _scene.add(rimLight);
}

export function getScene()    { return _scene; }
export function getCamera()   { return _camera; }
export function getRenderer() { return _renderer; }