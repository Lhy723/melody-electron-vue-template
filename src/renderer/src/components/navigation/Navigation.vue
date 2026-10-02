<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { CaretLeft16Regular, CaretRight16Regular } from '@vicons/fluent'
import { MusicalNote } from '@vicons/ionicons5'
import { appStatus, appSettings } from '@renderer/stores'
import SearchBox from '@renderer/components/navigation/SearchBox.vue'
import WindowController from '@renderer/components/navigation/WindowController.vue'

const router = useRouter()
const status = appStatus()
const settings = appSettings()
const { asideMenuCollapsed, searchInputFocus } = storeToRefs(status)
const { showSider } = storeToRefs(settings)

// 站点信息
const appName = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <nav :class="{ 'main-nav': true, 'no-sider': !showSider }">
    <div class="left">
      <div :class="['logo', asideMenuCollapsed ? 'collapsed' : null]" @click="router.push('/')">
        <!--  Logo   -->
        <n-icon class="logo-img" size="30">
          <MusicalNote />
        </n-icon>
        <!--  标题   -->
        <Transition name="fade" mode="out-in">
          <n-text v-if="!asideMenuCollapsed && showSider" class="site-name">
            {{ appName }}
          </n-text>
        </Transition>
      </div>
      <!--   前进后退键   -->
      <n-flex :class="['navigation', { hidden: searchInputFocus }]" :size="6">
        <n-button :focusable="false" class="nav-icon" quaternary @click="router.go(-1)">
          <template #icon>
            <n-icon>
              <CaretLeft16Regular />
            </n-icon>
          </template>
        </n-button>
        <n-button :focusable="false" class="nav-icon" quaternary @click="router.go(1)">
          <template #icon>
            <n-icon>
              <CaretRight16Regular />
            </n-icon>
          </template>
        </n-button>
      </n-flex>
      <!--   搜索框   -->
      <SearchBox />
    </div>
    <div class="right">
      <WindowController />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.main-nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  .left,
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .logo {
    width: 224px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 6px;
    box-sizing: border-box;
    transition:
      width 0.3s,
      padding-left 0.3s;
    -webkit-app-region: no-drag;
    cursor: pointer;
    .logo-img {
      width: 30px;
      height: 30px;
      min-width: 30px;
      background-color: transparent;
      transition: transform 0.3s;
      &:hover {
        transform: scale(1.15);
      }
      &:active {
        transform: scale(1);
      }
    }
    .site-name {
      margin-left: 12px;
      font-size: 20px;
      font-weight: bold;
    }
    &.collapsed {
      width: 48px;
      padding-left: 0;
    }
  }
  .navigation {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 34px;
    width: 86px;
    min-width: 86px;
    transition:
      width 0.3s,
      min-width 0.3s,
      opacity 0.3s;
    overflow: hidden;
    -webkit-app-region: no-drag;
    .nav-icon {
      border-radius: 8px;
      padding: 0 8px;
      .n-icon {
        font-size: 24px;
      }
    }
    @media (max-width: 700px) {
      &.hidden {
        opacity: 0;
        width: 0px;
        min-width: 0px;
      }
    }
  }
  &.no-sider {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 10vw;
    @media (max-width: 1200px) {
      padding: 0 5vw;
    }
    .logo {
      width: auto;
      padding-left: 0;
      margin-right: 12px;
    }
  }
  @media (max-width: 900px) {
    .left {
      .logo {
        width: auto;
        padding-left: 0;
        margin-right: 12px;
        .site-name {
          display: none;
        }
      }
    }
  }
  @media (max-width: 700px) {
    .left {
      width: 100%;
    }
  }
}
</style>
