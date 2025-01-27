<template>
  <div class="printing_files_container mb_40">
    <printerStatus />
    <tableFiles />
  </div>
  <addQueue />
</template>

<script setup>
import printerStatus from '@/components/printFiles/printerStatus.vue'
import tableFiles from '@/components/printFiles/tableFiles.vue'
import addQueue from '@/components/Modals/addQueue.vue'
</script>

<style scoped>
.printing_files_container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.printing_files_container div {
  flex: 1 1 auto;
}

@media (max-width: 1050px) {
  .printing_files_container {
    display: block;
  }

  .box_content_small {
    width: 100%;
    max-width: 100%;
  }

  .box_content_large {
    margin-top: 20px;
  }
}
</style>
