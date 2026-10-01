import useAppStatus from './appStatus'
import useAppSettingsStore from './appSettings'

export const appStatus = () => useAppStatus()
export const appSettings = () => useAppSettingsStore()
