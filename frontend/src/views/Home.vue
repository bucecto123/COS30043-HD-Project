<template>
  <div class="page-enter">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-12 col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
            <h1 class="hero-title">
              Compare Prices,<br>
              <span class="text-sage">Save More</span> in Da Nang
            </h1>
            <p class="hero-subtitle">
              Find the best deals across Go!, Bách Hoá Xanh, and Lottemart. 
              Smart shopping starts here — compare prices instantly and never overpay again.
            </p>
            <div class="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
              <router-link to="/products" class="btn-sage btn-lg">
                🛒 Browse Deals
              </router-link>
              <router-link to="/register" class="btn-outline-sage btn-lg" v-if="!isAuthenticated">
                Create Account
              </router-link>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="hero-images">
              <img 
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop" 
                alt="Fresh groceries and vegetables" 
                class="hero-img hero-img-1"
              >
              <img 
                src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=300&fit=crop" 
                alt="Supermarket shopping" 
                class="hero-img hero-img-2"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Why Choose Da Nang Deals?</h2>
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3>Save Money</h3>
              <p>Compare prices across 3 major supermarkets and find the best deals instantly.</p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Real-Time Updates</h3>
              <p>Get the latest prices and promotions updated daily from local stores.</p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple, clean interface designed for quick price checks while shopping.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stores Section -->
    <section class="stores-section">
      <div class="container">
        <h2 class="section-title text-center mb-4">Partner Stores</h2>
        <div class="row g-4 justify-content-center">
          <div class="col-6 col-md-4 col-lg-3">
            <div class="store-card">
              <div class="store-logo">🏪</div>
              <h4>Go!</h4>
              <p>Big C's rebranded chain</p>
            </div>
          </div>
          <div class="col-6 col-md-4 col-lg-3">
            <div class="store-card">
              <div class="store-logo">🛒</div>
              <h4>Bách Hoá Xanh</h4>
              <p>MWG's grocery chain</p>
            </div>
          </div>
          <div class="col-6 col-md-4 col-lg-3">
            <div class="store-card">
              <div class="store-logo">🏬</div>
              <h4>Lottemart</h4>
              <p>Korean hypermarket</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container text-center">
        <h2 class="cta-title">Ready to Start Saving?</h2>
        <p class="cta-subtitle">Join thousands of smart shoppers in Da Nang</p>
        <router-link to="/products" class="btn-sage btn-lg">
          Start Comparing Prices →
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
</script>

<style scoped>
.min-vh-75 {
  min-height: 75vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--cream) 0%, #f0ead8 100%);
  padding: 2rem 0 4rem;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--espresso);
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.text-sage {
  color: var(--sage);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--espresso-light);
  margin-bottom: 2rem;
  max-width: 500px;
}

@media (max-width: 991px) {
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
}

.btn-lg {
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
}

.hero-images {
  position: relative;
  height: 350px;
}

.hero-img {
  position: absolute;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 40px rgba(59, 47, 47, 0.15);
  object-fit: cover;
}

.hero-img-1 {
  width: 280px;
  height: 200px;
  top: 0;
  right: 10%;
  transform: rotate(-3deg);
  z-index: 2;
}

.hero-img-2 {
  width: 250px;
  height: 180px;
  bottom: 20px;
  left: 10%;
  transform: rotate(3deg);
  z-index: 1;
}

@media (max-width: 767px) {
  .hero-images {
    height: 280px;
  }
  .hero-img-1 {
    width: 200px;
    height: 150px;
    right: 5%;
  }
  .hero-img-2 {
    width: 180px;
    height: 130px;
    left: 5%;
  }
}

.features-section {
  padding: 5rem 0;
  background: var(--card-bg);
}

.section-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--espresso);
}

.feature-card {
  background: var(--cream);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(122, 139, 111, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--espresso);
}

.feature-card p {
  color: var(--espresso-light);
  font-size: 0.95rem;
  margin: 0;
}

.stores-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f5eed8 0%, #e8f0de 100%);
}

.store-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.store-card:hover {
  transform: translateY(-3px);
}

.store-logo {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.store-card h4 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: var(--espresso);
}

.store-card p {
  font-size: 0.85rem;
  color: var(--espresso-light);
  margin: 0;
}

.cta-section {
  padding: 5rem 0;
  background: var(--sage);
}

.cta-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: white;
  margin-bottom: 0.8rem;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2rem;
}

.cta-section .btn-sage {
  background: white;
  color: var(--sage-dark);
}

.cta-section .btn-sage:hover {
  background: var(--cream);
}
</style>
