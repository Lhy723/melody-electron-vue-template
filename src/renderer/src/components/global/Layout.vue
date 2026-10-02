<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { appSettings } from '@renderer/stores'

const settings = appSettings()
const { showSider } = storeToRefs(settings)
</script>

<template>
  <main id="main-layout" :class="['main-layout', { 'no-sider': !showSider }]">
    <!-- 路由页面 -->
    <router-view v-slot="{ Component }" class="main-router">
      <keep-alive>
        <Transition name="router" mode="out-in">
          <component :is="Component" />
        </Transition>
      </keep-alive>
    </router-view>
  </main>
</template>

<style scoped lang="scss">
.main-layout {
  padding: 24px;
  &.no-sider {
    padding: 0;
    background-color: var(--n-color);
    .main-router {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px 10vw;
      @media (max-width: 1200px) {
        padding: 24px 5vw;
      }
    }
  }
}
</style>
