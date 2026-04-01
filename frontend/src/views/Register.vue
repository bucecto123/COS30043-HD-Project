<template>
  <div class="auth-page page-enter">
    <div class="auth-illust" style="background: linear-gradient(160deg, #dde4d2, #e8dfc8);">
      <div class="auth-illust-items">
        <span v-for="i in 32" :key="i">{{ ['✨','🎁','💎','🏆','⭐','🎊','🥇','🎉'][i % 8] }}</span>
        <span v-for="i in 32" :key="'b'+i">{{ ['✨','🎁','💎','🏆','⭐','🎊','🥇','🎉'][i % 8] }}</span>
      </div>
    </div>
    <div class="auth-form-side">
      <div class="auth-form-box">
        <h2>Join Da Nang Deals</h2>
        <p class="auth-sub">Start comparing and saving in under a minute.</p>

        <form @submit.prevent="handleRegister">
          <div class="bloom-input-group">
            <label class="bloom-label">Username</label>
            <input 
              class="bloom-input" 
              :class="{ 'input-error': username && username.length < 3 }"
              v-model="username" 
              placeholder="Choose a username"
              :disabled="loading"
              required
              autofocus
            >
            <div v-if="username && username.length < 3" class="field-error">
              Username must be at least 3 characters
            </div>
          </div>
          
          <div class="bloom-input-group">
            <label class="bloom-label">Password</label>
            <div class="position-relative">
              <input 
                class="bloom-input" 
                :type="showPw ? 'text' : 'password'" 
                v-model="password" 
                placeholder="Create a strong password" 
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
            <div class="pw-strength">
              <div class="pw-strength-bar" :style="{ width: pwStrength.pct + '%', background: pwStrength.color }"></div>
            </div>
            <div class="pw-strength-label" :style="{ color: pwStrength.color }">
              {{ pwStrength.label }}
            </div>
          </div>
          
          <div class="bloom-input-group">
            <label class="bloom-label">Confirm Password</label>
            <input 
              class="bloom-input" 
              :class="{ 'input-error': confirmPassword && confirmPassword !== password }"
              :type="showPw ? 'text' : 'password'" 
              v-model="confirmPassword" 
              placeholder="Repeat your password"
              :disabled="loading"
              required
            >
            <div v-if="confirmPassword && confirmPassword !== password" class="field-error">
              Passwords don't match
            </div>
            <div v-else-if="confirmPassword && confirmPassword === password && password.length >= 6" class="field-success">
              ✓ Passwords match
            </div>
          </div>

          <div v-if="error" class="bloom-alert bloom-alert-error d-flex align-items-center gap-2">
            <span>⚠️</span>
            <span>{{ error }}</span>
            <button type="button" class="ms-auto btn-close-sm" @click="clearError">×</button>
          </div>

          <button 
            type="submit" 
            class="btn-sage w-100 mt-2" 
            :disabled="!canSubmit || loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Creating account...' : 'Create Account →' }}
          </button>
        </form>

        <p class="text-center mt-4" style="font-size: 0.88rem; color: var(--espresso-light);">
          Already have an account? 
          <router-link to="/login" class="auth-link">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPw = ref(false)

const loading = computed(() => store.getters['auth/isLoading'])
const error = computed(() => store.getters['auth/error'])

const pwStrength = computed(() => {
  const l = password.value.length
  if (l === 0) return { pct: 0, color: '#ccc', label: '' }
  if (l < 4) return { pct: 25, color: 'var(--tomato)', label: 'Too weak' }
  if (l < 6) return { pct: 55, color: 'var(--lemon)', label: 'Getting better' }
  if (l < 8) return { pct: 75, color: 'var(--sage-light)', label: 'Good' }
  return { pct: 100, color: 'var(--sage)', label: 'Strong password 💪' }
})

const canSubmit = computed(() => {
  return username.value.trim().length >= 3 &&
         password.value.length >= 6 &&
         password.value === confirmPassword.value
})

const clearError = () => {
  store.dispatch('auth/clearError')
}

const handleRegister = async () => {
  if (!canSubmit.value) return

  try {
    await store.dispatch('auth/register', {
      username: username.value.trim(),
      password: password.value
    })

    router.push('/products')
  } catch (err) {
    // Error is already set in store
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

.pw-strength-label {
  font-size: 0.75rem;
  margin-top: 0.3rem;
}

.field-error {
  font-size: 0.78rem;
  color: var(--tomato);
  margin-top: 0.3rem;
}

.field-success {
  font-size: 0.78rem;
  color: var(--sage);
  margin-top: 0.3rem;
}

.input-error {
  border-color: var(--tomato) !important;
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
</style>
