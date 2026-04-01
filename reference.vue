<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bloom Market — Fresh Starts Here</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cream: #FFF8F0;
  --sage: #7A8B6F;
  --sage-light: #a3b396;
  --sage-dark: #5c6b52;
  --terracotta: #C2703E;
  --terracotta-light: #e0955f;
  --espresso: #3B2F2F;
  --espresso-light: #5a4a4a;
  --warm-white: #FFFDF9;
  --card-bg: #FFFCF7;
  --shadow-warm: rgba(59, 47, 47, 0.08);
  --shadow-warm-md: rgba(59, 47, 47, 0.12);
  --tomato: #D94F3B;
  --lemon: #E8C84A;
  --blueberry: #4A5899;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
  --grain: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-body);
  color: var(--espresso);
  background-color: var(--cream);
  background-image: var(--grain);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5 { font-family: var(--font-display); font-weight: 500; }

/* ========== SCROLLBAR ========== */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--sage-light); border-radius: 3px; }

/* ========== NAVBAR ========== */
.bloom-nav {
  position: sticky; top: 0; z-index: 1000;
  background: rgba(255, 248, 240, 0.82);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(122, 139, 111, 0.12);
  padding: 0.6rem 0;
  transition: box-shadow 0.3s ease;
}
.bloom-nav.scrolled { box-shadow: 0 4px 24px var(--shadow-warm); }
.bloom-nav .navbar-brand {
  font-family: var(--font-display); font-weight: 700; font-size: 1.55rem;
  color: var(--espresso); letter-spacing: -0.5px;
}
.bloom-nav .navbar-brand span { color: var(--sage); }

.category-pills { display: flex; gap: 0.45rem; overflow-x: auto; scrollbar-width: none; padding: 0.2rem 0; }
.category-pills::-webkit-scrollbar { display: none; }
.cat-pill {
  white-space: nowrap; padding: 0.35rem 0.85rem; border-radius: 50px;
  border: 1.5px solid rgba(122, 139, 111, 0.25); background: transparent;
  font-size: 0.82rem; font-weight: 500; color: var(--espresso-light);
  cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: var(--font-body);
}
.cat-pill:hover, .cat-pill.active {
  background: var(--sage); color: white; border-color: var(--sage);
  transform: scale(1.04);
}

.nav-icon-btn {
  position: relative; background: none; border: none; padding: 0.4rem;
  color: var(--espresso); cursor: pointer; transition: color 0.2s;
  font-size: 1.2rem;
}
.nav-icon-btn:hover { color: var(--terracotta); }
.cart-badge {
  position: absolute; top: -2px; right: -6px;
  background: var(--terracotta); color: white;
  font-size: 0.62rem; font-weight: 700; width: 18px; height: 18px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes badgePop { 0% { transform: scale(0); } 100% { transform: scale(1); } }

.user-dropdown {
  position: absolute; right: 0; top: calc(100% + 8px);
  background: var(--card-bg); border-radius: var(--radius-md);
  box-shadow: 0 12px 40px var(--shadow-warm-md);
  min-width: 200px; padding: 0.5rem 0; z-index: 1001;
  animation: dropIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(122, 139, 111, 0.1);
}
@keyframes dropIn { 0% { opacity: 0; transform: translateY(-8px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.user-dropdown a, .user-dropdown button {
  display: flex; align-items: center; gap: 0.6rem; width: 100%;
  padding: 0.6rem 1rem; border: none; background: none; text-align: left;
  font-size: 0.88rem; color: var(--espresso); cursor: pointer;
  font-family: var(--font-body); text-decoration: none; transition: background 0.15s;
}
.user-dropdown a:hover, .user-dropdown button:hover { background: rgba(122, 139, 111, 0.08); }
.dropdown-divider-custom { height: 1px; background: rgba(122, 139, 111, 0.12); margin: 0.3rem 0; }

/* ========== BUTTONS ========== */
.btn-sage {
  background: var(--sage); color: white; border: none;
  border-radius: 50px; padding: 0.65rem 1.8rem;
  font-family: var(--font-body); font-weight: 600; font-size: 0.92rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.btn-sage:hover { background: var(--sage-dark); color: white; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(122, 139, 111, 0.3); }

.btn-terracotta {
  background: var(--terracotta); color: white; border: none;
  border-radius: 50px; padding: 0.55rem 1.4rem;
  font-family: var(--font-body); font-weight: 600; font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.btn-terracotta:hover { background: #a85e33; color: white; transform: translateY(-1px); }

.btn-outline-sage {
  background: transparent; color: var(--sage); border: 1.5px solid var(--sage);
  border-radius: 50px; padding: 0.55rem 1.4rem;
  font-family: var(--font-body); font-weight: 600; font-size: 0.85rem;
  cursor: pointer; transition: all 0.25s;
}
.btn-outline-sage:hover { background: var(--sage); color: white; }

/* ========== FORM INPUTS ========== */
.bloom-input-group { position: relative; margin-bottom: 1.2rem; }
.bloom-input {
  width: 100%; padding: 0.9rem 1rem 0.9rem;
  background: var(--cream); border: 1.5px solid rgba(59, 47, 47, 0.15);
  border-radius: var(--radius-sm); font-family: var(--font-body);
  font-size: 0.92rem; color: var(--espresso);
  transition: border-color 0.25s, box-shadow 0.25s;
  outline: none;
}
.bloom-input:focus {
  border-color: var(--terracotta);
  box-shadow: 0 0 0 3px rgba(194, 112, 62, 0.12);
}
.bloom-input::placeholder { color: rgba(59, 47, 47, 0.35); }

.bloom-label {
  display: block; margin-bottom: 0.35rem;
  font-size: 0.82rem; font-weight: 600; color: var(--espresso-light);
  letter-spacing: 0.02em;
}

/* ========== CARDS ========== */
.product-card {
  background: var(--card-bg); border-radius: var(--radius-lg);
  overflow: hidden; border: 1px solid rgba(122, 139, 111, 0.08);
  box-shadow: 0 4px 16px var(--shadow-warm);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px var(--shadow-warm-md);
}
.product-card .card-img-wrap {
  background: linear-gradient(135deg, #faf5ed, #f0ebe0);
  padding: 1.5rem; display: flex; align-items: center; justify-content: center;
  min-height: 180px; position: relative; overflow: hidden;
}
.product-card .card-img-wrap .product-emoji {
  font-size: 4.5rem; transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.product-card:hover .product-emoji { transform: scale(1.12) rotate(-3deg); }
.product-card .card-body { padding: 1rem 1.1rem 1.2rem; }
.product-card .farm-tag {
  font-size: 0.72rem; font-weight: 600; color: var(--sage);
  background: rgba(122, 139, 111, 0.1); padding: 0.15rem 0.55rem;
  border-radius: 50px; display: inline-block; margin-bottom: 0.35rem;
}
.product-card .product-name { font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; margin-bottom: 0.15rem; }
.product-card .product-price { font-family: var(--font-display); font-weight: 500; font-size: 1.05rem; color: var(--espresso); }

.qty-stepper {
  display: inline-flex; align-items: center; gap: 0; background: var(--terracotta);
  border-radius: 50px; overflow: hidden;
}
.qty-stepper button {
  background: none; border: none; color: white; width: 32px; height: 34px;
  font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.qty-stepper button:hover { background: rgba(255,255,255,0.15); }
.qty-stepper .qty-val { color: white; font-weight: 700; font-size: 0.85rem; min-width: 24px; text-align: center; }

/* ========== HERO ========== */
.hero-section {
  min-height: 92vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(160deg, var(--cream) 0%, #f0ead8 40%, #dde4d2 100%);
  position: relative; overflow: hidden;
}
.hero-section::before {
  content: ''; position: absolute; inset: 0; background-image: var(--grain); pointer-events: none;
}
.hero-basket {
  font-size: clamp(6rem, 14vw, 11rem); line-height: 1;
  position: relative; animation: basketFloat 4s ease-in-out infinite;
}
@keyframes basketFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
.hero-items {
  position: absolute; width: 100%; height: 100%;
  top: -40%; left: 0; display: flex; justify-content: center; gap: 0.3rem;
  pointer-events: none;
}
.hero-item {
  font-size: clamp(1.8rem, 4vw, 3rem);
  animation: itemPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
@keyframes itemPop { 0% { opacity: 0; transform: translateY(30px) scale(0.3) rotate(-20deg); } 100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); } }
.hero-text { text-align: center; max-width: 600px; }
.hero-text h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 700; line-height: 1.1; margin-bottom: 0.8rem; color: var(--espresso); }
.hero-text h1 em { font-style: italic; color: var(--sage); font-weight: 500; }
.hero-text p { font-size: 1.1rem; color: var(--espresso-light); line-height: 1.6; margin-bottom: 1.8rem; }

/* ========== SECTION TITLES ========== */
.section-title {
  font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500; margin-bottom: 0.3rem;
}
.section-subtitle { color: var(--espresso-light); font-size: 0.95rem; margin-bottom: 1.8rem; }

/* ========== COLLECTIONS ========== */
.collection-card {
  border-radius: var(--radius-lg); overflow: hidden; position: relative;
  min-height: 220px; display: flex; align-items: flex-end;
  padding: 1.5rem; cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.collection-card:hover { transform: scale(1.02); }
.collection-card .collection-bg {
  position: absolute; inset: 0; font-size: 5rem;
  display: flex; align-items: center; justify-content: center;
  filter: blur(1px); opacity: 0.3;
}
.collection-card .collection-overlay {
  position: absolute; inset: 0;
  border-radius: var(--radius-lg);
}
.collection-card .collection-content { position: relative; z-index: 2; color: white; }
.collection-card .collection-content h4 { font-family: var(--font-display); font-weight: 600; font-size: 1.2rem; margin-bottom: 0.2rem; }
.collection-card .collection-content p { font-size: 0.82rem; opacity: 0.85; }

/* ========== AUTH PAGES ========== */
.auth-page { min-height: 100vh; display: flex; }
.auth-illust {
  flex: 1; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  font-size: 6rem; line-height: 1;
}
.auth-illust-items {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem;
  font-size: 2.8rem; opacity: 0.6;
  animation: slowDrift 20s linear infinite;
}
@keyframes slowDrift { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
.auth-form-side {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 2rem; background: var(--cream);
}
.auth-form-box { width: 100%; max-width: 420px; }
.auth-form-box h2 { font-family: var(--font-display); font-size: 2rem; font-weight: 600; margin-bottom: 0.3rem; }
.auth-form-box .auth-sub { color: var(--espresso-light); margin-bottom: 2rem; font-size: 0.95rem; }

.social-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  width: 100%; padding: 0.7rem; border-radius: 50px;
  border: 1.5px solid rgba(59, 47, 47, 0.15); background: white;
  font-family: var(--font-body); font-weight: 600; font-size: 0.88rem;
  color: var(--espresso); cursor: pointer; transition: all 0.2s;
}
.social-btn:hover { border-color: var(--sage); background: rgba(122, 139, 111, 0.04); }

.divider-text {
  display: flex; align-items: center; gap: 1rem; margin: 1.4rem 0;
  font-size: 0.82rem; color: var(--espresso-light);
}
.divider-text::before, .divider-text::after {
  content: ''; flex: 1; height: 1px; background: rgba(59, 47, 47, 0.12);
}

.pw-strength { height: 4px; border-radius: 2px; background: rgba(59,47,47,0.08); margin-top: 0.4rem; overflow: hidden; }
.pw-strength-bar { height: 100%; border-radius: 2px; transition: width 0.4s, background 0.4s; }

/* ========== CATEGORY BANNER ========== */
.cat-banner {
  border-radius: var(--radius-xl); padding: 2.5rem 2rem;
  display: flex; align-items: center; gap: 1.5rem;
  margin-bottom: 1.5rem; position: relative; overflow: hidden;
}
.cat-banner .cat-emoji { font-size: 3.5rem; }
.cat-banner h2 { font-family: var(--font-display); font-weight: 600; font-size: 1.8rem; margin: 0; }
.cat-banner p { font-size: 0.9rem; opacity: 0.7; margin: 0.2rem 0 0; }

.filter-chips { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem; }

/* ========== PRODUCT DETAIL ========== */
.product-detail-img {
  background: linear-gradient(135deg, #faf5ed, #f0ebe0);
  border-radius: var(--radius-xl); display: flex; align-items: center;
  justify-content: center; min-height: 380px;
  font-size: 8rem; position: relative;
}
.breadcrumb-bloom { font-size: 0.82rem; margin-bottom: 1rem; }
.breadcrumb-bloom a { color: var(--terracotta); text-decoration: none; }
.breadcrumb-bloom a:hover { text-decoration: underline; }
.breadcrumb-bloom span { color: var(--espresso-light); }

.attr-chip {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.7rem; border-radius: 50px; font-size: 0.78rem; font-weight: 500;
  background: rgba(122, 139, 111, 0.1); color: var(--sage-dark);
  margin-right: 0.4rem; margin-bottom: 0.4rem;
}

.size-pill {
  padding: 0.5rem 1.2rem; border-radius: 50px;
  border: 1.5px solid rgba(59,47,47,0.15); background: white;
  font-family: var(--font-body); font-weight: 600; font-size: 0.85rem;
  cursor: pointer; transition: all 0.2s;
}
.size-pill.active, .size-pill:hover { background: var(--sage); color: white; border-color: var(--sage); }

.accordion-bloom { border: none; }
.accordion-bloom .accordion-item {
  border: none; border-bottom: 1px solid rgba(59,47,47,0.08); background: transparent;
}
.accordion-bloom .accordion-button {
  background: transparent; font-family: var(--font-body); font-weight: 600;
  color: var(--espresso); box-shadow: none; padding: 1rem 0;
}
.accordion-bloom .accordion-button:not(.collapsed) { color: var(--sage); }
.accordion-bloom .accordion-body { padding: 0 0 1rem; color: var(--espresso-light); font-size: 0.9rem; line-height: 1.7; }

/* ========== FOOTER ========== */
.bloom-footer {
  background: var(--espresso); color: rgba(255,248,240,0.7);
  padding: 3.5rem 0 2rem; margin-top: 4rem;
}
.bloom-footer h5 { font-family: var(--font-display); color: var(--cream); font-weight: 500; margin-bottom: 1rem; font-size: 1.1rem; }
.bloom-footer a { color: rgba(255,248,240,0.6); text-decoration: none; font-size: 0.88rem; transition: color 0.2s; }
.bloom-footer a:hover { color: var(--cream); }
.footer-newsletter .bloom-input { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); color: var(--cream); }
.footer-newsletter .bloom-input::placeholder { color: rgba(255,248,240,0.35); }
.footer-veg { font-size: 2rem; opacity: 0.4; letter-spacing: 0.5rem; margin-top: 2rem; }
.footer-bottom { border-top: 1px solid rgba(255,248,240,0.08); padding-top: 1.5rem; margin-top: 2rem; font-size: 0.82rem; }

/* ========== TOAST ========== */
.bloom-toast {
  position: fixed; top: 80px; right: 20px; z-index: 2000;
  background: var(--card-bg); border-radius: var(--radius-md);
  padding: 1rem 1.5rem; box-shadow: 0 10px 40px var(--shadow-warm-md);
  border-left: 4px solid var(--sage);
  animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 0.9rem; font-weight: 500;
}
@keyframes toastIn { 0% { opacity: 0; transform: translateX(30px); } 100% { opacity: 1; transform: translateX(0); } }

/* ========== MODAL ========== */
.bloom-modal-overlay {
  position: fixed; inset: 0; background: rgba(59,47,47,0.35);
  backdrop-filter: blur(4px); z-index: 3000;
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
.bloom-modal {
  background: var(--card-bg); border-radius: var(--radius-lg);
  padding: 2rem; max-width: 380px; width: 90%; text-align: center;
  box-shadow: 0 20px 60px var(--shadow-warm-md);
  animation: modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalPop { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }

/* ========== STAGGER ANIMATIONS ========== */
.stagger-in { animation: staggerFade 0.5s ease backwards; }
@keyframes staggerFade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .auth-illust { display: none; }
  .auth-form-side { padding: 1.5rem; }
  .hero-section { min-height: 80vh; padding: 1rem; }
  .product-detail-img { min-height: 260px; font-size: 5rem; }
}

/* Page transition */
.page-enter { animation: pageIn 0.4s ease; }
@keyframes pageIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
</style>
</head>
<body>

<div id="app">
  <!-- NAVBAR -->
  <nav class="bloom-nav" :class="{ scrolled: scrolled }">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between">
        <router-link to="/" class="navbar-brand text-decoration-none">
          🌿 Bloom<span>Market</span>
        </router-link>
        <div class="category-pills d-none d-md-flex">
          <button class="cat-pill" v-for="cat in categories" :key="cat"
            :class="{ active: activeCat === cat }" @click="goCategory(cat)">
            {{ cat }}
          </button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <router-link to="/products" class="nav-icon-btn text-decoration-none" title="Search">🔍</router-link>
          <button class="nav-icon-btn" @click="$router.push('/products')" title="Cart">
            🛒
            <span class="cart-badge" v-if="cartCount > 0" :key="cartCount">{{ cartCount }}</span>
          </button>
          <div class="position-relative" v-if="isLoggedIn">
            <button class="nav-icon-btn" @click="showUserMenu = !showUserMenu"
              style="width:34px;height:34px;border-radius:50%;background:var(--sage);color:white;display:flex;align-items:center;justify-content:center;font-size:0.82rem;font-weight:700;">
              {{ user.name.charAt(0) }}
            </button>
            <div class="user-dropdown" v-if="showUserMenu" @click.stop>
              <a href="#">📦 My Orders</a>
              <a href="#">💚 Saved Items</a>
              <a href="#">⚙️ Account Settings</a>
              <div class="dropdown-divider-custom"></div>
              <button @click="confirmLogout">🚪 Sign Out</button>
            </div>
          </div>
          <div v-else class="d-flex gap-1">
            <router-link to="/login" class="btn-outline-sage text-decoration-none" style="padding:0.4rem 1rem;font-size:0.8rem;">Sign In</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- TOAST -->
  <div class="bloom-toast" v-if="toast" @click="toast = ''">{{ toast }}</div>

  <!-- LOGOUT MODAL -->
  <div class="bloom-modal-overlay" v-if="showLogoutModal" @click="showLogoutModal = false">
    <div class="bloom-modal" @click.stop>
      <div style="font-size:3rem;margin-bottom:0.8rem;">👋</div>
      <h4 style="font-family:var(--font-display);margin-bottom:0.3rem;">Heading out?</h4>
      <p style="color:var(--espresso-light);font-size:0.9rem;margin-bottom:1.5rem;">You can always come back for more.</p>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn-outline-sage" @click="showLogoutModal = false">Stay</button>
        <button class="btn-sage" @click="doLogout">Sign Out</button>
      </div>
    </div>
  </div>

  <!-- ROUTER VIEW -->
  <router-view
    :products="products"
    :collections="collections"
    :cart="cart"
    :is-logged-in="isLoggedIn"
    @add-to-cart="addToCart"
    @remove-from-cart="removeFromCart"
    @login="handleLogin"
    @register="handleRegister"
    @show-toast="showToast"
  ></router-view>

  <!-- FOOTER -->
  <footer class="bloom-footer" v-if="$route.path !== '/login' && $route.path !== '/register'">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-4">
          <h5>🌿 Bloom Market</h5>
          <p style="font-size:0.88rem;line-height:1.7;">Your favorite neighborhood market, online. Premium quality without pretension — abundant, warm, and joyful.</p>
        </div>
        <div class="col-md-2">
          <h5>Shop</h5>
          <div class="d-flex flex-column gap-2">
            <a href="#">Produce</a><a href="#">Pantry</a><a href="#">Dairy</a><a href="#">Bakery</a>
          </div>
        </div>
        <div class="col-md-2">
          <h5>Company</h5>
          <div class="d-flex flex-column gap-2">
            <a href="#">About Us</a><a href="#">Our Farms</a><a href="#">Careers</a><a href="#">Blog</a>
          </div>
        </div>
        <div class="col-md-4 footer-newsletter">
          <h5>Fresh picks in your inbox 📬</h5>
          <div class="d-flex gap-2">
            <input class="bloom-input" placeholder="your@email.com" style="margin:0;">
            <button class="btn-sage" style="white-space:nowrap;">Subscribe</button>
          </div>
        </div>
      </div>
      <div class="footer-veg text-center">🥕 🍅 🥑 🫐 🥬 🍋 🍞 🧀</div>
      <div class="footer-bottom text-center">
        © 2026 Bloom Market. Made with 💚 for good food.
      </div>
    </div>
  </footer>
</div>

<!-- ========== TEMPLATES ========== -->

<!-- HOME PAGE -->
<script type="text/x-template" id="home-page">
<div class="page-enter">
  <!-- Hero -->
  <section class="hero-section">
    <div class="container text-center position-relative" style="z-index:2;">
      <div class="hero-basket mx-auto mb-4" style="display:inline-block;position:relative;">
        🧺
        <div class="hero-items">
          <span class="hero-item" v-for="(item, i) in heroItems" :key="i"
            :style="{ animationDelay: (0.3 + i * 0.12) + 's' }">{{ item }}</span>
        </div>
      </div>
      <div class="hero-text mx-auto">
        <h1>Fresh Food, <em>Full Life</em></h1>
        <p>Your favorite neighborhood market, now at your doorstep. Curated produce, artisan goods, and pantry staples — sourced with love from farms you can trust.</p>
        <router-link to="/products" class="btn-sage text-decoration-none d-inline-block">
          Shop What's Fresh →
        </router-link>
      </div>
    </div>
  </section>

  <!-- Fresh Today -->
  <section class="container py-5">
    <h2 class="section-title">What's Fresh Today</h2>
    <p class="section-subtitle">Hand-picked highlights from this week's harvest</p>
    <div class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="(p, i) in products.slice(0, 8)" :key="p.id"
        :style="{ animationDelay: (i * 0.06) + 's' }" class="stagger-in">
        <div class="product-card" @click="$router.push('/product/' + p.id)">
          <div class="card-img-wrap">
            <span class="product-emoji">{{ p.emoji }}</span>
          </div>
          <div class="card-body">
            <span class="farm-tag">{{ p.farm }}</span>
            <div class="product-name">{{ p.name }}</div>
            <div class="d-flex align-items-center justify-content-between mt-2">
              <span class="product-price">${{ p.price.toFixed(2) }}</span>
              <button class="btn-terracotta" v-if="!getQty(p.id)" @click.stop="$emit('add-to-cart', p.id)">+ Add</button>
              <div class="qty-stepper" v-else @click.stop>
                <button @click="$emit('remove-from-cart', p.id)">−</button>
                <span class="qty-val">{{ getQty(p.id) }}</span>
                <button @click="$emit('add-to-cart', p.id)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Collections -->
  <section class="container pb-5">
    <h2 class="section-title">Curated Collections</h2>
    <p class="section-subtitle">Ready-made bundles for your week</p>
    <div class="row g-3">
      <div class="col-md-4" v-for="c in collections" :key="c.name">
        <div class="collection-card" :style="{ background: c.bg }">
          <div class="collection-bg">{{ c.emojis }}</div>
          <div class="collection-overlay" :style="{ background: c.gradient }"></div>
          <div class="collection-content">
            <h4>{{ c.name }}</h4>
            <p>{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Community -->
  <section class="container pb-5">
    <h2 class="section-title">From the Community</h2>
    <p class="section-subtitle">What our neighbors are cooking</p>
    <div class="row g-3">
      <div class="col-md-4" v-for="t in testimonials" :key="t.name">
        <div style="background:var(--card-bg);border-radius:var(--radius-lg);padding:1.5rem;border:1px solid rgba(122,139,111,0.08);">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--sage);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">{{ t.name.charAt(0) }}</div>
            <div>
              <div style="font-weight:600;font-size:0.9rem;">{{ t.name }}</div>
              <div style="font-size:0.78rem;color:var(--espresso-light);">{{ t.role }}</div>
            </div>
          </div>
          <p style="font-size:0.88rem;color:var(--espresso-light);line-height:1.6;font-style:italic;">"{{ t.quote }}"</p>
          <a href="#" style="font-size:0.82rem;color:var(--terracotta);text-decoration:none;font-weight:600;">Shop their favorites →</a>
        </div>
      </div>
    </div>
  </section>
</div>
</script>

<!-- LOGIN PAGE -->
<script type="text/x-template" id="login-page">
<div class="auth-page page-enter">
  <div class="auth-illust" style="background:linear-gradient(160deg, #f0ead8, #dde4d2);">
    <div class="auth-illust-items">
      <span v-for="i in 32" :key="i">{{ ['🥑','🍞','🫐','🧀','🥕','🍅','🥬','🍋'][i % 8] }}</span>
      <span v-for="i in 32" :key="'b'+i">{{ ['🥑','🍞','🫐','🧀','🥕','🍅','🥬','🍋'][i % 8] }}</span>
    </div>
  </div>
  <div class="auth-form-side">
    <div class="auth-form-box">
      <h2>Welcome Back</h2>
      <p class="auth-sub">Your basket missed you.</p>

      <div class="d-flex gap-2 mb-2">
        <button class="social-btn">🔵 Google</button>
        <button class="social-btn">⚫ Apple</button>
      </div>
      <div class="divider-text">or sign in with email</div>

      <div class="bloom-input-group">
        <label class="bloom-label">Email Address</label>
        <input class="bloom-input" type="email" v-model="email" placeholder="hello@example.com">
      </div>
      <div class="bloom-input-group">
        <label class="bloom-label">Password</label>
        <div class="position-relative">
          <input class="bloom-input" :type="showPw ? 'text' : 'password'" v-model="password" placeholder="••••••••" style="padding-right:3rem;">
          <button @click="showPw = !showPw" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1rem;opacity:0.5;">
            {{ showPw ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="d-flex justify-content-between mt-2">
          <label style="font-size:0.82rem;display:flex;align-items:center;gap:0.4rem;cursor:pointer;">
            <input type="checkbox" v-model="remember" style="accent-color:var(--sage);"> Remember me
          </label>
          <a href="#" style="font-size:0.82rem;color:var(--terracotta);text-decoration:none;">Forgot password?</a>
        </div>
      </div>

      <button class="btn-sage w-100 mt-3" style="padding:0.8rem;" @click="doLogin">
        {{ loading ? '●●●' : 'Sign In →' }}
      </button>

      <p class="text-center mt-3" style="font-size:0.88rem;color:var(--espresso-light);">
        New to Bloom Market? <router-link to="/register" style="color:var(--terracotta);font-weight:600;text-decoration:none;">Create an account</router-link>
      </p>
    </div>
  </div>
</div>
</script>

<!-- REGISTER PAGE -->
<script type="text/x-template" id="register-page">
<div class="auth-page page-enter">
  <div class="auth-illust" style="background:linear-gradient(160deg, #dde4d2, #e8dfc8);">
    <div class="auth-illust-items">
      <span v-for="i in 32" :key="i">{{ ['🌻','🌿','🍃','🌾','🌱','🪴','🌸','🍀'][i % 8] }}</span>
      <span v-for="i in 32" :key="'b'+i">{{ ['🌻','🌿','🍃','🌾','🌱','🪴','🌸','🍀'][i % 8] }}</span>
    </div>
  </div>
  <div class="auth-form-side">
    <div class="auth-form-box">
      <h2>Join the Market</h2>
      <p class="auth-sub">Fresh starts here. Create your account in seconds.</p>

      <div class="d-flex gap-2 mb-2">
        <button class="social-btn">🔵 Google</button>
        <button class="social-btn">⚫ Apple</button>
      </div>
      <div class="divider-text">or sign up with email</div>

      <div class="bloom-input-group">
        <label class="bloom-label">Full Name</label>
        <input class="bloom-input" v-model="name" placeholder="Jane Appleseed">
      </div>
      <div class="bloom-input-group">
        <label class="bloom-label">Email Address</label>
        <input class="bloom-input" type="email" v-model="email" placeholder="hello@example.com">
      </div>
      <div class="bloom-input-group">
        <label class="bloom-label">Password</label>
        <div class="position-relative">
          <input class="bloom-input" :type="showPw ? 'text' : 'password'" v-model="password" placeholder="Create a strong password" style="padding-right:3rem;">
          <button @click="showPw = !showPw" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1rem;opacity:0.5;">
            {{ showPw ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="pw-strength">
          <div class="pw-strength-bar" :style="{ width: pwStrength.pct + '%', background: pwStrength.color }"></div>
        </div>
        <div style="font-size:0.75rem;margin-top:0.3rem;" :style="{ color: pwStrength.color }">{{ pwStrength.label }}</div>
      </div>
      <div class="bloom-input-group">
        <label class="bloom-label">Confirm Password</label>
        <input class="bloom-input" :type="showPw ? 'text' : 'password'" v-model="confirmPw" placeholder="Repeat your password">
        <div v-if="confirmPw && confirmPw !== password" style="font-size:0.78rem;color:var(--terracotta);margin-top:0.3rem;">Passwords don't match yet</div>
      </div>

      <button class="btn-sage w-100 mt-2" style="padding:0.8rem;" @click="doRegister" :disabled="!canSubmit">
        {{ loading ? '🌱 Growing...' : 'Create Account →' }}
      </button>

      <p class="text-center mt-3" style="font-size:0.88rem;color:var(--espresso-light);">
        Already part of the market? <router-link to="/login" style="color:var(--terracotta);font-weight:600;text-decoration:none;">Sign in</router-link>
      </p>
    </div>
  </div>
</div>
</script>

<!-- PRODUCT LIST PAGE -->
<script type="text/x-template" id="products-page">
<div class="page-enter">
  <div class="container py-4">
    <!-- Category Banner -->
    <div class="cat-banner" style="background:linear-gradient(135deg, #e8f0de, #f5eed8);">
      <span class="cat-emoji">🛒</span>
      <div>
        <h2>All Products</h2>
        <p>Browse our full selection of fresh, curated goods</p>
      </div>
    </div>

    <!-- Filter chips -->
    <div class="filter-chips">
      <button class="cat-pill" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">All</button>
      <button class="cat-pill" v-for="cat in uniqueCats" :key="cat"
        :class="{ active: activeFilter === cat }" @click="activeFilter = cat">{{ cat }}</button>
    </div>

    <!-- Sort bar -->
    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
      <span style="font-size:0.88rem;color:var(--espresso-light);">{{ filtered.length }} products</span>
      <select class="bloom-input" style="width:auto;padding:0.5rem 1rem;margin:0;font-size:0.85rem;" v-model="sortBy">
        <option value="popular">Popular</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
        <option value="name">A → Z</option>
      </select>
    </div>

    <!-- Product Grid -->
    <div class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="(p, i) in filtered" :key="p.id"
        class="stagger-in" :style="{ animationDelay: (i * 0.04) + 's' }">
        <div class="product-card" @click="$router.push('/product/' + p.id)">
          <div class="card-img-wrap">
            <span class="product-emoji">{{ p.emoji }}</span>
          </div>
          <div class="card-body">
            <span class="farm-tag">{{ p.farm }}</span>
            <div class="product-name">{{ p.name }}</div>
            <div class="d-flex align-items-center justify-content-between mt-2">
              <span class="product-price">${{ p.price.toFixed(2) }}</span>
              <button class="btn-terracotta" v-if="!getQty(p.id)" @click.stop="$emit('add-to-cart', p.id)">+ Add</button>
              <div class="qty-stepper" v-else @click.stop>
                <button @click="$emit('remove-from-cart', p.id)">−</button>
                <span class="qty-val">{{ getQty(p.id) }}</span>
                <button @click="$emit('add-to-cart', p.id)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="text-center py-5">
      <div style="font-size:4rem;margin-bottom:1rem;">🧺😔</div>
      <h4 style="font-family:var(--font-display);">Nothing here yet</h4>
      <p style="color:var(--espresso-light);">Try adjusting your filters or explore another aisle.</p>
      <button class="btn-sage" @click="activeFilter = 'all'">Browse All</button>
    </div>
  </div>
</div>
</script>

<!-- PRODUCT DETAIL PAGE -->
<script type="text/x-template" id="product-detail-page">
<div class="page-enter">
  <div class="container py-4" v-if="product">
    <div class="row g-4">
      <!-- Image -->
      <div class="col-md-6">
        <div class="product-detail-img">
          <span style="transition:transform 0.4s;" :style="hover ? 'transform:scale(1.1)' : ''"
            @mouseenter="hover=true" @mouseleave="hover=false">{{ product.emoji }}</span>
        </div>
      </div>
      <!-- Details -->
      <div class="col-md-6">
        <div class="breadcrumb-bloom">
          <router-link to="/">Home</router-link> <span> › </span>
          <router-link to="/products">{{ product.category }}</router-link> <span> › </span>
          <span>{{ product.name }}</span>
        </div>
        <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:600;margin-bottom:0.5rem;">{{ product.name }}</h1>
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="farm-tag" style="font-size:0.82rem;">📍 {{ product.farm }}</span>
        </div>
        <p style="font-size:1.6rem;font-family:var(--font-display);font-weight:500;margin-bottom:0.3rem;">
          ${{ product.price.toFixed(2) }}
          <span v-if="product.oldPrice" style="font-size:1rem;color:var(--espresso-light);text-decoration:line-through;margin-left:0.5rem;">${{ product.oldPrice.toFixed(2) }}</span>
        </p>
        <p style="font-size:0.85rem;color:var(--espresso-light);margin-bottom:1rem;">{{ product.unit }}</p>

        <!-- Size pills -->
        <div class="d-flex gap-2 mb-3">
          <button class="size-pill" v-for="s in product.sizes" :key="s"
            :class="{ active: selectedSize === s }" @click="selectedSize = s">{{ s }}</button>
        </div>

        <p style="color:var(--espresso-light);line-height:1.7;margin-bottom:1.2rem;">{{ product.description }}</p>

        <!-- Attribute chips -->
        <div class="mb-3">
          <span class="attr-chip" v-for="a in product.attrs" :key="a">{{ a }}</span>
        </div>

        <!-- Add to cart -->
        <div class="d-flex align-items-center gap-3">
          <div class="qty-stepper" style="transform:scale(1.15);">
            <button @click="if(qty > 1) qty--">−</button>
            <span class="qty-val">{{ qty }}</span>
            <button @click="qty++">+</button>
          </div>
          <button class="btn-sage flex-grow-1" style="padding:0.85rem;" @click="addMultiple">
            🧺 Add to Basket — ${{ (product.price * qty).toFixed(2) }}
          </button>
        </div>

        <!-- Accordion -->
        <div class="accordion accordion-bloom mt-4">
          <div class="accordion-item">
            <h2 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#nut">Nutrition Facts</button></h2>
            <div id="nut" class="accordion-collapse collapse"><div class="accordion-body">{{ product.nutrition }}</div></div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#store">How to Store</button></h2>
            <div id="store" class="accordion-collapse collapse"><div class="accordion-body">{{ product.storage }}</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related -->
    <section class="mt-5 pb-4">
      <h3 class="section-title">You Might Also Love</h3>
      <div class="row g-3 mt-2">
        <div class="col-6 col-md-3" v-for="r in related" :key="r.id">
          <div class="product-card" @click="$router.push('/product/' + r.id)">
            <div class="card-img-wrap"><span class="product-emoji">{{ r.emoji }}</span></div>
            <div class="card-body">
              <span class="farm-tag">{{ r.farm }}</span>
              <div class="product-name">{{ r.name }}</div>
              <span class="product-price">${{ r.price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
</script>

<!-- ========== SCRIPTS ========== -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js"></script>

<script>
const { createApp, ref, computed, watch, onMounted } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// ========== DATA ==========
const productsData = [
  { id:1, name:'Organic Avocados', emoji:'🥑', price:4.99, unit:'per 3-pack', farm:'Happy Hen Farm', category:'Produce', sizes:['3-pack','6-pack'], attrs:['🌿 Organic','📍 Local','🥬 Vegan'], description:'Creamy, buttery, and perfectly ripe — these organic avocados come straight from sun-drenched groves. Perfect for toast, bowls, or eating with a spoon.', nutrition:'Calories: 240 per avocado. Rich in healthy fats, potassium, fiber, and vitamins K, C, and E.', storage:'Keep at room temperature until ripe, then refrigerate. Use within 2-3 days once ripe.' },
  { id:2, name:'Sourdough Loaf', emoji:'🍞', price:7.50, unit:'per loaf', farm:'Stone Mill Bakery', category:'Bakery', sizes:['Regular','Large'], attrs:['🌾 Artisan','🥬 Vegan'], description:'48-hour fermented sourdough with a crackling crust and an airy, tangy crumb. Hand-shaped daily by our partner bakers.', nutrition:'Calories: 130 per slice. Contains wheat. Good source of iron and B vitamins.', storage:'Keep cut-side down on a board for 2 days. Freeze sliced for up to 3 months.' },
  { id:3, name:'Wild Blueberries', emoji:'🫐', price:6.99, unit:'per pint', farm:'Berry Brook', category:'Produce', sizes:['1 pint','2 pints'], attrs:['🌿 Organic','❄️ Seasonal','🥬 Vegan'], description:'Tiny, intense, and bursting with flavor — wild blueberries from the mountain slopes. Far more antioxidants than cultivated varieties.', nutrition:'Calories: 84 per cup. Extremely high in anthocyanins and vitamin C.', storage:'Refrigerate unwashed. Rinse just before eating. Best within 5 days.' },
  { id:4, name:'Farm Fresh Eggs', emoji:'🥚', price:8.25, unit:'per dozen', farm:'Happy Hen Farm', category:'Dairy', sizes:['6-pack','Dozen'], attrs:['📍 Local','🐔 Free-Range'], description:'Pasture-raised hens, deep golden yolks. You can taste the difference that open fields and sunshine make. Perfect for every meal.', nutrition:'Calories: 70 per egg. 6g protein, rich in B12 and choline.', storage:'Refrigerate upon arrival. Good for 3-4 weeks past purchase.' },
  { id:5, name:'Aged Gruyère', emoji:'🧀', price:12.99, unit:'per 200g wedge', farm:'Alpine Creamery', category:'Dairy', sizes:['200g','400g'], attrs:['🏔️ Imported','🧀 Aged 12mo'], description:'Nutty, complex, and smooth — aged for twelve months in mountain caves. Melts beautifully, snacks even better.', nutrition:'Calories: 117 per oz. High in calcium and protein.', storage:'Wrap in wax paper, then loosely in plastic. Keeps 3-4 weeks in the fridge.' },
  { id:6, name:'Heirloom Tomatoes', emoji:'🍅', price:5.49, unit:'per lb', farm:'Sunvale Gardens', category:'Produce', sizes:['1 lb','3 lb'], attrs:['🌿 Organic','📍 Local','🥬 Vegan'], description:'A rainbow of shapes and flavors — purple cherokees, yellow pineapples, and classic brandywines. Peak summer in every bite.', nutrition:'Calories: 22 per medium tomato. Rich in lycopene and vitamin C.', storage:'Never refrigerate! Keep on the counter at room temperature for best flavor.' },
  { id:7, name:'Organic Carrots', emoji:'🥕', price:3.49, unit:'per bunch', farm:'Rootwell Farm', category:'Produce', sizes:['1 bunch','3 bunches'], attrs:['🌿 Organic','📍 Local','🥬 Vegan'], description:'Sweet, crunchy, and straight from the earth. These rainbow carrots are perfect raw, roasted, or juiced.', nutrition:'Calories: 25 per medium carrot. Excellent source of beta-carotene and fiber.', storage:'Remove greens and refrigerate in a bag. Keeps up to 3 weeks.' },
  { id:8, name:'Raw Honeycomb', emoji:'🍯', price:14.99, unit:'per 12oz', farm:'Meadow Bee Co.', category:'Pantry', sizes:['8oz','12oz'], attrs:['🐝 Raw','📍 Local'], description:'Straight from the hive — waxy, floral, and impossibly sweet. Spread on toast, pair with cheese, or eat it by the spoonful.', nutrition:'Calories: 64 per tbsp. Natural enzymes and trace pollen. Not suitable for children under 1.', storage:'Room temperature in a sealed container. Never refrigerate — it crystallizes.' },
  { id:9, name:'Oat Milk', emoji:'🥛', price:5.99, unit:'per 32oz', farm:'The Oatery', category:'Beverages', sizes:['32oz','64oz'], attrs:['🥬 Vegan','🌿 Organic'], description:'Creamy, frothy, and made from just four ingredients. Perfect in coffee, cereal, or a glass on its own.', nutrition:'Calories: 120 per cup. Fortified with calcium, D2, and B12.', storage:'Refrigerate after opening. Shake well. Use within 7 days of opening.' },
  { id:10, name:'Mixed Greens', emoji:'🥬', price:4.49, unit:'per 5oz bag', farm:'Greenleaf Farms', category:'Produce', sizes:['5oz','10oz'], attrs:['🌿 Organic','📍 Local','🥬 Vegan'], description:'A vibrant mix of baby spinach, arugula, mizuna, and red chard. Triple-washed and ready for your bowl.', nutrition:'Calories: 20 per 3 cups. Iron, folate, and vitamins A and K.', storage:'Keep sealed in the fridge. Best within 5 days of opening.' },
  { id:11, name:'Meyer Lemons', emoji:'🍋', price:3.99, unit:'per 4-pack', farm:'Citrus Grove Co.', category:'Produce', sizes:['4-pack','8-pack'], attrs:['📍 Local','🥬 Vegan'], description:'Sweeter and more fragrant than regular lemons. Zest, juice, or slice into everything from salads to cocktails.', nutrition:'Calories: 17 per lemon. High in vitamin C and flavonoids.', storage:'Counter for a week, fridge for up to a month.' },
  { id:12, name:'Dark Chocolate Bar', emoji:'🍫', price:6.49, unit:'per 70g bar', farm:'Bean & Bloom', category:'Snacks', sizes:['70g','3-pack'], attrs:['🌿 Organic','🍫 72% Cacao','🥬 Vegan'], description:'Single-origin Ecuadorian cacao, stone-ground and slow-roasted. Notes of blackberry, espresso, and a whisper of sea salt.', nutrition:'Calories: 170 per half bar. Rich in iron and magnesium.', storage:'Cool, dry place. Below 70°F ideally. Avoid refrigeration.' },
];

const collectionsData = [
  { name:'Weeknight Dinner Kit', desc:'Everything for 3 easy meals', emojis:'🥕🍅🧀🍞', bg:'linear-gradient(135deg, #7A8B6F, #5c6b52)', gradient:'linear-gradient(135deg, rgba(122,139,111,0.85), rgba(92,107,82,0.9))' },
  { name:'Smoothie Essentials', desc:'Blend your way to morning bliss', emojis:'🫐🍋🥛🍯', bg:'linear-gradient(135deg, #C2703E, #a85e33)', gradient:'linear-gradient(135deg, rgba(194,112,62,0.85), rgba(168,94,51,0.9))' },
  { name:'Sunday Brunch Spread', desc:'Impress without the stress', emojis:'🥚🍞🥑🧀', bg:'linear-gradient(135deg, #3B2F2F, #5a4a4a)', gradient:'linear-gradient(135deg, rgba(59,47,47,0.85), rgba(90,74,74,0.9))' },
];

// ========== COMPONENTS ==========
const HomePage = {
  template: '#home-page',
  props: ['products', 'collections', 'cart'],
  setup(props) {
    const heroItems = ['🥑','🍞','🫐','🧀','🥕','🍅','🍋'];
    const testimonials = [
      { name:'Maria S.', role:'Home cook', quote:'Bloom Market changed my weeknights. The dinner kits are genius and everything tastes like it came from a real farm stand.' },
      { name:'David R.', role:'Dad of 3', quote:'My kids actually eat the vegetables now. There\'s something about freshness you just can\'t fake. We\'re hooked.' },
      { name:'Anika P.', role:'Pastry chef', quote:'The quality rivals what I source for my restaurant. The sourdough and aged gruyère are genuinely exceptional.' },
    ];
    const getQty = (id) => (props.cart[id] || 0);
    return { heroItems, testimonials, getQty };
  }
};

const LoginPage = {
  template: '#login-page',
  emits: ['login','show-toast'],
  setup(_, { emit }) {
    const email = ref(''); const password = ref('');
    const showPw = ref(false); const remember = ref(false); const loading = ref(false);
    const doLogin = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit('login', { name: email.value.split('@')[0] || 'Friend', email: email.value });
      }, 800);
    };
    return { email, password, showPw, remember, loading, doLogin };
  }
};

const RegisterPage = {
  template: '#register-page',
  emits: ['register','show-toast'],
  setup(_, { emit }) {
    const name = ref(''); const email = ref(''); const password = ref('');
    const confirmPw = ref(''); const showPw = ref(false); const loading = ref(false);
    const pwStrength = computed(() => {
      const l = password.value.length;
      if (l === 0) return { pct: 0, color: '#ccc', label: '' };
      if (l < 5) return { pct: 25, color: 'var(--terracotta)', label: 'Needs more spice' };
      if (l < 8) return { pct: 55, color: 'var(--lemon)', label: 'Looking fresh!' };
      return { pct: 100, color: 'var(--sage)', label: 'Rock solid 💪' };
    });
    const canSubmit = computed(() => name.value && email.value && password.value.length >= 5 && password.value === confirmPw.value);
    const doRegister = () => {
      if (!canSubmit.value) return;
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit('register', { name: name.value, email: email.value });
      }, 1000);
    };
    return { name, email, password, confirmPw, showPw, loading, pwStrength, canSubmit, doRegister };
  }
};

const ProductsPage = {
  template: '#products-page',
  props: ['products', 'cart'],
  emits: ['add-to-cart','remove-from-cart'],
  setup(props) {
    const activeFilter = ref('all');
    const sortBy = ref('popular');
    const uniqueCats = computed(() => [...new Set(props.products.map(p => p.category))]);
    const filtered = computed(() => {
      let items = activeFilter.value === 'all' ? [...props.products] : props.products.filter(p => p.category === activeFilter.value);
      if (sortBy.value === 'price-low') items.sort((a, b) => a.price - b.price);
      else if (sortBy.value === 'price-high') items.sort((a, b) => b.price - a.price);
      else if (sortBy.value === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
      return items;
    });
    const getQty = (id) => (props.cart[id] || 0);
    return { activeFilter, sortBy, uniqueCats, filtered, getQty };
  }
};

const ProductDetailPage = {
  template: '#product-detail-page',
  props: ['products', 'cart'],
  emits: ['add-to-cart','show-toast'],
  setup(props, { emit }) {
    const route = VueRouter.useRoute();
    const hover = ref(false);
    const qty = ref(1);
    const selectedSize = ref('');
    const product = computed(() => props.products.find(p => p.id === parseInt(route.params.id)));
    const related = computed(() => {
      if (!product.value) return [];
      return props.products.filter(p => p.id !== product.value.id && p.category === product.value.category).slice(0, 4);
    });
    watch(product, (p) => { if (p && p.sizes) selectedSize.value = p.sizes[0]; }, { immediate: true });
    watch(() => route.params.id, () => { qty.value = 1; window.scrollTo(0, 0); });
    const addMultiple = () => {
      for (let i = 0; i < qty.value; i++) emit('add-to-cart', product.value.id);
      emit('show-toast', `Added ${qty.value}× ${product.value.name} to basket!`);
    };
    return { product, related, hover, qty, selectedSize, addMultiple };
  }
};

// ========== ROUTER ==========
const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/products', component: ProductsPage },
  { path: '/product/:id', component: ProductDetailPage },
];

const router = createRouter({ history: createWebHashHistory(), routes, scrollBehavior: () => ({ top: 0 }) });

// ========== APP ==========
const app = createApp({
  setup() {
    const products = ref(productsData);
    const collections = ref(collectionsData);
    const cart = ref({});
    const isLoggedIn = ref(false);
    const user = ref({ name: 'Guest', email: '' });
    const showUserMenu = ref(false);
    const showLogoutModal = ref(false);
    const toast = ref('');
    const scrolled = ref(false);
    const categories = ['🥬 Produce','🍞 Bakery','🧀 Dairy','🥫 Pantry','🥤 Beverages','🍫 Snacks'];
    const activeCat = ref('');

    const cartCount = computed(() => Object.values(cart.value).reduce((a, b) => a + b, 0));

    const addToCart = (id) => { cart.value = { ...cart.value, [id]: (cart.value[id] || 0) + 1 }; };
    const removeFromCart = (id) => {
      if (cart.value[id] > 1) cart.value = { ...cart.value, [id]: cart.value[id] - 1 };
      else { const c = { ...cart.value }; delete c[id]; cart.value = c; }
    };

    const showToast = (msg) => { toast.value = msg; setTimeout(() => toast.value = '', 3000); };

    const handleLogin = (u) => {
      user.value = u; isLoggedIn.value = true;
      showToast(`Welcome back, ${u.name}! 💚`);
      router.push('/');
    };
    const handleRegister = (u) => {
      user.value = u; isLoggedIn.value = true;
      showToast(`Welcome to Bloom Market, ${u.name}! 🌱`);
      router.push('/');
    };
    const confirmLogout = () => { showUserMenu.value = false; showLogoutModal.value = true; };
    const doLogout = () => {
      isLoggedIn.value = false; user.value = { name: 'Guest', email: '' };
      showLogoutModal.value = false;
      showToast('See you soon! 👋');
      router.push('/');
    };

    const goCategory = (cat) => { activeCat.value = cat; router.push('/products'); };

    onMounted(() => {
      window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 10; });
      document.addEventListener('click', () => { showUserMenu.value = false; });
    });

    return {
      products, collections, cart, isLoggedIn, user, showUserMenu, showLogoutModal,
      toast, scrolled, categories, activeCat, cartCount,
      addToCart, removeFromCart, showToast, handleLogin, handleRegister,
      confirmLogout, doLogout, goCategory
    };
  }
});

app.use(router);
app.mount('#app');
</script>
</body>
</html>