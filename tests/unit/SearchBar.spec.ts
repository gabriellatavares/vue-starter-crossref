import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../../src/components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders the search input', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '', loading: false, hasSearched: false },
    })
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
  })

  it('displays the current value', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'climate change', loading: false, hasSearched: true },
    })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('climate change')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '', loading: false, hasSearched: false },
    })
    await wrapper.find('input').setValue('ocean')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ocean'])
  })

  it('emits submit when form is submitted', async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'test query', loading: false, hasSearched: true },
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'test', loading: true, hasSearched: false },
    })
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.find('.search-btn span:not(.spinner)').exists()).toBe(false)
  })

  it('search button is disabled when loading', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'test', loading: true, hasSearched: true },
    })
    const btn = wrapper.find('.search-btn')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('has a label associated with the input for accessibility', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '', loading: false, hasSearched: false },
    })
    const label = wrapper.find('label[for="search-input"]')
    expect(label.exists()).toBe(true)
  })
})
