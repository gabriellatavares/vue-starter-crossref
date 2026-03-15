<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <p class="code">
      404
    </p>
    <h1 class="heading">
      Page not found
    </h1>
    <p class="body">
      The page you're looking for doesn't exist.
    </p>
    <button
      class="home-btn"
      @click="router.push('/')"
    >
      Back to search
    </button>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.code {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 700;
  color: var(--border);
  margin: 0;
  line-height: 1;
}

.heading {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.body {
  color: var(--text-muted);
  margin: 0;
}

.home-btn {
  margin-top: 8px;
  padding: 10px 24px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 3px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.home-btn:hover { background: var(--accent-dark); }

.home-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>
