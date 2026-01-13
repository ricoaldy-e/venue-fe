import { ref, watch, computed } from 'vue';
import { S as SEARCH } from './constants-BG8e5vSv.mjs';

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

export { useSearch as u };
//# sourceMappingURL=useSearch-CZIgd0ZN.mjs.map
