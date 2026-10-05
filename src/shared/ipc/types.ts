/**
 * IPC 请求 / 响应载荷类型：与 channels.ts 一一对应，
 * main 的 handler 与 preload 的 invoke 共用同一份定义。
 */

// ===== 文件能力 =====

/** file:save 请求载荷 */
export interface SaveTextFilePayload {
  content: string
  /** 保存对话框中的默认文件名 */
  defaultName?: string
}

/** file:open 响应 */
export interface OpenFileResult {
  canceled: boolean
  path?: string
  name?: string
  content?: string
}

/** file:save 响应 */
export interface SaveFileResult {
  canceled: boolean
  path?: string
}

/** file:readDropped 响应 */
export interface DroppedFileResult {
  ok: boolean
  path?: string
  name?: string
  content?: string
  message?: string
}

// ===== 主进程存储 =====

/** store:set 请求载荷 */
export interface StoreSetPayload {
  key: string
  value: unknown
}

// ===== 网络 =====

/** http:get 响应 */
export interface HttpGetResult {
  ok: boolean
  status: number
  text?: string
  message?: string
}

// ===== 日志 =====

/** log:write 请求载荷 */
export interface LogWritePayload {
  message: string
  level?: 'info' | 'warn' | 'error'
}

// ===== 自动更新 =====

/** update:check 响应 */
export interface UpdateCheckResult {
  supported: boolean
  version?: string
  error?: string
  reason?: string
}

/** updateState 推送载荷（主进程 → 渲染层） */
export interface UpdateStatePayload {
  phase: 'checking' | 'available' | 'none' | 'downloading' | 'downloaded' | 'error'
  version?: string
  /** 下载进度百分比（downloading 阶段） */
  percent?: number
  message?: string
}
