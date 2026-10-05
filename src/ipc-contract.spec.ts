import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { ipcChannels } from './shared/ipc/channels'

// ==================== 源码收集工具 ====================

// 本文件位于 src 根目录，srcDir 即 src/
// 注意：先把 import.meta.url 存入变量再传入 new URL，
// 避免 Vite 将 new URL(字面量, import.meta.url) 识别为资源语法改写导致非 file: 协议
const specUrl = import.meta.url
const srcDir = fileURLToPath(new URL('.', specUrl))

// 递归收集目录下所有 .ts 源文件内容
const collectTsSources = (dir: string): string[] => {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectTsSources(fullPath))
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      files.push(readFileSync(fullPath, 'utf-8'))
    }
  }
  return files
}

// ==================== 读取三层源码 ====================

// 渲染进程侧：preload 暴露的 API 即契约的调用方
const preloadCode = readFileSync(join(srcDir, 'preload', 'index.ts'), 'utf-8')

// 主进程全部源码：mainIpc.ts + modules/* + index.ts（含窗口状态推送）
const mainSources = [
  ...collectTsSources(join(srcDir, 'main')),
  readFileSync(join(srcDir, 'main', 'mainIpc.ts'), 'utf-8')
]
const allMainCode = mainSources.join('\n')

// ==================== 通道表达式提取 ====================

// 源码已统一改用 ipcChannels.xxx.yyy 常量表达式，不再有手写字符串。
// 提取「ipcChannels.」开头的成员访问表达式，再解析到 channels.ts 登记的字面量。
const extractExpressions = (code: string, callPattern: RegExp): string[] => {
  const expressions: string[] = []
  for (const match of code.matchAll(callPattern)) {
    if (typeof match[1] === 'string') expressions.push(match[1])
  }
  return [...new Set(expressions)]
}

// 从表达式中剔除「ipcChannels.」前缀
const stripPrefix = (expression: string): string => expression.replace('ipcChannels.', '')

// 沿成员路径解析到 channels.ts 登记的通道字面量；解析失败返回 undefined
const resolveChannel = (expression: string): string | undefined => {
  const value = stripPrefix(expression)
    .split('.')
    .reduce<unknown>((node, key) => {
      if (node !== null && typeof node === 'object' && key in (node as Record<string, unknown>)) {
        return (node as Record<string, unknown>)[key]
      }
      return undefined
    }, ipcChannels as unknown)
  return typeof value === 'string' ? value : undefined
}

// ==================== 三层通道收集 ====================

// preload：渲染进程发起的 invoke / send，以及订阅的推送通道
const invokeExprs = extractExpressions(preloadCode, /ipcRenderer\.invoke\(\s*(ipcChannels\.[A-Za-z0-9.]+)/g)
const sendExprs = extractExpressions(preloadCode, /ipcRenderer\.send\(\s*(ipcChannels\.[A-Za-z0-9.]+)/g)
const rendererOnExprs = extractExpressions(preloadCode, /ipcRenderer\.on\(\s*(ipcChannels\.[A-Za-z0-9.]+)/g)

// 主进程：invoke 处理器（modules）、事件接收（mainIpc）、主动推送（webContents.send / ev.reply）
const handleExprs = extractExpressions(allMainCode, /ipcMain\.handle\(\s*(ipcChannels\.[A-Za-z0-9.]+)/g)
const mainOnExprs = extractExpressions(allMainCode, /ipcMain\.on\(\s*(ipcChannels\.[A-Za-z0-9.]+)/g)
const pushExprs = extractExpressions(allMainCode, /(?:webContents\.send|\.reply)\(\s*(ipcChannels\.[A-Za-z0-9.]+)/g)

// 表达式解析为通道字面量后的集合
const resolveAll = (expressions: string[]): Set<string> =>
  new Set(expressions.map((expression) => resolveChannel(expression) ?? `<未登记: ${expression}>`))

const invokeChannels = resolveAll(invokeExprs)
const sendChannels = resolveAll(sendExprs)
const rendererOnChannels = resolveAll(rendererOnExprs)
const handleChannels = resolveAll(handleExprs)
const mainOnChannels = resolveAll(mainOnExprs)
const pushChannels = resolveAll(pushExprs)

// 集合差集：a 中有而 b 中没有的通道
const missingIn = (a: Set<string>, b: Set<string>): string[] => [...a].filter((channel) => !b.has(channel))

// 断言已知通道均在对应集合中（防止提取规则失效导致契约测试空转）
const expectAllExtracted = (channels: Set<string>, names: string[], label: string): void => {
  for (const name of names) {
    expect(channels.has(name), `${label} 通道 ${name} 未被提取到`).toBe(true)
  }
}

// ==================== IPC 契约元测试 ====================
// 通道名单一来源于 channels.ts；本测试静态扫描三层源码中 ipcChannels.* 表达式，
// 保证：invoke → ipcMain.handle；send → ipcMain.on；主进程推送 → ipcRenderer.on，
// 且所有表达式都能解析回 channels.ts 登记的字面量（拼错通道名 = 编译期 + 此处双重拦截）。

describe('IPC 契约（preload ↔ main 静态扫描）', () => {
  it('表达式健全性：文档化通道均能被提取并解析回 channels.ts 登记', () => {
    // 若此处失败，说明源码写法变化导致提取规则失效，需同步更新提取规则
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
    expectAllExtracted(pushChannels, ['windowState', 'updateState'], '主进程推送')
    expectAllExtracted(mainOnChannels, ['window-min', 'window-maxOrRestore', 'window-close'], 'ipcMain.on')
  })

  it('(d) 所有 ipcChannels 表达式都能解析为 channels.ts 已登记通道', () => {
    for (const expression of [...invokeExprs, ...sendExprs, ...rendererOnExprs, ...handleExprs, ...mainOnExprs, ...pushExprs]) {
      expect(resolveChannel(expression), `表达式 ${expression} 未登记或拼错`).toBeTypeOf('string')
    }
  })

  it('(a) 每个 ipcRenderer.invoke 通道都有对应的 ipcMain.handle', () => {
    expect(missingIn(invokeChannels, handleChannels)).toEqual([])
  })

  it('(b) 每个 ipcRenderer.send 通道都有对应的 ipcMain.on', () => {
    expect(missingIn(sendChannels, mainOnChannels)).toEqual([])
  })

  it('(c) 每个主进程推送通道（webContents.send / ev.reply）都有对应的 ipcRenderer.on', () => {
    expect(missingIn(pushChannels, rendererOnChannels)).toEqual([])
  })

  it('主进程保留能力：window-restore 已注册但 preload 未使用，不影响契约', () => {
    expect(mainOnChannels.has('window-restore')).toBe(true)
  })
})
