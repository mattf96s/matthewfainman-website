import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools({
      // R3F intrinsics (mesh, group, etc.) treat unknown JSX attrs as
      // property paths on the underlying three.js object, which fails when
      // devtools tags them with data-tsd-source. Skip injection for files
      // that render inside the Canvas.
      injectSource: {
        enabled: true,
        ignore: { files: [/src\/game\//] },
      },
    }),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
