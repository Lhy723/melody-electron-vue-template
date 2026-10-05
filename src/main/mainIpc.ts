import { ipcMain, app, BrowserWindow } from 'electron'
import { ipcChannels } from '../shared/ipc/channels'

// 窗口控制 IPC：按事件来源解析目标窗口，注册一次即可，多窗口 / macOS 重开窗口均安全
const mainIpc = () => {
  ipcMain.on(ipcChannels.window.min, (ev) => {
    BrowserWindow.fromWebContents(ev.sender)?.minimize()
  })
  ipcMain.on(ipcChannels.window.maxOrRestore, (ev) => {
    const win = BrowserWindow.fromWebContents(ev.sender)
    if (!win) return
    win.isMaximized() ? win.restore() : win.maximize()
    ev.reply(ipcChannels.window.stateChanged, win.isMaximized())
  })
  ipcMain.on(ipcChannels.window.restore, (ev) => {
    BrowserWindow.fromWebContents(ev.sender)?.restore()
  })
  ipcMain.on(ipcChannels.window.close, (ev) => {
    BrowserWindow.fromWebContents(ev.sender)?.close()
    app.quit()
  })
}

export default mainIpc
