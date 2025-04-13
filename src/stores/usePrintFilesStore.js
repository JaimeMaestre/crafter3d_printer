import { defineStore } from 'pinia'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from '@/stores/useModalStore.js'

export const usePrintFilesStore = defineStore('printFiles', () => {
  // Imported Variables
  const websocketStore = useWebsocketStore()
  const GeneralVariablesStore = useGeneralVariablesStore()
  const modalStore = useModalStore()

  // Actions
  async function uploadPrintFile(files) {
    try {
      modalStore.showLoadingModal()
      for (const file of files) {
        try {
          await uploadSingleFile(file)
        } catch (error) {
          modalStore.showErrorModal('Failed to upload files' + error.message)
        }
      }
    } finally {
      modalStore.closeModalLoading()
      modalStore.showSuccessModal('Files uploaded succesfully')
    }
  }

  async function uploadSingleFile(selectedFile) {
    if (!selectedFile) {
      modalStore.showErrorModal('No file selected')
      return
    }

    // Check file type or extension
    const allowedExtensions = ['.gcode']
    const fileName = selectedFile.name.toLowerCase()
    const isGCodeFile = allowedExtensions.some((ext) => fileName.endsWith(ext))
    if (!isGCodeFile) {
      modalStore.showErrorModal('Invalid file type. Only G-code files are allowed.')
      return
    }

    // Create formData variable
    const formData = new FormData()
    formData.append('file', selectedFile)

    // Upload File
    try {
      const response = await fetch(`http://${GeneralVariablesStore.hostname}/server/files/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        modalStore.showErrorModal('File upload failed:' + response.statusText)
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      loadPrintFiles()
    } catch (error) {
      modalStore.showErrorModal('File upload error: ' + error.message)
    }
  }

  async function deletePrintFile(filename) {
    if (!filename) {
      modalStore.showErrorModal('No file selected for deletion')
      return
    }
    const filePath = `gcodes/${filename}`

    websocketStore
      .sendMessage('server.files.delete_file', { path: filePath })
      .then(() => {
        loadPrintFiles()
      })
      .catch((error) => {
        modalStore.showErrorModal('Unable to delete file: ' + error.message)
      })
  }

  async function loadPrintFiles() {
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (GeneralVariablesStore.isDatabaseLoaded) {
          clearInterval(checkConnection)
          resolve()
        }
      }, 100)
    })

    waitForConnection
      .then(() => {
        websocketStore
          .sendMessage('server.files.list')
          .then(async (response) => {
            if (response.result) {
              // Sort latest
              const sortedFiles = response.result.sort(
                (a, b) => new Date(b.modified) - new Date(a.modified),
              )

              // Fetch metadata for all files
              const filesWithMetadata = await Promise.all(
                sortedFiles.map(async (file) => {
                  const metadata = await loadMetaData(file.path)
                  return { ...file, metadata }
                }),
              )

              // Store all files
              GeneralVariablesStore.allPrintFiles = filesWithMetadata
              // Store 5 latest files
              const latestFiles = filesWithMetadata.slice(
                0,
                GeneralVariablesStore.database.countLatestPrintFiles,
              )
              GeneralVariablesStore.latestPrintFiles = latestFiles
            }
          })
          .catch((error) => {
            modalStore.showErrorModal('Failed to load print files: ' + error.message)
          })
      })
      .catch((error) => {
        modalStore.showErrorModal('Database is not loading: ' + error.message)
      })
  }

  async function loadMetaData(filename) {
    try {
      const response = await websocketStore.sendMessage('server.files.metadata', { filename })
      const thumbnails = response.result.thumbnails || []

      // Find the thumbnail with the largest size
      const largestThumbnail = thumbnails.reduce((largest, current) => {
        return current.size > (largest?.size || 0) ? current : largest
      }, null)
      return {
        slicer: response.result.slicer || 'Unkown',
        filament: response.result.filament_total / 1000 || '0',
        weigth: response.result.filament_total
          ? filamentWeight(response.result.filament_total)
          : '0',
        estimated_time: response.result.estimated_time || 0,
        thumbnails: largestThumbnail ? largestThumbnail.relative_path : 'Unkown',
      }
    } catch (error) {
      console.log('Failed to load metadata for file:', filename, 'Error:', error.message)
      return {}
    }
  }

  // Helpers
  function filamentWeight(length) {
    // Convert diameter from mm to cm
    const radius = 1.75 / 20 // Divide by 2 for radius, then by 10 for cm
    // Calculate volume in cm³
    const volume = Math.PI * Math.pow(radius, 2) * (length / 10) // Length in cm
    // Calculate weight in grams
    return volume * 1.24
  }

  return {
    uploadPrintFile,
    deletePrintFile,
    loadPrintFiles,
    loadMetaData,
  }
})
