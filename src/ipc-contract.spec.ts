import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// ==================== 源码收集工具 ====================

// 本文件位于 src 根目录，srcDir 即 src/
// 注意：先把 import.meta.url 存入变量再传入 new URL，
// 避免 Vite 将 new URL(字面量, import.meta.url) 识别为资源语法改写导致非 file: 协议
const specUrl = import.meta.url
const srcDir = fileURLToPath(new URL('.', specUrl))

// 从源码中按正则提取通道名（本模板通道一律使用单引号）
const extractChannels = (code: string, pattern: RegExp): string[] => {
  const channels: string[] = []
  for (const match of code.matchAll(pattern)) {
    if (typeof match[1] === 'string') channels.push(match[1])
  }
  return channels
}

// 递归收集目录下所有 .ts 源文件路径
const collectTsFiles = (dir: string): string[] => {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath))
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath)
    }
  }
  return files
}

// ==================== 读取三层源码 ====================

// 渲染进程侧：preload 暴露的 API 即契约的调用方
const preloadCode = readFileSync(join(srcDir, 'preload', 'index.ts'), 'utf-8')

// 主进程侧：mainIpc.ts 接收窗口控制事件
const mainIpcCode = readFileSync(join(srcDir, 'main', 'mainIpc.ts'), 'utf-8')

// 主进程 modules 目录：所有 ipcMain.handle 的声明处
const modulesDir = join(srcDir, 'main', 'modules')
const modulesCode = readdirSync(modulesDir)
  .filter((name) => name.endsWith('.ts'))
  .map((name) => readFileSync(join(modulesDir, name), 'utf-8'))
  .join('\n')

// 主进程全部源码：用于扫描 webContents.send 主动推送
const allMainCode = collectTsFiles(join(srcDir, 'main'))
  .map((file) => readFileSync(file, 'utf-8'))
  .join('\n')

// ==================== 通道提取 ====================

// preload：渲染进程发起的 invoke / send，以及订阅的推送通道
const invokeChannels = new Set(extractChannels(preloadCode, /ipcRenderer\.invoke\(\s*'([^']+)'/g))
const sendChannels = new Set(extractChannels(preloadCode, /ipcRenderer\.send\(\s*'([^']+)'/g))
const rendererOnChannels = new Set(extractChannels(preloadCode, /ipcRenderer\.on\(\s*'([^']+)'/g))
// 主进程：事件接收与 invoke 处理器
const mainOnChannels = new Set(extractChannels(mainIpcCode, /ipcMain\.on\(\s*'([^']+)'/g))
const handleChannels = new Set(extractChannels(modulesCode, /ipcMain\.handle\(\s*'([^']+)'/g))
// 主进程主动推送（fire-and-forget）
const pushChannels = new Set(extractChannels(allMainCode, /webContents\.send\(\s*'([^']+)'/g))

// 集合差集：a 中有而 b 中没有的通道
const missingIn = (a: Set<string>, b: Set<string>): string[] =>
  [...a].filter((channel) => !b.has(channel))

// 断言文档化通道均能被正则提取到（防止提取规则失效导致契约测试空转）
const expectAllExtracted = (channels: Set<string>, names: string[], label: string): void => {
  for (const name of names) {
    expect(channels.has(name), `${label} 通道 ${name} 未被提取到`).toBe(true)
  }
}

// ==================== IPC 契约元测试 ====================
// 静态扫描三层源码，保证通道契约对齐：
//   invoke → ipcMain.handle；send → ipcMain.on；webContents.send → ipcRenderer.on
// 只断言调用方向有承接，不要求反向全覆盖（如主进程保留的 window-restore）

describe('IPC 契约（preload ↔ main 静态扫描）', () => {
  it('提取器健全性：文档化通道均能被正则捕获', () => {
    // 若此处失败，说明源码写法变化导致正则失效，需同步更新提取规则
    expectAllExtracted(
      invokeChannels,
      [
        'file:open',
        'file:save',
        'file:readDropped',
        'file:reveal',
        'store:get',
        'store:set',
        'store:delete',
        'http:get',
        'log:write',
        'log:path',
        'update:check',
        'update:download',
        'update:install'
      ],
      'invoke'
    )
    expectAllExtracted(sendChannels, ['window-min', 'window-maxOrRestore', 'window-close'], 'send')
    expectAllExtracted(rendererOnChannels, ['windowState', 'updateState'], 'ipcRenderer.on')
    expectAllExtracted(pushChannels, ['windowState', 'updateState'], 'webContents.send')
    expectAllExtracted(
      mainOnChannels,
      ['window-min', 'window-maxOrRestore', 'window-close'],
      'ipcMain.on'
    )
  })

  it('(a) 每个 ipcRenderer.invoke 通道都有对应的 ipcMain.handle', () => {
    expect(missingIn(invokeChannels, handleChannels)).toEqual([])
  })

  it('(b) 每个 ipcRenderer.send 通道都有对应的 ipcMain.on', () => {
    expect(missingIn(sendChannels, mainOnChannels)).toEqual([])
  })

  it('(c) 每个 webContents.send 推送通道都有对应的 ipcRenderer.on', () => {
    expect(missingIn(pushChannels, rendererOnChannels)).toEqual([])
  })

  it('主进程保留能力：window-restore 已注册但 preload 未使用，不影响契约', () => {
    expect(mainOnChannels.has('window-restore')).toBe(true)
  })
})
