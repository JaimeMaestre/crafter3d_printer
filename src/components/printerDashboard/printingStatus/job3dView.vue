<template>
  <div class="border_radius_10 text_center">
    <div class="p_80 background_printFileName">3d view</div>
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

<style scope>
.background_printFileName {
  background-color: var(--grey-color-13);
  padding: 5px;
  opacity: 50%;
  color: var(--primary-font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
