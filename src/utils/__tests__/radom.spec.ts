import { generateRandomStringWithTimestamp, generateRandomString } from '@/utils/radom'
import { describe, it, expect } from 'vitest'

describe('Random string generators', () => {
  describe('generateRandomStringWithTimestamp', () => {
    it('Should generate a string with timestamp', () => {
      const result = generateRandomStringWithTimestamp()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(20)
    })

    it('Should generate different results each time', () => {
      const result1 = generateRandomStringWithTimestamp()
      const result2 = generateRandomStringWithTimestamp()

      expect(result1).not.toBe(result2)
    })
  })

  describe('generateRandomString', () => {
    it('Should generate a string with length 7', () => {
      const result = generateRandomString()
      
      expect(typeof result).toBe('string')
      
      expect(result.length).toBe(7)
    })

    it('Should generate different results each time', () => {
      const result1 = generateRandomString()
      const result2 = generateRandomString()

      expect(result1).not.toBe(result2)
    })
  })
})