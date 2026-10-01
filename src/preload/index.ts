import { contextBridge, ipcRenderer, webUtils } from 'electron'

/** 自动更新状态推送载荷 */
interface UpdateStatePayload {
  phase: 'checking' | 'available' | 'none' | 'downloading' | 'downloaded' | 'error'
  version?: string
  percent?: number
  message?: string
}

// 通过 contextBridge 暴露给渲染进程的 API（沙箱与上下文隔离均保持开启）
const electronAPI = {
  // ===== 窗口控制 =====
  minimize: () => ipcRenderer.send('window-min'),
  toggleMaximize: () => ipcRenderer.send('window-maxOrRestore'),
  close: () => ipcRenderer.send('window-close'),
  onWindowState: (listener: (maximized: boolean) => void) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, maximized: boolean) => {
      listener(maximized)
    }
    ipcRenderer.on('windowState', wrappedListener)
    return () => ipcRenderer.removeListener('windowState', wrappedListener)
  },

  // ===== 文件能力 =====
  // 打开文件选择对话框并读取所选文件
  openFile: () => ipcRenderer.invoke('file:open'),
  // 将文本内容保存为文件（defaultName 为对话框中的默认文件名）
  saveTextFile: (content: string, defaultName?: string) =>
    ipcRenderer.invoke('file:save', { content, defaultName }),
  // 按磁盘路径读取拖拽文件的内容
  readDroppedFile: (filePath: string) => ipcRenderer.invoke('file:readDropped', filePath),
  // 在系统文件管理器中定位该文件
  revealInFolder: (filePath: string) => ipcRenderer.invoke('file:reveal', filePath),
  // 将拖拽得到的 File 对象转换为真实磁盘路径（沙箱 preload 可用的 webUtils）
  getPathForFile: (file: File) => webUtils.getPathForFile(file),

  // ===== 主进程存储 =====
  storeGet: (key: string) => ipcRenderer.invoke('store:get', key),
  storeSet: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
  storeDelete: (key: string) => ipcRenderer.invoke('store:delete', key),

  // ===== 网络 =====
  // 由主进程代理发起 GET 请求（规避渲染进程的跨域限制）
  httpGet: (url: string) => ipcRenderer.invoke('http:get', url),

  // ===== 日志 =====
  // 写入主进程日志（level 默认为 info）
  logWrite: (message: string, level?: 'info' | 'warn' | 'error') =>
    ipcRenderer.invoke('log:write', { message, level }),
  // 获取主进程日志文件路径
  getLogPath: () => ipcRenderer.invoke('log:path'),

  // ===== 自动更新 =====
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  // 订阅主进程推送的更新状态，返回取消订阅函数
  onUpdateState: (listener: (payload: UpdateStatePayload) => void) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, payload: UpdateStatePayload) => {
      listener(payload)
    }
    ipcRenderer.on('updateState', wrappedListener)
    return () => ipcRenderer.removeListener('updateState', wrappedListener)
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
