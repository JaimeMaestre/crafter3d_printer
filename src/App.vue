<!-- App.vue -->
<template>
  <div id="app" class="body_container" @dragover.prevent="onDragOver">
    <TopBar />
    <SideBar />
    <main class="main_container">
      <router-view />
    </main>
    <PrinterServerError />
    <PrinterConfigError />
    <WebsocketError />
    <ErrorModal />
    <SuccessModal />
    <GeneralLoading />
    <GeneralError />
    <GeneralSucess />
    <WebsocketError />
    <AddWifi />
    <ForgetWifi />
    <ProbeAccuracyModal />

    <div
      class="drag_container"
      :class="{ 'drag-active': isDragging }"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div class="drag_content">
        <div><font-awesome-icon :icon="['fas', 'upload']" /></div>
        drop your Files here
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/Layout/SideBar.vue'
import TopBar from '@/components/Layout/TopBar.vue'
import ErrorModal from '@/components/Modals/GeneralError.vue'
import SuccessModal from '@/components/Modals/GeneralSucess.vue'
import GeneralLoading from '@/components/Modals/GeneralLoading.vue'
import PrinterConfigError from '@/components/Modals/PrinterConfigError.vue'
import PrinterServerError from '@/components/Modals/PrinterServerError.vue'
import WebsocketError from '@/components/Modals/WebsocketError.vue'
import { usePrintFilesStore } from '@/stores/usePrintFilesStore'
import { ref } from 'vue'
import GeneralError from '@/components/Modals/GeneralError.vue'
import GeneralSucess from '@/components/Modals/GeneralSucess.vue'
import AddWifi from '@/components/Modals/addWifi.vue'
import ForgetWifi from '@/components/Modals/forgetWifi.vue'
import ProbeAccuracyModal from '@/components/Modals/ProbeAccuracyModal.vue'

const isDragging = ref(false)
const PrintFilesStore = usePrintFilesStore()

function onDragLeave(event) {
  event.preventDefault()
  isDragging.value = false
}

function onDragOver(event) {
  event.preventDefault()
  isDragging.value = true
}

function onDrop(event) {
  event.preventDefault()
  isDragging.value = false
  const droppedFiles = event.dataTransfer.files
  PrintFilesStore.uploadPrintFile(droppedFiles)
}
</script>

<style scope>
.drag_container {
  width: 98%;
  height: 100%;
  position: fixed;
  left: 1%;
  top: 60px;
  z-index: 5;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  border: 5px dotted grey;
  display: none;
}

.drag_content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(110vh - 125px);
  font-size: 50px;
  text-align: center;
  color: var(--primary-font-color);
}

.drag_content input {
  display: none;
}

.drag-active {
  display: block;
}

@media (max-width: 1000px) {
  .drag_content {
    font-size: 30px;
  }
}
</style>
