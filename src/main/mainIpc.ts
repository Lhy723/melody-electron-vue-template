import { ipcMain, app, BrowserWindow } from 'electron'

const mainIpc = (window: BrowserWindow) => {
  ipcMain.on('window-min', (ev) => {
    ev.preventDefault()
    window.minimize()
  })
  ipcMain.on('window-maxOrRestore', (ev) => {
    const winSizeState = window.isMaximized()
    winSizeState ? window.restore() : window.maximize()
    ev.reply('windowState', window.isMaximized())
  })
  ipcMain.on('window-restore', () => {
    window.restore()
  })
  ipcMain.on('window-close', () => {
    window.close()
    app.quit()
  })
}

export default mainIpc
