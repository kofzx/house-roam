import * as THREE from 'three'
import { model } from "@/scene/model.js";
import { assetsLoad } from "@/scene/assetsLoader.js";

const assets = assetsLoad();

const scene = new THREE.Scene();
scene.add(model);


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(853, 2000, 160);
scene.add(directionalLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);

// 雾化效果
const fog = new THREE.Fog(0xcccccc, 4000, 6000);
scene.fog = fog;

const geometry = new THREE.PlaneGeometry(8000, 8000); //矩形平面

const texture = assets.texture.stoneGroundTexture;
texture.colorSpace = THREE.SRGBColorSpace;

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

texture.repeat.set(12, 12);

const material = new THREE.MeshLambertMaterial({
    map: texture,
});

const ground = new THREE.Mesh(geometry, material);
ground.rotateX(-Math.PI / 2);
scene.add(ground);

// const axesHelper = new THREE.AxesHelper(2500);
// scene.add(axesHelper);

export {
    scene,
    directionalLight,
    ambient,
    fog,
    assets,
}