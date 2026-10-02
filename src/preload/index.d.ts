export {}

declare global {
  /** 自动更新状态推送载荷（主进程通过 updateState 通道推送） */
  interface UpdateStatePayload {
    /** 当前阶段：检查中 / 有更新 / 无更新 / 下载中 / 已下载 / 出错 */
    phase: 'checking' | 'available' | 'none' | 'downloading' | 'downloaded' | 'error'
    /** 新版本号 */
    version?: string
    /** 下载进度百分比（downloading 阶段） */
    percent?: number
    /** 附加信息（如错误详情） */
    message?: string
  }

  /** 打开文件结果 */
  interface OpenFileResult {
    canceled: boolean
    path?: string
    name?: string
    content?: string
  }

  /** 保存文件结果 */
  interface SaveFileResult {
    canceled: boolean
    path?: string
  }

  /** 拖拽文件读取结果 */
  interface DroppedFileResult {
    ok: boolean
    path?: string
    name?: string
    content?: string
    message?: string
  }

  /** 主进程代理 GET 请求结果 */
  interface HttpGetResult {
    ok: boolean
    status: number
    text?: string
    message?: string
  }

  /** 更新检查结果 */
  interface UpdateCheckResult {
    supported: boolean
    version?: string
    error?: string
    reason?: string
  }

  interface Window {
    electron: {
      // ===== 窗口控制 =====
      /** 最小化窗口 */
      minimize: () => void
      /** 最大化 / 还原窗口 */
      toggleMaximize: () => void
      /** 关闭窗口 */
      close: () => void
      /** 订阅窗口最大化状态变化，返回取消订阅函数 */
      onWindowState: (listener: (maximized: boolean) => void) => () => void

      // ===== 文件能力 =====
      /** 打开文件选择对话框并读取所选文本文件 */
      openFile: () => Promise<OpenFileResult>
      /** 将文本内容保存为文件，defaultName 为对话框中的默认文件名 */
      saveTextFile: (content: string, defaultName?: string) => Promise<SaveFileResult>
      /** 按磁盘路径读取拖拽文件的内容 */
      readDroppedFile: (filePath: string) => Promise<DroppedFileResult>
      /** 在系统文件管理器中定位该文件 */
      revealInFolder: (filePath: string) => Promise<void>
      /** 将拖拽得到的 File 对象转换为真实磁盘路径 */
      getPathForFile: (file: File) => string

      // ===== 主进程存储 =====
      /** 读取主进程持久化存储中指定键的值（未设置时为 undefined） */
      storeGet: (key: string) => Promise<unknown>
      /** 写入主进程持久化存储 */
      storeSet: (key: string, value: unknown) => Promise<boolean>
      /** 删除主进程持久化存储中指定键 */
      storeDelete: (key: string) => Promise<boolean>

      // ===== 网络 =====
      /** 由主进程代理发起 GET 请求（不受渲染层 CORS 限制） */
      httpGet: (url: string) => Promise<HttpGetResult>

      // ===== 日志 =====
      /** 写入主进程日志，level 缺省为 info，返回日志文件路径 */
      logWrite: (message: string, level?: 'info' | 'warn' | 'error') => Promise<string>
      /** 获取主进程日志文件路径 */
      getLogPath: () => Promise<string>

      // ===== 自动更新 =====
      /** 检查更新 */
      checkForUpdates: () => Promise<UpdateCheckResult>
      /** 下载更新 */
      downloadUpdate: () => Promise<boolean>
      /** 安装更新并重启应用 */
      installUpdate: () => Promise<void>
      /** 订阅更新状态推送，返回取消订阅函数 */
      onUpdateState: (listener: (payload: UpdateStatePayload) => void) => () => void
    }
  }
}
