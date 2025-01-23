import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'

export const useCrafterAPIStore = defineStore('crafterAPI', () => {
  const GeneralVariablesStore = useGeneralVariablesStore()

  // Base URL for the API
  const api = axios.create({
    baseURL: `http://${GeneralVariablesStore.hostname}`,
    timeout: 10000, // 10 seconds timeout
  })

  // States
  const isLoading = ref(false)
  const errorMessage = ref('')
  const apiResponse = ref(null)

  // Methods
  async function executeCommand(command) {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await api.post('/execute', { command })
      apiResponse.value = response.data
    } catch (error) {
      errorMessage.value = error.response?.data?.error || error.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStatus() {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await api.get('/status')
      apiResponse.value = response.data
    } catch (error) {
      errorMessage.value = error.response?.data?.error || error.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    errorMessage,
    apiResponse,
    executeCommand,
    fetchStatus,
  }
})
