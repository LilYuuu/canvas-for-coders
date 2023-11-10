import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { MapControls } from "three/addons/controls/MapControls";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper";

// app
const app = document.querySelector("#app");

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0xcccccc, 0.0005);

// perspective camera
// const camera = new THREE.PerspectiveCamera(
//   60,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   3000
// );

// orthographic camera
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0,
  3000
);

camera.position.set(100, 400, 250);
// camera.position.set(200, 200, 100);
camera.lookAt(0, 0, 0);

// axis helper -> X: red, Y: green, Z: blue
// const axesHelper = new THREE.AxesHelper(50);
// axesHelper.position.y = 0.01; // above the ground slightly
// scene.add(axesHelper);

// initialize clock
const clock = new THREE.Clock(); // requires delta time value in update()

// big sphere
const geometry = new THREE.SphereGeometry(5, 128, 128);
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
});
const sphereMesh = new THREE.Mesh(geometry, material);
sphereMesh.position.y = 100;
sphereMesh.scale.setScalar(5);
scene.add(sphereMesh);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// directional light
const dirLight = new THREE.DirectionalLight("#5500ff", 0.1);
dirLight.position.set(-100, 100, 0);
scene.add(dirLight);
// const dirLighthelper = new THREE.DirectionalLightHelper(dirLight, 10);
// scene.add(dirLighthelper);

// point light
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.position.set(0, 100, 0);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
scene.add(pointLightHelper);

// area light
// const rectLight = new THREE.RectAreaLight(0x00ff00, 3, 50, 100);
// rectLight.position.set(0, 50, 200);
// scene.add(rectLight);
// const rectLightHelper = new RectAreaLightHelper(rectLight);
// scene.add(rectLightHelper);

// spot light
const spotLight = new THREE.SpotLight(0x551111, 3);
spotLight.angle = Math.PI * 0.1;
spotLight.penumbra = 0.3;
spotLight.decay = 1;
spotLight.distance = 1000;
spotLight.position.set(150, 400, -50);
// spotLight.target.position.set(0, 0, 0);
spotLight.target = sphereMesh;
scene.add(spotLight, spotLight.target);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

const spotLight2 = new THREE.SpotLight(0x111177, 3);
spotLight2.angle = Math.PI * 0.1;
spotLight2.penumbra = 0.3;
spotLight2.decay = 1;
spotLight2.distance = 1000;
spotLight2.position.set(-150, 400, -50);
// spotLight2.target.position.set(0, 0, 0);
spotLight2.target = sphereMesh;
scene.add(spotLight2, spotLight2.target);
// const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
// scene.add(spotLightHelper2);

const spotLight3 = new THREE.SpotLight(0x115511, 3);
spotLight3.angle = Math.PI * 0.1;
spotLight3.penumbra = 0.3;
spotLight3.decay = 1;
spotLight3.distance = 1000;
spotLight3.position.set(0, 400, 150);
// spotLight3.target.position.set(0, 0, 0);
spotLight3.target = sphereMesh;
scene.add(spotLight3, spotLight3.target);
// const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);
// scene.add(spotLightHelper3);

// hemisphere light
const hemiLight = new THREE.HemisphereLight(0x000000, 0x00ffff, 1);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
// scene.add(hemiLightHelper);

// control
const controls = new OrbitControls(camera, renderer.domElement); // orbit control
// const controls = new MapControls(camera, renderer.domElement); // map control
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.rotateSpeed = 0.3;
controls.enableZoom = true;
controls.zoomSpeed = 0.5;
controls.minDistance = 10;
controls.maxDistance = 1000;

// first person control
// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 100;
// controls.lookSpeed = 0.02;
// const clock = new THREE.Clock(); // requires delta time value in update()

/*
////////////////////////////////////////////////////////////////////////////////
objects, you don't need to modify for week2 
*/

// ground
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.8,
  metalness: 0.2,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI * 0.5;
scene.add(groundMesh);

// spheres
// for (let i = 0; i < 30; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.z = -i * 100;
//   scene.add(mesh);
// }

////////////////////////////////////////////////////////////////////////////////

// resize
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  // camera.left = window.innerWidth / -2;
  // camera.right = window.innerWidth / 2;
  // camera.top = window.innerHeight / 2;
  // camera.bottom = window.innerHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onResize);

// animate
const animate = () => {
  requestAnimationFrame(animate);

  // controls.update();
  // controls.update(clock.getDelta());

  sphereMesh.position.x = Math.cos(clock.getElapsedTime()) * 50;
  sphereMesh.position.z = Math.sin(clock.getElapsedTime()) * 50;
  sphereMesh.position.y += Math.sin(clock.getElapsedTime()) * 0.3;

  pointLight.position.x = Math.cos(clock.getElapsedTime()) * 50;
  pointLight.position.z = Math.sin(clock.getElapsedTime()) * 50;
  pointLight.position.y += Math.sin(clock.getElapsedTime()) * 0.3;

  renderer.render(scene, camera);
};

animate();
