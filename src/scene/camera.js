import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {renderer} from "@/scene/renderer.js";

const defaultCameraPos = new THREE.Vector3(806, 2123, -934);
const defaultLookAt = new THREE.Vector3(0, 0, 0);
const fireCameraPos = new THREE.Vector3(-617, 784, 570);
const fireLookAt = new THREE.Vector3(-594, 87, -650);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);
camera.lookAt(defaultLookAt.x, defaultLookAt.y, defaultLookAt.z);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2000;
controls.maxDistance = 5000;
// 最大旋转角度
controls.maxPolarAngle = Math.PI / 2.2;
controls.addEventListener('change', () => {
    console.log(camera.position)
    console.log('target: ', controls.target)
})


export {
    camera,
    controls,
    defaultCameraPos,
    defaultLookAt,
    fireCameraPos,
    fireLookAt,
}