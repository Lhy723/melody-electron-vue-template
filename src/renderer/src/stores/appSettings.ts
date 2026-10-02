// 应用设置
import { defineStore } from 'pinia'

// 设置项状态类型
interface AppSettingsState {
  // 外观
  themeType: 'dark' | 'light' // 主题类型 dark / light
  themeAuto: boolean // 跟随系统外观
  systemFonts: string // 界面字体
  // 布局
  showSider: boolean // 显示侧边栏
  siderShowCover: boolean // 侧边栏封面样式
  // 行为
  closeTip: boolean // 关闭窗口时提醒
  closeType: 'close' | 'hide' // 关闭方式 close 直接关闭 / hide 最小化到任务栏
  // 数据
  loadSize: number // 每页加载数量
}

const useAppSettingsStore = defineStore('appSettings', {
  state: (): AppSettingsState => {
    return {
      // 外观
      themeType: 'dark', // 主题类型 dark / light
      themeAuto: false, // 跟随系统外观
      systemFonts: 'HarmonyOS Sans', // 界面字体
      // 布局
      showSider: true, // 显示侧边栏
      siderShowCover: false, // 侧边栏封面样式
      // 行为
      closeTip: true, // 关闭窗口时提醒
      closeType: 'hide', // 关闭方式 close 直接关闭 / hide 最小化到任务栏
      // 数据
      loadSize: 50 // 每页加载数量
    }
  },
  // 数据持久化
  persist: [
    {
      key: 'siteSettings',
      storage: localStorage
    }
  ]
})

export default useAppSettingsStore
