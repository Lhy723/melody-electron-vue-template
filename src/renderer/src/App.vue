<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOsTheme, darkTheme } from 'naive-ui'
import { useRouter } from 'vue-router'
import Provider from '@renderer/components/global/Provider.vue'
import Navigation from '@renderer/components/navigation/Navigation.vue'
import { appStatus, appSettings } from '@renderer/stores'
import Menu from '@renderer/components/menu/Menu.vue'
import Layout from '@renderer/components/global/Layout.vue'
import DemoPlayBar from '@renderer/components/global/DemoPlayBar.vue'

const router = useRouter()
const status = appStatus()
const settings = appSettings()
const { showSider, themeType, themeAuto } = storeToRefs(settings)
const { showPlayBar, asideMenuCollapsed, showFullPlayer } = storeToRefs(status)

// 主题：手动优先，跟随系统时读取 OS 偏好
const osTheme = useOsTheme()
const activeTheme = computed(() => {
  const base = themeAuto.value ? osTheme.value : themeType.value
  return base === 'light' ? null : darkTheme
})

// 页面标题跟随路由
router.afterEach((to) => {
  const base = import.meta.env.VITE_APP_TITLE ?? 'Star Melody Player'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})
</script>

<template>
  <Provider :theme="activeTheme">
    <!-- 主框架 -->
    <n-layout :class="['all-layout', { 'full-player': showFullPlayer }]">
      <!-- 导航栏 -->
      <n-layout-header bordered>
        <Navigation />
      </n-layout-header>
      <!-- 主内容 - 有侧边栏 -->
      <n-layout
        v-if="showSider"
        :class="{
          'body-layout': true,
          'player-bar': showPlayBar
        }"
        position="absolute"
        has-sider
      >
        <!-- 侧边栏 -->
        <n-layout-sider
          :collapsed="asideMenuCollapsed"
          :native-scrollbar="false"
          :collapsed-width="64"
          :width="240"
          class="main-sider"
          show-trigger="bar"
          collapse-mode="width"
          bordered
          @collapse="asideMenuCollapsed = true"
          @expand="asideMenuCollapsed = false"
        >
          <div class="sider-all">
            <Menu />
          </div>
        </n-layout-sider>
        <!-- 页面区 -->
        <n-layout :native-scrollbar="false" embedded>
          <!-- 全局反馈容器 -->
          <n-message-provider placement="bottom">
            <n-notification-provider :max="3">
              <n-dialog-provider>
                <Layout />
              </n-dialog-provider>
            </n-notification-provider>
          </n-message-provider>
        </n-layout>
      </n-layout>
      <!-- 底部播放条 -->
      <Transition name="up">
        <DemoPlayBar v-if="showPlayBar" />
      </Transition>
    </n-layout>
  </Provider>
</template>
<style lang="scss" scoped>
.all-layout {
  height: 100%;
  transition:
    transform 0.3s,
    opacity 0.3s;
  .n-layout-header {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    -webkit-app-region: drag;
  }
  .body-layout {
    top: 60px;
    transition: bottom 0.3s;
    .main-sider {
      :deep(.n-scrollbar-content) {
        height: 100%;
      }
      .sider-all {
        height: 100%;
      }
      @media (max-width: 900px) {
        display: none;
      }
    }
    &.player-bar {
      bottom: 80px;
    }
  }
  &.full-player {
    opacity: 0;
    transform: scale(0.9);
  }
}
</style>
