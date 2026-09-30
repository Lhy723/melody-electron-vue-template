declare global {
  interface Window {
    electron: {
      minimize: () => void
      toggleMaximize: () => void
      close: () => void
      onWindowState: (listener: (maximized: boolean) => void) => () => void
    }
    api: unknown
  }
}
