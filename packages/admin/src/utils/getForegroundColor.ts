// ref: https://stackoverflow.com/questions/3116260/given-a-background-color-how-to-get-a-foreground-color-that-makes-it-readable-o
export const getForegroundColor = (hexColor: string) => {
  const r = parseInt(hexColor.substring(1, 3), 16)
  const g = parseInt(hexColor.substring(3, 5), 16)
  const b = parseInt(hexColor.substring(5, 7), 16)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 140 ? "#fff" : "#000"
}
