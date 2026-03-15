import { describe, it, expect, vi, afterEach } from 'vitest'
import { useCrossrefSearch } from '../../src/composables/useCrossrefSearch'

const mockWork = {
  DOI: '10.1000/test',
  title: ['Test Article'],
  type: 'journal-article',
  published: { 'date-parts': [[2022]] },
}

const mockResponse = {
  status: 'ok',
  message: {
    'total-results': 42,
    items: [mockWork],
    facets: {
      'type-name': { values: { 'journal-article': 30, 'book': 12 } },
      published: { values: { '2022': 20, '2021': 22 } },
    },
  },
}

function mockFetch(response: object, ok = true) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: async () => response,
  } as Response)
}

describe('useCrossrefSearch', () => {
  afterEach(() => vi.restoreAllMocks())

  it('initial state is empty', () => {
    const { results, typeNameFacets, publishedFacets, totalResults, loading, error } =
      useCrossrefSearch()

    expect(results.value).toEqual([])
    expect(typeNameFacets.value).toEqual([])
    expect(publishedFacets.value).toEqual([])
    expect(totalResults.value).toBe(0)
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('populates results and facets on successful search', async () => {
    mockFetch(mockResponse)
    const { results, typeNameFacets, publishedFacets, totalResults, search } = useCrossrefSearch()

    await search('climate change', { typeName: null, published: null })

    expect(results.value).toHaveLength(1)
    expect(results.value[0].DOI).toBe('10.1000/test')
    expect(totalResults.value).toBe(42)
    expect(typeNameFacets.value).toHaveLength(2)
    expect(typeNameFacets.value[0]).toEqual({ value: 'journal-article', count: 30 })
    expect(publishedFacets.value).toHaveLength(2)
  })

  it('sorts facet values by count descending', async () => {
    mockFetch(mockResponse)
    const { publishedFacets, search } = useCrossrefSearch()

    await search('test', { typeName: null, published: null })

    expect(publishedFacets.value[0].value).toBe('2021') // count 22 > 20
    expect(publishedFacets.value[1].value).toBe('2022')
  })

  it('refreshes facets on every response, including when filters are active', async () => {
    mockFetch(mockResponse)
    const { typeNameFacets, search } = useCrossrefSearch()

    await search('climate', { typeName: 'book', published: '2022' })

    expect(typeNameFacets.value).toHaveLength(2)
  })

  it('builds URL with filter params when filters are active', async () => {
    const spy = mockFetch(mockResponse)
    const { search } = useCrossrefSearch()

    await search('climate change', { typeName: 'book', published: '2020' })

    const calledUrl = spy.mock.calls[0][0] as string
    expect(calledUrl).toContain('filter=type-name:book,from-pub-date:2020')
  })

  it('builds URL without filter param when no filters are active', async () => {
    const spy = mockFetch(mockResponse)
    const { search } = useCrossrefSearch()

    await search('climate change', { typeName: null, published: null })

    const calledUrl = spy.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('filter=')
  })

  it('does not encode colons and commas in facet or filter params', async () => {
    const spy = mockFetch(mockResponse)
    const { search } = useCrossrefSearch()

    await search('test', { typeName: 'book', published: '2021' })

    const calledUrl = spy.mock.calls[0][0] as string
    expect(calledUrl).toContain('facet=type-name:*,published:*')
    expect(calledUrl).toContain('filter=type-name:book,from-pub-date:2021')
    expect(calledUrl).not.toContain('%3A') // encoded colon
    expect(calledUrl).not.toContain('%2C') // encoded comma
  })

  it('sets error state on API failure', async () => {
    mockFetch({}, false)
    const { error, search } = useCrossrefSearch()

    await search('test', { typeName: null, published: null })

    expect(error.value).toBeTruthy()
  })

  it('does not set results on API failure', async () => {
    mockFetch({}, false)
    const { results, search } = useCrossrefSearch()

    await search('test', { typeName: null, published: null })

    expect(results.value).toEqual([])
  })

  it('sets loading to true during fetch and false after', async () => {
    let resolveFetch!: (v: unknown) => void
    vi.spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise(resolve => { resolveFetch = resolve }) as unknown as Promise<Response>
    )

    const { loading, search } = useCrossrefSearch()
    const searchPromise = search('test', { typeName: null, published: null })

    expect(loading.value).toBe(true)

    resolveFetch({ ok: true, json: async () => mockResponse })
    await searchPromise

    expect(loading.value).toBe(false)
  })

  it('reset clears all state', async () => {
    mockFetch(mockResponse)
    const { results, totalResults, error, search, reset } = useCrossrefSearch()

    await search('test', { typeName: null, published: null })
    expect(results.value).toHaveLength(1)

    reset()

    expect(results.value).toEqual([])
    expect(totalResults.value).toBe(0)
    expect(error.value).toBeNull()
  })

  it('does not search for empty query', async () => {
    const spy = mockFetch(mockResponse)
    const { search } = useCrossrefSearch()

    await search('', { typeName: null, published: null })

    expect(spy).not.toHaveBeenCalled()
  })
})
