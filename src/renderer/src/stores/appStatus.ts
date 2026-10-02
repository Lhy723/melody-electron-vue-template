// 应用状态
import { defineStore } from 'pinia'

const useAppStatus = defineStore('appStatus', {
  state: () => {
    return {
      // 菜单折叠状态
      asideMenuCollapsed: false,
      // 搜索框聚焦状态
      searchInputFocus: false,
      // 是否显示底部播放条
      showPlayBar: true,
      // 演示播放条：播放状态
      playState: false,
      // 演示播放条：播放进度 0-1
      playSeek: 0,
      // 全屏播放器占位
      showFullPlayer: false
    }
  },
  // 数据持久化
  persist: [
    {
      key: 'siteStatus',
      storage: localStorage,
      pick: ['asideMenuCollapsed', 'showPlayBar']
    }
  ]
})
export default useAppStatus
