import useAppStatus from './appStatus'
import useAppSettingsStore from './appSettings'
import useMusicDataStore from './musicData'

export const appStatus = () => useAppStatus()
export const appSettings = () => useAppSettingsStore()
export const musicData = () => useMusicDataStore()
