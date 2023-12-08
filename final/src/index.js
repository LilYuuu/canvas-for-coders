import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { MapControls } from "three/addons/controls/MapControls";
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

// orthographic camera
// const camera = new THREE.OrthographicCamera(
//   window.innerWidth / -2,
//   window.innerWidth / 2,
//   window.innerHeight / 2,
//   window.innerHeight / -2,
//   0,
//   5000
// );

// camera.position.set(100, 400, 250);
// camera.position.set(200, 200, 100);
// camera.lookAt(0, 0, 0);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  5000
);
camera.position.set(0, 600, -600);

// axis helper -> X: red, Y: green, Z: blue
// const axesHelper = new THREE.AxesHelper(50);
// axesHelper.position.y = 0.01; // above the ground slightly
// scene.add(axesHelper);

// initialize clock
const clock = new THREE.Clock(); // requires delta time value in update()

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
let pointLightIntensity = 0.5;
const pointLight = new THREE.PointLight(0xffffff, pointLightIntensity, 300);
pointLight.position.set(0, 100, 0);
scene.add(pointLight);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
// scene.add(pointLightHelper);

let pointLightIntensity2 = 0.5;
const pointLight2 = new THREE.PointLight(0xffffff, pointLightIntensity2, 300);
pointLight2.position.set(1500, 100, 0);
scene.add(pointLight2);

// area light
// const rectLight = new THREE.RectAreaLight(0x00ff00, 3, 50, 100);
// rectLight.position.set(0, 50, 200);
// scene.add(rectLight);
// const rectLightHelper = new RectAreaLightHelper(rectLight);
// scene.add(rectLightHelper);

// hemisphere light
const hemiLight = new THREE.HemisphereLight(0x000000, 0x00ffff, 1);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
// scene.add(hemiLightHelper);

// control
// const controls = new OrbitControls(camera, renderer.domElement); // orbit control
const controls = new MapControls(camera, renderer.domElement); // map control
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// controls.screenSpacePanning = false;
// controls.enableRotate = true;
// controls.rotateSpeed = 0.3;
// controls.enableZoom = true;
// controls.zoomSpeed = 0.5;
// controls.minDistance = 10;
// controls.maxDistance = 1000;

// first person control
// const controls = new FirstPersonControls(camera, renderer.domElement);/
// controls.movementSpeed = 100;
// controls.lookSpeed = 0.02;

// const clock = new THREE.Clock(); // requires delta time value in update()

/*
////////////////////////////////////////////////////////////////////////////////
*/

// positional audio
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio(listener);
const sound2 = new THREE.PositionalAudio(listener);

// load a sound and set it as the PositionalAudio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/AMei.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setVolume(1);
  sound.setRefDistance(500); // the distance at which the volume reduction starts taking effect
  sound.setRolloffFactor(10); // value describing how quickly the volume is reduced as the source moves away from the listener
  sound.setLoop(true);
  // console.log(sound);
});
audioLoader.load("/BuCiKa.mp3", function (buffer) {
  sound2.setBuffer(buffer);
  sound2.setVolume(0.2);
  sound2.setRefDistance(500);
  sound2.setRolloffFactor(10);
  sound2.setLoop(true);
});

// start playing on user interaction - https://developer.chrome.com/blog/autoplay/#webaudio
const play = () => {
  if (sound.buffer && !sound.isPlaying) sound.play();
  if (sound2.buffer && !sound2.isPlaying) sound2.play();
};
window.addEventListener("click", play);

// spheres
const sphereGeometry = new THREE.SphereGeometry(5, 128, 128);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 100, 0);
sphereMesh.scale.setScalar(5);
sphereMesh.add(sound);
scene.add(sphereMesh);

const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh2.position.set(1500, 100, 0);
sphereMesh2.scale.setScalar(5);
sphereMesh2.add(sound2);
scene.add(sphereMesh2);

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

  controls.update();
  // controls.update(clock.getDelta());

  let dist = camera.position.distanceTo(sphereMesh.position);
  // console.log(dist);
  if (dist > 700) {
    pointLightIntensity = 0.5;
    // console.log("off");
  } else {
    pointLightIntensity = 3;
    // console.log("on");
  }
  pointLight.intensity = pointLightIntensity;

  let dist2 = camera.position.distanceTo(sphereMesh2.position);
  if (dist2 > 700) {
    pointLightIntensity2 = 0.5;
    // console.log("off");
  } else {
    pointLightIntensity2 = 3;
    // console.log("on");
  }
  pointLight2.intensity = pointLightIntensity2;

  renderer.render(scene, camera);
};

animate();
