import * as THREE from 'three'
import {scene} from "@/scene/index.js";
import {renderer} from "@/scene/renderer.js";
import {camera, controls} from "@/scene/camera.js";
import { bloomComposer, finalComposer } from "@/scene/composer.js";
import config from '@/scene/config.js'
import { CSS2LabelRenderer } from "@/scene/CSS2DRenderer.js";
import TWEEN from '@tweenjs/tween.js'

export function initRenderer() {
    document.body.appendChild(renderer.domElement);

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
        TWEEN.update();
        controls.update();
        requestAnimationFrame(render);
    }
    render();

    function compatLandscape() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const app = document.getElementById('app');

        // 适配手机横屏展示
        if (width > height) {
            app.style.width = width + "px";
            app.style.height = height + "px";
            app.style.top = "0";
            app.style.left = "0";
            app.style.transform = 'none';
            app.style.transformOrigin = '50% 50%';
        } else {
            app.style.width = height + "px";
            app.style.height = width + "px";
            app.style.top = ((height - width) / 2) + "px";
            app.style.left = 0 - ((height - width) / 2) + "px";
            app.style.transform = 'rotate(90deg)';
            app.style.transformOrigin = '50% 50%';
        }
    }

    window.onresize = function(){
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(innerWidth, innerHeight);
        CSS2LabelRenderer.setSize(innerWidth, innerHeight);
        bloomComposer.setSize( width, height );
        finalComposer.setSize( width, height );

        compatLandscape();

        // 相机适配手机横屏展示
        if (width > height) {
            camera.aspect = width / height;
        } else {
            camera.aspect = height / width;
        }
        camera.updateProjectionMatrix();
    };

    window.addEventListener('orientationchange', compatLandscape);

}