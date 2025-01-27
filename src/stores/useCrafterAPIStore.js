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

  // Methods
  async function executeCommand(command) {
    isLoading.value = true
    try {
      const response = await api.post('/shell/execute', { command })
      apiResponse.value = response.data
    } catch (error) {
      modalStore.showErrorModal('Crafter API error:' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  async function newWifi(ssid, password) {
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

  async function fetchAvailableNetworks() {
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

  async function fetchSavedConnections() {
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

  async function forgetConnection(ssid) {
    isLoading.value = true
    try {
      const response = await api.post('/wifi/forget-connection', { ssid })
      apiResponse.value = response.data
    } catch (error) {
      modalStore.showErrorModal('Unable to forget connection:' + error.message)
    } finally {
      modalStore.showSuccessModal('Connection succesfully forgotten: ' + ssid)
      isLoading.value = false
    }
  }

  async function fetchActiveConnection() {
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

  return {
    isLoading,
    apiResponse,
    executeCommand,
    newWifi,
    fetchAvailableNetworks,
    fetchSavedConnections,
    forgetConnection,
    fetchActiveConnection,
  }
})
