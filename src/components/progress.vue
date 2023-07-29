<script setup>

</script>

<template>
  <div id="progress">
    <!-- 进度条 -->
    <div id="per"> </div>
  </div>
</template>

<style scoped>
#progress {
  position: absolute;
  width: 400px;
  height: 16px;
  top: 50%;
  left:50%;
  margin-left: -200px;
  margin-top: -8px;
  border-radius: 8px;
  border: 1px solid #009999;
  overflow: hidden;
}
#per {
  height: 100%;
  width: 0px;
  background: #00ffff;
  color: #00ffff;
  line-height: 15px;
}
</style>