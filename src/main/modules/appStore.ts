import Store from 'electron-store'

// 应用持久化存储：数据写入用户数据目录（Windows 下为 %APPDATA%/star-melody-player/app-data.json）
export const appStore = new Store({ name: 'app-data' })
