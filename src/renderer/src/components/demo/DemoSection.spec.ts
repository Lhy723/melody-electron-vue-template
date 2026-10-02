import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import naive from 'naive-ui'
import DemoSection from './DemoSection.vue'

// 演示区块卡片：挂载时全局注册 naive-ui，保证 n-card / n-p / n-text 可解析
describe('DemoSection 组件', () => {
  it('渲染 title prop 与 description 段落', () => {
    const wrapper = mount(DemoSection, {
      props: {
        title: '播放器演示区块',
        description: '这是区块的一句话说明'
      },
      global: {
        plugins: [naive]
      }
    })
    // 标题渲染在卡片头部
    expect(wrapper.text()).toContain('播放器演示区块')
    // description 渲染为段落元素（n-p 最终输出 p 标签，class 透传到根元素）
    const paragraph = wrapper.find('p.demo-section-desc')
    expect(paragraph.exists()).toBe(true)
    expect(paragraph.text()).toContain('这是区块的一句话说明')
  })

  it('未传 description 时不渲染说明段落', () => {
    const wrapper = mount(DemoSection, {
      props: { title: '仅标题区块' },
      global: {
        plugins: [naive]
      }
    })
    expect(wrapper.text()).toContain('仅标题区块')
    expect(wrapper.find('p.demo-section-desc').exists()).toBe(false)
  })
})
