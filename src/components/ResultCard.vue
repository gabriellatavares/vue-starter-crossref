<script setup lang="ts">
import type { CrossrefWork } from '../types/crossref'

const { work }= defineProps<{ work: CrossrefWork }>()

function getYear(work: CrossrefWork): string | null {
  const parts = work.published?.['date-parts']?.[0]
  return parts?.[0] ? String(parts[0]) : null
}

function getAuthors(work: CrossrefWork): string {
  if (!work.author?.length) return ''
  const names = work.author.slice(0, 3).map(a =>
    a.family ? `${a.family}${a.given ? ', ' + a.given[0] + '.' : ''}` : (a.name ?? '')
  )
  return names.join(' · ') + (work.author.length > 3 ? ' et al.' : '')
}
</script>

<template>
  <article class="result-card">
    <div class="card-meta">
      <span
        v-if="work.type"
        class="badge"
      >{{ work.type }}</span>
      <span
        v-if="getYear(work)"
        class="year"
      >{{ getYear(work) }}</span>
    </div>

    <h3 class="card-title">
      <a
        v-if="work.URL"
        :href="work.URL"
        target="_blank"
        rel="noopener noreferrer"
        class="title-link"
      >
        {{ work.title?.[0] ?? 'Untitled' }}
        <svg
          class="ext-icon"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14 21 3" />
        </svg>
      </a>
      <span v-else>{{ work.title?.[0] ?? 'Untitled' }}</span>
    </h3>

    <p
      v-if="getAuthors(work)"
      class="authors"
    >
      {{ getAuthors(work) }}
    </p>

    <p
      v-if="work['container-title']?.[0]"
      class="journal"
    >
      {{ work['container-title'][0] }}
    </p>

    <div class="card-footer">
      <span
        v-if="work.DOI"
        class="doi"
      >
        DOI: <a
          :href="`https://doi.org/${work.DOI}`"
          target="_blank"
          rel="noopener noreferrer"
          class="doi-link"
        >{{ work.DOI }}</a>
      </span>
      <span
        v-if="work['is-referenced-by-count'] != null"
        class="citations"
      >
        Cited {{ work['is-referenced-by-count'] }}×
      </span>
    </div>
  </article>
</template>

<style scoped>
.result-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 20px 24px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.result-card:hover {
  border-color: var(--accent-light);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--accent-faint);
  color: var(--accent-dark);
  padding: 2px 8px;
  border-radius: 2px;
}

.year {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 8px;
  color: var(--text);
}

.title-link {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.title-link:hover { color: var(--accent); text-decoration: underline; }

.ext-icon {
  width: 12px; height: 12px;
  flex-shrink: 0;
  position: relative;
  top: 1px;
  opacity: 0.5;
}

.authors {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 4px;
}

.journal {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
  margin: 0 0 12px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.doi {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.doi-link {
  color: var(--accent);
  text-decoration: none;
}

.doi-link:hover { text-decoration: underline; }

.citations {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-left: auto;
}
</style>
