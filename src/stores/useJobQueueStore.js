import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from './useModalStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'

export const useJobQueueStore = defineStore('jobQueue', () => {
  const websocketStore = useWebsocketStore()
  const modalStore = useModalStore()
  const GeneralVariablesStore = useGeneralVariablesStore()

  /////////////////////////////////
  // Getters
  /////////////////////////////////
  function getQueueJobs() {
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (GeneralVariablesStore.isWebsocketConnected) {
          clearInterval(checkConnection)
          resolve()
        }
      }, 100)
    })

    waitForConnection
      .then(() => {
        websocketStore
          .sendMessage('server.job_queue.status')
          .then((response) => {
            if (response.result) {
              GeneralVariablesStore.queueJobs = response.result.queued_jobs || []
              GeneralVariablesStore.queueStatus = response.result.queue_state || 'Unkown'
            } else {
              modalStore.showErrorModal('Failed to retrieve queue jobs.')
            }
          })
          .catch((error) => {
            modalStore.showErrorModal('Failed to retrieve queue jobs: ' + error.message)
          })
      })
      .catch((error) => {
        alert('Websocket not responding: ' + error.message)
      })
  }

  /////////////////////////////////
  // Actions Job Queue
  /////////////////////////////////
  function addQueueJob(fileName) {
    websocketStore
      .sendMessage('server.job_queue.post_job', { filenames: fileName })
      .then(() => {
        modalStore.showSuccessModal('Job successfully enqueued: ' + fileName)
        getQueueJobs()
      })
      .catch((error) => {
        modalStore.showErrorModal('Failed to enqueue job: ' + error.message)
      })
  }

  function removeQueuedJob(jobId) {
    websocketStore
      .sendMessage('server.job_queue.delete_job', { job_ids: jobId })
      .then(() => {
        modalStore.showSuccessModal('Job successfully removed from the queue')
        getQueueJobs()
      })
      .catch((error) => {
        modalStore.showErrorModal('Failed to remove enqueued job: ' + error.message)
      })
  }

  function pauseQueue() {
    websocketStore
      .sendMessage('server.job_queue.pause')
      .then(() => {
        modalStore.showSuccessModal('Job queue successfully paused')
        getQueueJobs()
      })
      .catch((error) => {
        modalStore.showErrorModal('Failed to pause job queue: ' + error.message)
      })
  }

  function jobQueueJump(jobId) {
    websocketStore
      .sendMessage('server.job_queue.jump', { job_id: jobId })
      .then(() => {
        getQueueJobs()
      })
      .catch((error) => {
        modalStore.showErrorModal('Failed to perform queue jump: ' + error.message)
      })
  }

  function startQueue() {
    websocketStore
      .sendMessage('server.job_queue.start')
      .then(() => {
        getQueueJobs()
      })
      .catch((error) => {
        modalStore.showErrorModal('Failed to start job queue: ' + error.message)
      })
  }

  /////////////////////////////////
  // Actions Print
  /////////////////////////////////
  function printFile(filename) {
    websocketStore.sendMessage('printer.print.start', { filename: filename }).catch((error) => {
      modalStore.showErrorModal('Unable to start printing: ' + error.message)
    })
  }

  function pausePrint() {
    websocketStore.sendMessage('printer.print.pause').catch((error) => {
      modalStore.showErrorModal('Unable to pause printing: ' + error.message)
    })
  }

  function resumePrint() {
    websocketStore.sendMessage('printer.print.resume').catch((error) => {
      modalStore.showErrorModal('Unable to resume printing: ' + error.message)
    })
  }

  function cancelPrint() {
    websocketStore.sendMessage('printer.print.cancel').catch((error) => {
      modalStore.showErrorModal('Unable to start printing: ' + error.message)
    })
  }

  return {
    getQueueJobs,
    addQueueJob,
    removeQueuedJob,
    pauseQueue,
    startQueue,
    jobQueueJump,
    // Print File
    printFile,
    pausePrint,
    resumePrint,
    cancelPrint,
  }
})
