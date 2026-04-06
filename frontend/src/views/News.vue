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
              v-focus
              placeholder="Search by title or content..."
              aria-label="Search news by title or content"
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
              <h3 class="news-title" v-highlight>{{ item.title }}</h3>
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
import newsItems from '../data/news.json'

// News data loaded from local JSON file
const newsData = ref(newsItems)

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
