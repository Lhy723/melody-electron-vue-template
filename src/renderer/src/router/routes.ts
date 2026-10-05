import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 首页
  {
    path: '/',
    name: 'home',
    meta: {
      title: '主页'
    },
    component: () => import('../views/Home.vue')
  },
  // 组件展示
  {
    path: '/components/basic',
    name: 'components-basic',
    meta: {
      title: '基础组件'
    },
    component: () => import('../views/ComponentsBasic.vue')
  },
  {
    path: '/components/form',
    name: 'components-form',
    meta: {
      title: '表单校验'
    },
    component: () => import('../views/ComponentsForm.vue')
  },
  {
    path: '/components/feedback',
    name: 'components-feedback',
    meta: {
      title: '反馈交互'
    },
    component: () => import('../views/ComponentsFeedback.vue')
  },
  {
    path: '/components/navigation',
    name: 'components-navigation',
    meta: {
      title: '导航结构'
    },
    component: () => import('../views/ComponentsNavigation.vue')
  },
  {
    path: '/components/window',
    name: 'components-window',
    meta: {
      title: '窗口与主题'
    },
    component: () => import('../views/ComponentsWindow.vue')
  },
  {
    path: '/components/desktop',
    name: 'components-desktop',
    meta: {
      title: '桌面能力'
    },
    component: () => import('../views/DesktopCapabilities.vue')
  },
  {
    path: '/components/data',
    name: 'components-data',
    meta: {
      title: '数据进阶'
    },
    component: () => import('../views/ComponentsData.vue')
  },
  {
    path: '/components/extensions',
    name: 'components-extensions',
    meta: {
      title: '扩展库示例'
    },
    component: () => import('../views/ExtensionsDemo.vue')
  },
  // 设置
  {
    path: '/settings',
    name: 'settings',
    meta: {
      title: '设置'
    },
    component: () => import('../views/Settings.vue')
  }
]

export default routes
