import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderBookItem from '@/components/order-book/orderbook-item.vue'
import { OrderBookItemType, type OrderBookItemProps } from '@/types/orderbook-item.d'

describe('OrderBookItem.vue', () => {
  const defaultProps: OrderBookItemProps = {
    price: 50000.25,
    size: 1.5,
    total: 10.5,
    tradeTotal: 100,
    index: 0,
    type: OrderBookItemType.ASKS,
    isHovered: false,
    isHighlight: false,
    labelsWidthPercentage: ['33.33%', '33.33%', '33.33%'],
    quoteSizeStatus: null
  }

  it('renders price and styles correctly', () => {
    const wrapper = mount(OrderBookItem, {
      props: defaultProps
    })

    expect(wrapper.find('.text-left span').text()).toBe('50,000.3')
    expect(wrapper.find('.text-left span').classes()).toContain('text-asks-red')
  })

  it('renders size and total correctly', () => {
    const wrapper = mount(OrderBookItem, {
      props: defaultProps
    })

    const columns = wrapper.findAll('.text-right')
    expect(columns[0].text()).toBe('1.5')
    expect(columns[1].text()).toBe('10.5')
  })

  it('calculates trade total percentage correctly', () => {
    const wrapper = mount(OrderBookItem, {
      props: defaultProps
    })

    const bar = wrapper.find('i')
    expect(bar.attributes('style')).toContain('width: 10.5%')
  })

  it('displays correct flash animation when quote size status changes', async () => {
    const wrapper = mount(OrderBookItem, {
      props: {
        ...defaultProps,
        quoteSizeStatus: {
          isSizeGrowing: true,
          price: '50000.25',
          size: 1.5
        }
      }
    })

    const sizeColumn = wrapper.findAll('.text-right')[0]
    expect(sizeColumn.classes()).toContain('bg-animation-flash-red')
  })

  it('shows correct background on hover', () => {
    const wrapper = mount(OrderBookItem, {
      props: {
        ...defaultProps,
        isHovered: true
      }
    })

    expect(wrapper.find('.flex').classes()).toContain('bg-quote-row-hover')
  })

  it('displays correct flash animation based on type when highlighted', () => {
    // Test ASKS highlight
    const asksWrapper = mount(OrderBookItem, {
      props: {
        ...defaultProps,
        isHighlight: true,
        type: OrderBookItemType.ASKS
      }
    })
    expect(asksWrapper.find('.flex').classes()).toContain('bg-animation-flash-red')

    // Test BIDS highlight
    const bidsWrapper = mount(OrderBookItem, {
      props: {
        ...defaultProps,
        isHighlight: true,
        type: OrderBookItemType.BIDS
      }
    })
    expect(bidsWrapper.find('.flex').classes()).toContain('bg-animation-flash-green')
  })

  it('displays correct background bar style based on type', () => {
    const asksWrapper = mount(OrderBookItem, {
      props: defaultProps
    })
    expect(asksWrapper.find('i').classes()).toContain('bg-sell-quote-accumulative-total-size-bar')
    const bidsWrapper = mount(OrderBookItem, {
      props: {
        ...defaultProps,
        type: OrderBookItemType.BIDS
      }
    })
    expect(bidsWrapper.find('i').classes()).toContain('bg-buy-quote-accumulative-total-size-bar')
  })
})