import { contextBridge, ipcRenderer } from 'electron'

// Expose only the window controls required by the renderer.
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

// Keep the existing custom API global while avoiding exposure of ipcRenderer itself.
const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (defined in index.d.ts)
  window.electron = electronAPI
  // @ts-ignore (defined in index.d.ts)
  window.api = api
}
