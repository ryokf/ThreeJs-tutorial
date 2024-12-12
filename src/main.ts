import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene()

new RGBELoader().load('img/studio_small_09_4k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.background = texture
  scene.castShadow = true
  scene.backgroundBlurriness = 0
})

const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 20, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.8
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const light = new THREE.DirectionalLight(0xffffff, 10)
light.position.set(5, 5, 5)
light.castShadow = true
light.receiveShadow = true
// scene.add(light)

const light2 = new THREE.DirectionalLight(0xffffff, 10)
light2.position.set(-5, 5, -5)
light2.castShadow = true
light2.receiveShadow = true
// scene.add(light2)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
)
// plane.receiveShadow = true
plane.castShadow = true
plane.rotation.x = -Math.PI / 2
scene.add(plane)

new GLTFLoader().load('models/porsche_911_gt3tm.glb', (gltf) => {
  const porcshe = gltf.scene.getObjectByName('GLTF_SceneRootNode') as THREE.Mesh
  porcshe.castShadow = true
  porcshe.rotation.x = Math.PI
  porcshe.rotation.z = Math.PI
  porcshe.rotation.y = Math.PI
  porcshe.position.y = 0

  const hood = gltf.scene.getObjectByName('Object_11') as THREE.Mesh
  const body = gltf.scene.getObjectByName("Object_169") as THREE.Mesh
  if (body.material instanceof THREE.MeshPhysicalMaterial) {
    body.material.color = new THREE.Color(0x99bbff);
    body.material.clearcoat = 1
    body.material.roughness = 0.3;
    body.material.metalness = 0.8
  }

  hood.material = new THREE.MeshPhysicalMaterial({ color: 0x99bbff, roughness: 0.3, clearcoat: 1, metalness: 0.8 })
  
  const velg = [
    'Object_173', 'Object_174',
    'Object_178', 'Object_179',
    'Object_183', 'Object_184',
    'Object_188', 'Object_189'
  ].map(name => gltf.scene.getObjectByName(name) as THREE.Mesh)
  
  const tires = [
    'Object_171', 'Object_181',
    'Object_186', 'Object_176',
  ].map(name => gltf.scene.getObjectByName(name) as THREE.Mesh)

  velg.forEach(wheel => {
    wheel.material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, clearcoat: 0.5 })
    wheel.visible = false
  })

  tires.forEach(tire => {
    tire.material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, clearcoat: 0.5 })
    tire.visible = false
  })

  scene.userData.wheel = []

  scene.add(porcshe)
  
  interface WheelConfig {
    position: [number, number, number];
    scale: [number, number, number];
    rotation?: { x?: number; y?: number; z?: number };
  }
  
  function createWheel(
    config: WheelConfig,
    material: THREE.MeshPhysicalMaterial,
    gltfPath: string,
    parent: THREE.Object3D,
    scene: THREE.Scene
  ): void {
    const loader = new GLTFLoader();
    loader.load(gltfPath, (gltf) => {
      const wheel = gltf.scene.getObjectByName("t5robjcleanermaterialmergergles") as THREE.Mesh;
      if (!wheel) {
        console.warn("Wheel object not found in the GLTF file.");
        return;
      }
  
      // Set position, scale, and rotation
      wheel.position.set(...config.position);
      wheel.scale.set(...config.scale);
      if (config.rotation) {
        wheel.rotation.set(
          config.rotation.x || 0,
          config.rotation.y || 0,
          config.rotation.z || 0
        );
      }
  
      // Configure the velg
      const velg = gltf.scene.getObjectByName("Object_6") as THREE.Mesh;
      if (velg) {
        velg.material = material;
        wheel.add(velg);
      } else {
        console.warn("Velg object not found in the GLTF file.");
      }
  
      // Add wheel to the scene's userData for future reference
      scene.userData.wheel = [...(scene.userData.wheel || []), wheel];
      parent.add(wheel);
    });
  }
  
  // Konfigurasi roda
  const wheelsConfig: WheelConfig[] = [
    { position: [2.3, 0.8, 3], scale: [1.55, 1.55, 1.55] },
    { position: [-2.3, 0.8, 3], scale: [1.55, 1.55, 1.55], rotation: { z: Math.PI } },
    { position: [2.3, 0.9, -3.2], scale: [1.55, 1.55, 1.55] },
    { position: [-2.3, 0.9, -3.2], scale: [1.55, 1.55, 1.55], rotation: { z: Math.PI } },
  ];
  
  // Material untuk velg
  const velgMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.6,
    roughness: 0,
    clearcoat: 1,
  });
  
  // Path model
  const gltfPath = "models/work_emotion_t5r.glb";
  
  // Tambahkan semua roda ke dalam porcshe
  wheelsConfig.forEach((config) => {
    createWheel(config, velgMaterial, gltfPath, porcshe, scene);
  });
  
  

  new GLTFLoader().load('models/porsche_gt3rs_spoiler.glb', (gltf) => {
    // const wheel = gltf.scene.getObjectByName("t5robjcleanermaterialmergergles") as THREE.Mesh
    const spoiler = gltf.scene
    spoiler.scale.set(0.3,0.3,0.3)
    spoiler.rotation.y = Math.PI
    spoiler.position.set(0.2,2,-5.3)
    porcshe.add(gltf.scene)
  })
  
})


const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
  requestAnimationFrame(animate)

  if (scene.userData.wheel) {
    scene.userData.wheel.forEach((v: { rotation: {
      x: number; z: number 
} }) => {
      v.rotation.x += 0.05;
    });
  }

  controls.update()

  renderer.render(scene, camera)

  stats.update()
}

animate()
