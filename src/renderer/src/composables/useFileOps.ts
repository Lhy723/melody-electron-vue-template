/**
 * 文件能力组合式函数：封装打开 / 保存 / 拖拽读取的 IPC 调用与结果规整。
 * 只做数据搬运，消息提示（useMessage）留给视图。
 */
import type { OpenFileResult } from '@shared/ipc/types'

/** 拖拽文件读取成功时的结果 */
export interface DroppedFileContent {
  /** 文件真实磁盘路径 */
  path: string
  /** 文件名 */
  name: string
  /** 文本内容 */
  content: string
}

/** useFileOps 的返回值类型 */
export interface UseFileOpsReturn {
  /** 打开文本文件：用户取消返回 null，其余透传主进程结果；异常向上抛出 */
  openTextFile: () => Promise<OpenFileResult | null>
  /** 保存文本文件：用户取消返回 null，成功返回保存路径；异常向上抛出 */
  saveTextFile: (content: string, defaultName?: string) => Promise<string | null>
  /** 读取拖拽文件：成功返回路径 / 文件名 / 内容，主进程返回 !ok 时返回 null；异常向上抛出 */
  readDroppedFile: (file: File) => Promise<DroppedFileContent | null>
}

/**
 * 文件能力（打开对话框 / 另存为 / 拖拽读取）。
 * 依赖 preload 暴露的 window.electron；浏览器预览（无 preload）时调用会抛错，由视图捕获提示。
 */
export function useFileOps(): UseFileOpsReturn {
  /** 打开文本文件：canceled 返回 null，其余结果透传 */
  const openTextFile = async (): Promise<OpenFileResult | null> => {
    const res = await window.electron.openFile()
    return res.canceled ? null : res
  }

  /** 保存文本文件：canceled 返回 null，成功返回保存路径 */
  const saveTextFile = async (content: string, defaultName?: string): Promise<string | null> => {
    const res = await window.electron.saveTextFile(content, defaultName)
    return res.canceled ? null : (res.path ?? '')
  }

  /**
   * 读取拖拽文件：渲染进程出于 Chromium 安全限制拿不到拖拽 File 对象的真实磁盘路径，
   * preload 内部需先用 webUtils.getPathForFile(file) 换取真实路径，再把路径交给主进程读取。
   */
  const readDroppedFile = async (file: File): Promise<DroppedFileContent | null> => {
    // 兼容同步 string 与 Promise<string> 两种 getPathForFile 实现
    const filePath = await window.electron.getPathForFile(file)
    const res = await window.electron.readDroppedFile(filePath)
    // 主进程读取失败（如拖入文件夹）返回 null
    if (!res.ok) return null
    return {
      path: res.path ?? filePath,
      name: res.name ?? file.name,
      content: res.content ?? ''
    }
  }

  return { openTextFile, saveTextFile, readDroppedFile }
}
