import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
// 空中视角
// camera.position.set(4373, 5170, -3535);
camera.position.set(2996, 1581, -2357);
// camera.position.set(1749, 632, -1820);
camera.lookAt(0, 0, 0);

export {
    camera
}