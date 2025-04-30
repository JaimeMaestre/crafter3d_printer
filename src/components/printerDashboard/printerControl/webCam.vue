<template>
  <div class="webcam_container">
    <div class="webcam_box" :class="{ webcam_box_disabled: !isStreamActive }">
      <div v-if="!isStreamActive" class="webcam_placeholder">
        <div>Webcam</div>
        <button class="btn button_primary mt_8" @click="toggleStream">
          <font-awesome-icon :icon="['fas', 'eye']" /> View
        </button>
      </div>
      <div v-else class="webcam_stream">
        <img :src="streamUrl" alt="Webcam Stream" />
        <button class="btn button_red stream_close" @click="toggleStream">X</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

const GeneralVariablesStore = useGeneralVariablesStore()

const isStreamActive = ref(false)
const streamUrl = 'http://' + GeneralVariablesStore.hostname + ':8080/?action=stream'
console.log(streamUrl)

function toggleStream() {
  isStreamActive.value = !isStreamActive.value
}
</script>

<style scoped>
.webcam_container {
  width: 100%;
  height: 300px;
  position: relative;
}

.webcam_box {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.webcam_placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.webcam_stream {
  width: 100%;
  height: 100%;
  position: relative;
}

.webcam_stream img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.stream_close {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0.8;
}

.stream_close:hover {
  opacity: 1;
}
</style>
