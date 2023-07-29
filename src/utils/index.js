import * as THREE from "three";

export function getRandomColor() {
    return new THREE.Color().setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);
}