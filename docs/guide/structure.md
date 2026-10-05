# 目录结构

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

## 测试文件

测试文件（`*.spec.ts`）与源码同目录。`src/ipc-contract.spec.ts` 校验 IPC 通道契约。

## IPC 契约

通道名与载荷类型的唯一事实来源在 `src/shared/ipc/`。主进程与 preload 都从契约导入。

契约元测试 `src/ipc-contract.spec.ts` 做三层校验：

- 每个 `invoke` 通道都有对应的 `handle`。
- 每个 `send` 通道都有对应的 `on`。
- 每个主进程推送通道都有对应的渲染进程订阅。

通道拼错时，编译期类型与契约测试双重报错。
