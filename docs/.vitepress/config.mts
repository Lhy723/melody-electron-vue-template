import { defineConfig } from 'vitepress'

// 仓库部署在项目页路径下，base 必须与仓库名一致
export default defineConfig({
  lang: 'zh-CN',
  title: 'Melody Electron Vue Template',
  description: 'Electron + Vue 3 桌面应用模板。使用说明与扩展指南。',
  base: '/melody-electron-vue-template/',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
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
