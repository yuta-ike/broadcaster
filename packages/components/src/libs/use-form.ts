import type { StandardSchemaV1 } from "@standard-schema/spec"
import {
  type ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"

type Initializer<State> = State | (() => State)
const resolveInitializer = <State>(init: Initializer<State>): State =>
  typeof init === "function" ? (init as () => State)() : init

type InputOption = Pick<
  ComponentProps<"input">,
  "pattern" | "min" | "minLength" | "max" | "maxLength"
>

export const useForm = <
  State extends Record<string, unknown>,
  Schema extends StandardSchemaV1<State>,
>(
  inputSchema: Schema,
  init: Initializer<State>,
) => {
  const [schema] = useState(() => inputSchema)
  const [values, setValues] = useState(() => resolveInitializer(init))
  const dartyMap = useRef(new Map<keyof State, boolean>())
  const onceBluredMap = useRef(new Map<keyof State, boolean>())

  const setValue = useCallback(
    <K extends keyof State>(key: K, value: State[K]) => {
      dartyMap.current.set(key, true)
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [],
  )

  const registerInput = useCallback(
    <K extends keyof State>(
      type: "date" | "text" | "checkbox" | "color",
      key: K,
      options?: InputOption,
    ) => {
      if (type === "text" || type === "date" || type === "color") {
        return {
          ...options,
          type,
          name: key,
          value: values[key],
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            dartyMap.current.set(key, true)
            setValues((prev) => ({
              ...prev,
              [key]: e.target.value,
            }))
          },
          onBlur: () => onceBluredMap.current.set(key, true),
        }
      }

      if (type === "checkbox") {
        return {
          ...options,
          type: "checkbox",
          name: key,
          checked: values[key] as boolean,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            dartyMap.current.set(key, true)
            setValues((prev) => ({
              ...prev,
              [key]: e.target.checked,
            }))
          },
          onBlur: () => onceBluredMap.current.set(key, true),
        }
      }
    },
    [values],
  )

  const registerSingleCheckbox = useCallback(
    <K extends keyof State>(key: K, options?: InputOption) => {
      return {
        ...options,
        type: "checkbox",
        name: key,
        checked: values[key] as boolean,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          dartyMap.current.set(key, true)
          setValues((prev) => ({
            ...prev,
            [key]: e.target.checked,
          }))
        },
        onBlur: () => onceBluredMap.current.set(key, true),
      }
    },
    [values],
  )

  const registerMultipleCheckbox = useCallback(
    <K extends keyof State>(
      key: K,
      value: State[K] extends (infer Item)[] ? Item : never,
      options?: InputOption,
    ) => {
      return {
        ...options,
        type: "checkbox",
        name: key,
        value: value,
        checked: (values[key] as State[K] & unknown[]).includes(value),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          dartyMap.current.set(key, true)
          setValues((prev) => {
            const currentArray = prev[key] as State[K] & unknown[]
            if (e.target.checked) {
              return {
                ...prev,
                [key]: Array.from(new Set([...currentArray, value])),
              }
            } else {
              return {
                ...prev,
                [key]: currentArray.filter((item) => item !== value),
              }
            }
          })
        },
        onBlur: () => onceBluredMap.current.set(key, true),
      }
    },
    [values],
  )

  const registerTextarea = useCallback(
    <K extends keyof State>(key: K, options?: InputOption) => {
      return {
        ...options,
        name: key,
        value: values[key],
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          dartyMap.current.set(key, true)
          setValues((prev) => ({
            ...prev,
            [key]: e.target.value,
          }))
        },
        onBlur: () => onceBluredMap.current.set(key, true),
      }
    },
    [values],
  )

  const registerCustom = useCallback(
    <K extends keyof State, NativeValue, OnChangeInput>(
      key: K,
      transform: {
        encode: (value: State[K]) => NativeValue
        decode: (input: OnChangeInput) => State[K]
      },
      options?: InputOption,
    ) => {
      return {
        ...options,
        name: key,
        value: transform.encode(values[key]),
        onChange: (input: OnChangeInput) => {
          dartyMap.current.set(key, true)
          setValues((prev) => ({
            ...prev,
            [key]: transform.decode(input),
          }))
        },
        onBlur: () => onceBluredMap.current.set(key, true),
      }
    },
    [values],
  )

  const errors = useMemo(() => {
    const result = schema["~standard"].validate(values)
    if (result instanceof Promise) {
      throw new Error("Async validater is not supported.")
    }
    const issue = result.issues
    if (issue == null) {
      return {} as Record<keyof State, string | undefined>
    }

    const errorMap = {} as Record<keyof State, string | undefined>
    for (const item of issue) {
      if (item.path != null && 0 < item.path.length) {
        const key = item.path[0]!.toString()
        if (
          values[key] != null &&
          dartyMap.current.get(key as keyof State) &&
          onceBluredMap.current.get(key as keyof State)
        ) {
          errorMap[key as keyof State] = item.message
        }
      }
    }
    return errorMap
  }, [values])

  const getValidValues = useCallback(() => {
    const result = schema["~standard"].validate(values)
    if (result instanceof Promise) {
      throw new Error("Async validater is not supported.")
    }
    if (result.issues != null) {
      return null
    }
    return values
  }, [values])

  return {
    values,
    setValue,
    setValues,
    registerInput,
    registerTextarea,
    registerCustom,
    registerSingleCheckbox,
    registerMultipleCheckbox,
    errors,
    getValidValues,
  }
}
