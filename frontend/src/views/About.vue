<template>
  <div class="page-enter">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="about-header text-center mb-5">
        <h1>About Da Nang Deals</h1>
        <p class="lead text-espresso-light">Your trusted companion for smart grocery shopping</p>
      </div>

      <div class="row g-5">
        <!-- About Section -->
        <div class="col-12 col-lg-6">
          <div class="about-card">
            <h2>🛒 What We Do</h2>
            <p>
              Da Nang Deals is a price comparison web application designed to help shoppers 
              in Da Nang find the best deals across major supermarkets. We aggregate prices 
              from <strong>Go!</strong>, <strong>Bách Hoá Xanh</strong>, and <strong>Lottemart</strong> 
              to help you make informed purchasing decisions.
            </p>
            <p>
              Our mission is simple: <em>save you time and money</em>. Whether you're planning 
              your weekly grocery run or hunting for specific deals, we've got you covered.
            </p>

            <h3 class="mt-4">✨ Key Features</h3>
            <ul class="feature-list">
              <li>📊 Real-time price comparisons across 3+ stores</li>
              <li>🔍 Advanced search and filtering options</li>
              <li>❤️ Save your favorite products</li>
              <li>📱 Mobile-friendly responsive design</li>
              <li>🔔 Price drop notifications</li>
            </ul>
          </div>
        </div>

        <!-- Interactive Section -->
        <div class="col-12 col-lg-6">
          <div class="interactive-card">
            <h2>👋 Say Hello!</h2>
            <p class="text-espresso-light">Enter your name and we'll greet you personally.</p>

            <form @submit.prevent class="name-form">
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <label class="bloom-label" for="firstName">First Name</label>
                  <input 
                    id="firstName"
                    type="text" 
                    class="bloom-input" 
                    v-model="firstName"
                    placeholder="Enter your first name"
                    aria-describedby="firstNameHelp"
                  >
                </div>
                <div class="col-12 col-sm-6">
                  <label class="bloom-label" for="lastName">Last Name</label>
                  <input 
                    id="lastName"
                    type="text" 
                    class="bloom-input" 
                    v-model="lastName"
                    placeholder="Enter your last name"
                    aria-describedby="lastNameHelp"
                  >
                </div>
              </div>
            </form>

            <!-- Welcome Message -->
            <transition name="fade">
              <div v-if="fullName" class="welcome-message mt-4">
                <span class="welcome-emoji">🎉</span>
                <h3>Welcome, {{ fullName }}!</h3>
                <p>Thanks for visiting Da Nang Deals. Happy shopping!</p>
              </div>
            </transition>

            <!-- Image Selection -->
            <div class="image-selector mt-5">
              <h3>🖼️ Choose Your Vibe</h3>
              <p class="text-espresso-light mb-3">Select an image theme that suits your mood:</p>

              <div class="radio-group">
                <label class="radio-card" :class="{ active: selectedImage === 'mountain' }">
                  <input 
                    type="radio" 
                    name="imageChoice" 
                    value="mountain" 
                    v-model="selectedImage"
                    class="visually-hidden"
                  >
                  <span class="radio-emoji">🏔️</span>
                  <span class="radio-label">Mountain</span>
                </label>

                <label class="radio-card" :class="{ active: selectedImage === 'ocean' }">
                  <input 
                    type="radio" 
                    name="imageChoice" 
                    value="ocean" 
                    v-model="selectedImage"
                    class="visually-hidden"
                  >
                  <span class="radio-emoji">🌊</span>
                  <span class="radio-label">Ocean</span>
                </label>
              </div>

              <!-- Selected Image Display -->
              <transition name="fade" mode="out-in">
                <div :key="selectedImage" class="selected-image mt-4">
                  <img 
                    v-if="selectedImage === 'mountain'"
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop"
                    alt="Beautiful mountain landscape"
                    class="theme-image"
                  >
                  <img 
                    v-else
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
                    alt="Peaceful ocean beach"
                    class="theme-image"
                  >
                  <p class="image-caption">
                    {{ selectedImage === 'mountain' ? '🏔️ The majestic mountains remind us to aim high!' : '🌊 The calm ocean teaches us to go with the flow.' }}
                  </p>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="contact-section mt-5">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 text-center">
            <h2>📬 Get In Touch</h2>
            <p class="text-espresso-light mb-4">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <div class="contact-links">
              <a href="mailto:hello@danangdeals.vn" class="contact-link">
                ✉️ hello@danangdeals.vn
              </a>
              <a href="#" class="contact-link">
                📍 Da Nang, Vietnam
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Name input fields
const firstName = ref('')
const lastName = ref('')

// Computed full name
const fullName = computed(() => {
  const first = firstName.value.trim()
  const last = lastName.value.trim()
  if (first || last) {
    return [first, last].filter(Boolean).join(' ')
  }
  return ''
})

// Image selection
const selectedImage = ref('mountain')
</script>

<style scoped>
.about-header h1 {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--espresso);
  margin-bottom: 0.5rem;
}

.lead {
  font-size: 1.15rem;
}

.about-card,
.interactive-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 2rem;
  height: 100%;
  border: 1px solid rgba(122, 139, 111, 0.1);
}

.about-card h2,
.interactive-card h2,
.contact-section h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--espresso);
  margin-bottom: 1rem;
}

.about-card h3,
.interactive-card h3 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--sage-dark);
  margin-bottom: 1rem;
}

.about-card p {
  color: var(--espresso-light);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(59, 47, 47, 0.08);
  color: var(--espresso);
}

.feature-list li:last-child {
  border-bottom: none;
}

.name-form {
  margin-top: 1.5rem;
}

.welcome-message {
  background: linear-gradient(135deg, rgba(122, 139, 111, 0.1), rgba(194, 112, 62, 0.05));
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
}

.welcome-emoji {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.welcome-message h3 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--sage-dark);
  margin-bottom: 0.3rem;
}

.welcome-message p {
  color: var(--espresso-light);
  margin: 0;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-card {
  flex: 1;
  background: var(--cream);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.radio-card:hover {
  border-color: rgba(122, 139, 111, 0.3);
}

.radio-card.active {
  border-color: var(--sage);
  background: rgba(122, 139, 111, 0.08);
}

.radio-emoji {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.radio-label {
  font-weight: 600;
  color: var(--espresso);
}

.selected-image {
  text-align: center;
}

.theme-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(59, 47, 47, 0.15);
}

.image-caption {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: var(--espresso-light);
  font-style: italic;
}

.contact-section {
  background: linear-gradient(135deg, #f5eed8, #e8f0de);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

.contact-link {
  color: var(--sage-dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--terracotta);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .radio-group {
    flex-direction: column;
  }
  
  .about-card,
  .interactive-card {
    padding: 1.5rem;
  }
}
</style>
