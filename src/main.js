import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './routes'; // Import the router configuration

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

import { useWebsocketStore } from './stores/useWebsocket.js';
const websocketStore = useWebsocketStore();
websocketStore.connectWebSocket();

app.use(router); // Add the router to the app
app.mount('#app');
