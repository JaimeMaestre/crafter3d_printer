<!-- App.vue -->
<template>
  <div id="app">
    <h1>Crafter3D Web Interface</h1>
    <p v-if="websocket.isConnected">Connected to Moonraker</p>
    <p v-else>Connecting...</p>
    <Dashboard />
  </div>
</template>

<script setup>
import { useWebsocketStore } from './stores/useWebsocket.js';
import Dashboard from '@/components/Dashboard.vue';

const websocket = useWebsocketStore();
</script>
