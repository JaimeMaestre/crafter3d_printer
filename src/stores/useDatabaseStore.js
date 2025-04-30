import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { useModalStore } from './useModalStore'
import i18n from '@/languages'

export const useDatabaseStore = defineStore('database', () => {
  /////////////////////////////////
  // Variables
  /////////////////////////////////
  const websocketStore = useWebsocketStore()
  const GeneralVariablesStore = useGeneralVariablesStore()
  const ModalStore = useModalStore()

  /////////////////////////////////
  // Initialize
  /////////////////////////////////
  function initializeDatabase() {
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (GeneralVariablesStore.isWebsocketConnected) {
          clearInterval(checkConnection)
          resolve()
        }
      }, 100) // Check every 100ms
    })

    waitForConnection
      .then(() => {
        getDatabase()
        GeneralVariablesStore.isDatabaseLoaded = true
        console.log('Database Loaded')
      })
      .catch((error) => {
        ModalStore.showErrorModal('Websocket not responding: ' + error.message)
      })
  }

  /////////////////////////////////
  // Helpers
  /////////////////////////////////
  function isKeyMissing(local, remote) {
    for (const key in local) {
      if (!(key in remote)) {
        return true // Key is missing
      }
      const localValue = local[key]
      const remoteValue = remote[key]

      if (
        typeof localValue === 'object' &&
        localValue !== null &&
        typeof remoteValue === 'object' &&
        remoteValue !== null &&
        !Array.isArray(localValue)
      ) {
        if (isKeyMissing(localValue, remoteValue)) {
          return true
        }
      }
    }
    return false
  }

  /////////////////////////////////
  // Handle
  /////////////////////////////////
  function handleDatabase(data) {
    for (const key in data) {
      GeneralVariablesStore.database[key] = data[key]
    }
  }

  /////////////////////////////////
  // Getters
  /////////////////////////////////
  function getDatabase() {
    websocketStore
      .sendMessage('server.database.get_item', {
        namespace: 'crafter3d_web',
      })
      .then((response) => {
        if (response.result) {
          if (isKeyMissing(GeneralVariablesStore.database, response.result.value)) {
            updateDatabase()
          } else {
            handleDatabase(response.result.value)
            i18n.global.locale = GeneralVariablesStore.database.others.language || 'en'
          }
        } else {
          updateDatabase()
        }
      })
  }

  /////////////////////////////////
  // Delete
  /////////////////////////////////
  function deleteDatabase() {
    for (const key in GeneralVariablesStore.database) {
      websocketStore.sendMessage('server.database.delete_item', {
        namespace: 'crafter3d_web',
        key: key,
      })
    }
  }

  /////////////////////////////////
  // Actions
  /////////////////////////////////
  function updateDatabase() {
    deleteDatabase()
    for (const key in GeneralVariablesStore.database) {
      websocketStore.sendMessage('server.database.post_item', {
        namespace: 'crafter3d_web',
        key: key,
        value: GeneralVariablesStore.database[key],
      })
    }

    //set language
    i18n.global.locale = GeneralVariablesStore.database.others.language || 'en'
    ModalStore.showSuccessModal('DataBase Updated Succesfully')
  }

  return {
    initializeDatabase,
    getDatabase,
    updateDatabase,
    deleteDatabase,
  }
})
