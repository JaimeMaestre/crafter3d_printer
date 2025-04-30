<template>
  <div class="box_content_small printFiles mt_32">
    <div class="box_content_header">
      <div><font-awesome-icon :icon="['fas', 'list']" class="mr_8" />Latest Print Files</div>
      <div
        v-if="box_visible_recentFiles === false"
        class="open_button"
        @click="box_visible_recentFiles = true"
      >
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="box_visible_recentFiles === true"
        class="open_button"
        @click="box_visible_recentFiles = false"
      >
        <font-awesome-icon :icon="['fas', 'angle-up']" />
      </div>
    </div>

    <div class="box_content_info pb_32" v-if="box_visible_recentFiles === true">
      <div class="upload_button">
        <button @click="uploadNewFile" class="btn button_complementary w_100">
          <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="mr_8" /> Upload new
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

      <table class="mt_20">
        <thead>
          <tr>
            <th class="image">Img</th>
            <th class="file_name">Name</th>
            <th>Cfg</th>
            <th class="file_options">Opt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, index) in GeneralVariablesStore.latestPrintFiles" :key="index">
            <td class="image">
              <img :src="job.metadata?.thumbnails || ''" alt="print file overview" />
            </td>
            <td class="file_name font_complementary" :title="job.path">
              {{
                job.path
                  .replace(/^gcodes\//, '')
                  .replace('.gcode', '')
                  .slice(0, 60) +
                (job.path.replace(/^gcodes\//, '').replace('.gcode', '').length > 60 ? '...' : '')
              }}
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

      <div class="no_jobs mt_20" v-if="GeneralVariablesStore.latestPrintFiles.length == 0">
        Not files uploaded
      </div>

      <div class="text_center mt_20" v-if="GeneralVariablesStore.latestPrintFiles.length > 0">
        <router-link to="/print-files" class="btn button_primary">
          <font-awesome-icon :icon="['fas', 'plus']" class="mr_8" /> See All
        </router-link>
      </div>
    </div>
  </div>
  <addQueue />
</template>

<script setup>
import { ref } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { usePrintFilesStore } from '@/stores/usePrintFilesStore'
import addQueue from '@/components/Modals/addQueue.vue'
import filesDropdown from '@/components/general/filesDropdown.vue'

//variables
const GeneralVariablesStore = useGeneralVariablesStore()
const PrintFilesStore = usePrintFilesStore()
const fileInput = ref(null)
const box_visible_recentFiles = ref(true)

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

.no_jobs {
  text-align: center;
}

table {
  width: 100%;
  table-layout: fixed;
}

table .file_name {
  overflow-wrap: anywhere;
  width: 65%;
}

.image {
  width: 15%;
  text-align: center;
}

.image img {
  max-width: 50px;
  max-height: 50px;
  object-fit: contain;
}

.file_options {
  width: 5%;
  padding: 0px;
  text-align: center;
}
</style>
