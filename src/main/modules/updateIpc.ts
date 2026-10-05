import { ipcMain, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log/main'
import { ipcChannels } from '../../shared/ipc/channels'
// 更新状态载荷
import type { UpdateCheckResult, UpdateStatePayload } from '../../shared/ipc/types'

// 向所有窗口广播更新状态
const broadcastUpdateState = (state: UpdateStatePayload): void => {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(ipcChannels.updateStateChanged, state)
  }
}

// 自动更新 IPC：开发模式禁用，生产模式由 GitHub Releases 提供更新
export const registerUpdateIpc = (): void => {
  if (is.dev) {
    ipcMain.handle(ipcChannels.update.check, (): UpdateCheckResult => ({ supported: false, reason: '开发模式下禁用自动更新' }))
    ipcMain.handle(ipcChannels.update.download, (): UpdateCheckResult => ({ supported: false, reason: '开发模式下禁用自动更新' }))
    ipcMain.handle(ipcChannels.update.install, (): UpdateCheckResult => ({ supported: false, reason: '开发模式下禁用自动更新' }))
    return
  }

  // 手动触发下载，下载完成后在退出时静默安装
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.logger = log

  // 生命周期事件 → 广播 updateState 给渲染进程
  autoUpdater.on('checking-for-update', () => {
    broadcastUpdateState({ phase: 'checking' })
  })
  autoUpdater.on('update-available', (info) => {
    broadcastUpdateState({ phase: 'available', version: info.version })
  })
  autoUpdater.on('update-not-available', (info) => {
    broadcastUpdateState({ phase: 'none', version: info.version })
  })
  autoUpdater.on('download-progress', (progress) => {
    broadcastUpdateState({ phase: 'downloading', percent: progress.percent })
  })
  autoUpdater.on('update-downloaded', (info) => {
    broadcastUpdateState({ phase: 'downloaded', version: info.version })
  })
  autoUpdater.on('error', (error) => {
    const message = error instanceof Error ? error.message : String(error)
    log.error('[update] 出错:', message)
    broadcastUpdateState({ phase: 'error', message })
  })

  // 检查更新
  ipcMain.handle(ipcChannels.update.check, async (): Promise<UpdateCheckResult> => {
    try {
      const result = await autoUpdater.checkForUpdates()
      return { supported: true, version: result?.updateInfo.version }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { supported: true, error: message }
    }
  })

  // 下载更新
  ipcMain.handle(ipcChannels.update.download, async (): Promise<UpdateCheckResult> => {
    await autoUpdater.downloadUpdate()
    return { supported: true }
  })

  // 退出并安装
  ipcMain.handle(ipcChannels.update.install, () => {
    autoUpdater.quitAndInstall()
  })
}
