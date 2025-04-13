<template>
  <button class="btn button_empty">
    <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
  </button>
  <div class="dropdown_content_menu">
    <a class="print_now" @click="print_file(job_info.path)">
      <font-awesome-icon :icon="['fas', 'play']" class="mr_8" /> Print now
    </a>
    <a @click="ModalStore.showModalAddQueue(job_info.path)">
      <font-awesome-icon :icon="['fas', 'plus']" class="mr_8" /> Add queue
    </a>
    <a class="delete" @click="deleteFile(job_info.path)">
      <font-awesome-icon :icon="['fas', 'trash-can']" class="mr_8" /> Delete
    </a>
  </div>
</template>

<script setup>
import { useJobQueueStore } from '@/stores/useJobQueueStore'
import { useModalStore } from '@/stores/useModalStore.js'
import { usePrintFilesStore } from '@/stores/usePrintFilesStore'

//variables
defineProps({
  job_info: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})
const PrintFilesStore = usePrintFilesStore()
const JobQueueStore = useJobQueueStore()
const ModalStore = useModalStore()

function deleteFile(filename) {
  PrintFilesStore.deletePrintFile(filename)
}

function print_file(filename) {
  // JobQueueStore.addQueueJob(filename)
  JobQueueStore.printFile(filename)
}
</script>

<style scoped>
.file_options .dropdown_content_menu .delete:hover {
  background-color: var(--error-color-9);
}

.file_options .dropdown_content_menu .print_now:hover {
  background-color: var(--success-color-11);
}

.file_options:hover .dropdown_content_menu {
  display: block;
}
</style>
