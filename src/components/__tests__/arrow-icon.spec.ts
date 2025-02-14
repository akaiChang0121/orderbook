import { mount } from '@vue/test-utils'
import ArrowIcon from '@/components/icons/arrow-icon.vue'
import { describe, it, expect } from 'vitest'

describe('arrow-icon.vue', () => {
  it('Should render with default props', () => {
    const wrapper = mount(ArrowIcon)
    const svg = wrapper.find('svg')

    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.attributes('stroke')).toBe('#00b15d')
  })

  it('Should receive and apply custom props', () => {
    const wrapper = mount(ArrowIcon, {
      props: {
        fillColor: '#ff0000',
        size: 32
      }
    })
    const svg = wrapper.find('svg')
    
    // Check attributes
    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('height')).toBe('32')
    expect(svg.attributes('stroke')).toBe('#ff0000')
  })

  it('Should contain correct SVG elements', () => {
    const wrapper = mount(ArrowIcon)
    
    expect(wrapper.find('line').exists()).toBe(true)
    expect(wrapper.find('polyline').exists()).toBe(true)
  })
})