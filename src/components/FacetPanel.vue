<script setup lang="ts">
import type { FacetValue } from '../types/crossref'

const props = defineProps<{
  typeNames: readonly FacetValue[]
  published: readonly FacetValue[]
  activeType: string | null
  activeYear: string | null
}>()

const emit = defineEmits<{
  'select-type': [value: string | null]
  'select-year': [value: string | null]
}>()

function toggleType(value: string) {
  emit('select-type', props.activeType === value ? null : value)
}

function toggleYear(value: string) {
  emit('select-year', props.activeYear === value ? null : value)
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n)
}
</script>

<template>
  <aside
    class="facets"
    aria-label="Filter results"
  >
    <div
      v-if="typeNames.length > 0"
      class="facet-group"
    >
      <h2 class="facet-heading">
        Record Type
      </h2>
      <ul
        class="facet-list"
        role="list"
      >
        <li
          v-for="item in typeNames"
          :key="item.value"
        >
          <button
            class="facet-btn"
            :class="{ active: activeType === item.value }"
            :aria-pressed="activeType === item.value"
            @click="toggleType(item.value)"
          >
            <span class="facet-label">{{ item.value }}</span>
            <span
              class="facet-count"
              aria-label="{{ formatCount(item.count) }} results"
            >
              {{ formatCount(item.count) }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <div
      v-if="published.length > 0"
      class="facet-group"
    >
      <h2 class="facet-heading">
        Publication Year
      </h2>
      <ul
        class="facet-list"
        role="list"
      >
        <li
          v-for="item in published"
          :key="item.value"
        >
          <button
            class="facet-btn"
            :class="{ active: activeYear === item.value }"
            :aria-pressed="activeYear === item.value"
            @click="toggleYear(item.value)"
          >
            <span class="facet-label">{{ item.value }}</span>
            <span class="facet-count">{{ formatCount(item.count) }}</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.facets {
  width: 220px;
  flex-shrink: 0;
}

.facet-group + .facet-group {
  margin-top: 32px;
}

.facet-heading {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.facet-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.facet-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, border-color 0.12s;
  font-family: var(--font-body);
}

.facet-btn:hover {
  background: var(--surface-hover);
  border-color: var(--border);
}

.facet-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.facet-btn.active {
  background: var(--accent-faint);
  border-color: var(--accent);
  color: var(--accent-dark);
}

.facet-label {
  font-size: 0.875rem;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.facet-btn.active .facet-label {
  color: var(--accent-dark);
  font-weight: 500;
}

.facet-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--surface-hover);
  padding: 1px 6px;
  border-radius: 10px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.facet-btn.active .facet-count {
  background: var(--accent);
  color: #fff;
}
</style>
