<template>
  <div class="page-enter">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="news-header mb-4">
        <h1>📰 News & Updates</h1>
        <p class="text-espresso-light">Stay updated with the latest deals, tips, and store news</p>
      </div>

      <!-- Search & Filter Section -->
      <div class="filter-section mb-4">
        <div class="row g-3">
          <div class="col-12 col-md-6 col-lg-4">
            <label class="bloom-label">Search</label>
            <input 
              type="text" 
              class="bloom-input" 
              v-model="searchQuery"
              placeholder="Search by title or content..."
            >
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <label class="bloom-label">Category</label>
            <select class="bloom-select" v-model="selectedCategory">
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <label class="bloom-label">Date</label>
            <input 
              type="date" 
              class="bloom-input" 
              v-model="selectedDate"
            >
          </div>
          <div class="col-12 col-lg-4 d-flex align-items-end">
            <button class="btn-outline-sage me-2" @click="resetFilters">
              Reset Filters
            </button>
            <span class="text-espresso-light" style="font-size: 0.85rem;">
              {{ filteredNews.length }} results
            </span>
          </div>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="active-filters mb-3">
        <span class="filter-label">Active filters:</span>
        <span v-if="searchQuery" class="filter-tag">
          "{{ searchQuery }}" <button @click="searchQuery = ''">×</button>
        </span>
        <span v-if="selectedCategory" class="filter-tag">
          {{ selectedCategory }} <button @click="selectedCategory = ''">×</button>
        </span>
        <span v-if="selectedDate" class="filter-tag">
          {{ formatDate(selectedDate) }} <button @click="selectedDate = ''">×</button>
        </span>
      </div>

      <!-- News Grid -->
      <div v-if="paginatedNews.length > 0" class="row g-4">
        <div 
          v-for="(item, index) in paginatedNews" 
          :key="item.id" 
          class="col-12 col-md-6 col-lg-4 stagger-in"
          :style="{ animationDelay: (index * 0.05) + 's' }"
        >
          <article class="news-card h-100">
            <div class="news-emoji">{{ item.image }}</div>
            <div class="news-body">
              <div class="news-meta">
                <span class="news-category">{{ item.category }}</span>
                <span class="news-date">{{ formatDate(item.date) }}</span>
              </div>
              <h3 class="news-title">{{ item.title }}</h3>
              <p class="news-excerpt">{{ item.content }}</p>
            </div>
          </article>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📰😔</div>
        <h4>No news found</h4>
        <p>Try adjusting your search or filters.</p>
        <button class="btn-sage" @click="resetFilters">Reset Filters</button>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="pagination-nav mt-5">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
              ← Previous
            </button>
          </li>
          <li 
            v-for="page in visiblePages" 
            :key="page" 
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
              Next →
            </button>
          </li>
        </ul>
        <div class="text-center text-espresso-light" style="font-size: 0.85rem;">
          Page {{ currentPage }} of {{ totalPages }} ({{ filteredNews.length }} items)
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// News data (loaded from JSON)
const newsData = ref([
  {
    "id": 1,
    "date": "2026-04-01",
    "title": "Go! Supermarket Launches Spring Sale",
    "content": "Go! supermarket announces massive spring discounts on beverages and snacks. Get up to 30% off on selected items throughout April.",
    "category": "Promotions",
    "image": "🛒"
  },
  {
    "id": 2,
    "date": "2026-03-28",
    "title": "Bách Hoá Xanh Expands to 5 New Locations",
    "content": "Bách Hoá Xanh continues rapid expansion with 5 new stores opening in Da Nang's suburban areas, bringing fresh groceries closer to residents.",
    "category": "Store News",
    "image": "🏪"
  },
  {
    "id": 3,
    "date": "2026-03-25",
    "title": "Price Comparison Tips for Smart Shoppers",
    "content": "Learn how to maximize your savings by comparing prices across different supermarkets. Our guide helps you save up to 20% on weekly groceries.",
    "category": "Tips",
    "image": "💡"
  },
  {
    "id": 4,
    "date": "2026-03-22",
    "title": "Lottemart Introduces New Organic Section",
    "content": "Lottemart Da Nang introduces a dedicated organic produce section featuring locally sourced vegetables and fruits from Central Vietnam farms.",
    "category": "Store News",
    "image": "🥬"
  },
  {
    "id": 5,
    "date": "2026-03-20",
    "title": "Weekend Flash Sales: Best Deals Roundup",
    "content": "This weekend's best deals include 25% off dairy products at Go!, buy-one-get-one on snacks at Bách Hoá Xanh, and frozen food discounts at Lottemart.",
    "category": "Promotions",
    "image": "⚡"
  },
  {
    "id": 6,
    "date": "2026-03-18",
    "title": "New Mobile App Features Released",
    "content": "Da Nang Deals app now includes barcode scanning, real-time price alerts, and shopping list synchronization across devices.",
    "category": "App Updates",
    "image": "📱"
  },
  {
    "id": 7,
    "date": "2026-03-15",
    "title": "How to Use Price History Charts",
    "content": "Our new price history feature helps you identify the best time to buy. Track price trends over 30 days and never miss a good deal.",
    "category": "Tips",
    "image": "📊"
  },
  {
    "id": 8,
    "date": "2026-03-12",
    "title": "Community Savings Report: March 2026",
    "content": "Da Nang Deals users collectively saved over 500 million VND in March! Top categories for savings were beverages, rice, and cooking oil.",
    "category": "Community",
    "image": "🎉"
  },
  {
    "id": 9,
    "date": "2026-03-10",
    "title": "Go! Membership Program Changes",
    "content": "Go! supermarket updates its loyalty program with new tier benefits. Gold members now receive additional 5% discount on all purchases.",
    "category": "Store News",
    "image": "⭐"
  },
  {
    "id": 10,
    "date": "2026-03-08",
    "title": "Easter Holiday Shopping Guide",
    "content": "Plan your Easter shopping with our comprehensive guide. Find the best deals on chocolate, baking supplies, and festive decorations.",
    "category": "Tips",
    "image": "🐰"
  },
  {
    "id": 11,
    "date": "2026-03-05",
    "title": "New Partner Store: WinMart",
    "content": "We're excited to announce WinMart as our newest partner store. Compare prices across 4 major supermarket chains in Da Nang!",
    "category": "App Updates",
    "image": "🤝"
  },
  {
    "id": 12,
    "date": "2026-03-02",
    "title": "User Review: Best Budget Rice Brands",
    "content": "Community members share their top picks for affordable yet quality rice brands. ST25 continues to dominate as the favorite choice.",
    "category": "Community",
    "image": "🍚"
  },
  {
    "id": 13,
    "date": "2026-02-28",
    "title": "Bách Hoá Xanh Valentine's Clearance",
    "content": "Post-Valentine clearance sale at Bách Hoá Xanh! Chocolate and gift items marked down by up to 50%. Limited stock available.",
    "category": "Promotions",
    "image": "💝"
  },
  {
    "id": 14,
    "date": "2026-02-25",
    "title": "Understanding Unit Pricing",
    "content": "Learn how to calculate and compare unit prices to make smarter shopping decisions. Bigger isn't always cheaper!",
    "category": "Tips",
    "image": "🧮"
  },
  {
    "id": 15,
    "date": "2026-02-22",
    "title": "Lottemart Kids' Day Special",
    "content": "Special discounts on children's snacks, toys, and school supplies at Lottemart. Valid for the entire last week of February.",
    "category": "Promotions",
    "image": "👶"
  },
  {
    "id": 16,
    "date": "2026-02-20",
    "title": "Price Alert Feature Now Available",
    "content": "Set custom price alerts for your favorite products. Get notified instantly when prices drop below your target.",
    "category": "App Updates",
    "image": "🔔"
  },
  {
    "id": 17,
    "date": "2026-02-18",
    "title": "Weekly Top 10 Deals",
    "content": "This week's hottest deals: Coca-Cola 24-pack at Go!, fresh milk at Bách Hoá Xanh, and instant noodles bulk pack at Lottemart.",
    "category": "Promotions",
    "image": "🔥"
  },
  {
    "id": 18,
    "date": "2026-02-15",
    "title": "Community Milestone: 10,000 Users!",
    "content": "Thank you for helping us reach 10,000 active users! Together, we're making grocery shopping smarter in Da Nang.",
    "category": "Community",
    "image": "🎊"
  }
])

// Search & Filter state
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

// Computed: unique categories
const categories = computed(() => {
  const cats = [...new Set(newsData.value.map(item => item.category))]
  return cats.sort()
})

// Computed: filtered news
const filteredNews = computed(() => {
  let result = [...newsData.value]

  // Filter by search query (title and content)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  // Filter by date
  if (selectedDate.value) {
    result = result.filter(item => item.date === selectedDate.value)
  }

  return result
})

// Computed: paginated news
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNews.value.slice(start, end)
})

// Computed: total pages
const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / itemsPerPage)
})

// Computed: visible page numbers
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }

  return pages
})

// Computed: has active filters
const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedDate.value
})

// Methods
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedDate.value = ''
  currentPage.value = 1
}

// Watch for filter changes to reset pagination
import { watch } from 'vue'
watch([searchQuery, selectedCategory, selectedDate], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.news-header h1 {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.filter-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid rgba(122, 139, 111, 0.1);
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.85rem;
  color: var(--espresso-light);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(122, 139, 111, 0.1);
  color: var(--sage-dark);
  padding: 0.25rem 0.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
}

.filter-tag button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  color: inherit;
  padding: 0;
  margin-left: 0.2rem;
}

.news-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(122, 139, 111, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(59, 47, 47, 0.1);
}

.news-emoji {
  background: linear-gradient(135deg, #f5eed8, #e8f0de);
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.news-body {
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.news-category {
  background: rgba(122, 139, 111, 0.12);
  color: var(--sage-dark);
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.news-date {
  font-size: 0.8rem;
  color: var(--espresso-light);
}

.news-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--espresso);
  margin-bottom: 0.6rem;
  line-height: 1.3;
}

.news-excerpt {
  font-size: 0.9rem;
  color: var(--espresso-light);
  line-height: 1.5;
  flex: 1;
}

.pagination-nav {
  margin-top: 2rem;
}

.pagination {
  gap: 0.3rem;
}

.page-link {
  background: var(--card-bg);
  border: 1px solid rgba(122, 139, 111, 0.2);
  color: var(--espresso);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.page-link:hover:not(:disabled) {
  background: rgba(122, 139, 111, 0.1);
  border-color: var(--sage);
}

.page-item.active .page-link {
  background: var(--sage);
  border-color: var(--sage);
  color: white;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-family: var(--font-display);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--espresso-light);
  margin-bottom: 1.5rem;
}
</style>
