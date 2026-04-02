// frontend/src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/bloom-theme.css";

const app = createApp(App);

// Custom directive: v-focus (auto-focuses element on mount)
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

// Custom directive: v-highlight (highlights text on hover)
app.directive('highlight', {
  mounted(el, binding) {
    const highlightColor = binding.value || 'rgba(122, 139, 111, 0.2)';
    const originalBg = el.style.backgroundColor;
    
    el.addEventListener('mouseenter', () => {
      el.style.backgroundColor = highlightColor;
      el.style.transition = 'background-color 0.3s ease';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.backgroundColor = originalBg;
    });
  }
});

// Custom directive: v-tooltip (shows tooltip on hover)
app.directive('tooltip', {
  mounted(el, binding) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = binding.value;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--espresso);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: nowrap;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    `;
    document.body.appendChild(tooltip);
    
    el.addEventListener('mouseenter', (e) => {
      const rect = el.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8 + window.scrollY}px`;
      tooltip.style.opacity = '1';
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    
    el._tooltip = tooltip;
  },
  unmounted(el) {
    if (el._tooltip) {
      el._tooltip.remove();
    }
  }
});

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
