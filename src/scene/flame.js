import * as THREE from 'three';

import {createTextureAnimationLoop} from "@/utils/index.js";
import {assets} from "@/scene/index.js";
// 创建一个火焰动画
function createFlame(){
  const w = 70;
  const h = 3 * w;
  const geometry = new THREE.PlaneGeometry(w, h);
  geometry.translate(0, h / 2, 0); // 火焰底部中点和局部坐标系坐标原点重合

  const texture = assets.texture.fireTexture;
  const num = 15; // 火焰多少帧图
  // .repeat方法设置uv两个方向纹理重复数量
  texture.repeat.set(1 / num, 1); // 1/num：从图像上截图一帧火焰
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.4, // 整体调节透明度 和三维场景相融合
    side: THREE.DoubleSide,
    depthWrite: false, //是否对深度缓冲区有任何的影响
  });
  const mesh = new THREE.Mesh(geometry, material);
  const flame = new THREE.Group();
  // 四个火焰mesh交叉叠加
  flame.add(mesh, mesh.clone().rotateY(Math.PI / 2), mesh.clone().rotateY(Math.PI / 4), mesh.clone().rotateY(Math.PI / 4 * 3))

  const stopFn = createTextureAnimationLoop(texture, num, 0.1);
  flame.stop = stopFn

  return flame;
}

function generateFlame(model, name) {
  const fireGrass = model.getObjectByName(name)
  const pos = new THREE.Vector3()
  fireGrass.getWorldPosition(pos)
  const flame = createFlame()
  flame.position.copy(pos)
  flame.name = name

  return flame
}

export { createFlame, generateFlame }