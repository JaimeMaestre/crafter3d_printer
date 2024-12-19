<template>
  <div class="dashboard">
    <h2>Printer Status</h2>
    <p>Klippy Connected: {{ printerStatus.state.klippy_connected }}</p>
    <p>Klippy State: {{ printerStatus.state.klippy_state }}</p>
    <p>Current Print: {{ printerStatus.state.current_print.filename }}</p>
    <p>Progress: {{ printerStatus.state.current_print.progress }}%</p>
    <p>Toolhead Position: {{ printerStatus.state.toolhead.position.join(", ") }}</p>
    <p>Bed Temperature: {{ printerStatus.state.temperatures.bed.current }}°C</p>
    <p>Extruder Temperature: {{ printerStatus.state.temperatures.extruders[0].current }}°C</p>
    <!-- Button to send the "server.info" command -->
    <button @click="sendButtonCommand">Send Command: server.info</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { usePrinterStatus } from "@/stores/usePrinter";
import { connectWebSocket, disconnectWebSocket, sendCommand } from "@/api/websocket";

// Use the printer status store
const printerStatus = usePrinterStatus();
const isConnected = ref(false);

// Handle incoming WebSocket messages
const handleMessage = (data) => {
  console.log("Received WebSocket data:", data);

  // Check if data contains valid results or errors
  if (data.result) {
    printerStatus.updatePrinterStatus(data.result);
  } else if (data.error) {
    console.error("Error from WebSocket:", data.error.message);
  }
};

// Function to send a "server.info" JSON-RPC command
const sendButtonCommand = () => {
  console.log("Sending 'server.info' command");
  sendCommand("server.info");
  sendCommand("server.subscribe", {
    topics: ["notify_status_update"],
  });
};

// Handle WebSocket connection close
const handleWebSocketClose = () => {
  console.warn("WebSocket disconnected. Attempting to reconnect...");
  isConnected.value = false;
};

// Connect to WebSocket on component mount
onMounted(() => {
  console.log("Connecting to WebSocket...");
  connectWebSocket(handleMessage, handleWebSocketClose);
  isConnected.value = true;
});

// Disconnect WebSocket when component unmounts
onUnmounted(() => {
  console.log("Disconnecting WebSocket...");
  disconnectWebSocket();
  isConnected.value = false;
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
