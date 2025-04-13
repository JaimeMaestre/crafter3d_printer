<template>
  <div class="box_content_large mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'terminal']" class="mr_8" />
        G-code Console
      </div>
      <div class="refresh_timer">Next update in: {{ countdown }}s</div>
    </div>

    <div class="box_content_info">
      <textarea
        class="console_output"
        ref="consoleOutput"
        readonly
        :value="formattedHistory"
      ></textarea>
      <div class="console_input">
        <span class="console_prompt">></span>
        <input
          type="text"
          v-model="currentCommand"
          placeholder="Enter G-code command"
          class="console_command_input"
          @keyup.enter="executeCommand"
          ref="commandInput"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed, onUnmounted } from 'vue'
import { useGcodeStore } from '@/stores/useGcodeStore'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

const gCodeStore = useGcodeStore()
const GeneralVariablesStore = useGeneralVariablesStore()
const currentCommand = ref('')
const commandInput = ref(null)
const consoleOutput = ref(null)
const countdown = ref(5)
let refreshInterval = null
let countdownInterval = null

const formattedHistory = computed(() => {
  return GeneralVariablesStore.gcodeHistory.map((command) => `> ${command}`).join('\n')
})

const scrollToBottom = () => {
  nextTick(() => {
    if (consoleOutput.value) {
      consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
    }
  })
}

const startRefreshTimer = () => {
  // Clear any existing intervals
  if (refreshInterval) clearInterval(refreshInterval)
  if (countdownInterval) clearInterval(countdownInterval)

  // Reset countdown
  countdown.value = 5

  // Start countdown
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 5
      refreshConsole()
    }
  }, 1000)
}

const refreshConsole = async () => {
  await gCodeStore.consoleHistory()
  scrollToBottom()
}

// Watch for changes in gcodeHistory and scroll to bottom
watch(
  () => GeneralVariablesStore.gcodeHistory,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

const executeCommand = async () => {
  if (currentCommand.value.trim()) {
    // Execute the command
    await gCodeStore.customGcode(currentCommand.value)
    // Clear input
    currentCommand.value = ''
    // Focus back on input
    nextTick(() => {
      commandInput.value?.focus()
    })
  }
}

onMounted(async () => {
  // Load initial G-code history
  await gCodeStore.consoleHistory()
  // Focus the input when component mounts
  commandInput.value?.focus()
  // Initial scroll to bottom
  scrollToBottom()
  // Start refresh timer
  startRefreshTimer()
})

onUnmounted(() => {
  // Clean up intervals
  if (refreshInterval) clearInterval(refreshInterval)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.console_output {
  background-color: var(--grey-color-13);
  border: 1px solid var(--primary-color-1);
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  min-height: 120px;
  height: 120px;
  width: 100%;
  resize: vertical;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  color: var(--primary-font-color);
  overflow-y: scroll;
}

/* Style the scrollbar */
.console_output::-webkit-scrollbar {
  width: 8px;
}

.console_output::-webkit-scrollbar-track {
  background: var(--grey-color-13);
}

.console_output::-webkit-scrollbar-thumb {
  background: var(--primary-color-1);
  border-radius: 4px;
}

.console_output::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

.console_input {
  display: flex;
  align-items: center;
  background-color: var(--grey-color-13);
  border: 1px solid var(--primary-color-1);
  border-radius: 4px;
  padding: 8px;
}

.console_prompt {
  color: var(--primary-color);
  margin-right: 8px;
  font-family: monospace;
}

.console_command {
  color: var(--primary-font-color);
  font-family: monospace;
}

.console_command_input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--primary-font-color);
  font-family: monospace;
  font-size: 14px;
  outline: none;
  padding: 0;
}

.refresh_timer {
  color: var(--primary-color);
  font-size: 14px;
  font-family: monospace;
}
</style>
