import { join } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import Inspect from "vite-plugin-inspect"
import { defineConfig } from "waku/config"

export default defineConfig({
  vite: {
    server: {
      port: Number.parseInt(process.env.PORT || "3000", 10),
    },
    plugins: [
      tailwindcss(),
      Inspect(),
      viteReact({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
    ],
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "broadcaster-components": join(
          import.meta.dirname,
          "../components/src",
        ),
        "broadcaster-db": join(import.meta.dirname, "../db/src"),
      },
    },
  },
  srcDir: "./src/ui",
})
