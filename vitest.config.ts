import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// 渲染进程源码目录别名，与 electron.vite.config.ts 中的 @renderer 保持一致
const rendererPath = fileURLToPath(new URL('./src/renderer/src', import.meta.url))

export default defineConfig({
  // 组件测试需要编译 .vue 单文件组件，复用项目自带的 @vitejs/plugin-vue
  plugins: [vue()],
  resolve: {
    alias: {
      '@renderer': rendererPath
    }
  },
  test: {
    // 使用 happy-dom 模拟浏览器环境（DOM、localStorage 等）
    environment: 'happy-dom',
    // 只收集 src 目录下的单元测试文件
    include: ['src/**/*.spec.ts']
  }
})
