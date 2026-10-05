# Melody Electron Vue Template

这是一个 Electron + Vue 3 桌面应用模板。它提供完整的应用骨架、桌面能力示例与扩展开发流程。

主要特性：

- 无边框窗口与自绘标题栏。
- 侧边菜单导航与明暗主题。
- 组件演示页、持久化设置、文件日志与自动更新。

点击仓库右上角的 **Use this template** 按钮。GitHub 会创建你的副本仓库，作为项目起点。

![CI](https://github.com/Lhy723/melody-electron-vue-template/actions/workflows/ci.yml/badge.svg) ![Tech Stack](https://img.shields.io/badge/Electron-44-47848F) ![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D) ![Naive UI](https://img.shields.io/badge/Naive_UI-2.x-18A058) ![License](https://img.shields.io/badge/License-MIT-green)

📖 在线文档：<https://lhy723.github.io/melody-electron-vue-template/>（源码在 `docs/` 目录，推送到 main 自动部署）

## 功能特性

每个特性对应独立的模块或演示页。你可以在应用内直接体验它们。

- **窗口**：无边框窗口。标题栏由应用绘制。窗口按钮通过最小 IPC 通道与主进程通信。
- **布局**：顶栏、可折叠侧边菜单、内容区、底部播放条。
- **组件演示页**：基础控件、表单校验、数据进阶、反馈交互、导航结构，以及 @vueuse 与 ECharts 扩展库示例。
- **主题**：切换明暗主题。也可以跟随系统外观。
- **设置持久化**：偏好写入 localStorage。重启后保留。
- **文件操作**：通过系统对话框打开和保存文件。支持拖拽文件并读取真实路径。
- **主进程存储**：配置写入 userData 目录的 JSON 文件。窗口大小和位置自动记忆。
- **日志**：主进程与渲染进程统一写入文件日志。
- **自动更新**：对接 GitHub Releases。开发模式下自动禁用。
- **路由**：Hash 模式路由。页面标题联动。页面缓存。

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
| 图表 | ECharts（vue-echarts，按需注册） |
| 工具集 | @vueuse/core |

> 说明：TypeScript 锁定在 6.x（`~6.0.2`）。原因：`vue-tsc` 与 `typescript-eslint` 尚未支持 TypeScript 7。工具链支持后可直接升级。

## 快速开始

前置条件：Node.js ≥ 22.12 和 pnpm 12。

1. 点击仓库右上角的 **Use this template** 按钮。GitHub 会创建你的副本仓库。
2. 克隆副本仓库到本地：

   ```bash
   git clone <你的仓库地址>
   ```

3. 安装依赖：

   ```bash
   pnpm install
   ```

4. 启动开发模式：

   ```bash
   pnpm dev
   ```

5. 按平台选择打包命令：

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
├── shared/               # 主进程与渲染进程共享契约：通道常量（channels.ts）与类型（types.ts）
├── preload/              # preload 脚本：contextBridge 暴露窗口与桌面能力 API
│   ├── index.ts
│   └── index.d.ts
└── renderer/             # 渲染进程（Vue 3）
    └── src/
        ├── App.vue               # 布局骨架与主题接入
        ├── router/               # 路由表（routes.ts 注册页面）
        ├── stores/               # Pinia：应用状态与设置（持久化）
        ├── components/
        │   ├── global/           # Provider / Layout / DemoPlayBar
        │   ├── menu/             # 侧边菜单（Menu.vue 配置菜单项）
        │   ├── navigation/       # 顶栏：搜索框、窗口控制
        │   └── demo/             # 演示页通用区块组件
        ├── composables/          # 组合式函数：useUpdater / useFileOps 等 IPC 封装
        ├── utils/                # 演示数据等工具
        ├── style/                # 全局样式与动画
        └── views/                # 页面（首页、演示页、设置）
```

测试文件（`*.spec.ts`）与源码同目录。`src/ipc-contract.spec.ts` 校验 IPC 通道契约。

## 如何定制

### 新增页面

1. 在 `src/renderer/src/views/` 下新建组件。
2. 在 `src/renderer/src/router/routes.ts` 注册路由。
3. 在 `src/renderer/src/components/menu/Menu.vue` 添加菜单项。

### 新增桌面能力

推荐先运行 `pnpm gen:capability <name>`。它会生成主进程模块骨架。然后完成这些步骤：

1. 在 `src/shared/ipc/channels.ts` 登记通道。载荷与结果类型放入 `types.ts`。
2. 在生成的模块中实现 handler。
3. 在 `src/main/index.ts` 的 `whenReady` 中注册模块。
4. 在 `src/preload/index.ts` 暴露方法。同步更新 `index.d.ts`。
5. 在视图中通过 composable 或 `electron.*` 调用。

通道两侧不匹配时，`src/ipc-contract.spec.ts` 会失败。编译期类型也会报错。

### 改名应用

全局搜索替换 `star-melody-player`。范围包括 `package.json`、`electron-builder.yml` 和 `src/main/index.ts` 中的 AppUserModelID。

### 调整主题

修改 `src/renderer/src/components/global/Provider.vue` 中的 `theme-overrides`。

### 窗口控制

参考 `src/renderer/src/components/navigation/WindowController.vue` 与 `src/main/mainIpc.ts`。

## 进阶扩展指引

模板刻意保持精简。以下常见桌面能力可作为扩展方向。

### 本地数据库

安装 [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)。postinstall 会自动重编译原生模块。然后在 `src/main/modules/` 新建数据访问模块。

### 系统托盘

在 `src/main/index.ts` 的 `whenReady` 中创建 `Tray`。拦截 `close` 事件可以实现「关闭时隐藏到托盘」。`appSettings.closeType` 提供现成开关。

### 国际化

安装 [vue-i18n](https://vue-i18n.intlify.dev/)。语言偏好挂到 `appSettings` store。持久化由现有体系完成。

### 自动更新发版

推送 `v*` 标签。`release.yml` 会自动构建并发布 Release。手动发布时运行：

```bash
gh release create v1.x.x dist/star-melody-player-1.x.x-setup.exe dist/latest.yml dist/star-melody-player-1.x.x-setup.exe.blockmap
```

旧版本会在应用内检查到更新。

## 脚本说明

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发模式。主进程 HMR。渲染进程热更新。 |
| `pnpm test` | 运行 vitest 测试。 |
| `pnpm run typecheck` | 运行主进程与渲染进程类型检查。 |
| `pnpm exec eslint .` | 运行 ESLint 检查。 |
| `pnpm run build:unpack` | 构建并输出未打包目录。 |
| `pnpm run build:win / mac / linux` | 打包对应平台的安装包。 |
| `pnpm gen:capability <name>` | 生成新能力模块骨架。 |

## 文档规范

本文档遵循 ASD-STE100 简化技术写作原则。要点：一句一义。短句。步骤用祈使句，每步一个动作。主动表述。术语全篇一致。修改文档时请保持这些原则。

## License

[MIT](./LICENSE) © 2026 Lhy723
