import { describe, expect, it } from 'vitest'
import {
  demoFormRules,
  demoSelectOptions,
  demoTabPanes,
  demoTableData,
  demoTimelineData
} from './demoData'

// 判断对象是否含有指定自有属性（只看自身，不看原型链）
const hasOwn = (obj: unknown, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key)

// 模板演示数据：结构与完整性校验，供各演示页安全消费
describe('demoData 演示数据', () => {
  it('demoTableData 每行字段完整且 index 唯一', () => {
    expect(Array.isArray(demoTableData)).toBe(true)
    expect(demoTableData.length).toBeGreaterThan(0)
    for (const row of demoTableData) {
      expect(hasOwn(row, 'index')).toBe(true)
      expect(hasOwn(row, 'name')).toBe(true)
      expect(hasOwn(row, 'desc')).toBe(true)
      expect(hasOwn(row, 'status')).toBe(true)
    }
    // 所有行的 index 互不重复
    const indexes = demoTableData.map((row) => row.index)
    expect(new Set(indexes).size).toBe(indexes.length)
  })

  it('demoSelectOptions 每项都有 label 与 value', () => {
    expect(Array.isArray(demoSelectOptions)).toBe(true)
    expect(demoSelectOptions.length).toBeGreaterThan(0)
    for (const option of demoSelectOptions) {
      expect(hasOwn(option, 'label')).toBe(true)
      expect(hasOwn(option, 'value')).toBe(true)
    }
  })

  it('demoFormRules 包含 username / email / age 三类规则', () => {
    expect(hasOwn(demoFormRules, 'username')).toBe(true)
    expect(hasOwn(demoFormRules, 'email')).toBe(true)
    expect(hasOwn(demoFormRules, 'age')).toBe(true)
  })

  it('demoTimelineData 与 demoTabPanes 均为非空数组', () => {
    expect(Array.isArray(demoTimelineData)).toBe(true)
    expect(demoTimelineData.length).toBeGreaterThan(0)
    expect(Array.isArray(demoTabPanes)).toBe(true)
    expect(demoTabPanes.length).toBeGreaterThan(0)
  })
})
