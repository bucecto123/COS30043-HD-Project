# Price Comparison Feature — Design Spec

**Date:** 2026-04-02
**Stage:** 3 (Advanced Feature)
**Technique:** Vue 3 Composables with `provide/inject`, `watchEffect`, Chart.js

## Purpose

Add an interactive price comparison tool to the Da Nang Deals app. Users select 2-3 products from the product grid, then view a side-by-side comparison overlay with a price table and bar chart. This feature demonstrates advanced Vue 3 patterns suitable for a Stage 3 tutorial video.

## Advanced Vue.js Concepts Demonstrated

1. **Custom Composables** — `useProductComparison()` encapsulates all comparison logic as a reusable function
2. **`provide/inject`** — shares a single composable instance across Products.vue, ProductCard.vue, ComparisonBar.vue, and ComparisonOverlay.vue without prop drilling
3. **`watchEffect`** — reactively rebuilds chart data whenever the selected products change
4. **`<Teleport>`** — renders the comparison overlay at `<body>` level
5. **`<Transition>`** — animates the floating bar and overlay entrance/exit

## Architecture

### Composable: `useProductComparison`

Location: `frontend/src/composables/useProductComparison.js`

```
useProductComparison()
├── State
│   ├── selectedProducts: ref([])     // max 3 Product objects
│   ├── isComparing: ref(false)       // controls overlay visibility
│   └── MAX_ITEMS: 3
│
├── Computed
│   ├── canCompare         // selectedProducts.length >= 2
│   ├── selectionCount     // selectedProducts.length
│   └── comparisonData     // chart-ready data, rebuilt by watchEffect
│
├── Methods
│   ├── toggleProduct(product)   // add/remove from selection
│   ├── isSelected(productId)    // check if product is in selection
│   ├── clearSelection()         // reset selectedProducts and close overlay
│   └── openComparison()         // sets isComparing = true
│
└── Provided via provide('comparison', ...) in Products.vue
    Consumed via inject('comparison') in child components
```

### `comparisonData` Shape (built by `watchEffect`)

```js
{
  labels: ['Coca-Cola Zero', 'Pepsi 330ml'],     // product names
  datasets: [
    {
      label: 'Go!',
      backgroundColor: '#6B8F5E',                // green
      data: [25000, 28000]                        // effective prices (sale || regular)
    },
    {
      label: 'Bach Hoa Xanh',
      backgroundColor: '#5B8DB8',                 // blue
      data: [23000, 27500]
    },
    {
      label: 'Lottemart',
      backgroundColor: '#C2703E',                 // orange/terracotta
      data: [26000, 29000]
    }
  ]
}
```

Products missing a price for a given store get `null` in that dataset (Chart.js skips null bars).

## Component Changes

### Modified Files

**`Products.vue`**
- Import `useProductComparison` and call `provide('comparison', useProductComparison())`
- Mount `<ComparisonBar />` (floating bottom bar)
- Mount `<ComparisonOverlay />` wrapped in `<Teleport to="body">`

**`ProductCard.vue`**
- Call `inject('comparison')` to access shared state
- Add a "Compare" toggle button (top-right of card image area, next to the like button)
- Add a CSS border highlight (sage-colored) when the product is selected for comparison

### New Files

**`frontend/src/composables/useProductComparison.js`**
- The composable as described above
- Exports a single function `useProductComparison()`

**`frontend/src/components/ComparisonBar.vue`**
- Fixed-position bar at bottom of viewport
- Shows: mini product thumbnails/names (up to 3), selection count, "Compare Now" button, "Clear" button
- "Compare Now" disabled when fewer than 2 products selected
- Wrapped in `<Transition>` — slides up when selection > 0, slides down when cleared
- Injects comparison state via `inject('comparison')`

**`frontend/src/components/ComparisonOverlay.vue`**
- Full-screen overlay (z-index above everything)
- Sections:
  1. **Header:** Title "Price Comparison" + close button
  2. **Product cards row:** Side-by-side product info (image, name, brand, unit) — responsive columns
  3. **Price comparison table:** Rows = stores, Columns = products. Best price per product highlighted in green. Sale prices show strikethrough on regular price. Missing prices show "—".
  4. **Bar chart:** Chart.js bar chart using `vue-chartjs`. X-axis = product names, Y-axis = price (VND), one dataset per store with distinct colors. Tooltip shows formatted VND price.
- Wrapped in `<Transition>` — slides up on open, slides down on close
- Clicking backdrop (outside modal content) closes the overlay
- Injects comparison state via `inject('comparison')`

## Dependencies

- `chart.js` — charting library
- `vue-chartjs` — Vue 3 wrapper for Chart.js

Install: `npm install chart.js vue-chartjs`

## Chart Details

- **Type:** Bar chart (grouped)
- **X-axis:** Product names
- **Y-axis:** Price in VND (formatted with Intl.NumberFormat on tooltip)
- **Colors:** Go! = `#6B8F5E` (sage green), Bach Hoa Xanh = `#5B8DB8` (blue), Lottemart = `#C2703E` (terracotta)
- **Tooltip:** Shows store name + exact VND price
- **Responsive:** Chart resizes with container

## Comparison Table

| | Product A | Product B | Product C |
|---|---|---|---|
| Image + Name | img, name | img, name | img, name |
| Brand / Unit | brand, unit | brand, unit | brand, unit |
| Go! | 25,000₫ | 28,000₫ | — |
| Bach Hoa Xanh | **23,000₫ Best** | **27,500₫ Best** | — |
| Lottemart | 26,000₫ | 29,000₫ | — |

- Best price per product: green background highlight
- Sale price active: regular price shown with strikethrough, sale price shown as main
- No price for a store: "—" in grey

## Data Flow

```
User clicks "Compare" on ProductCard
  → toggleProduct(product) called on shared composable
  → selectedProducts ref updates
  → watchEffect fires → rebuilds comparisonData for chart
  → ComparisonBar reactively updates (shows/hides, updates count)

User clicks "Compare Now" on ComparisonBar
  → openComparison() called
  → isComparing = true
  → ComparisonOverlay renders via Teleport to body
  → Table + Chart display comparison data

User clicks close/backdrop on ComparisonOverlay
  → isComparing = false
  → Overlay transitions out
  → Selection preserved (user can re-open or modify selection)

User clicks "Clear" on ComparisonBar
  → clearSelection() called
  → selectedProducts emptied, isComparing = false
  → Bar slides away
```

## Styling

- All new components use the existing bloom theme CSS variables
- Overlay uses backdrop blur consistent with existing modals (see ProductEdit.vue delete modal)
- ComparisonBar uses the same sticky-bottom pattern as ProductEdit.vue sticky actions
- Chart container has a max-height with responsive sizing
- Table is horizontally scrollable on mobile

## Scope Boundaries

- No persistence of comparison selections (resets on page leave)
- No "share comparison" URL feature
- No price history over time (mock or real) — just current prices
- Maximum 3 products compared at once
- Chart library only used in ComparisonOverlay — not a global dependency

## File Summary

| File | Action | Purpose |
|---|---|---|
| `frontend/src/composables/useProductComparison.js` | Create | Composable with all comparison logic |
| `frontend/src/components/ComparisonBar.vue` | Create | Floating bottom selection bar |
| `frontend/src/components/ComparisonOverlay.vue` | Create | Full-screen comparison view with table + chart |
| `frontend/src/views/Products.vue` | Modify | Provide composable, mount bar + overlay |
| `frontend/src/components/ProductCard.vue` | Modify | Inject composable, add compare toggle |
| `frontend/package.json` | Modify | Add chart.js + vue-chartjs dependencies |
