<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Provider from '@renderer/components/global/Provider.vue'
import Navigation from '@renderer/components/navigation/Navigation.vue'
import { musicData, appStatus, appSettings } from '@renderer/stores'
import Menu from '@renderer/components/menu/Menu.vue'
import Layout from '@renderer/components/global/Layout.vue'

const router = useRouter()
const music = musicData()
const status = appStatus()
const settings = appSettings()
const { autoPlay, showSider, autoSignIn, autoCheckUpdates } = storeToRefs(settings)
const { showPlayBar, asideMenuCollapsed, showFullPlayer } = storeToRefs(status)
</script>

<template>
  <Provider>
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
          'player-bar': music.getPlaySongData?.id && showPlayBar
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
          <Layout />
        </n-layout>
      </n-layout>
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
