<template>
  <div
    v-for="i in 5"
    :key="i"
    class="skeleton-card"
  >
    <div class="sk sk-badge" />
    <div class="sk sk-title" />
    <div class="sk sk-title sk-short" />
    <div class="sk sk-line" />
  </div>
</template>

<style>
.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk {
  border-radius: 3px;
  height: 14px;
  background: linear-gradient(90deg, var(--border) 25%, var(--surface-hover) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-badge { width: 80px; height: 20px; border-radius: 2px; }
.sk-title { width: 85%; height: 18px; }
.sk-short { width: 55%; }
.sk-line { width: 40%; height: 12px; }

@keyframes shimmer { to { background-position: -200% 0; } }
</style>