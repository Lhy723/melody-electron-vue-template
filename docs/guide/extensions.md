# 进阶扩展

模板刻意保持精简。以下常见桌面能力可作为扩展方向。

## 本地数据库

安装 [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)。postinstall 会自动重编译原生模块。然后在 `src/main/modules/` 新建数据访问模块。

## 系统托盘

在 `src/main/index.ts` 的 `whenReady` 中创建 `Tray`。拦截 `close` 事件可以实现「关闭时隐藏到托盘」。`appSettings.closeType` 提供现成开关。

## 国际化

安装 [vue-i18n](https://vue-i18n.intlify.dev/)。语言偏好挂到 `appSettings` store。持久化由现有体系完成。

## 自动更新发版

推送 `v*` 标签。`release.yml` 会自动构建并发布 Release。手动发布时运行：

```bash
gh release create v1.x.x dist/star-melody-player-1.x.x-setup.exe dist/latest.yml dist/star-melody-player-1.x.x-setup.exe.blockmap
```

旧版本会在应用内检查到更新。
