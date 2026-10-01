import { ipcMain } from 'electron'
import log from 'electron-log/main'

// 初始化主进程日志：写入用户数据目录下的 logs/main.log，info 及以上级别落盘
export const setupMainLog = (): void => {
  log.initialize()
  log.transports.file.level = 'info'
}

// 日志 IPC：渲染进程写日志、查询日志文件路径
export const registerLogIpc = (): void => {
  ipcMain.handle('log:write', (_event, payload: { message: string; level?: string }) => {
    const message = `[renderer] ${payload?.message ?? ''}`
    switch (payload?.level) {
      case 'error':
        log.error(message)
        break
      case 'warn':
        log.warn(message)
        break
      default:
        log.info(message)
    }
    return log.transports.file.getFile().path
  })

  ipcMain.handle('log:path', () => log.transports.file.getFile().path)
}
