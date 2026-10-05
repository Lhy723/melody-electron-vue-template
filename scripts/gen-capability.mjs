#!/usr/bin/env node
/**
 * IPC 能力骨架生成器
 *
 * 用法：node scripts/gen-capability.mjs <name>
 *   name 为 kebab-case（如 audio、audio-dev），生成 src/main/modules/<camelCase(name)>Ipc.ts
 *
 * 仅生成骨架文件，不改动任何现有代码；目标文件已存在时跳过（幂等）。
 */
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptDir, '..')

const USAGE = [
  '用法: node scripts/gen-capability.mjs <name>',
  '  name 需为 kebab-case，例如 audio、audio-dev',
  '  示例: node scripts/gen-capability.mjs audio  →  生成 src/main/modules/audioIpc.ts'
].join('\n')

// kebab-case：小写字母开头，仅含小写字母/数字，组间以单个连字符分隔
const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/

/** audio-dev → audioDev */
const toCamelCase = (name) => name.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase())

/** audio-dev → AudioDev */
const toPascalCase = (name) => {
  const camel = toCamelCase(name)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

const main = () => {
  const name = process.argv[2]

  if (!name || !KEBAB_CASE_RE.test(name)) {
    console.error(USAGE)
    process.exit(1)
  }

  const camel = toCamelCase(name)
  const pascal = toPascalCase(name)
  const targetPath = join(projectRoot, 'src', 'main', 'modules', `${camel}Ipc.ts`)

  if (existsSync(targetPath)) {
    console.log(`跳过：${targetPath} 已存在（幂等，不做覆盖）`)
    return
  }

  const content = `import { ipcMain } from 'electron'
// 通道名唯一事实来源：请先在 src/shared/ipc/channels.ts 的对应分组登记 '${name}:xxx' 通道
import { ipcChannels } from '../../shared/ipc/channels'

// ${name} 能力 IPC 骨架（由 scripts/gen-capability.mjs 生成）
// TODO: 在 channels.ts 登记通道后，实现真实 handler 并替换下方示例：
//   ipcMain.handle('${name}:sample', async (_event, payload: unknown) => {
//     // 业务逻辑，返回值会传回渲染层
//     return payload
//   })
// 登记后建议改用 ipcChannels.${camel}.sample 引用通道名，拼错会在编译期暴露

// 占位引用：避免 noUnusedLocals 报错，实现 handler 后删除以下两行
void ipcMain
void ipcChannels

// 注册 ${name} IPC：需在 src/main/index.ts 的 app.whenReady 中调用一次
export const register${pascal}Ipc = (): void => {
  // TODO: 在此注册 ${name} 相关的 ipcMain.handle
}
`

  mkdirSync(dirname(targetPath), { recursive: true })
  writeFileSync(targetPath, content, 'utf-8')
  console.log(`已生成 ${targetPath}`)
  console.log(`后续人工步骤（${name} 能力尚未可用）：`)
  console.log(`  1) 在 src/shared/ipc/channels.ts 登记 '${name}:xxx' 通道`)
  console.log('  2) 实现 handler 并替换骨架中的示例')
  console.log(`  3) 在 src/main/index.ts 的 whenReady 中调用 register${pascal}Ipc()`)
  console.log('  4) 在 src/preload/index.ts 暴露方法并同步 index.d.ts')
  console.log('  5) 在演示页加卡片')
}

main()
