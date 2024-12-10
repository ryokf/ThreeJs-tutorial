import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene()

new RGBELoader().load('img/venice_sunset_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.background = texture
  scene.castShadow = true
  scene.backgroundBlurriness = 0.1
})

const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 10)

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

// const raycaster = new THREE.Raycaster()
// const pickables: THREE.Mesh[] = []
// const mouse = new THREE.Vector2()

// const arrowHelper = new THREE.ArrowHelper()
// arrowHelper.setLength(0.5)
// scene.add(arrowHelper)

// renderer.domElement.addEventListener('mousemove', (e) => {
//   mouse.set((e.clientX / renderer.domElement.clientWidth) * 2 - 1, -(e.clientY / renderer.domElement.clientHeight) * 2 + 1)

//   raycaster.setFromCamera(mouse, camera)

//   const intersects = raycaster.intersectObjects(pickables, false)

//   if (intersects.length) {
//     //console.log(intersects.length)
//     //console.log(intersects[0].point)
//     //console.log(intersects[0].object.name + ' ' + intersects[0].distance)
//     //console.log((intersects[0].face as THREE.Face).normal)

//     const n = new THREE.Vector3()
//     n.copy((intersects[0].face as THREE.Face).normal)
//     //n.transformDirection(intersects[0].object.matrixWorld)

//     arrowHelper.setDirection(n)
//     arrowHelper.position.copy(intersects[0].point)
//   }
// })

// renderer.domElement.addEventListener('dblclick', (e) => {
//   mouse.set((e.clientX / renderer.domElement.clientWidth) * 2 - 1, -(e.clientY / renderer.domElement.clientHeight) * 2 + 1)

//   raycaster.setFromCamera(mouse, camera)

//   const intersects = raycaster.intersectObjects(pickables, false)

//   if (intersects.length) {
//     const n = new THREE.Vector3()
//     n.copy((intersects[0].face as THREE.Face).normal)
//     //n.transformDirection(intersects[0].object.matrixWorld)

//     const cube = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial())
//     cube.lookAt(n)
//     cube.position.copy(intersects[0].point)
//     cube.position.addScaledVector(n, 0.1)
//     cube.castShadow = true

//     scene.add(cube)
//     pickables.push(cube)
//   }
// })

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(20, 20, 20)
light.castShadow = true
light.receiveShadow = true
scene.add(light)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
)
// plane.receiveShadow = true
plane.castShadow = true
plane.rotation.x = -Math.PI / 2
scene.add(plane)

new GLTFLoader().load('models/porsche_911_gt3tm.glb', (gltf) => {
  // console.log(gltf.scene.getObjectByName('Low_Poly_Rx7'))
  const porcshe = gltf.scene.getObjectByName('GLTF_SceneRootNode') as THREE.Mesh
  porcshe.castShadow = true
  porcshe.rotation.x = Math.PI
  porcshe.rotation.z = Math.PI
  porcshe.rotation.y = Math.PI

  const hood = gltf.scene.getObjectByName('Object_11') as THREE.Mesh
  const body = gltf.scene.getObjectByName("Object_169") as THREE.Mesh
  body.material.color = new THREE.Color(0xdddddd)
  body.material.roughness = 0

  hood.material = new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0, clearcoat: 0.5 })
  // console.log(hood.material)
  
  const wheels = [
    'Object_173', 'Object_174',
    'Object_178', 'Object_179',
    'Object_183', 'Object_184',
    'Object_188', 'Object_189'
  ].map(name => gltf.scene.getObjectByName(name) as THREE.Mesh)

  wheels.forEach(wheel => {
    wheel.material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0, clearcoat: 0.5 })
  })

  
  // wheel.material.roughness = 0

  scene.add(porcshe)
})

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

  stats.update()
}

animate()