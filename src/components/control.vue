<script setup>
import { ref, watch } from 'vue'
import { directionalLight, ambient, fog, scene } from "@/scene/index.js";
import config from '@/scene/config.js'
import { finalComposer, mixPass } from "@/scene/composer.js";
import {getRandomColor} from "@/utils/index.js";
import * as THREE from "three";
import { getHouseWindowByName } from "@/scene/model.js";
import emitter from "@/utils/emitter.js";

const isNight = ref(false)
const showLabel = ref(true)

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
  emitter.emit('showLabel', val)
})
</script>

<template>
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
    </div>
  </div>
</template>

<style scoped>
.con {
  position: absolute;
  top: 250px;
  left: 20px;

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
</style>