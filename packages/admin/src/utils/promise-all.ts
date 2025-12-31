export const promiseAllMap = async <
  PromiseMap extends Record<string, Promise<unknown> | null | undefined>,
>(
  input: PromiseMap,
): Promise<{ [K in keyof PromiseMap]: Awaited<PromiseMap[K]> }> => {
  const entries = Object.entries(input)
  const results = await Promise.all(entries.map(([_, promise]) => promise))
  return entries.reduce(
    (acc, [key], index) => {
      acc[key] = results[index]
      return acc
    },
    {} as Record<string, unknown>,
  ) as { [K in keyof PromiseMap]: Awaited<PromiseMap[K]> }
}
