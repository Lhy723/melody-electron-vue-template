import useAppStatus from './appStatus'
import useAppSettingsStore from './appSettings'

export const appStatus = () => useAppStatus()
export const appSettings = () => useAppSettingsStore()

export type AppStatusStore = ReturnType<typeof useAppStatus>
export type AppSettingsStore = ReturnType<typeof useAppSettingsStore>
