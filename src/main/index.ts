import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import log from 'electron-log/main'
import mainIpc from './mainIpc'
import { appStore } from './modules/appStore'
import { registerFileIpc } from './modules/fileIpc'
import { registerStoreIpc } from './modules/storeIpc'
import { registerHttpIpc } from './modules/httpIpc'
import { setupMainLog, registerLogIpc } from './modules/logIpc'
import { registerUpdateIpc } from './modules/updateIpc'

let mainWindow: BrowserWindow

function createWindow(): BrowserWindow {
  // 读取上次保存的窗口状态（最大化标志 + 正常状态下的边界）
  const saved = appStore.get('windowState') as
    | { maximized?: boolean; width?: number; height?: number; x?: number; y?: number }
    | undefined
  // 仅当是有限数字时才采用，否则回退默认尺寸
  const width = typeof saved?.width === 'number' && Number.isFinite(saved.width) ? saved.width : 1280
  const height = typeof saved?.height === 'number' && Number.isFinite(saved.height) ? saved.height : 740
  const x = typeof saved?.x === 'number' && Number.isFinite(saved.x) ? saved.x : undefined
  const y = typeof saved?.y === 'number' && Number.isFinite(saved.y) ? saved.y : undefined

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    show: false,
    frame: false,
    titleBarStyle: 'customButtonsOnHover',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js')
    }
  })

  // 恢复上次的最大化状态
  if (saved?.maximized) {
    mainWindow.maximize()
  }

  // 关闭时保存窗口状态，下次启动恢复
  mainWindow.on('close', () => {
    try {
      appStore.set('windowState', { maximized: mainWindow.isMaximized(), ...mainWindow.getNormalBounds() })
    } catch {
      /* 保存失败忽略 */
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('windowState', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('windowState', false)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows (与 electron-builder.yml 的 appId 保持一致)
  electronApp.setAppUserModelId('com.electron.app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 初始化主进程日志，并捕获未处理异常
  setupMainLog()
  process.on('uncaughtException', (error) => log.error('未捕获异常', error))

  createWindow()
  // 窗口控制 IPC 按事件来源解析窗口，注册一次即可
  mainIpc()
  registerFileIpc()
  registerStoreIpc()
  registerHttpIpc()
  registerLogIpc()
  registerUpdateIpc()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
