import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultCard from '../../src/components/ResultCard.vue'
import type { CrossrefWork } from '../../src/types/crossref'

const fullWork: CrossrefWork = {
  DOI: '10.1000/xyz123',
  title: ['The Effects of Climate Change on Ocean Ecosystems'],
  type: 'journal-article',
  author: [
    { given: 'Jane', family: 'Smith' },
    { given: 'John', family: 'Doe' },
  ],
  'container-title': ['Nature Climate Change'],
  published: { 'date-parts': [[2022, 6, 15]] },
  URL: 'https://doi.org/10.1000/xyz123',
  'is-referenced-by-count': 42,
}

describe('ResultCard', () => {
  it('renders the title', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    expect(wrapper.text()).toContain('The Effects of Climate Change on Ocean Ecosystems')
  })

  it('renders the publication year', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    expect(wrapper.text()).toContain('2022')
  })

  it('renders the record type badge', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    expect(wrapper.find('.badge').text()).toBe('journal-article')
  })

  it('renders authors in family, initial format', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    expect(wrapper.text()).toContain('Smith, J.')
    expect(wrapper.text()).toContain('Doe, J.')
  })

  it('renders the journal name', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    expect(wrapper.text()).toContain('Nature Climate Change')
  })

  it('renders the DOI as a link', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    const doiLink = wrapper.find('.doi-link')
    expect(doiLink.exists()).toBe(true)
    expect(doiLink.attributes('href')).toBe('https://doi.org/10.1000/xyz123')
  })

  it('renders the title as a link when URL is present', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    const titleLink = wrapper.find('.title-link')
    expect(titleLink.exists()).toBe(true)
    expect(titleLink.attributes('href')).toBe('https://doi.org/10.1000/xyz123')
  })

  it('renders citation count', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    expect(wrapper.text()).toContain('42×')
  })

  it('renders "Untitled" when title is missing', () => {
    const work: CrossrefWork = { ...fullWork, title: undefined }
    const wrapper = mount(ResultCard, { props: { work } })
    expect(wrapper.text()).toContain('Untitled')
  })

  it('does not render authors section when author is missing', () => {
    const work: CrossrefWork = { ...fullWork, author: undefined }
    const wrapper = mount(ResultCard, { props: { work } })
    expect(wrapper.find('.authors').exists()).toBe(false)
  })

  it('truncates author list to 3 with "et al." for more', () => {
    const work: CrossrefWork = {
      ...fullWork,
      author: [
        { given: 'A', family: 'One' },
        { given: 'B', family: 'Two' },
        { given: 'C', family: 'Three' },
        { given: 'D', family: 'Four' },
      ],
    }
    const wrapper = mount(ResultCard, { props: { work } })
    expect(wrapper.find('.authors').text()).toContain('et al.')
    expect(wrapper.find('.authors').text()).not.toContain('Four')
  })

  it('opens links in new tab with rel=noopener', () => {
    const wrapper = mount(ResultCard, { props: { work: fullWork } })
    const titleLink = wrapper.find('.title-link')
    expect(titleLink.attributes('target')).toBe('_blank')
    expect(titleLink.attributes('rel')).toContain('noopener')
  })
})
