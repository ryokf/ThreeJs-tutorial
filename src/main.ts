import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(5,5,5);
new OrbitControls(camera, renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1,1,1)
directionalLight.intensity = 1
directionalLight.castShadow = true
directionalLight.receiveShadow = true
scene.add(directionalLight)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshStandardMaterial({color: 0xffffff}))
plane.rotation.x = -Math.PI / 2 
plane.receiveShadow = true
plane.castShadow = true
scene.add(plane)

const sun = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color: 0xffffaa}))
sun.position.set(5,5,5)
scene.add(sun)

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = 0.5
cube.castShadow = true
// cube.receiveShadow = true
scene.add( cube );

function animate(){
  camera.lookAt(0,0,0)
  renderer.render(scene, camera)
  renderer.setAnimationLoop(animate)

  const time = Date.now() * 0.0005;
  const x = Math.sin(time) * 7;
  const y = Math.cos(time) * 5;
  directionalLight.position.set(x, y, 0)

  sun.position.set(x, y, 0)

  // cube.rotation.x += 0.01
  // cube.rotation.z += 0.01 
  // cube.rotation.y += 0.01
}

animate()