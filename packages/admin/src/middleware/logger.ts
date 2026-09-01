import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { randomUUID } from "node:crypto"
import { authMiddleware } from "./auth"

export const loggerMiddleware = createMiddleware({ type: "request" })
  .middleware([authMiddleware])
  .server(async ({ next, request, context }) => {
    const trace = getRequestHeader("traceparent") || randomUUID()
    const requestUrl = new URL(request.url).pathname
    console.info(
      JSON.stringify({
        severity: "INFO",
        message: {
          url: request.url,
          user: {
            id: context?.user?.id,
          },
        },
        httpRequest: { requestMethod: request.method, requestUrl },
        time: new Date().toISOString(),
        "logging.googleapis.com/trace": trace,
      }),
    )

    try {
      const ret = await next()

      console.info(
        JSON.stringify({
          severity: "INFO",
          message: {
            url: request.url,
            user: {
              id: context?.user?.id,
            },
          },
          httpRequest: {
            requestMethod: request.method,
            requestUrl: request.url,
            status: ret.response.status,
          },
          time: new Date().toISOString(),
          "logging.googleapis.com/trace": trace,
        }),
      )

      return ret
    } catch (e) {
      console.error(
        JSON.stringify({
          severity: "ERROR",
          message: {
            user: {
              id: context?.user?.id,
            },
            error: e instanceof Error ? { name: e.name, message: e.message } : e,
          },
          httpRequest: {
            requestMethod: request.method,
            requestUrl,
            status: 500,
          },
          time: new Date().toISOString(),
          "logging.googleapis.com/trace": trace,
        }),
      )

      throw e
    }
  })
