<template>
  <div class="box_content_large">
    <div class="box_content_header">
      <div><font-awesome-icon :icon="['fas', 'list']" class="mr_8" />Latest Print Files</div>
      <div v-if="box_visible === false" class="open_button" @click="box_visible = true">
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
      <div v-if="box_visible === true" class="open_button" @click="box_visible = false">
        <font-awesome-icon :icon="['fas', 'angle-up']" />
      </div>
    </div>

    <div v-if="box_visible === true" class="box_content_info">
      <div class="upload_button">
        <button @click="uploadNewFile" class="btn button_complementary w_100">
          <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="mr_8" /> Upload new
          File
        </button>
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          accept=".gcode"
          multiple
          style="display: none"
        />
      </div>

      <table class="mt_40">
        <thead>
          <tr>
            <th class="image">Img</th>
            <th class="title_name">Name</th>
            <th class="hide_mobile_1350">Filament</th>
            <th class="hide_mobile_700">Weight</th>
            <th class="hide_mobile_700">Print Time</th>
            <th class="hide_mobile_1350">Size</th>
            <th class="hide_mobile_1350">Date</th>
            <th>Cfg</th>
            <th>Opt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, index) in GeneralVariablesStore.allPrintFiles" :key="index">
            <td class="image">
              <img src="/public/images/printer_90.png" alt="print file overview" />
            </td>
            <td class="title_name font_complementary font_ellipsis" :title="job.path">
              {{ job.path.replace(/^gcodes\//, '').replace('.gcode', '') }}
            </td>
            <td class="hide_mobile_1350">{{ job.metadata.filament.toFixed(2) }} m</td>
            <td class="hide_mobile_700">{{ job.metadata.weigth.toFixed(0) }} g</td>
            <td class="hide_mobile_700">
              {{ GeneralVariablesStore.formatPrintTime(job.metadata.estimated_time) }}
            </td>
            <td class="hide_mobile_1350">{{ (job.size / (1024 * 1024)).toFixed(2) }} Mb</td>
            <td class="hide_mobile_1350 font_wrap date_format">
              {{ GeneralVariablesStore.formatFileTime(job.modified) }}
            </td>
            <td class="image" :title="'45 Degrees'">
              <img src="/public/images/printer_45.png" alt="print file overview" />
            </td>
            <td class="file_options">
              <filesDropdown :job_info="job" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { usePrintFilesStore } from '@/stores/usePrintFilesStore'
import filesDropdown from '@/components/general/filesDropdown.vue'

//variables
const PrintFilesStore = usePrintFilesStore()
const fileInput = ref(null)
const GeneralVariablesStore = useGeneralVariablesStore()
const box_visible = ref(true)

// Actions
const uploadNewFile = () => {
  fileInput.value.click()
}

const onFileChange = (event) => {
  PrintFilesStore.uploadPrintFile(event.target.files)
}
</script>

<style scoped>
.upload_button {
  text-align: right;
}

.date_format {
  max-width: 120px;
}
</style>
