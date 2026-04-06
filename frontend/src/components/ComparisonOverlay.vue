<template>
  <Teleport to="body">
    <Transition name="overlay-slide">
      <div v-if="isComparing" class="overlay-backdrop" @click.self="isComparing = false">
        <div class="overlay-panel">

          <div class="overlay-header">
            <h2>⚖️ Price Comparison</h2>
            <button class="overlay-close" @click="isComparing = false">✕</button>
          </div>

          <div class="overlay-body">

            <!-- Product thumbnails -->
            <div class="products-row">
              <div v-for="product in selectedProducts" :key="product.id" class="product-thumb-card">
                <div class="thumb-img">
                  <img v-if="product.image" :src="product.image" :alt="product.name">
                  <span v-else>🛒</span>
                </div>
                <p class="thumb-name">{{ product.name }}</p>
                <span class="thumb-meta">{{ product.brand }} · {{ product.unit }}</span>
              </div>
            </div>

            <!-- Price table -->
            <div class="table-wrap">
              <table class="price-table">
                <thead>
                  <tr>
                    <th class="store-col">Store</th>
                    <th v-for="product in selectedProducts" :key="product.id">
                      {{ product.name.substring(0, 18) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="store in STORES" :key="store.id">
                    <td class="store-cell">{{ store.name }}</td>
                    <td
                      v-for="product in selectedProducts"
                      :key="product.id"
                      class="price-cell"
                      :class="{ 'is-best': isBestPrice(product, store.id) }"
                    >
                      <template v-if="getStorePrice(product, store.id)">
                        <span class="p-main">
                          {{ fmt(getStorePrice(product, store.id).salePrice || getStorePrice(product, store.id).regularPrice) }}
                        </span>
                        <span v-if="getStorePrice(product, store.id).salePrice" class="p-old">
                          {{ fmt(getStorePrice(product, store.id).regularPrice) }}
                        </span>
                        <span v-if="isBestPrice(product, store.id)" class="best-tag">Best</span>
                      </template>
                      <span v-else class="no-price">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Chart -->
            <div class="chart-section">
              <h4>Price Comparison Chart</h4>
              <div class="chart-container">
                <Bar v-if="comparisonData" :data="comparisonData" :options="chartOptions" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { inject } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { selectedProducts, isComparing, comparisonData } = inject('comparison')

const STORES = [
  { id: 'go',    name: 'Go!' },
  { id: 'bhx',   name: 'Bách Hoá Xanh' },
  { id: 'lotte', name: 'Lottemart' }
]

const vndFmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const fmt = (price) => price ? vndFmt.format(price) : '—'

function getStorePrice(product, storeId) {
  return product.prices?.find(p => p.storeId === storeId) || null
}

function isBestPrice(product, storeId) {
  const prices = STORES
    .map(s => getStorePrice(product, s.id))
    .filter(Boolean)
    .map(e => e.salePrice || e.regularPrice)
  if (prices.length < 2) return false
  const entry = getStorePrice(product, storeId)
  if (!entry) return false
  return (entry.salePrice || entry.regularPrice) === Math.min(...prices)
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: ctx => fmt(ctx.raw)
      }
    }
  },
  scales: {
    y: {
      ticks: { callback: val => vndFmt.format(val) }
    }
  }
}
</script>

<style scoped>
.overlay-backdrop { position: fixed; inset: 0; background: rgba(59,47,47,0.45); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: flex-end; justify-content: center; }
.overlay-panel    { background: var(--card-bg); width: 100%; max-width: 900px; max-height: 88vh; border-radius: var(--radius-xl) var(--radius-xl) 0 0; display: flex; flex-direction: column; overflow: hidden; }
.overlay-header   { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(122,139,111,0.12); flex-shrink: 0; }
.overlay-header h2 { font-family: var(--font-display); font-size: 1.3rem; margin: 0; }
.overlay-close    { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--espresso-light); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); transition: background 0.2s; }
.overlay-close:hover { background: rgba(122,139,111,0.1); }
.overlay-body     { overflow-y: auto; padding: 1.5rem; flex: 1; }
.products-row     { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.product-thumb-card { flex: 1; min-width: 120px; background: linear-gradient(135deg,#faf5ed,#f0ebe0); border-radius: var(--radius-md); padding: 1rem; text-align: center; }
.thumb-img        { height: 70px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; font-size: 2.5rem; }
.thumb-img img    { max-height: 70px; max-width: 100%; object-fit: contain; }
.thumb-name       { font-weight: 600; font-size: 0.82rem; color: var(--espresso); margin-bottom: 0.2rem; }
.thumb-meta       { font-size: 0.72rem; color: var(--espresso-light); }
.table-wrap       { overflow-x: auto; margin-bottom: 1.5rem; border-radius: var(--radius-md); border: 1px solid rgba(122,139,111,0.12); }
.price-table      { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.price-table th   { background: rgba(122,139,111,0.08); padding: 0.7rem 1rem; text-align: left; font-weight: 600; color: var(--espresso); white-space: nowrap; }
.price-table td   { padding: 0.7rem 1rem; border-top: 1px solid rgba(59,47,47,0.06); vertical-align: middle; }
.store-cell       { font-weight: 600; color: var(--espresso-light); white-space: nowrap; }
.price-cell       { min-width: 130px; }
.price-cell.is-best { background: rgba(122,139,111,0.08); }
.p-main           { font-weight: 700; color: var(--espresso); display: block; }
.p-old            { font-size: 0.78rem; color: var(--espresso-light); text-decoration: line-through; }
.best-tag         { display: inline-block; background: var(--sage); color: white; font-size: 0.68rem; font-weight: 700; padding: 0.1rem 0.45rem; border-radius: 50px; margin-left: 0.3rem; vertical-align: middle; }
.no-price         { color: var(--espresso-light); opacity: 0.5; }
.chart-section h4 { font-family: var(--font-display); font-size: 1rem; margin-bottom: 1rem; color: var(--espresso); }
.chart-container  { height: 260px; position: relative; }
.overlay-slide-enter-active, .overlay-slide-leave-active { transition: transform 0.35s cubic-bezier(0.32,0.72,0,1), opacity 0.35s ease; }
.overlay-slide-enter-from, .overlay-slide-leave-to       { transform: translateY(100%); opacity: 0; }
</style>
