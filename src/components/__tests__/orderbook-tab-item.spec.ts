import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabItem from '@/components/order-book/tab-item.vue'

describe('TabItem', () => {
  const defaultTabs = [
    {
      label: "Order Book",
      id: "orderbook",
    }
  ]

  it('renders default tab correctly', () => {
    const wrapper = mount(TabItem)
    const tab = wrapper.get('[data-testid="tab-orderbook"]')
    const tabContent = wrapper.get('[data-testid="tab-item-orderbook"]')

    expect(tabContent.text()).toBe('Order Book')
    expect(tab.classes()).toContain('w-full')
    expect(tab.classes()).toContain('px-[10px]')
    expect(tab.classes()).toContain('text-gray')
    expect(tab.classes()).toContain('font-bold')
  })

  it('renders custom tabs correctly', () => {
    const customTabs = [
      {
        label: "Trade History",
        id: "trades"
      },
      {
        label: "Positions",
        id: "positions"
      }
    ]
    
    const wrapper = mount(TabItem, {
      props: {
        tabs: customTabs,
        active: 'trades'
      }
    })

    const tradeHistoryTab = wrapper.get('[data-testid="tab-item-trades"]')
    const positionsTab = wrapper.get('[data-testid="tab-item-positions"]')
    
    expect(tradeHistoryTab.text()).toBe('Trade History')
    expect(positionsTab.text()).toBe('Positions')
  })

  it('emits update:active event when tab is clicked', async () => {
    const wrapper = mount(TabItem, {
      props: {
        tabs: defaultTabs,
        active: 'orderbook'
      }
    })

    await wrapper.get('[data-testid="tab-item-orderbook"]').trigger('click')
    
    const emitted = wrapper.emitted('update:active')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['orderbook'])
  })
})