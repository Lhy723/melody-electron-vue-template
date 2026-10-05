import { defineConfig } from 'vitepress'

// 仓库部署在项目页路径下，base 必须与仓库名一致
export default defineConfig({
  lang: 'zh-CN',
  title: 'Melody Electron Vue Template',
  description: 'Electron + Vue 3 桌面应用模板。使用说明与扩展指南。',
  base: '/melody-electron-vue-template/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/melody-electron-vue-template/logo.png' }]
  ],
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    lastUpdated: { text: '最后更新' },
    editLink: {
      pattern:
        'https://github.com/Lhy723/melody-electron-vue-template/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '界面预览', link: '/guide/showcase' },
      {
        text: 'GitHub',
        link: 'https://github.com/Lhy723/melody-electron-vue-template'
      }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '界面预览', link: '/guide/showcase' },
          { text: '目录结构', link: '/guide/structure' },
          { text: '如何定制', link: '/guide/customization' },
          { text: '进阶扩展', link: '/guide/extensions' },
          { text: '脚本说明', link: '/guide/scripts' }
        ]
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Lhy723/melody-electron-vue-template'
      }
    ],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: '© 2026 Lhy723'
    },
    outline: { level: [2, 3] }
  }
})
