import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


// Create a scene, which will hold all the elements like objects, cameras, and lights.
const scene = new THREE.Scene()

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
scene.add(cube)

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(cube.rotation, 'x', -Math.PI, Math.PI);
cubeFolder.add(cube.rotation, 'y', -Math.PI, Math.PI);
cubeFolder.add(cube.rotation, 'z', -Math.PI, Math.PI);

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -5, 5);
cameraFolder.add(camera.position, 'y', -5, 5);
cameraFolder.add(camera.position, 'z', -5, 5);

// Define an animation function to rotate the cube and render the scene continuously.
function animate() {
  requestAnimationFrame(animate)

  // Rotate the cube slightly on each frame around the x and y axes.
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01

  // Render the scene from the perspective of the camera.
  renderer.render(scene, camera)

  stats.update();
}

// Start the animation loop.
animate()
