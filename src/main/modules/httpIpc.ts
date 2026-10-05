import { ipcMain, net } from 'electron'
import log from 'electron-log/main'
import { ipcChannels } from '../../shared/ipc/channels'
import type { HttpGetResult } from '../../shared/ipc/types'

// HTTP 请求 IPC：校验协议后用 net.fetch 走系统网络栈，绕开渲染进程的跨域限制
export const registerHttpIpc = (): void => {
  ipcMain.handle(ipcChannels.http.get, async (_event, url: string): Promise<HttpGetResult> => {
    try {
      // 仅允许 http/https 协议，防止 file: 等协议被滥用
      const parsed = new URL(url)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`仅支持 http/https 协议，收到 ${parsed.protocol}`)
      }
      const response = await net.fetch(url)
      const text = await response.text()
      log.info(`[http:get] ${url} -> ${response.status}`)
      return { ok: response.ok, status: response.status, text }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log.error('[http:get] 请求失败:', message)
      return { ok: false, status: 0, message }
    }
  })
}
