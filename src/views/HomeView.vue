<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import SearchBar from '../components/SearchBar.vue'
import FacetPanel from '../components/FacetPanel.vue'
import ActiveFilters from '../components/ActiveFilters.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import ResultCard from '../components/ResultCard.vue'

import { useCrossrefSearch } from '../composables/useCrossrefSearch'
import type { ActiveFilters as IActiveFilters } from '../types/crossref'

const router = useRouter()
const route = useRoute()
const query = ref(String(route.query.q ?? ''))
const filters = ref<IActiveFilters>({
  typeName: route.query.type ? String(route.query.type) : null,
  published: route.query.year ? String(route.query.year) : null,
})
const { results, typeNameFacets, publishedFacets, totalResults, loading, error, search, reset } = useCrossrefSearch()

const hasSearched = computed(() => query.value.trim() !== '' && totalResults.value > 0)

function pushRoute() {
  router.replace({
    query: {
      ...(query.value ? { q: query.value } : {}),
      ...(filters.value.typeName ? { type: filters.value.typeName } : {}),
      ...(filters.value.published ? { year: filters.value.published } : {}),
    },
  })
}

async function doSearch() {
  const trimmed = query.value.trim()

  if (!trimmed) {
    filters.value = { typeName: null, published: null }
    reset()
    pushRoute()
    return
  }

  await search(trimmed, filters.value)

  if (!error.value) {
    pushRoute()
  }
}

async function onSelectType(value: string | null) {
  filters.value.typeName = value
  await doSearch()
}

async function onSelectYear(value: string | null) {
  filters.value.published = value
  await doSearch()
}

async function clearAll() {
  filters.value = { typeName: null, published: null }
  await doSearch()
}

function onNewSearch() {
  filters.value = { typeName: null, published: null }
  doSearch()
}

onMounted(() => {
  if (query.value) doSearch()
})

</script>

<template>
  <div class="search-view">
    <div class="search-section">
      <SearchBar
        v-model="query"
        :loading="loading"
        :has-searched="hasSearched"
        @submit="onNewSearch"
      />
    </div>
    <div
      v-if="!hasSearched && !totalResults"
      class="empty-state"
    >
      <p class="empty-hint">
        Search over 150 million scholarly records. Articles, books, conference papers, and more.
      </p>
    </div>
    <div
      v-else
      class="content-area"
    >
      <FacetPanel
        v-if="typeNameFacets.length || publishedFacets.length"
        :type-names="typeNameFacets"
        :published="publishedFacets"
        :active-type="filters.typeName"
        :active-year="filters.published"
        @select-type="onSelectType"
        @select-year="onSelectYear"
      />
      <section
        class="results-column"
        aria-live="polite"
      >
        <div
          v-if="!loading && !error && results.length > 0"
          class="results-header"
        >
          <p class="results-count">
            <strong>{{ totalResults.toLocaleString() }}</strong> results
            <span v-if="filters.typeName || filters.published"> (filtered)</span>
          </p>
          <ActiveFilters
            :active-type="filters.typeName"
            :active-year="filters.published"
            @clear-type="onSelectType(null)"
            @clear-year="onSelectYear(null)"
            @clear-all="clearAll"
          />
        </div>
        <div
          v-if="loading"
          class="skeletons"
          aria-label="Loading results"
        >
          <SkeletonCard />
        </div>
        <div
          v-else-if="error"
          class="error-state"
          role="alert"
        >
          <p>{{ error }}</p>
          <button
            class="retry-btn"
            @click="doSearch"
          >
            Try again
          </button>
        </div>

        <div
          v-else-if="results.length === 0 && query.value.trim() !== ''"
          class="no-results"
        >
          <p>No results found for <strong>"{{ query }}"</strong>.</p>
          <p
            v-if="filters.typeName || filters.published"
            class="hint"
          >
            Try removing some filters.
          </p>
        </div>
        <ul
          v-else
          class="results-list"
          role="list"
        >
          <li
            v-for="work in results"
            :key="work.DOI"
          >
            <ResultCard :work="work" />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  width: 100%;
}

.search-section {
  margin-bottom: 32px;
}

.empty-state {
  max-width: 600px;
  padding: 40px 0;
}

.empty-hint {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}

.content-area {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.results-column { flex: 1; min-width: 0; }

.results-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.results-count {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.results-count strong { color: var(--text); font-weight: 600; }

.results-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeletons { display: flex; flex-direction: column; gap: 12px; }

.error-state, .no-results {
  padding: 32px 0;
  color: var(--text-secondary);
}

.hint { color: var(--text-muted); font-size: 0.875rem; }

.retry-btn {
  margin-top: 12px;
  padding: 8px 20px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.9rem;
}

.retry-btn:hover { background: var(--accent-dark); }

@media (max-width: 700px) {
  .content-area { flex-direction: column; }
  .search-section { max-width: 100%; }
}
</style>
