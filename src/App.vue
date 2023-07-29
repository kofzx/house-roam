<script setup>
import { onMounted, ref } from 'vue'
import { initRenderer } from './init.js'
import MyProgress from './components/progress.vue'
import Control from './components/control.vue'
import SceneTag from "@/components/sceneTag.vue";
import emitter from "@/utils/emitter.js";
import { CSS2LabelRenderer } from "@/scene/CSS2DRenderer.js";

const sceneTags = [
  { name: '员工宿舍A', queryName: 'Object_15' },
  { name: '员工宿舍B', queryName: 'Shop' },
  { name: '西餐厅', queryName: 'Restaurant' },
]

const modelRef = ref(null)
const isModelLoaded = ref(false)

onMounted(() => {
  initRenderer()
})

emitter.on('modelLoaded', async (model) => {
  modelRef.value = model
  isModelLoaded.value = true
})

emitter.on('showLabel', (val) => {
  CSS2LabelRenderer.domElement.style.display = val ? 'block' : 'none'
})
</script>

<template>
  <MyProgress />
  <Control ref="controlRef" />
  <div v-if="isModelLoaded">
    <SceneTag v-for="(item, index) in sceneTags" :key="index" :item="item" :model="modelRef" />
  </div>
</template>

<style scoped>
</style>
