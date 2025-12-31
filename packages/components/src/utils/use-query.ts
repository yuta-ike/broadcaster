import { useEffect, useRef, useState } from "react"

type PromiseState<Data> =
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; error: unknown }

type Fetcher<Data> = (abortSignal: AbortSignal) => Promise<Data>

type UseQueryReturn<Data> = {
  revalidate: () => void
} & (
  | {
      status: "loading"
      isLoading: true
      isError: false
      data: undefined
    }
  | {
      status: "error"
      isLoading: false
      isError: true
      data: undefined
    }
  | {
      status: "success"
      isLoading: false
      isError: false
      data: Data
    }
)

export const useQuery = <Data>(
  fetcher: Fetcher<Data>,
): UseQueryReturn<Data> => {
  const [state, setState] = useState<PromiseState<Data>>({
    status: "loading",
  })
  const acRef = useRef<AbortController | null>(null)

  const doFetch = () => {
    const ac = new AbortController()
    acRef.current = ac

    setState({ status: "loading" })
    fetcher(ac.signal)
      .then((res) => {
        if (ac.signal.aborted) return
        setState({ status: "success", data: res })
      })
      .catch((err) => {
        if (ac.signal.aborted) return
        setState({ status: "error", error: err })
      })
      .finally(() => {
        acRef.current = null
      })
    return ac
  }

  useEffect(() => {
    const ac = doFetch()
    return () => ac.abort()
  }, [])

  const revalidate = () => {
    doFetch()
  }

  if (state.status === "loading") {
    return {
      status: "loading",
      isLoading: true,
      isError: false,
      data: undefined,
      revalidate,
    }
  } else if (state.status === "error") {
    return {
      status: "error",
      isLoading: false,
      isError: true,
      data: undefined,
      revalidate,
    }
  } else {
    return {
      status: "success",
      isLoading: false,
      isError: false,
      data: state.data,
      revalidate,
    }
  }
}
