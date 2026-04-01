<template>
  <div class="auth-page page-enter">
    <div class="auth-illust" style="background: linear-gradient(160deg, #f0ead8, #dde4d2);">
      <div class="auth-illust-items">
        <span v-for="i in 32" :key="i">{{ ['🏷️','💰','🛒','🔖','📦','💲','🎯','🏪'][i % 8] }}</span>
        <span v-for="i in 32" :key="'b'+i">{{ ['🏷️','💰','🛒','🔖','📦','💲','🎯','🏪'][i % 8] }}</span>
      </div>
    </div>
    <div class="auth-form-side">
      <div class="auth-form-box">
        <h2>Welcome Back</h2>
        <p class="auth-sub">Login to check the latest deals.</p>

        <form @submit.prevent="handleLogin">
          <div class="bloom-input-group">
            <label class="bloom-label">Username</label>
            <input 
              class="bloom-input" 
              type="text" 
              v-model="username" 
              placeholder="Your username"
              :disabled="loading"
              required
              autofocus
            >
          </div>
          
          <div class="bloom-input-group">
            <label class="bloom-label">Password</label>
            <div class="position-relative">
              <input 
                class="bloom-input" 
                :type="showPw ? 'text' : 'password'" 
                v-model="password" 
                placeholder="••••••••" 
                style="padding-right: 3rem;"
                :disabled="loading"
                required
              >
              <button 
                type="button"
                @click="showPw = !showPw" 
                class="pw-toggle-btn"
                tabindex="-1"
              >
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="error" class="bloom-alert bloom-alert-error d-flex align-items-center gap-2">
            <span>⚠️</span>
            <span>{{ error }}</span>
            <button type="button" class="ms-auto btn-close-sm" @click="clearError">×</button>
          </div>

          <button 
            type="submit" 
            class="btn-sage w-100 mt-3" 
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Signing in...' : 'Sign In →' }}
          </button>
        </form>

        <p class="text-center mt-4" style="font-size: 0.88rem; color: var(--espresso-light);">
          New to Da Nang Deals? 
          <router-link to="/register" class="auth-link">
            Create an account
          </router-link>
        </p>

        <!-- Demo credentials hint -->
        <div class="demo-hint mt-4">
          <div class="demo-hint-title">🔑 Demo Accounts</div>
          <div class="demo-hint-content">
            <code>admin / admin123</code> or <code>user / user123</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const showPw = ref(false)

const loading = computed(() => store.getters['auth/isLoading'])
const error = computed(() => store.getters['auth/error'])

const isFormValid = computed(() => {
  return username.value.trim().length >= 1 && password.value.length >= 1
})

const clearError = () => {
  store.dispatch('auth/clearError')
}

const handleLogin = async () => {
  if (!isFormValid.value) return

  try {
    await store.dispatch('auth/login', {
      username: username.value.trim(),
      password: password.value
    })

    // Redirect to intended page or products
    const redirectTo = route.query.redirect || '/products'
    router.push(redirectTo)
  } catch (err) {
    // Error is already set in store
    password.value = ''
  }
}

// Clear any previous errors on mount
onMounted(() => {
  clearError()
})
</script>

<style scoped>
.pw-toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.pw-toggle-btn:hover {
  opacity: 0.8;
}

.btn-close-sm {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  padding: 0;
  line-height: 1;
}

.auth-link {
  color: var(--terracotta);
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

.demo-hint {
  background: rgba(122, 139, 111, 0.08);
  border-radius: var(--radius-sm);
  padding: 0.8rem 1rem;
  text-align: center;
}

.demo-hint-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sage-dark);
  margin-bottom: 0.3rem;
}

.demo-hint-content {
  font-size: 0.8rem;
  color: var(--espresso-light);
}

.demo-hint code {
  background: rgba(59, 47, 47, 0.08);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
}
</style>
