export const safeLoop = async <Param extends {}>(
  callback: (cursor: Awaited<Param> | null) => Param | null,
  maxIterations = 100,
) => {
  let iterations = 0
  let param: Awaited<Param> | null = null
  while (true) {
    if (iterations >= maxIterations) {
      console.error("Exceeded maximum iterations in safeLoop")
      break
    }
    param = await callback(param)
    if (param == null) {
      break
    } else {
      iterations++
    }
  }
}
