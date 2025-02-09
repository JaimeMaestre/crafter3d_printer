import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { useModalStore } from './useModalStore'

export const useCrafterAPIStore = defineStore('CrafterAPIStore', () => {
  const GeneralVariablesStore = useGeneralVariablesStore()
  const modalStore = useModalStore()

  // Base URL for the API
  const api = axios.create({
    baseURL: `http://${GeneralVariablesStore.hostname}/crafter3d-api`,
    timeout: 10000, // 10 seconds timeout
  })

  // States
  const isLoading = ref(false)
  const apiResponse = ref(null)

  // post
  async function newWifiConnection(ssid, password) {
    isLoading.value = true
    try {
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
      const response = await api.post('/wifi/delete-connection', { ssid })
      apiResponse.value = response.data
    } catch (error) {
      modalStore.showErrorModal('Unable to forget connection:' + error.message)
    } finally {
      modalStore.showSuccessModal('Connection succesfully forgotten: ' + ssid)
      isLoading.value = false
    }
  }

  async function savePrinter45Config(newContent) {
    isLoading.value = true
    try {
      const response = await api.post('/config-save-file/printer-45', { content: newContent })
      modalStore.showSuccessModal(response.data.message)
    } catch (error) {
      modalStore.showErrorModal('Failed to update configuration file: ' + error.message)
    } finally {
      modalStore.showSuccessModal('File updated succesfully')
      isLoading.value = false
    }
  }

  async function savePrinterStandardConfig(newContent) {
    isLoading.value = true
    try {
      const response = await api.post('/config-save-file/printer-standard', { content: newContent })
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
      const response = await api.get('/wifi/active-connection')
      apiResponse.value = response.data
    } catch (error) {
      console.error('Crafter API error:' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getPrinter45Config() {
    isLoading.value = true
    try {
      const response = await api.get('/config-get-file/printer-45')
      apiResponse.value = response.data.content
    } catch (error) {
      modalStore.showErrorModal('Failed to fetch configuration file: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function getPrinterStandardConfig() {
    isLoading.value = true
    try {
      const response = await api.get('/config-get-file/printer-standard')
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
    savePrinter45Config,
    savePrinterStandardConfig,
    getAvailableWifiNetworks,
    getSavedWifiConnections,
    getActiveWifiConnection,
    getPrinter45Config,
    getPrinterStandardConfig,
    getUSBdevices,
  }
})
