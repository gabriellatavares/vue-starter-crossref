import { ref, readonly } from 'vue'
import type { CrossrefResponse, CrossrefWork, FacetValue, ActiveFilters } from '../types/crossref'

const ROWS = 10
const BASE_URL = 'https://api.crossref.org/works'

function buildUrl(query: string, filters: ActiveFilters): string {
  const base = `${BASE_URL}?query.bibliographic=${encodeURIComponent(query)}&facet=type-name:*,published:*&rows=${ROWS}`

  const filterParts: string[] = []
  if (filters.typeName) filterParts.push(`type-name:${filters.typeName}`)
  if (filters.published) filterParts.push(`from-pub-date:${filters.published}`)

  return filterParts.length
    ? `${base}&filter=${filterParts.join(',')}`
    : base
}

function parseFacetValues(raw: Record<string, number> | undefined): FacetValue[] {
  if (!raw) return []
  return Object.entries(raw)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

export function useCrossrefSearch() {
  const results = ref<CrossrefWork[]>([])
  const typeNameFacets = ref<FacetValue[]>([])
  const publishedFacets = ref<FacetValue[]>([])
  const totalResults = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let abortController: AbortController | null = null

  async function search(query: string, filters: ActiveFilters) {
    if (!query.trim()) return

    // Cancel any in-flight request
    if (abortController) abortController.abort()
    abortController = new AbortController()

    loading.value = true
    error.value = null

    try {
      const url = buildUrl(query, filters)
      const response = await fetch(url, { signal: abortController.signal })

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data: CrossrefResponse = await response.json()
      const msg = data.message

      results.value = msg.items
      totalResults.value = msg['total-results']

      typeNameFacets.value = parseFacetValues(msg.facets?.['type-name']?.values)
      publishedFacets.value = parseFacetValues(msg.facets?.published?.values)
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return
      error.value = 'Failed to fetch results. Please try again.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  function reset() {
    results.value = []
    typeNameFacets.value = []
    publishedFacets.value = []
    totalResults.value = 0
    error.value = null
  }

  return {
    results: readonly(results),
    typeNameFacets: readonly(typeNameFacets),
    publishedFacets: readonly(publishedFacets),
    totalResults: readonly(totalResults),
    loading: readonly(loading),
    error: readonly(error),
    search,
    reset,
  }
}
