export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter((val) => typeof val === "string").join(" ")
}
