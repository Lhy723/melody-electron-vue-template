import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(async () => {
  return {
    main: {
      build: {
        externalizeDeps: true
      }
    },
    preload: {
      build: {
        externalizeDeps: true
      }
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@shared': resolve('src/shared')
        }
      },
      plugins: [vue({})]
    }
  }
})
