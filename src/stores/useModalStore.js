import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // Variables
  const visibleModalError = ref(false)
  const errorMessage = ref('')
  const visibleModalSuccess = ref(false)
  const successMessage = ref('')
  const visibleModalLoading = ref(false)
  const visibleModalAddQueue = ref(false)
  const filePath = ref()
  const visibleModalAddWifi = ref(false)
  const ssidModalAddWifi = ref('')
  const securityModalAddWifi = ref('')
  const visibleModalForgetWifi = ref(false)
  const ssidModalForgetWifi = ref('')

  // Actions
  const showErrorModal = (message) => {
    errorMessage.value = message
    visibleModalError.value = true
  }

  const closeModalError = () => {
    visibleModalError.value = false
    errorMessage.value = ''
  }

  const showSuccessModal = (message) => {
    successMessage.value = message
    visibleModalSuccess.value = true

    // Auto-close after a timeout
    setTimeout(() => {
      visibleModalSuccess.value = false
      successMessage.value = ''
    }, 2000)
  }

  const closeModalSuccess = () => {
    visibleModalSuccess.value = false
    successMessage.value = ''
  }

  const showLoadingModal = () => {
    visibleModalLoading.value = true
  }

  const closeModalLoading = () => {
    visibleModalLoading.value = false
  }

  const showModalAddQueue = (file) => {
    filePath.value = file
    visibleModalAddQueue.value = true
  }

  const closeModalAddQueue = () => {
    visibleModalAddQueue.value = false
  }

  const showModalAddWifi = (ssid, security) => {
    securityModalAddWifi.value = security
    ssidModalAddWifi.value = ssid
    visibleModalAddWifi.value = true
  }

  const closeModalAddWifi = () => {
    visibleModalAddWifi.value = false
  }

  const showModalForgetWifi = (ssid) => {
    ssidModalForgetWifi.value = ssid
    visibleModalForgetWifi.value = true
  }

  const closeModalForgetWifi = () => {
    visibleModalForgetWifi.value = false
  }

  return {
    visibleModalError,
    errorMessage,
    visibleModalSuccess,
    successMessage,
    visibleModalLoading,
    visibleModalAddQueue,
    filePath,
    visibleModalAddWifi,
    ssidModalAddWifi,
    securityModalAddWifi,
    visibleModalForgetWifi,
    ssidModalForgetWifi,
    showErrorModal,
    showSuccessModal,
    showModalAddQueue,
    showLoadingModal,
    closeModalError,
    closeModalSuccess,
    closeModalAddQueue,
    closeModalLoading,
    showModalAddWifi,
    closeModalAddWifi,
    showModalForgetWifi,
    closeModalForgetWifi,
  }
})
