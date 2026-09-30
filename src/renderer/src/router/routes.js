const routes = [
  // 首页
  {
    path: '/',
    name: 'home',
    meta: {
      title: '主页'
    },
    component: () => import('../views/Home.vue')
  },
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
