export class ExhaustiveError extends Error {
  constructor(value: never, options?: ErrorOptions) {
    // oxlint-disable-next-line typescript/restrict-template-expressions
    super(`Unexpected value: ${value}`, options)
  }
}
