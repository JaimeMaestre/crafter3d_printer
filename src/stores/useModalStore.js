import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // Variables
  const visibleModalError = ref(false)
  const visibleModalSuccess = ref(false)
  const visibleModalLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const visibleModalAddQueue = ref(false)
  const filePath = ref()

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

  return {
    visibleModalError,
    visibleModalSuccess,
    visibleModalAddQueue,
    visibleModalLoading,
    errorMessage,
    successMessage,
    filePath,
    showErrorModal,
    showSuccessModal,
    showModalAddQueue,
    showLoadingModal,
    closeModalError,
    closeModalSuccess,
    closeModalAddQueue,
    closeModalLoading,
  }
})
