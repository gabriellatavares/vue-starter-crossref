import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActiveFilters from '../../src/components/ActiveFilters.vue'

describe('ActiveFilters', () => {
  it('renders nothing when no filters are active', () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: null, activeYear: null },
    })
    expect(wrapper.find('.active-filters').exists()).toBe(false)
  })

  it('renders type pill when type filter is active', () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: 'journal-article', activeYear: null },
    })
    expect(wrapper.text()).toContain('Type: journal-article')
  })

  it('renders year pill when year filter is active', () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: null, activeYear: '2022' },
    })
    expect(wrapper.text()).toContain('Year: 2022')
  })

  it('renders both pills when both filters are active', () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: 'book', activeYear: '2021' },
    })
    const pills = wrapper.findAll('.pill')
    expect(pills).toHaveLength(2)
  })

  it('emits clear-type when type pill is clicked', async () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: 'journal-article', activeYear: null },
    })
    await wrapper.find('.pill').trigger('click')
    expect(wrapper.emitted('clear-type')).toHaveLength(1)
  })

  it('emits clear-year when year pill is clicked', async () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: null, activeYear: '2022' },
    })
    await wrapper.find('.pill').trigger('click')
    expect(wrapper.emitted('clear-year')).toHaveLength(1)
  })

  it('shows clear-all button only when both filters are active', () => {
    const wrapperOne = mount(ActiveFilters, {
      props: { activeType: 'book', activeYear: null },
    })
    expect(wrapperOne.find('.clear-all').exists()).toBe(false)

    const wrapperBoth = mount(ActiveFilters, {
      props: { activeType: 'book', activeYear: '2022' },
    })
    expect(wrapperBoth.find('.clear-all').exists()).toBe(true)
  })

  it('emits clear-all when clear all button is clicked', async () => {
    const wrapper = mount(ActiveFilters, {
      props: { activeType: 'book', activeYear: '2022' },
    })
    await wrapper.find('.clear-all').trigger('click')
    expect(wrapper.emitted('clear-all')).toHaveLength(1)
  })
})
