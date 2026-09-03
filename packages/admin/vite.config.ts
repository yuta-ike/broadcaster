import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"

export default defineConfig({
  server: {
    port: Number.parseInt(process.env.PORT || "3000", 10),
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "broadcaster-components/*": "../components/src/*",
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
    }),
    nitro(),
    Inspect(),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
})
