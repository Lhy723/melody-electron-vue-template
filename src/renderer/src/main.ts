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
app.mount('#app')
