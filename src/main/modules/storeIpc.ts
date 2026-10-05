import { ipcMain } from 'electron'
import { appStore } from './appStore'
import { ipcChannels } from '../../shared/ipc/channels'

// 存储 IPC：读写 electron-store 持久化数据
export const registerStoreIpc = (): void => {
  ipcMain.handle(ipcChannels.store.get, (_event, key: string) => appStore.get(key))

  ipcMain.handle(ipcChannels.store.set, (_event, key: string, value: unknown) => {
    appStore.set(key, value)
    return true
  })

  ipcMain.handle(ipcChannels.store.delete, (_event, key: string) => {
    appStore.delete(key)
    return true
  })
}
