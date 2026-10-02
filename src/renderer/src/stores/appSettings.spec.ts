import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import useAppSettingsStore from './appSettings'

// 应用设置 store：默认值、字段读写与 $reset 行为
describe('appSettings store', () => {
  beforeEach(() => {
    // 每个用例使用全新的 Pinia 实例，避免用例间状态串扰
    setActivePinia(createPinia())
  })

  it('默认值正确', () => {
    const store = useAppSettingsStore()
    // 外观
    expect(store.themeType).toBe('dark')
    expect(store.themeAuto).toBe(false)
    // 布局
    expect(store.showSider).toBe(true)
    // 数据
    expect(store.loadSize).toBe(50)
  })

  it('修改字段后可以读到新值', () => {
    const store = useAppSettingsStore()
    store.themeType = 'light'
    store.themeAuto = true
    store.showSider = false
    store.loadSize = 100
    expect(store.themeType).toBe('light')
    expect(store.themeAuto).toBe(true)
    expect(store.showSider).toBe(false)
    expect(store.loadSize).toBe(100)
  })

  it('$reset 恢复默认值', () => {
    const store = useAppSettingsStore()
    store.themeType = 'light'
    store.loadSize = 100
    store.$reset()
    expect(store.themeType).toBe('dark')
    expect(store.themeAuto).toBe(false)
    expect(store.showSider).toBe(true)
    expect(store.loadSize).toBe(50)
  })
})
