import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FacetPanel from '../../src/components/FacetPanel.vue'

const typeNames = [
  { value: 'journal-article', count: 45230 },
  { value: 'book', count: 3102 },
]

const published = [
  { value: '2023', count: 8000 },
  { value: '2022', count: 7500 },
]

describe('FacetPanel', () => {
  it('renders both facet groups when data is present', () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: null, activeYear: null },
    })
    const headings = wrapper.findAll('.facet-heading')
    expect(headings).toHaveLength(2)
    expect(headings[0].text()).toBe('Record Type')
    expect(headings[1].text()).toBe('Publication Year')
  })

  it('renders a button for each facet value', () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: null, activeYear: null },
    })
    const buttons = wrapper.findAll('.facet-btn')
    expect(buttons).toHaveLength(4)
  })

  it('marks the active type button as pressed', () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: 'journal-article', activeYear: null },
    })
    const activeBtn = wrapper.findAll('.facet-btn').find(b => b.text().includes('journal-article'))
    expect(activeBtn?.attributes('aria-pressed')).toBe('true')
    expect(activeBtn?.classes()).toContain('active')
  })

  it('marks non-active buttons as not pressed', () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: 'journal-article', activeYear: null },
    })
    const inactiveBtn = wrapper.findAll('.facet-btn').find(b => b.text().includes('book'))
    expect(inactiveBtn?.attributes('aria-pressed')).toBe('false')
  })

  it('emits select-type with value when a type button is clicked', async () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: null, activeYear: null },
    })
    await wrapper.findAll('.facet-btn')[0].trigger('click')
    expect(wrapper.emitted('select-type')?.[0]).toEqual(['journal-article'])
  })

  it('emits select-type with null when the active type is clicked again (toggle off)', async () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: 'journal-article', activeYear: null },
    })
    await wrapper.findAll('.facet-btn')[0].trigger('click')
    expect(wrapper.emitted('select-type')?.[0]).toEqual([null])
  })

  it('emits select-year when a year button is clicked', async () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: null, activeYear: null },
    })
    // year buttons come after type buttons
    await wrapper.findAll('.facet-btn')[2].trigger('click')
    expect(wrapper.emitted('select-year')?.[0]).toEqual(['2023'])
  })

  it('formats large counts with k suffix', () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: null, activeYear: null },
    })
    expect(wrapper.text()).toContain('45k')
  })

  it('renders counts below 1000 without suffix', () => {
    const wrapper = mount(FacetPanel, {
      props: { typeNames, published, activeType: null, activeYear: null },
    })
    expect(wrapper.text()).toContain('3k')
  })
})
