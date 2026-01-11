declare module "react" {
  interface CSSProperties {
    [varName: `--${string}`]: string | number | undefined
  }
}
export {}
