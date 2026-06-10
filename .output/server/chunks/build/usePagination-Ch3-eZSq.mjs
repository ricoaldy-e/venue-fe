import { ref, watch, computed } from 'vue';
import { S as SEARCH, P as PAGINATION } from './constants-BG8e5vSv.mjs';

const useSearch = (items, searchKeys, options = {}) => {
  const {
    debounceDelay = SEARCH.DEBOUNCE_DELAY,
    minLength = SEARCH.MIN_SEARCH_LENGTH,
    caseSensitive = false
  } = options;
  const searchQuery = ref("");
  const debouncedQuery = ref("");
  const isSearching = ref(false);
  let debounceTimeout = null;
  watch(searchQuery, (newValue) => {
    isSearching.value = true;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      debouncedQuery.value = newValue;
      isSearching.value = false;
    }, debounceDelay);
  });
  const filteredItems = computed(() => {
    const query = debouncedQuery.value.trim();
    if (!query || query.length < minLength) {
      return items.value;
    }
    const searchTerm = caseSensitive ? query : query.toLowerCase();
    return items.value.filter((item) => {
      const keys = searchKeys(item);
      return keys.some((key) => {
        const searchableKey = caseSensitive ? key : key.toLowerCase();
        return searchableKey.includes(searchTerm);
      });
    });
  });
  const hasResults = computed(() => filteredItems.value.length > 0);
  const resultCount = computed(() => filteredItems.value.length);
  const clearSearch = () => {
    searchQuery.value = "";
    debouncedQuery.value = "";
    isSearching.value = false;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      debounceTimeout = null;
    }
  };
  return {
    searchQuery,
    debouncedQuery,
    filteredItems,
    isSearching,
    hasResults,
    resultCount,
    clearSearch
  };
};
const usePagination = (items, options = {}) => {
  const {
    itemsPerPage = PAGINATION.ITEMS_PER_PAGE,
    initialPage = 1,
    resetOnItemsChange = true
  } = options;
  const currentPage = ref(initialPage);
  const totalItems = computed(() => items.value.length);
  const totalPages = computed(() => {
    return Math.max(Math.ceil(totalItems.value / itemsPerPage), 1);
  });
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.value.slice(start, end);
  });
  const summary = computed(() => {
    if (totalItems.value === 0) return "Tidak ada data";
    const start = (currentPage.value - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage.value * itemsPerPage, totalItems.value);
    return `Menampilkan ${start}-${end} dari ${totalItems.value} data`;
  });
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);
  const isFirstPage = computed(() => currentPage.value === 1);
  const isLastPage = computed(() => currentPage.value === totalPages.value);
  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++;
    }
  };
  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--;
    }
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  if (resetOnItemsChange) {
    watch(
      () => items.value.length,
      () => {
        if (currentPage.value > totalPages.value) {
          currentPage.value = Math.max(totalPages.value, 1);
        }
      }
    );
  }
  watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages) {
      currentPage.value = Math.max(newTotalPages, 1);
    }
  });
  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    summary,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage
  };
};

export { usePagination as a, useSearch as u };
//# sourceMappingURL=usePagination-Ch3-eZSq.mjs.map
