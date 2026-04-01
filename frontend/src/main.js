// frontend/src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/bloom-theme.css";

const app = createApp(App);

app.use(router);
app.use(store);

// Initialize auth state from localStorage
store.dispatch("auth/initAuth");

// Listen for auth expiry events (from API service)
window.addEventListener('auth:expired', () => {
  store.dispatch('auth/logout')
  router.push({ path: '/login', query: { expired: '1' } })
})

app.mount("#app");
