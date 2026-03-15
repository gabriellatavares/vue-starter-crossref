<script setup lang="ts">
import XIcon from '../assets/XIcon.vue'

const { activeType, activeYear } = defineProps<{
  activeType: string | null
  activeYear: string | null
}>()

const emit = defineEmits<{
  'clear-type': []
  'clear-year': []
  'clear-all': []
}>()
</script>

<template>
  <div
    v-if="activeType || activeYear"
    class="active-filters"
    role="status"
    aria-live="polite"
    aria-label="Active filters"
  >
    <button
      v-if="activeType"
      class="pill"
      @click="emit('clear-type')"
    >
      Type: {{ activeType }}
      <XIcon />
    </button>

    <button
      v-if="activeYear"
      class="pill"
      @click="emit('clear-year')"
    >
      From Year: {{ activeYear }}
      <XIcon />
    </button>

    <button
      v-if="activeType && activeYear"
      class="clear-all"
      @click="emit('clear-all')"
    >
      Clear all
    </button>
  </div>
</template>

<style scoped>
.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filters-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--accent-faint);
  border: 1px solid var(--accent-light);
  border-radius: 20px;
  font-size: 0.8rem;
  font-family: var(--font-body);
  color: var(--accent-dark);
  cursor: pointer;
  transition: background 0.12s;
}

.pill:hover {
  background: var(--accent-light);
}

.pill:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.pill svg {
  width: 12px; height: 12px;
}

.clear-all {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  text-decoration: underline;
  padding: 4px 4px;
}

.clear-all:hover { color: var(--text); }
</style>
