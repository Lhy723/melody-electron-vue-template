import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import App from '@renderer/App.vue'
import router from '@renderer/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
// 全局样式
import './style/main.scss'
import './style/animate.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(naive)
app.use(pinia)
app.use(router)
// 渲染层全局错误接入文件日志（浏览器预览无 preload 时跳过）
app.config.errorHandler = (err, _instance, info) => {
  console.error(err)
  if (typeof window.electron !== 'undefined') {
    void window.electron.logWrite(`[vue] ${String(err)} (${info})`, 'error')
  }
}
app.mount('#app')
