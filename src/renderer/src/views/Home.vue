<script setup>
// 首页：模板概览与快速入口
import { useRouter } from 'vue-router'
import {
  Grid16Regular,
  Chat16Regular,
  List16Regular,
  Desktop16Regular,
  Settings16Regular,
  Code16Regular
} from '@vicons/fluent'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'

const router = useRouter()

// 模板功能入口
const quickLinks = [
  {
    key: 'basic',
    title: '基础组件',
    desc: '按钮、输入、选择、卡片、表格等常用元素',
    icon: Grid16Regular,
    route: 'components-basic'
  },
  {
    key: 'feedback',
    title: '反馈交互',
    desc: '模态框、抽屉、消息、通知与加载进度',
    icon: Chat16Regular,
    route: 'components-feedback'
  },
  {
    key: 'navigation',
    title: '导航结构',
    desc: '标签页、面包屑、分页与步骤条',
    icon: List16Regular,
    route: 'components-navigation'
  },
  {
    key: 'window',
    title: '窗口能力',
    desc: '窗口控制、主题切换与桌面环境示例',
    icon: Desktop16Regular,
    route: 'components-window'
  },
  {
    key: 'settings',
    title: '模板设置',
    desc: '外观与行为偏好的持久化示例',
    icon: Settings16Regular,
    route: 'settings'
  }
]

// 模板技术栈
const techStacks = [
  { label: 'Electron 44', value: '桌面壳' },
  { label: 'Vue 3', value: '组合式 API' },
  { label: 'Naive UI', value: '组件库' },
  { label: 'Pinia', value: '状态持久化' },
  { label: 'Vue Router', value: 'Hash 路由' },
  { label: 'electron-vite', value: '构建工具' }
]
</script>

<template>
  <div class="home-page">
    <DemoPageHeader
      title="Star Melody Player 模板"
      description="一套可直接二次开发的 Electron + Vue3 桌面应用模板：无边框窗口、自绘标题栏、侧边菜单、路由页面与主题体系均已就绪，以下入口可查看各能力的示例。"
    />
    <!-- 快速入口 -->
    <n-grid :x-gap="16" :y-gap="16" cols="1 s:2 m:3" responsive="screen">
      <n-grid-item v-for="link in quickLinks" :key="link.key">
        <n-card hoverable class="quick-link" embedded @click="router.push({ name: link.route })">
          <div class="quick-link-inner">
            <n-icon :size="28" class="quick-link-icon">
              <component :is="link.icon" />
            </n-icon>
            <div class="quick-link-text">
              <n-text strong>{{ link.title }}</n-text>
              <n-text depth="3" class="quick-link-desc selectable">{{ link.desc }}</n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
    <!-- 技术栈 -->
    <n-card class="tech-card" embedded title="内置技术栈">
      <template #header-extra>
        <n-icon :size="18">
          <Code16Regular />
        </n-icon>
      </template>
      <n-space :size="12">
        <n-tag v-for="item in techStacks" :key="item.label" type="info" round>
          {{ item.label }}
          <template #avatar>
            <n-text depth="3" style="font-size: 12px">{{ item.value }}</n-text>
          </template>
        </n-tag>
      </n-space>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  .quick-link {
    cursor: pointer;
    border-radius: 12px;
    transition: transform 0.3s;
    &:hover {
      transform: translateY(-2px);
    }
    &:active {
      transform: scale(0.98);
    }
    .quick-link-inner {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 14px;
      .quick-link-icon {
        min-width: 28px;
      }
      .quick-link-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        .quick-link-desc {
          font-size: 13px;
          user-select: text !important;
        }
      }
    }
  }
  .tech-card {
    margin-top: 16px;
    border-radius: 12px;
  }
}
</style>
