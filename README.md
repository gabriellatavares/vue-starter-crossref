# Crossref Metadata Search

A small search UI built with **Vue 3 + TypeScript + Vite** that queries the [Crossref REST API](https://api.crossref.org) and displays results with facet filtering.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
npm run build
npm run preview
```

---

## Testing

### Unit tests (Vitest + Vue Test Utils)

```bash
npm test                  # run once
npm run test:watch        # watch mode
npm run test:coverage     # with coverage report
```

Covers:
- `useCrossrefSearch` composable — API calls, URL construction, facet parsing, error handling, loading state, request cancellation, reset
- `SearchBar` — input binding, submit, clear button, loading/disabled state, accessibility label
- `FacetPanel` — rendering, active state, toggle behaviour, `aria-pressed`, count formatting
- `ResultCard` — title, authors, journal, DOI link, citation count, missing field handling
- `ActiveFilters` — pill rendering, clear individual/all, clear-all visibility logic

### Visual & e2e tests (Playwright)

Playwright tests require a browser to be installed first:

```bash
npx playwright install chromium
```

Then:

```bash
npm run test:visual               # run all visual + e2e tests
npm run test:visual:update        # update snapshots (run this first to generate baseline)
npm run test:visual:ui            # open Playwright UI mode
```

**Important:** visual snapshot tests will fail on first run because no baseline images exist yet. Run `npm run test:visual:update` once to generate them, then `npm run test:visual` for subsequent runs to diff against the baseline.

The visual tests cover:
- Initial / empty state
- Search results with facets
- Active type filter
- Both filters active simultaneously
- 404 page

The e2e tests cover the full interaction flow:
- Search, results and facet rendering
- URL sync on search and filter selection
- Restoring state from a shared URL
- Facet toggle and deselect
- Clear-all filters
- Search bar clear button
- 404 routing
- Navigation guard stripping unrecognised query params

---

## Architecture

### Structure

```
App.vue                        – layout shell (header, router-view, footer)
src/
├── router/index.ts            – routes + navigation guard
├── views/
│   ├── SearchView.vue         – search orchestration, URL sync
│   └── NotFoundView.vue       – 404 page
├── components/
│   ├── SearchBar.vue          – controlled input, submit, clear button
│   ├── FacetPanel.vue         – sidebar filter toggles (type + year)
│   ├── ActiveFilters.vue      – pill display of active filters
│   ├── ResultCard.vue         – individual result (title, authors, journal, DOI, citations)
│   └── (etc)
├── composables/
│   └── useCrossrefSearch.ts   – API calls, URL construction, AbortController, facet parsing
└── types/
    └── crossref.ts            – shared TypeScript interfaces
```

### URL format

```
/?q=climate+change&type=journal-article&year=2022
```

All three params are optional. Visiting a shared URL directly replays the search on mount.

### API URL construction

The Crossref API requires colons and commas in `facet` and `filter` values to be unencoded. `URLSearchParams` encodes these, so the URL is built manually:

```
/works?query.bibliographic={query}&facet=type-name:*,published:*&rows=10
/works?...&filter=type-name:Book,from-pub-date:2018
```

### Facet counts

Facets are updated on every API response, including when filters are active. The API returns fresh facet data in every response at no extra cost, so counts always reflect the current filtered result set.

### Request cancellation

`AbortController` cancels any in-flight request when a new search is issued, preventing stale responses from overwriting newer results.

### Empty input / clear behaviour

Submitting an empty search (or clicking the clear button) is treated as a deliberate reset — results, facets and filters are all cleared and the URL returns to `/`. It is not treated as a validation error.

---

## Possible future improvements

- Pagination / infinite scroll (via the API's `offset` param)
- Debounced search-as-you-type
- Sorting options (relevance, date, citation count)
- Abstract preview on expand
- More facets (funder, license, language)
- Server-side proxy to handle rate limiting at scale
