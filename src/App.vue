<script setup>
import { onMounted, ref } from 'vue'
import { initRenderer } from './init.js'
import Control from './components/control.vue'
import SceneTag from "@/components/sceneTag.vue";
import emitter from "@/utils/emitter.js";

const sceneTags = [
  { name: '员工宿舍A', queryName: 'Object_15' },
  { name: '员工宿舍B', queryName: 'Shop' },
  { name: '西餐厅', queryName: 'Restaurant' },
]

const modelRef = ref(null)
const backRef = ref(null)
const isModelLoaded = ref(false)
const percent = ref(0)
const lengthComputable = ref(false)

const noopFormat = () => ''

onMounted(() => {
  backRef.value.style.width = window.innerWidth + 'px';
  backRef.value.style.height = window.innerHeight + 'px';
  initRenderer()
})

emitter.on('modelLoaded', async (model) => {
  modelRef.value = model
  isModelLoaded.value = true
})

emitter.on('modelLoading', (xhr) => {
  if (xhr.lengthComputable) {
    const percentVal = Math.floor(xhr.loaded / xhr.total * 100);
    percent.value = percentVal
  }
  lengthComputable.value = xhr.lengthComputable
})
</script>

<template>
  <div ref="backRef" class="back" v-if="!isModelLoaded">
    <el-progress
        class="percent"
        :indeterminate="!lengthComputable"
        :text-inside="false"
        :stroke-width="6"
        :percentage="percent"
        :format="noopFormat"
    />
  </div>
  <Control v-if="isModelLoaded" ref="controlRef" />
  <div v-if="isModelLoaded">
    <SceneTag v-for="(item, index) in sceneTags" :key="index" :item="item" :model="modelRef" />
  </div>
</template>

<style scoped>
.percent {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -4px;
  margin-left: -200px;
  z-index: 11;
}
.back {
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>
