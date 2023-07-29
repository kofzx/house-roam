import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {scene} from "@/scene/index.js";
import {renderer} from "@/scene/renderer.js";
import {camera} from "@/scene/camera.js";
import { bloomComposer, finalComposer } from "@/scene/composer.js";
import config from '@/scene/config.js'
import { CSS2LabelRenderer } from "@/scene/CSS2DRenderer.js";

export function initRenderer() {
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2000;
    controls.maxDistance = 5000;
    // 最大旋转角度
    controls.maxPolarAngle = Math.PI / 2.2;
    // controls.addEventListener('change', () => {
    //     console.log(camera.position)
    // })

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(1);
    const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
    const materials = {};
    function darkenNonBloomed( obj ) {
        if (obj.isMesh && bloomLayer.test(obj.layers) === false ) {
            materials[obj.uuid] = obj.material;
            obj.material = darkMaterial;
        }
    }

    function restoreMaterial(obj) {
        if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];
        }
    }

    // 渲染循环
    function render() {
        if (config.isNight) {
            scene.traverse(darkenNonBloomed);
            bloomComposer.render();
            scene.traverse(restoreMaterial);
        }
        finalComposer.render();

        CSS2LabelRenderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(render);
    }
    render();

    window.onresize=function(){
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(innerWidth, innerHeight);
        CSS2LabelRenderer.setSize(innerWidth, innerHeight);
        bloomComposer.setSize( width, height );
        finalComposer.setSize( width, height );

        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
    };
}