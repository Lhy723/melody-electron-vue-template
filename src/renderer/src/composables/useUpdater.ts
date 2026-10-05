/**
 * 自动更新组合式函数：封装检查更新、下载更新、安装更新与主进程
 * updateState 推送的完整生命周期，视图只需消费状态文案与加载标记。
 */
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import type { UpdateCheckResult, UpdateStatePayload } from '@shared/ipc/types'

/** onUpdateState 各 phase 对应的中文基础文案 */
const updatePhaseText: Record<UpdateStatePayload['phase'], string> = {
  checking: '正在检查更新…',
  available: '发现新版本',
  none: '当前已是最新版本',
  downloading: '正在下载更新',
  downloaded: '更新包下载完成，等待安装',
  error: '更新出错'
}

/** 把主进程推送的更新状态载荷拼成可读的中文文案（拼接规则迁移自 DesktopCapabilities.vue） */
function buildUpdateStateText(payload: UpdateStatePayload): string {
  const base = updatePhaseText[payload.phase] ?? payload.phase
  let text = base
  // 下载阶段拼接进度百分比，其余阶段拼接版本号
  if (payload.phase === 'downloading' && payload.percent != null) {
    text = `${base}：${Math.round(payload.percent)}%`
  } else if (payload.version) {
    text = `${base}（v${payload.version}）`
  }
  if (payload.message) text += `：${payload.message}`
  return text
}

/** useUpdater 的返回值类型 */
export interface UseUpdaterReturn {
  /** 更新状态中文文案，由主进程 updateState 推送实时驱动（只读） */
  updateStateText: Readonly<Ref<string>>
  /** 是否正在检查更新 */
  checkingUpdate: Ref<boolean>
  /** 最近一次检查更新的结果（只读，供视图展示「检查结果」） */
  updateResult: Readonly<Ref<UpdateCheckResult | null>>
  /** 检查更新：返回检查结果并写入 updateResult，异常向上抛出（消息提示留给视图） */
  checkForUpdates: () => Promise<UpdateCheckResult>
  /** 下载更新：返回主进程是否受理，进度经 updateState 推送反映到 updateStateText */
  downloadUpdate: () => Promise<boolean>
  /** 安装更新并重启应用 */
  installUpdate: () => Promise<void>
}

/**
 * 自动更新生命周期。
 * 内部在 onMounted 订阅 electron.onUpdateState，onUnmounted 自动取消订阅；
 * 浏览器直接预览（无 preload，window.electron 不存在）时订阅防御性跳过。
 */
export function useUpdater(): UseUpdaterReturn {
  /** 更新状态文案 */
  const updateStateText = ref('')
  /** 是否正在检查更新 */
  const checkingUpdate = ref(false)
  /** 最近一次检查更新的结果 */
  const updateResult = ref<UpdateCheckResult | null>(null)

  // onUpdateState 返回取消订阅函数，组件卸载时调用
  let cancelUpdateState: (() => void) | null = null

  onMounted(() => {
    // 浏览器直接预览（无 preload）时 electron 不存在，做防御性跳过
    if (typeof window.electron === 'undefined') return
    cancelUpdateState = window.electron.onUpdateState((payload) => {
      updateStateText.value = buildUpdateStateText(payload)
    })
  })
  onUnmounted(() => {
    cancelUpdateState?.()
    cancelUpdateState = null
  })

  /** 检查更新；checkingUpdate 由本函数管理，异常向上抛出由视图提示 */
  const checkForUpdates = async (): Promise<UpdateCheckResult> => {
    checkingUpdate.value = true
    try {
      const res = await window.electron.checkForUpdates()
      updateResult.value = res
      return res
    } finally {
      checkingUpdate.value = false
    }
  }

  /** 下载更新 */
  const downloadUpdate = async (): Promise<boolean> => window.electron.downloadUpdate()

  /** 安装更新并重启应用 */
  const installUpdate = async (): Promise<void> => {
    await window.electron.installUpdate()
  }

  return {
    updateStateText,
    checkingUpdate,
    updateResult,
    checkForUpdates,
    downloadUpdate,
    installUpdate
  }
}
