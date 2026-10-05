/**
 * IPC 通道名常量：preload 与 main 共同的唯一事实来源。
 *
 * 新增能力时先在此登记通道，再实现两端——通道名拼错会在编译期暴露，
 * 配合 src/ipc-contract.spec.ts 的契约元测试形成双保险。
 */
export const ipcChannels = {
  file: {
    open: 'file:open',
    save: 'file:save',
    readDropped: 'file:readDropped',
    reveal: 'file:reveal'
  },
  store: {
    get: 'store:get',
    set: 'store:set',
    delete: 'store:delete'
  },
  http: {
    get: 'http:get'
  },
  log: {
    write: 'log:write',
    path: 'log:path'
  },
  update: {
    check: 'update:check',
    download: 'update:download',
    install: 'update:install'
  },
  window: {
    min: 'window-min',
    maxOrRestore: 'window-maxOrRestore',
    restore: 'window-restore',
    close: 'window-close',
    /** 主进程 → 渲染层：窗口最大化状态变化 */
    stateChanged: 'windowState'
  },
  /** 主进程 → 渲染层：自动更新状态变化 */
  updateStateChanged: 'updateState'
} as const
