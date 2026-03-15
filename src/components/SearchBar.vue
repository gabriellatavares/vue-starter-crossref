<script setup lang="ts">
import SearchIcon from '../assets/SearchIcon.vue'
import XIcon from '../assets/XIcon.vue'

const { modelValue, loading, hasSearched } = defineProps<{ modelValue: string; loading: boolean, hasSearched: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onSubmit() {
  emit('submit')
}

function onClear() {
  emit('update:modelValue', '')
  emit('submit')
}
</script>

<template>
  <form
    class="search-bar"
    role="search"
    @submit.prevent="onSubmit"
  >
    <label
      for="search-input"
      class="visually-hidden"
    >
      Search Crossref metadata
    </label>
    <div class="input-wrap">
      <SearchIcon />
      <input
        id="search-input"
        ref="inputRef"
        type="search"
        class="search-input"
        placeholder="Search articles, books, journals…"
        :value="modelValue"
        autocomplete="off"
        @input="onInput"
        @keydown.enter.prevent="onSubmit"
      >
      <button
        v-if="modelValue && hasSearched"
        type="button"
        class="clear-btn"
        aria-label="Clear search"
        @click="onClear"
      >
        <XIcon />
      </button>
      <button
        type="submit"
        class="search-btn"
        :disabled="loading || !modelValue.trim() && hasSearched"
        :aria-busy="loading"
      >
        <span
          v-if="loading"
          class="spinner"
          aria-hidden="true"
        />
        <span v-else>Search</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.search-bar { width: 100%; }

.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.input-wrap:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-faint);
}

.search-icon {
  width: 18px; height: 18px;
  margin-left: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 13px 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text);
  min-width: 0;
}

.search-input::placeholder { color: var(--text-muted); }

.search-input::-webkit-search-cancel-button { display: none; }

.search-btn {
  padding: 0 24px;
  height: 100%;
  min-height: 50px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.search-btn:hover:not(:disabled) { background: var(--accent-dark); }
.search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: background 0.12s, color 0.12s;
}
 
.clear-btn:hover {
  background: var(--surface-hover);
  color: var(--text);
}
 
.clear-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
 
.clear-btn svg {
  width: 14px;
  height: 14px;
}
</style>
