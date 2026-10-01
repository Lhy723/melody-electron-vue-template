import { ipcMain, app, BrowserWindow } from 'electron'

// 窗口控制 IPC：按事件来源解析目标窗口，注册一次即可，多窗口 / macOS 重开窗口均安全
const mainIpc = () => {
  ipcMain.on('window-min', (ev) => {
    BrowserWindow.fromWebContents(ev.sender)?.minimize()
  })
  ipcMain.on('window-maxOrRestore', (ev) => {
    const win = BrowserWindow.fromWebContents(ev.sender)
    if (!win) return
    win.isMaximized() ? win.restore() : win.maximize()
    ev.reply('windowState', win.isMaximized())
  })
  ipcMain.on('window-restore', (ev) => {
    BrowserWindow.fromWebContents(ev.sender)?.restore()
  })
  ipcMain.on('window-close', (ev) => {
    BrowserWindow.fromWebContents(ev.sender)?.close()
    app.quit()
  })
}

export default mainIpc
