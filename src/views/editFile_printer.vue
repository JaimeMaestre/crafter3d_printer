<template>
  <div class="save_button">
    <h1 class="font_size_38 m_0">General Printer Configuration</h1>
    <button class="btn button_green" @click="saveConfig()">
      <font-awesome-icon :icon="['fas', 'floppy-disk']" class="mr_8" /> Save & Restart
    </button>
    <router-link to="/edit-file-standard" class="btn button_primary ml_8">
      <font-awesome-icon :icon="['fas', 'pen']" class="mr_8" /> Edit standard cfg
    </router-link>
    <router-link to="/edit-file-infinite-z" class="btn button_primary ml_8">
      <font-awesome-icon :icon="['fas', 'pen']" class="mr_8" /> Edit infinite-Z cfg
    </router-link>
  </div>
  <div class="editor-container">
    <div ref="editorContainer" class="code-editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView } from 'codemirror'
import { lineNumbers, highlightActiveLine, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { StreamLanguage } from '@codemirror/language'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { boysAndGirls } from 'thememirror'
import { useCrafterAPIStore } from '@/stores/useCrafterAPIStore'
import { useMoonrakerStore } from '@/stores/useMoonrakerStore.js'

const CrafterAPIStore = useCrafterAPIStore()
const MoonrakerStore = useMoonrakerStore()
const configContent = ref('')
const file_loaded = ref(false)
const editorContainer = ref(null)
const code_mirror = ref(null)

async function saveConfig() {
  file_loaded.value = false
  configContent.value = code_mirror.value.state.doc.toString()
  await CrafterAPIStore.savePrinterConfig(code_mirror.value.state.doc.toString())
  file_loaded.value = true
  MoonrakerStore.resetFirmware()
}

onMounted(async () => {
  await CrafterAPIStore.getPrinterConfig()
  configContent.value = CrafterAPIStore.apiResponse
  file_loaded.value = true
})

watch(file_loaded, (newValue) => {
  if (newValue == true) {
    code_mirror.value = new EditorView({
      state: EditorState.create({
        doc: configContent.value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          StreamLanguage.define(shell),
          [boysAndGirls],
          keymap.of(defaultKeymap),
        ],
      }),
      parent: editorContainer.value,
    })
  }
})
</script>

<style scoped>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
  margin-top: 110px;
  margin-bottom: 60px;
}

.code-editor {
  height: 100%;
  width: 100%;
}

.save_button {
  top: 54px;
  position: fixed;
  z-index: 1;
  padding: 20px 0px;
  background: black;
  width: 100%;
}

@media (max-width: 1000px) {
  .save_button {
    top: 46px;
  }
}
</style>
