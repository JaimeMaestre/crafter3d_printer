<template>
  <div class="box_content_small">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'eye']" class="mr_8" /> Printer Status -
        <span class="font_italic"
          >{{ GeneralVariablesStore.printJobStatus.state.toUpperCase() }} ({{
            (GeneralVariablesStore.printJobStatus.progress * 100).toFixed(0)
          }}%)</span
        >
      </div>
      <div
        v-if="box_visible_printingStatus === false"
        class="open_button"
        @click="box_visible_printingStatus = true"
      >
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="box_visible_printingStatus === true"
        class="open_button"
        @click="box_visible_printingStatus = false"
      >
        <font-awesome-icon :icon="['fas', 'angle-up']" />
      </div>
    </div>
    <div v-if="box_visible_printingStatus === true" class="pb_20">
      <job3dView />

      <div class="box_content_info">
        <jobPercentageActions />
      </div>

      <lifeInformation />

      <div class="box_content_info mt_20">
        <jobSpeeds />
      </div>

      <div class="box_content_info">
        <jobQueue />
      </div>
    </div>
  </div>
</template>

<script setup>
import job3dView from '@/components/printerDashboard/printingStatus/job3dView.vue'
import jobPercentageActions from '@/components/printerDashboard/printingStatus/jobPercentageActions.vue'
import lifeInformation from '@/components/printerDashboard/printingStatus/lifeInformation.vue'
import jobSpeeds from '@/components/printerDashboard/printingStatus/jobSpeeds.vue'
import jobQueue from '@/components/printerDashboard/printingStatus/jobQueue.vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { ref } from 'vue'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()

const box_visible_printingStatus = ref(true)
</script>

<style scoped></style>
