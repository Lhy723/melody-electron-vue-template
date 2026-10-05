import { ipcMain, dialog, shell } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { basename } from 'path'
import log from 'electron-log/main'
import { ipcChannels } from '../../shared/ipc/channels'
import type { DroppedFileResult, OpenFileResult, SaveFileResult, SaveTextFilePayload } from '../../shared/ipc/types'

// 文件读写 IPC：打开 / 保存对话框、读取拖拽文件、在资源管理器中显示
export const registerFileIpc = (): void => {
  // 打开文本文件
  ipcMain.handle(ipcChannels.file.open, async (): Promise<OpenFileResult> => {
    log.info('[file:open] 打开文件对话框')
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: '文本文件', extensions: ['txt', 'md', 'json', 'csv', 'log', 'js', 'ts', 'vue', 'css', 'html'] },
        { name: '所有文件', extensions: ['*'] }
      ]
    })
    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true }
    }
    const path = result.filePaths[0]
    const content = await readFile(path, 'utf-8')
    log.info('[file:open] 读取文件成功:', path)
    return { canceled: false, path, name: basename(path), content }
  })

  // 保存文本文件
  ipcMain.handle(ipcChannels.file.save, async (_event, payload: SaveTextFilePayload): Promise<SaveFileResult> => {
    log.info('[file:save] 打开保存对话框')
    const result = await dialog.showSaveDialog({
      defaultPath: payload?.defaultName,
      filters: [
        { name: '文本文件', extensions: ['txt', 'md', 'json', 'csv', 'log'] },
        { name: '所有文件', extensions: ['*'] }
      ]
    })
    if (result.canceled || !result.filePath) {
      return { canceled: true }
    }
    await writeFile(result.filePath, payload?.content ?? '', 'utf-8')
    log.info('[file:save] 保存文件成功:', result.filePath)
    return { canceled: false, path: result.filePath }
  })

  // 读取拖拽进来的文件
  ipcMain.handle(ipcChannels.file.readDropped, async (_event, filePath: string): Promise<DroppedFileResult> => {
    if (typeof filePath !== 'string' || filePath.length === 0) {
      log.warn('[file:readDropped] 非法的文件路径')
      return { ok: false, message: '文件路径不能为空' }
    }
    try {
      const content = await readFile(filePath, 'utf-8')
      log.info('[file:readDropped] 读取文件成功:', filePath)
      return { ok: true, path: filePath, name: basename(filePath), content }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log.error('[file:readDropped] 读取文件失败:', message)
      return { ok: false, message }
    }
  })

  // 在资源管理器中显示文件
  ipcMain.handle(ipcChannels.file.reveal, (_event, filePath: string) => {
    log.info('[file:reveal] 显示文件:', filePath)
    shell.showItemInFolder(filePath)
  })
}
