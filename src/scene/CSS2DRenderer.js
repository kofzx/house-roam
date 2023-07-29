import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
const CSS2LabelRenderer = new CSS2DRenderer();
CSS2LabelRenderer.setSize(window.innerWidth, window.innerHeight);
CSS2LabelRenderer.domElement.style.position = 'absolute';
CSS2LabelRenderer.domElement.style.top = '0px';
CSS2LabelRenderer.domElement.style.left = '0px';
CSS2LabelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(CSS2LabelRenderer.domElement);

export { CSS2LabelRenderer }