import { contextBridge, ipcRenderer } from 'electron'

// 仅暴露窗口控制所需的最小 API（沙箱与上下文隔离均保持开启）
const electronAPI = {
  minimize: () => ipcRenderer.send('window-min'),
  toggleMaximize: () => ipcRenderer.send('window-maxOrRestore'),
  close: () => ipcRenderer.send('window-close'),
  onWindowState: (listener: (maximized: boolean) => void) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, maximized: boolean) => {
      listener(maximized)
    }
    ipcRenderer.on('windowState', wrappedListener)
    return () => ipcRenderer.removeListener('windowState', wrappedListener)
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
