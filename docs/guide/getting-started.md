# 快速开始

## 前置条件

安装 Node.js ≥ 22.12 和 pnpm 12。

## 步骤

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

> 说明：TypeScript 锁定在 6.x（`~6.0.2`）。原因：`vue-tsc` 与 `typescript-eslint` 尚未支持 TypeScript 7。工具链支持后可直接升级。
