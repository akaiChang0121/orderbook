export const numberFormatter = (price: number, lang: string = 'zh-TW'): string => {
  if (!price) {
    return '0.00'
  }

  const formatter = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return formatter.format(price)
}
