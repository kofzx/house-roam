import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js'
import {model} from "@/scene/model.js";

export function getRandomColor() {
    return new THREE.Color().setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);
}

export function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

// 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
// pos: 三维向量Vector3，表示动画结束相机位置
// target: 三维向量Vector3，表示相机动画结束lookAt指向的目标观察点
export function createCameraTween(camera, controls, endPos, endTarget){
    const tween = new TWEEN.Tween({
        // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        tx: controls.target.x,
        ty: controls.target.y,
        tz: controls.target.z,
    })
        .to({
            // 动画结束相机位置坐标
            x: endPos.x,
            y: endPos.y,
            z: endPos.z,
            // 动画结束相机指向的目标观察点
            tx: endTarget.x,
            ty: endTarget.y,
            tz: endTarget.z,
        }, 2000)
        .onUpdate(function (obj) {
            // 动态改变相机位置
            camera.position.set(obj.x, obj.y, obj.z);
            // 动态计算相机视线
            // camera.lookAt(obj.tx, obj.ty, obj.tz);
            controls.target.set(obj.tx, obj.ty, obj.tz);
            controls.update();//内部会执行.lookAt()
        })
        .start();

    return tween
}

const textureLoader = new THREE.TextureLoader();

export function createTextureMesh(width, height, texture) {
    const geometry = new THREE.PlaneGeometry(width, height)

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    model.add(mesh);

    return mesh
}

export function createGifMesh(width, height, texture, num, speed) {
    const geometry = new THREE.PlaneGeometry(width, height)
    texture.repeat.set(1 / num, 1)

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    model.add(mesh);

    const stopFn = createTextureAnimationLoop(texture, num, speed)
    mesh.stop = stopFn

    return mesh
}

export function createTextureAnimationLoop(texture, frameNum, speed) {
    let t = 0;
    let stopAnimationFrame = null;
    function updateLoop() {
        t += speed;
        if (t > frameNum) t = 0;
        texture.offset.x = Math.floor(t) / frameNum;
        stopAnimationFrame = window.requestAnimationFrame(updateLoop);
    }
    updateLoop();

    const stop = () => {
        window.cancelAnimationFrame(stopAnimationFrame);
    }

    return stop
}

export function createAudio(url, options = {
    loop: true,
    volume: 0.9,
}) {
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(url, function(AudioBuffer) {
        audio.setBuffer(AudioBuffer);
        audio.setLoop(options.loop);
        audio.setVolume(options.volume);
    });

    return audio;
}
