# 如何定制

## 新增页面

1. 在 `src/renderer/src/views/` 下新建组件。
2. 在 `src/renderer/src/router/routes.ts` 注册路由。
3. 在 `src/renderer/src/components/menu/Menu.vue` 添加菜单项。

## 新增桌面能力

推荐先运行 `pnpm gen:capability <name>`。它会生成主进程模块骨架。然后完成这些步骤：

1. 在 `src/shared/ipc/channels.ts` 登记通道。载荷与结果类型放入 `types.ts`。
2. 在生成的模块中实现 handler。
3. 在 `src/main/index.ts` 的 `whenReady` 中注册模块。
4. 在 `src/preload/index.ts` 暴露方法。同步更新 `index.d.ts`。
5. 在视图中通过 composable 或 `electron.*` 调用。

通道两侧不匹配时，`src/ipc-contract.spec.ts` 会失败。编译期类型也会报错。

## 改名应用

全局搜索替换 `star-melody-player`。范围包括 `package.json`、`electron-builder.yml` 和 `src/main/index.ts` 中的 AppUserModelID。

## 调整主题

修改 `src/renderer/src/components/global/Provider.vue` 中的 `theme-overrides`。

## 窗口控制

参考 `src/renderer/src/components/navigation/WindowController.vue` 与 `src/main/mainIpc.ts`。
