import { test, expect, type Page } from '@playwright/test'

const MOCK_RESPONSE = {
  status: 'ok',
  message: {
    'total-results': 2,
    items: [
      {
        DOI: '10.1000/abc',
        title: ['Climate Change and the Ocean'],
        type: 'journal-article',
        author: [{ given: 'Jane', family: 'Smith' }],
        'container-title': ['Nature'],
        published: { 'date-parts': [[2022]] },
        URL: 'https://doi.org/10.1000/abc',
        'is-referenced-by-count': 10,
      },
      {
        DOI: '10.1000/def',
        title: ['Ocean Acidification Trends'],
        type: 'book',
        author: [{ given: 'John', family: 'Doe' }],
        'container-title': ['Science'],
        published: { 'date-parts': [[2021]] },
        URL: 'https://doi.org/10.1000/def',
        'is-referenced-by-count': 5,
      },
    ],
    facets: {
      'type-name': { values: { 'journal-article': 1, book: 1 } },
      published: { values: { '2022': 1, '2021': 1 } },
    },
  },
}

async function mockCrossrefApi(page: Page) {
  await page.route('**/api.crossref.org/works**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_RESPONSE),
    })
  })
}

async function performSearch(page: Page, query = 'climate change') {
  await page.fill('input[type="search"]', query)
  await page.click('.search-btn')
  await page.waitForSelector('.result-card')
}

test.describe('Visual snapshots', () => {
  test('empty / initial state', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('initial-state.png', { fullPage: true })
  })

  test('search results with facets', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)
    await expect(page).toHaveScreenshot('search-results.png', { fullPage: true })
  })

  test('active type filter applied', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)
    await page.click('.facet-btn:first-child')
    await page.waitForSelector('.active-filters')
    await expect(page).toHaveScreenshot('type-filter-active.png', { fullPage: true })
  })

  test('both filters active', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)
    await page.click('.facet-btn:first-child')
    await page.waitForSelector('.active-filters')
    await page.click('.facet-group:last-child .facet-btn:first-child')
    await expect(page).toHaveScreenshot('both-filters-active.png', { fullPage: true })
  })

  test('404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page).toHaveScreenshot('404-page.png', { fullPage: true })
  })
})

test.describe('Search flow', () => {
  test('loads initial state correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('input[type="search"]')).toBeVisible()
    await expect(page.locator('.result-card')).not.toBeVisible()
    await expect(page.locator('.facet-btn')).not.toBeVisible()
  })

  test('shows results and facets after search', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)

    await expect(page.locator('.result-card')).toHaveCount(2)
    await expect(page.locator('.facet-group')).toHaveCount(2)
    await expect(page.locator('.results-count')).toContainText('2')
  })

  test('shows result titles', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)

    await expect(page.locator('.result-card').first()).toContainText('Climate Change and the Ocean')
  })

  test('updates URL with search query', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page, 'climate change')

    expect(page.url()).toContain('q=climate+change')
  })

  test('restores search from URL on direct visit', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/?q=climate+change')
    await page.waitForSelector('.result-card')

    await expect(page.locator('.result-card')).toHaveCount(2)
    expect((await page.inputValue('input[type="search"]'))).toBe('climate change')
  })
})

test.describe('Facet filtering', () => {
  test('clicking a type facet updates URL and shows active filter pill', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)

    await page.click('.facet-btn:first-child')
    await page.waitForSelector('.active-filters')

    expect(page.url()).toContain('type=')
    await expect(page.locator('.pill')).toHaveCount(1)
  })

  test('clicking the active facet again deselects it', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)

    await page.click('.facet-btn:first-child')
    await page.waitForSelector('.active-filters')
    await page.click('.facet-btn:first-child')
    await page.waitForSelector('.active-filters', { state: 'detached' })

    expect(page.url()).not.toContain('type=')
  })

  test('clear-all button removes both filters', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)

    await page.click('.facet-btn:first-child')
    await page.waitForSelector('.active-filters')
    await page.click('.facet-group:last-child .facet-btn:first-child')
    await page.waitForSelector('.clear-all')
    await page.click('.clear-all')

    await expect(page.locator('.active-filters')).not.toBeVisible()
    expect(page.url()).not.toContain('type=')
    expect(page.url()).not.toContain('year=')
  })
})

test.describe('Search bar clear button', () => {
  test('clear button is hidden when input is empty', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.clear-btn')).not.toBeVisible()
  })

  test('clicking clear resets to initial state', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/')
    await performSearch(page)
    await page.click('.clear-btn')

    await expect(page.locator('.result-card')).not.toBeVisible()
    await expect(page.locator('.facet-btn')).not.toBeVisible()
    expect(page.url()).not.toContain('q=')
  })
})

test.describe('404 page', () => {
  test('shows not found page for unknown routes', async ({ page }) => {
    await page.goto('/unknown-page')
    await expect(page.locator('.not-found')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Page not found')
  })

  test('"Back to search" button navigates home', async ({ page }) => {
    await page.goto('/unknown-page')
    await page.click('.home-btn')
    expect(page.url()).toMatch(/\/$/)
  })
})

test.describe('Navigation guard', () => {
  test('strips unrecognised query params from URL', async ({ page }) => {
    await mockCrossrefApi(page)
    await page.goto('/?q=climate&badparam=xyz')
    await page.waitForURL(url => !url.searchParams.has('badparam'))
    expect(page.url()).not.toContain('badparam')
    expect(page.url()).toContain('q=climate')
  })
})
