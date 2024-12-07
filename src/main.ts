import './style.css'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.add(new THREE.GridHelper()) // uncomment to see a grid on the scene

const camera = new THREE.PerspectiveCamera(
  75, // field of view (in degrees)
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000, // far clipping plane
)
// camera.position.set(0, 2, 3) // uncomment to change the camera position
// camera.lookAt(0, 0.5, 0) // uncomment to change the camera lookAt

const renderer = new THREE.WebGLRenderer({
  // antialias: true,
  // alpha: true,
  // logarithmicDepthBuffer: true,
  // canvas: document.getElementById('canvas'),
})
// set the size of the canvas
renderer.setSize(window.innerWidth, window.innerHeight)
// add the canvas to the DOM
document.body.appendChild(renderer.domElement)

// update the camera and renderer when the window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5 // move the cube up a bit to see the grid
scene.add(cube)

// add stats (FPS counter) to the page
const stats = new Stats()
document.body.appendChild(stats.dom)

// create a GUI to control the camera
const gui = new GUI()

const cameraFolder = gui.addFolder('Camera')
// add controls to the camera folder
cameraFolder.add(camera.position, 'x', -10, 10)
cameraFolder.add(camera.position, 'y', -10, 10)
cameraFolder.add(camera.position, 'z', -10, 10)
cameraFolder.add(camera, 'fov', 0, 180, 0.01).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'aspect', 0.00001, 10).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'near', 0.01, 10).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'far', 0.01, 10).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.open()

// animate the scene
function animate() {
  // update the stats
  stats.update()

  camera.lookAt(cube.position)

  // render the scene
  renderer.render(scene, camera)

  // request the next frame
  requestAnimationFrame(animate)
}

animate()
