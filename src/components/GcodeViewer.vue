<template>
  <div class="gcode-viewer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';

const canvas = ref(null);

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Camera position
  camera.position.z = 50;

  // Add lights
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  // G-code visualization logic
  function createGcodePath() {
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(10, 10, 0),
    ]; // Replace this with parsed G-code paths

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }

  createGcodePath();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
</script>

<style scoped>
.gcode-viewer {
  width: 100%;
  height: 400px;
  overflow: hidden;
  position: relative;
}
canvas {
  display: block;
}
</style>
