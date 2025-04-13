import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { useModalStore } from './useModalStore'

export const useCrafterAPIStore = defineStore('CrafterAPIStore', () => {
  const GeneralVariablesStore = useGeneralVariablesStore()
  const modalStore = useModalStore()

  // States
  const isLoading = ref(false)
  const apiResponse = ref(null)

  // Create a new API instance for each request
  const getApi = () => {
    return axios.create({
      baseURL: 'http://' + GeneralVariablesStore.hostname + '/crafter3d-api',
      timeout: 10000, // 10 seconds timeout
    })
  }

  // post
  async function newWifiConnection(ssid, password) {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/wifi/new-connection', { ssid, password })
      apiResponse.value = response.data
    } catch (error) {
      modalStore.showErrorModal('Check your password:' + error.message)
    } finally {
      modalStore.showSuccessModal('Wifi added succesfully: ' + ssid)
      isLoading.value = false
    }
  }

  async function deleteWifiConnection(ssid) {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/wifi/delete-connection', { ssid })
      apiResponse.value = response.data
    } catch (error) {
      modalStore.showErrorModal('Unable to forget connection:' + error.message)
    } finally {
      modalStore.showSuccessModal('Connection succesfully forgotten: ' + ssid)
      isLoading.value = false
    }
  }

  async function saveInfiniteZConfig(newContent) {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/config-save-file/infinite-z', { content: newContent })
      modalStore.showSuccessModal(response.data.message)
    } catch (error) {
      modalStore.showErrorModal('Failed to update configuration file: ' + error.message)
    } finally {
      modalStore.showSuccessModal('File updated succesfully')
      isLoading.value = false
    }
  }

  async function saveStandardConfig(newContent) {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/config-save-file/standard', { content: newContent })
      modalStore.showSuccessModal(response.data.message)
    } catch (error) {
      modalStore.showErrorModal('Failed to update configuration file: ' + error.message)
    } finally {
      modalStore.showSuccessModal('File updated succesfully')
      isLoading.value = false
    }
  }

  async function savePrinterConfig(newContent) {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/config-save-file/printer', { content: newContent })
      modalStore.showSuccessModal(response.data.message)
    } catch (error) {
      modalStore.showErrorModal('Failed to update configuration file: ' + error.message)
    } finally {
      modalStore.showSuccessModal('File updated succesfully')
      isLoading.value = false
    }
  }

  async function togglePrinterStandardConfig() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/config-file/toggle-standard')
      modalStore.showSuccessModal(response.data.message)
    } catch (error) {
      modalStore.showErrorModal('Failed to update configuration file: ' + error.message)
    } finally {
      modalStore.showSuccessModal('File updated succesfully')
      isLoading.value = false
    }
  }

  async function togglePrinterInfiniteZConfig() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.post('/config-file/toggle-infinite-z')
      modalStore.showSuccessModal(response.data.message)
    } catch (error) {
      modalStore.showErrorModal('Failed to update configuration file: ' + error.message)
    } finally {
      modalStore.showSuccessModal('File updated succesfully')
      isLoading.value = false
    }
  }

  //getters
  async function getAvailableWifiNetworks() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/wifi/available-networks')
      apiResponse.value = response.data
    } catch (error) {
      console.error('Crafter API error:' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getSavedWifiConnections() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/wifi/saved-connections')
      apiResponse.value = response.data
    } catch (error) {
      console.error('Crafter API error:' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getActiveWifiConnection() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/wifi/active-connection')
      apiResponse.value = response.data
    } catch (error) {
      console.error('Crafter API error:' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getInfiniteZConfig() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/config-get-file/infinite-z')
      apiResponse.value = response.data.content
    } catch (error) {
      modalStore.showErrorModal('Failed to fetch configuration file: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getStandardConfig() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/config-get-file/standard')
      apiResponse.value = response.data.content
    } catch (error) {
      modalStore.showErrorModal('Failed to fetch configuration file: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getPrinterConfig() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/config-get-file/printer')
      apiResponse.value = response.data.content
    } catch (error) {
      modalStore.showErrorModal('Failed to fetch configuration file: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getUSBdevices() {
    isLoading.value = true
    try {
      const api = getApi()
      const response = await api.get('/serial/devices')
      apiResponse.value = response.data.devices
    } catch (error) {
      console.error('Failed to fetch USB connections: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    apiResponse,
    newWifiConnection,
    deleteWifiConnection,
    saveInfiniteZConfig,
    saveStandardConfig,
    savePrinterConfig,
    togglePrinterStandardConfig,
    togglePrinterInfiniteZConfig,
    getAvailableWifiNetworks,
    getSavedWifiConnections,
    getActiveWifiConnection,
    getInfiniteZConfig,
    getStandardConfig,
    getPrinterConfig,
    getUSBdevices,
  }
})
