<script setup>
import { ref, watch } from 'vue'
import { directionalLight, ambient, fog, scene } from "@/scene/index.js";
import config from '@/scene/config.js'
import { finalComposer, mixPass } from "@/scene/composer.js";
import {getRandomColor, sleep} from "@/utils/index.js";
import * as THREE from "three";
import { model, getHouseWindowByName } from "@/scene/model.js";
import { CSS2LabelRenderer } from "@/scene/CSS2DRenderer.js";
import {camera, controls, defaultCameraPos, defaultLookAt, fireCameraPos, fireLookAt} from "@/scene/camera.js";
import { createCameraTween } from "@/utils/index.js";
import {closeToast, showToast} from 'vant';
import {generateFlame} from "@/scene/flame.js";
import {startCatAnimate} from "@/scene/cat.js";

const isNight = ref(false)
const showLabel = ref(true)
const showFire = ref(false)
const showHelpFire = ref(false)
const isCatAnimStart = ref(false)

const flameArr = []
const generateFire = () => {
  // 着火的花草处
  const fireGrass = ['Object_343', 'Object_1458', 'Object_161', 'Object_376', 'Object_10948']
  fireGrass.forEach((name, i) => {
    const flame = generateFlame(model, name)
    switch (i) {
      case 0:
        flame.translateY(-650)
        break
      case 1:
        flame.translateY(-350)
        break
      case 2:
        flame.translateY(-580)
        break
      case 3:
        flame.translateY(-380)
        break
      case 4:
        flame.translateY(-80)
        break
    }
    flameArr.push(flame)
    model.add(flame)
  })
}

const destoryFire = () => {
  for (let i = 0; i < flameArr.length; i++) {
    model.remove(flameArr[i])
  }
  flameArr.length = 0
}

const handleHelpFire = () => {
  isCatAnimStart.value = true
  showHelpFire.value = false
  closeToast()
  startCatAnimate((name) => {
    if (flameArr && flameArr.length > 0) {
      const item = flameArr.find(flame => flame.name === name)
      if (item) {
        model.remove(item)
        flameArr.splice(flameArr.indexOf(item), 1)
      }
    }
  }, () => {
    showToast({
      message: '谢谢你们，byd猫......',
      position: 'top',
      duration: 4000,
      onClose: async () => {
        await sleep(1000)
        showFire.value = false
        isCatAnimStart.value = false
      }
    })
  })
}

watch(isNight, (val) => {
  const windowMesh = getHouseWindowByName('Object_15')
  const windowMesh2 = getHouseWindowByName('Shop')
  const windowMesh3 = getHouseWindowByName('Restaurant')

  if (val) {
    directionalLight.intensity = 0.0
    ambient.intensity = 0.1
    config.isNight = true
    scene.fog = null
    finalComposer.addPass(mixPass)

    scene.traverse((item) => {
      if (item.name.includes('lanternSphere')) {
        item.visible = true
        item.material.color = getRandomColor()
      }
    })

    windowMesh.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2488, 0.11, 0.044) });
    windowMesh2.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.064, 0.262, 0.364) });
    windowMesh3.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.274, 0.2, 0.05) });
  } else {
    directionalLight.intensity = 0.8
    ambient.intensity = 0.9
    config.isNight = false
    scene.fog = fog
    finalComposer.removePass(mixPass)

    scene.traverse((item) => {
      if (item.name.includes('lanternSphere')) {
        item.visible = false
      }
    })

    windowMesh.material = windowMesh.originalMaterial;
    windowMesh2.material = windowMesh2.originalMaterial;
    windowMesh3.material = windowMesh3.originalMaterial;
  }
})

watch(showLabel, (val) => {
  showLabel.value = val
  CSS2LabelRenderer.domElement.style.display = val ? 'block' : 'none'
})

watch(showFire, (val) => {
  showFire.value = val

  controls.enableZoom = !val
  controls.enableRotate = !val
  controls.enablePan = !val

  if (val) {
    generateFire()
    showToast({
      message: '着火了，正在火速赶往现场......',
      position: 'top',
      duration: 3000,
      onOpened: () => {
        setTimeout(() => {
          controls.minDistance = 0
          createCameraTween(camera, controls, fireCameraPos, fireLookAt)
        }, 500)
      },
      onClose: () => {
        if (controls.minDistance === 0) {
          setTimeout(() => {
            showToast({
              message: '大事不好了!!!快去呼叫救火大队......',
              position: 'top',
              duration: 30000,
            })
            showHelpFire.value = true
          }, 1000)
        }
      }
    });
  } else {
    destoryFire()
    showHelpFire.value = false
    closeToast()
    controls.minDistance = 2000
    createCameraTween(camera, controls, defaultCameraPos, defaultLookAt)
  }
})
</script>

<template>
  <div>
    <div class="con">
      <div style="padding: 8px 12px;margin-top: -10px;">
        <div class="out">
          <span class="in">标签</span>
          <el-switch v-model="showLabel" />
        </div>
        <div class="out">
          <span class="in">{{ isNight ? '夜晚' : '白天' }}</span>
          <el-switch v-model="isNight" />
        </div>
        <div class="out">
          <span class="in">着火</span>
          <el-switch v-model="showFire" :disabled="isCatAnimStart" />
        </div>
      </div>
    </div>
    <div v-if="showHelpFire" class="center-button" @click="handleHelpFire">呼叫救火大队</div>
  </div>
</template>

<style scoped>
.con {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translate3d(0, -50%, 0);
}

.out {
  background: rgba(0, 0, 0, 0.4);
  width: 100px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  margin-top: 20px;
}

.in {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.3);
  display: inline-block;
  line-height: 40px;
  color: #fff;
  text-align: center;
}

.center-button {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  background-image: url(../assets/open/closeBg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  user-select: none;
  width: 800px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: rgba(0,255,255,1.0);
  line-height: 1;
}
</style>