<template>
  <div class="job_queue_header">
    <div><font-awesome-icon :icon="['fas', 'list-ol']" class="mr_8" />Job Queue</div>
    <template v-if="GeneralVariablesStore.queueStatus !== 'ready'">
      <button
        class="btn button_green"
        @click="JobQueueStore.startQueue"
        v-if="computedJobs.length > 0"
      >
        <font-awesome-icon :icon="['fas', 'play']" class="mr_8" /> Start Queue
      </button>
    </template>
    <template v-else>
      <button class="btn button_primary_empty">
        {{ GeneralVariablesStore.queueStatus }}
      </button>
    </template>
  </div>

  <table class="mt_20">
    <thead>
      <tr>
        <th class="title_name">Job</th>
        <th>Qty</th>
        <th class="file_options">Opt</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(job, index) in computedJobs" :key="job.index">
        <td class="title_name font_complementary" :title="job.path">
          {{ index + 1 }}.
          <span class="font_ellipsis">{{
            job.filename.replace(/^gcodes\//, '').replace('.gcode', '')
          }}</span>
        </td>
        <td class="image" :title="'45 Degrees'">
          {{ job.quantity }}
        </td>
        <td class="file_options">
          <button class="btn button_empty">
            <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
          </button>
          <div class="dropdown_content_menu">
            <a @click="enqueueTop(job.job_ids)">
              <font-awesome-icon :icon="['fas', 'angles-up']" class="mr_8" /> Print First
            </a>
            <a class="delete" @click="JobQueueStore.removeQueuedJob(job.job_ids[0])">
              <font-awesome-icon :icon="['fas', 'trash-can']" class="mr_8" /> Delete x 1
            </a>
            <a class="delete" @click="deleteAllQueueJobs(job.job_ids)">
              <font-awesome-icon :icon="['fas', 'trash-can-arrow-up']" class="mr_8" /> Delete all
            </a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="no_jobs mt_20" v-if="computedJobs.length == 0">Not jobs added</div>
</template>

<script setup>
import { computed } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { useJobQueueStore } from '@/stores/useJobQueueStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const JobQueueStore = useJobQueueStore()

// Actions
function deleteAllQueueJobs(jobIds) {
  jobIds.forEach((jobId) => {
    JobQueueStore.removeQueuedJob(jobId)
  })
}

function enqueueTop(jobIds) {
  jobIds.forEach((jobId) => {
    JobQueueStore.jobQueueJump(jobId)
  })
}

// Cumputed
const computedJobs = computed(() => {
  const jobList = []
  let currentFilename = null
  let currentQuantity = 0
  let currentJobIDs = []

  GeneralVariablesStore.queueJobs.forEach((job, index) => {
    const cleanFilename = job.filename.replace(/^gcodes\//, '').replace('.gcode', '')

    // Check if the current filename is different from the previous one
    if (cleanFilename !== currentFilename) {
      // If there was a previous group, push it to the list
      if (currentFilename !== null) {
        jobList.push({
          filename: currentFilename,
          quantity: currentQuantity,
          job_ids: currentJobIDs,
        })
      }

      // Reset tracking variables for the new filename group
      currentFilename = cleanFilename
      currentQuantity = 1
      currentJobIDs = [job.job_id]
    } else {
      // Increment quantity and add job_id to the current group
      currentQuantity++
      currentJobIDs.push(job.job_id)
    }

    // Push the last group after the loop ends
    if (index === GeneralVariablesStore.queueJobs.length - 1) {
      jobList.push({
        filename: currentFilename,
        quantity: currentQuantity,
        job_ids: currentJobIDs,
      })
    }
  })

  return jobList
})

// Actions
</script>

<style scoped>
.job_queue_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list_header {
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 2px solid var(--primary-font-color);
  align-items: center;
  font-weight: bold;
}

.list_header .job {
  width: 60%;
}

.no_jobs {
  text-align: center;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid var(--primary-font-color);
  align-items: center;
}

li .jobname {
  display: flex;
  align-items: center;
  width: 60%;
  white-space: nowrap;
}

li .job_quantity {
  display: flex;
  align-items: center;
}

li .job_quantity .btn {
  padding: 4px 10px;
}

.file_options .dropdown_content_menu .delete:hover {
  background-color: var(--error-color-9);
}

.file_options .dropdown_content_menu .print_now:hover {
  background-color: var(--success-color-11);
}

.file_options:hover .dropdown_content_menu {
  display: block;
}

.file_options {
  width: 40px;
  text-align: center;
}
</style>
