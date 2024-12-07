import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


// Create a scene, which will hold all the elements like objects, cameras, and lights.
// Set the background color of the scene to black.
const sceneA = new THREE.Scene()
sceneA.background = new THREE.Color(0xaaaaff)
// set image as background
const sceneB = new THREE.Scene()
sceneB.background = new THREE.TextureLoader().load('https://sbcode.net/img/grid.png')
// set 6 image as background
const sceneC = new THREE.Scene()
sceneC.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

let activeScene = sceneA;
const setScene = {
  sceneA: () => {
    activeScene = sceneA
  },
  sceneB: () => {
    activeScene = sceneB
  },
  sceneC: () => {
    activeScene = sceneC
  },
}

// Set up a camera with a perspective view. It is positioned at a distance of 1.5 units along the z-axis.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1.5

// Create a renderer to display the scene. The renderer's size is set to fill the window.
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Add an event listener to handle window resize events, updating the camera and renderer size.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

new OrbitControls(camera, renderer.domElement);

// Create a box geometry and a normal material with wireframe for visualizing the cube.
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

// Create a mesh from the geometry and material, and add it to the scene.
const cube = new THREE.Mesh(geometry, material)

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

const cubeRotationFolder = gui.addFolder('Cube Rotation');
cubeRotationFolder.add(cube.rotation, 'x', -Math.PI, Math.PI);
cubeRotationFolder.add(cube.rotation, 'y', -Math.PI, Math.PI);
cubeRotationFolder.add(cube.rotation, 'z', -Math.PI, Math.PI);

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -5, 5);
cameraFolder.add(camera.position, 'y', -5, 5);
cameraFolder.add(camera.position, 'z', -5, 5);

gui.add(setScene, 'sceneA').name('Scene A')
gui.add(setScene, 'sceneB').name('Scene B')
gui.add(setScene, 'sceneC').name('Scene C')

// Define an animation function to rotate the cube and render the scene continuously.
function animate() {
  activeScene.add(cube)
  requestAnimationFrame(animate)

  // Rotate the cube slightly on each frame around the x and y axes.
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01

  // Render the scene from the perspective of the camera.
  renderer.render(activeScene, camera)

  stats.update();
}

// Start the animation loop.
animate()
