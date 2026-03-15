export interface CrossrefAuthor {
  given?: string
  family?: string
  name?: string
}

export interface CrossrefWork {
  DOI: string
  title?: readonly string[]
  author?: readonly CrossrefAuthor[]
  'container-title'?: readonly string[]
  published?: { 'date-parts': readonly (readonly number[])[] }
  type?: string
  URL?: string
  publisher?: string
  abstract?: string
  'is-referenced-by-count'?: number
}

export interface FacetValue {
  value: string
  count: number
}

export interface CrossrefFacets {
  'type-name'?: { values: Record<string, number> }
  published?: { values: Record<string, number> }
}

export interface CrossrefResponse {
  status: string
  message: {
    'total-results': number
    items: CrossrefWork[]
    facets: CrossrefFacets
  }
}

export interface ActiveFilters {
  typeName: string | null
  published: string | null
}

export interface SearchState {
  query: string
  results: CrossrefWork[]
  facets: {
    typeNames: FacetValue[]
    published: FacetValue[]
  }
  totalResults: number
  loading: boolean
  error: string | null
  filters: ActiveFilters
}
