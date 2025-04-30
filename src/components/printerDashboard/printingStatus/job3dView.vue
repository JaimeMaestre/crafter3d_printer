<template>
  <div class="border_radius_10 text_center">
    <div class="preview-container">
      <template
        v-if="
          GeneralVariablesStore.printJobStatus.job_thumbnail &&
          GeneralVariablesStore.printJobStatus.state !== 'standby'
        "
      >
        <img
          :src="GeneralVariablesStore.printJobStatus.job_thumbnail"
          alt="Print job preview"
          class="preview-image"
        />
      </template>
      <template v-else>
        <div class="p_80">3d view</div>
      </template>
    </div>
    <div class="background_printFileName">
      <font-awesome-icon :icon="['fa', 'file']" class="mr_8" />
      {{ GeneralVariablesStore.printJobStatus.filename }}
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
.background_printFileName {
  background-color: var(--grey-color-11);
  padding: 5px 20px;
  opacity: 50%;
  color: var(--primary-font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.preview-container {
  position: relative;
  width: 100%;
  min-height: 80px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 300px;
}
</style>
