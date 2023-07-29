<script setup>
import { ref, onMounted } from "vue";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const props = defineProps(['item', 'model'])

const tagRef = ref(null)


onMounted(() => {
  const sceneTag = new CSS2DObject(tagRef.value);
  const obj = props.model.getObjectByName(props.item.queryName);
  obj.add(sceneTag);
})

</script>

<template>
  <div class="sceneTag" ref="tagRef">{{ item.name }}</div>
</template>

<style scoped>
.sceneTag {
  color: #00dddd;
  font-size: 18px;
  padding: 4px 16px;
  padding-bottom: 8px;
  background-image: url(../assets/sceneTag.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>