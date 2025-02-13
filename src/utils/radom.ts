export const generateRandomStringWithTimestamp = (): string => {
  const timestamp: number = new Date().getTime()
  const randomPart: string =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const combinedString: string = timestamp.toString(36) + randomPart

  return combinedString
}

export const generateRandomString = (): string => {
  return Math.random().toString(36).substring(2, 9)
}
