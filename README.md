# Melody Electron Vue Template

一个可直接二次开发的 **Electron + Vue 3 桌面应用模板**：无边框窗口、自绘标题栏、侧边菜单导航、明暗主题、持久化设置与一组可交互的组件演示页均已就绪。点击右上角 **Use this template** 即可把它作为你自己项目的起点。

![CI](https://github.com/Lhy723/melody-electron-vue-template/actions/workflows/ci.yml/badge.svg) ![Tech Stack](https://img.shields.io/badge/Electron-44-47848F) ![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D) ![Naive UI](https://img.shields.io/badge/Naive_UI-2.x-18A058) ![License](https://img.shields.io/badge/License-MIT-green)

## 功能特性

- **无边框窗口 + 自绘标题栏**：窗口拖拽、最小化 / 最大化 / 关闭按钮，通过 preload 暴露的最小 IPC 通道与主进程通信
- **布局骨架**：顶栏（前进 / 后退 / 搜索）+ 可折叠侧边菜单 + 内容区 + 常驻底部播放条（演示实现）
- **组件演示页**：基础控件、表单校验闭环、Modal / Drawer / Message / Notification 反馈、Tabs / Steps 等导航元素
- **明暗主题**：手动切换或跟随系统，基于 Naive UI `darkTheme` + `n-global-style`
- **设置持久化**：Pinia + `pinia-plugin-persistedstate`，偏好写入 localStorage，重启保留
- **文件操作**：系统对话框打开 / 保存、文本读写、拖拽文件取真实路径（`webUtils`），全部走 `invoke/handle` 请求-响应规范
- **主进程持久化**：electron-store 写 userData JSON 配置，窗口大小位置自动记忆、重启恢复
- **文件日志**：electron-log 主 / 渲染进程统一写入用户日志目录
- **自动更新**：electron-updater 对接 GitHub Releases，开发模式安全禁用
- **路由就绪**：Hash 路由、路由元信息、页面标题联动、keep-alive 页面缓存

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 桌面壳 | Electron 44 |
| 前端框架 | Vue 3（组合式 API） |
| UI 组件库 | Naive UI |
| 状态管理 | Pinia + pinia-plugin-persistedstate |
| 路由 | Vue Router（Hash 模式） |
| 构建 | electron-vite + Vite |
| 打包 | electron-builder（NSIS / DMG / AppImage） |
| 包管理 | pnpm |
| 主进程存储 | electron-store（锁定 CJS 版本） |
| 日志 | electron-log |
| 自动更新 | electron-updater（GitHub Releases） |

## 快速开始

1. 点击仓库右上角 **Use this template** → **Create a new repository**，以模板创建你自己的仓库并克隆；
2. 安装依赖（需要 Node.js ≥ 22.12 与 pnpm 12）：

   ```bash
   pnpm install
   ```

3. 启动开发模式：

   ```bash
   pnpm dev
   ```

4. 打包对应平台的安装包：

   ```bash
   pnpm run build:win    # Windows (NSIS)
   pnpm run build:mac    # macOS
   pnpm run build:linux  # Linux (AppImage / snap / deb)
   ```

## 目录结构

```
src/
├── main/                 # Electron 主进程
│   ├── index.ts          # 窗口创建、生命周期、窗口状态记忆
│   ├── mainIpc.ts        # 窗口控制 IPC
│   └── modules/          # 能力模块：fileIpc / storeIpc / httpIpc / logIpc / updateIpc / appStore
├── preload/              # preload 脚本：contextBridge 暴露窗口与桌面能力 API
│   ├── index.ts
│   └── index.d.ts
└── renderer/             # 渲染层（Vue 3）
    └── src/
        ├── App.vue               # 布局骨架 + 主题接入
        ├── router/               # 路由表（routes.js 注册页面）
        ├── stores/               # Pinia：应用状态 / 设置（持久化）
        ├── components/
        │   ├── global/           # Provider / Layout / DemoPlayBar
        │   ├── menu/             # 侧边菜单（Menu.vue 配置菜单项）
        │   ├── navigation/       # 顶栏：搜索框、窗口控制
        │   └── demo/             # 演示页通用区块组件
        ├── utils/                # 演示数据等工具
        ├── style/                # 全局样式与动画
        └── views/                # 页面（首页、演示页、设置）
```

## 如何定制

- **新增页面**：在 `views/` 下新建组件 → 在 `router/routes.js` 注册路由 → 在 `components/menu/Menu.vue` 的菜单数据里加一项；
- **改名应用**：全局搜索替换 `star-melody-player`（`package.json`、`electron-builder.yml`、`src/main/index.ts` 的 AppUserModelID）；
- **调整主题**：`components/global/Provider.vue` 中修改 `theme-overrides`；
- **窗口控制**：参考 `components/navigation/WindowController.vue` 与 `src/main/mainIpc.ts` 的最小 IPC 用法；
- **新增桌面能力**：在 `src/main/modules/` 新建模块注册 `handle` 通道，在 `src/preload/index.ts` 暴露对应方法并同步 `index.d.ts` 类型，参照 `fileIpc.ts` 的写法。

## 进阶扩展指引

模板刻意保持精简，以下常见桌面能力可作为下一步接入方向：

- **本地数据库**：结构化存储接入 [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)（原生模块，`pnpm add better-sqlite3` 后由 postinstall 的 `electron-builder install-app-deps` 自动重编译），在 `src/main/modules/` 新建数据访问模块；
- **系统托盘**：在 `src/main/index.ts` 的 `whenReady` 中用 `Tray` 创建，「关闭窗口时隐藏到托盘」可结合 `appSettings.closeType` 的现成开关拦截 `close` 事件实现；
- **国际化**：渲染层接入 [vue-i18n](https://vue-i18n.intlify.dev/)，语言偏好挂到 `appSettings` store 即可随现有持久化体系保存；
- **自动更新全链路**：`pnpm run build:win` 生成安装包与 `latest.yml`，发布到 GitHub Release 后旧版本即可在「桌面能力」页检查并升级：

  ```bash
  gh release create v1.x.x dist/star-melody-player-1.x.x-setup.exe dist/latest.yml dist/star-melody-player-1.x.x-setup.exe.blockmap
  ```

## 脚本说明

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 开发模式（主进程 HMR + 渲染层 Vite 热更新） |
| `pnpm run typecheck` | 主进程 / 渲染层双 TypeScript 类型检查 |
| `pnpm exec eslint .` | ESLint 检查 |
| `pnpm run build:unpack` | 构建并输出未打包目录 |
| `pnpm run build:win / mac / linux` | 打包各平台安装包 |

## License

[MIT](./LICENSE) © 2026 Lhy723
