import * as THREE from 'three'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {getRandomColor} from "@/utils/index.js";
import emitter from "@/utils/emitter.js";

const loader = new GLTFLoader();

const model = new THREE.Group()

function createLanternSphere() {
    const geometry = new THREE.IcosahedronGeometry(1, 15);

    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.scale.setScalar(10);
    sphere.translateZ(300);
    sphere.layers.enable(1);
    sphere.visible = false;

    return sphere;
}

function getHouseWindowByName(name) {
    const object = model.getObjectByName(name)
    const windowMesh = object.children[2]

    return windowMesh
}

function findAndSetHouseWindow(name) {
    const windowMesh = getHouseWindowByName(name)
    const originalMaterial = windowMesh.material.clone()
    windowMesh.originalMaterial = originalMaterial
    windowMesh.layers.enable(1);
}


let percentDiv = null

loader.load('/city_scene_tarifa/scene.gltf', function (gltf) {
    console.log(gltf)
    model.add(gltf.scene);

    // 路灯
    for (let i = 1; i <= 5; i++) {
        const streetLight = model.getObjectByName('Lantern00' + i)

        const lanternSphere = createLanternSphere();
        lanternSphere.name = 'lanternSphere00' + i;

        streetLight.add(lanternSphere);
    }

    // 所有房子窗户
    const houseWindows = ['Object_15', 'Shop', 'Restaurant']
    houseWindows.forEach(name => {
        findAndSetHouseWindow(name)
    })

    emitter.emit('modelLoaded', model)
}, function (xhr) {
    console.log(xhr)
    emitter.emit('modelLoading', xhr)
})

export {
    model,
    getHouseWindowByName
}