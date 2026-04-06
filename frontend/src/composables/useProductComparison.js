import { ref, computed, watchEffect, watch } from "vue";

const STORE_NAMES = { go: "Go!", bhx: "Bách Hoá Xanh", lotte: "Lottemart" };
const STORE_COLORS = { go: "#6B8F5E", bhx: "#5B8DB8", lotte: "#C2703E" };
const ALL_STORES = ["go", "bhx", "lotte"];

export function useProductComparison() {
  const MAX_ITEMS = 3;
  //reactive state
  const selectedProducts = ref([]);
  const isComparing = ref(false);
  const comparisonData = ref(null);

  //computed
  const canCompare = computed(() => selectedProducts.value.length >= 2);
  const selectionCount = computed(() => selectedProducts.value.length);

  //watchEffect
  watchEffect(() => {
    if (selectedProducts.value.length === 0) {
      comparisonData.value = null;
      return;
    }

    comparisonData.value = {
      labels: selectedProducts.value.map((p) =>
        p.name.length > 22 ? p.name.substring(0, 22) + "…" : p.name,
      ),
      datasets: ALL_STORES.map((storeId) => ({
        label: STORE_NAMES[storeId],
        backgroundColor: STORE_COLORS[storeId],
        borderRadius: 6,
        data: selectedProducts.value.map((product) => {
          const entry = product.prices?.find((p) => p.storeId === storeId);
          return entry ? entry.salePrice || entry.regularPrice : null;
        }),
      })).filter((ds) => ds.data.some((d) => d !== null)), //only include stores that have at least one price in the current selection
    };
  });

  //methods
  function toggleProduct(product) {
    const idx = selectedProducts.value.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      selectedProducts.value.splice(idx, 1);
    } else if (selectedProducts.value.length < MAX_ITEMS) {
      selectedProducts.value.push(product);
    }
  }

  function isSelected(productId) {
    return selectedProducts.value.some((p) => p.id === productId);
  }

  function clearSelection() {
    selectedProducts.value = [];
    isComparing.value = false;
  }

  function openComparison() {
    if (canCompare.value) isComparing.value = true;
  }

  return {
    selectedProducts,
    isComparing,
    comparisonData,
    canCompare,
    selectionCount,
    MAX_ITEMS,
    toggleProduct,
    isSelected,
    clearSelection,
    openComparison
  }
}
