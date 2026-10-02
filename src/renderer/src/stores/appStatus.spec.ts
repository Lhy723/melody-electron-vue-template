import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import useAppStatusStore from './appStatus'

// 应用状态 store：默认值与赋值读写
describe('appStatus store', () => {
  beforeEach(() => {
    // 每个用例使用全新的 Pinia 实例，避免用例间状态串扰
    setActivePinia(createPinia())
  })

  it('默认值正确', () => {
    const store = useAppStatusStore()
    // 是否显示底部播放条
    expect(store.showPlayBar).toBe(true)
    // 演示播放条：播放状态
    expect(store.playState).toBe(false)
    // 演示播放条：播放进度 0-1
    expect(store.playSeek).toBe(0)
  })

  it('赋值后可以读到新值', () => {
    const store = useAppStatusStore()
    store.showPlayBar = false
    store.playState = true
    store.playSeek = 0.5
    expect(store.showPlayBar).toBe(false)
    expect(store.playState).toBe(true)
    expect(store.playSeek).toBe(0.5)
  })
})
