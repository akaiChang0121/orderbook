import { numberFormatter } from '@/utils/format'
import { describe, it, expect } from 'vitest'

describe('numberFormatter', () => {
  it('Should format number correctly', () => {
    expect(numberFormatter(1234.56)).toBe('1,234.6')
    expect(numberFormatter(1000)).toBe('1,000.0')
    expect(numberFormatter(0.1)).toBe('0.1')
  })

  it('When input is 0, should return "0.00"', () => {
    expect(numberFormatter(0)).toBe('0.00')
  })

  it('Can handle different regions', () => {
    expect(numberFormatter(1234.56, 'en-US')).toBe('1,234.6')
    expect(numberFormatter(1234.56, 'de-DE')).toBe('1.234,6')
    expect(numberFormatter(1234.56, 'ja-JP')).toBe('1,234.6')
  })
})