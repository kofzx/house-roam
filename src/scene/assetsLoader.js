import * as THREE from "three";

import stoneGround from "@/assets/stGround.jpg";
import fire from '@/assets/fire.png';
import bananaCatWalkPng from "@/assets/cat/bananaCatWalk.png";
import bananaCatCryPng from "@/assets/cat/bananaCatCry.png";
import bananaCatAfterCryGif from "@/assets/cat/bananaCatAfterCry.gif";
import happyCatPng from "@/assets/cat/happyCat.png";
import appleCatPng from "@/assets/cat/appleCat.png";
import {createAudio} from "@/utils/index.js";

const bananaCatCryMp3 = new URL('@/assets/cat/bananaCatCry.MP3', import.meta.url)
const happyCatMp3 = new URL('@/assets/cat/happyCat.MP3', import.meta.url)

const textureLoader = new THREE.TextureLoader();
export function assetsLoad() {
    const stoneGroundTexture = textureLoader.load(stoneGround)
    const fireTexture = textureLoader.load(fire)
    const bananaCatWalkPngTexture = textureLoader.load(bananaCatWalkPng)
    const bananaCatCryTexture = textureLoader.load(bananaCatCryPng)
    const bananaCatAfterCryTexture = textureLoader.load(bananaCatAfterCryGif)
    const happyCatTexture = textureLoader.load(happyCatPng)
    const appleCatTexture = textureLoader.load(appleCatPng)

    const bananaCatCryAudio = createAudio(bananaCatCryMp3.href)
    const happyCatAudio = createAudio(happyCatMp3.href)

    return {
        texture: {
            stoneGroundTexture,
            fireTexture,
            bananaCatWalkPngTexture,
            bananaCatCryTexture,
            bananaCatAfterCryTexture,
            happyCatTexture,
            appleCatTexture,
        },
        audio: {
            bananaCatCryAudio,
            happyCatAudio,
        }
    }
}