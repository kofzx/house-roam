import TWEEN from '@tweenjs/tween.js'
import {createGifMesh, createTextureMesh, sleep} from "@/utils/index.js";
import {model} from "@/scene/model.js";
import {assets} from "@/scene/index.js";

const bananaCatX = -657
const happyCatOffsetX = 80
const appleCatOffsetX = 100


async function startCatAnimate(destoryFire, animateComplete) {
    // 香蕉猫走过来
    const bananaCatWalkMesh = createBananaCatWalk();
    await animateCat(bananaCatWalkMesh, bananaCatX, 3000);
    bananaCatWalkMesh.stop();
    model.remove(bananaCatWalkMesh);

    // 香蕉猫开始哭泣
    const bananaCatCryMesh = createBananaCatCry();
    const bananaCatCryAudio = assets.audio.bananaCatCryAudio
    bananaCatCryAudio.play()

    await sleep(5000)
    // 火焰慢慢消失
    destoryFire && destoryFire('Object_1458')
    await sleep(1000)
    if (destoryFire) {
        destoryFire('Object_343')
        destoryFire('Object_376')
    }
    await sleep(1000)
    if (destoryFire) {
        destoryFire('Object_161')
        destoryFire('Object_10948')
    }
    await sleep(2000)
    bananaCatCryAudio.stop()
    bananaCatCryMesh.stop()
    model.remove(bananaCatCryMesh)

    // 香蕉猫哭完以后，穿上了爱心，随后 happy猫 出现，music!
    const bananaCatAfterCryMesh = createBananaCatAfterCry()
    const happyCatMesh = createHappyCat()
    const happyCatAudio = assets.audio.happyCatAudio
    happyCatAudio.play()

    // happy了一段时间，苹果猫出现，清理战场
    await sleep(3000)
    const appleCatMesh = createAppleCat()
    await sleep(1000)

    animateComplete && animateComplete()

    // 开始清理战场
    const targetX = -1657
    await Promise.all([
        animateCat(appleCatMesh, targetX + appleCatOffsetX / 2, 3200),
        animateCat(bananaCatAfterCryMesh, targetX, 3000),
        animateCat(happyCatMesh, targetX - happyCatOffsetX / 2, 2800),
    ])
    happyCatAudio.stop()
    model.remove(happyCatMesh)
    model.remove(bananaCatAfterCryMesh)
    model.remove(appleCatMesh)


}

function animateCat(mesh, targetX, duration) {
    return new Promise(resolve => {
        new TWEEN.Tween({
            x: mesh.position.x,
        })
            .to({
                x: targetX,
            }, duration)
            .onUpdate((obj) => {
                mesh.position.x = obj.x;
            })
            .onComplete(() => {
                resolve();
            })
            .start();
    });
}

function createBananaCatWalk() {
    const mesh = createGifMesh(100, 100, assets.texture.bananaCatWalkPngTexture, 8, 0.8)
    mesh.position.set(-397, 557, 188)

    return mesh
}

function createBananaCatCry() {
    const mesh = createGifMesh(100, 100, assets.texture.bananaCatCryTexture, 10, 0.8)
    mesh.position.set(bananaCatX, 557, 188)
    mesh.scale.addScalar(0.2)

    return mesh
}

function createBananaCatAfterCry() {
    const mesh = createTextureMesh(100, 100, assets.texture.bananaCatAfterCryTexture)
    mesh.position.set(bananaCatX, 557, 188)

    return mesh
}

function createHappyCat() {
    const mesh = createGifMesh(100, 100, assets.texture.happyCatTexture, 10, 0.8)
    mesh.position.set(bananaCatX - happyCatOffsetX, 557, 188)
    mesh.scale.addScalar(0.2)

    return mesh
}

function createAppleCat() {
    const mesh = createGifMesh(100, 100, assets.texture.appleCatTexture, 8, 0.8)
    mesh.position.set(bananaCatX + appleCatOffsetX, 557, 188)
    mesh.scale.x = -1

    return mesh
}

export {
    startCatAnimate,
}