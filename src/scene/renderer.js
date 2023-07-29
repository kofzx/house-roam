import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
    antialias: true, //开启锯齿
    // 对数深度缓冲区解决深度冲突问题
    logarithmicDepthBuffer: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true; // 设置渲染器，允许场景中使用阴影贴图
renderer.shadowMap.type = THREE.VSMShadowMap; // 以免模型表面产生条纹影响渲染效果

export {
    renderer
}