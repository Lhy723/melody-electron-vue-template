# 脚本说明

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发模式。主进程 HMR。渲染进程热更新。 |
| `pnpm test` | 运行 vitest 测试。 |
| `pnpm run typecheck` | 运行主进程与渲染进程类型检查。 |
| `pnpm exec eslint .` | 运行 ESLint 检查。 |
| `pnpm run build:unpack` | 构建并输出未打包目录。 |
| `pnpm run build:win / mac / linux` | 打包对应平台的安装包。 |
| `pnpm gen:capability <name>` | 生成新能力模块骨架。 |

## 文档站

文档源码在 `docs/` 目录。构建产物部署到 GitHub Pages。

| 命令（在 `docs/` 目录内运行） | 作用 |
| --- | --- |
| `pnpm run docs:dev` | 启动文档站本地预览。 |
| `pnpm run docs:build` | 构建文档站。 |
| `pnpm run docs:preview` | 预览构建产物。 |

## 文档规范

文档遵循 ASD-STE100 简化技术写作原则。要点：一句一义。短句。步骤用祈使句，每步一个动作。主动表述。术语全篇一致。修改文档时请保持这些原则。
