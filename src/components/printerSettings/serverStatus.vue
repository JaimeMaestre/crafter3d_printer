<template>
  <div class="box_content_large mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'temperature-three-quarters']" class="mr_8" />
        Server Status
      </div>
    </div>

    <div class="box_content_info">
      <serverCPU />
    </div>
  </div>
</template>

<script setup>
import serverCPU from '@/components/printerSettings/serverStatus/serverCPU.vue'
</script>

<style scoped>
h3 {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--primary-font-color);
}

p {
  margin: 0px;
  margin-top: 8px;
}

.space_between {
  justify-content: space-between;
}
</style>
