<script setup lang="ts">
import { ref } from 'vue'
import {
  Subtract16Regular,
  Maximize16Regular,
  Window16Regular,
  Dismiss16Regular
} from '@vicons/fluent'
// preload 以 contextBridge 暴露的 window.electron（页面内直接写作 electron）
declare const electron: {
  minimize: () => void
  toggleMaximize: () => void
  close: () => void
  onWindowState: (listener: (maximized: boolean) => void) => () => void
}

// 默认窗口状态
const defaultWindowState = ref(false)

// 窗口最小化
const windowMin = (): void => {
  electron.minimize()
}

// 窗口最大化或恢复
const maxOrRestore = (): void => {
  electron.toggleMaximize()
}

// 窗口关闭
const winClose = (): void => {
  electron.close()
}

// 窗口状态响应
if (typeof electron !== 'undefined') {
  electron.onWindowState((maximized) => {
    defaultWindowState.value = maximized
  })
}
</script>

<template>
  <div id="electron-bar" class="title-bar">
    <n-divider vertical />
    <n-button
      :focusable="false"
      class="bar-icon"
      tag="div"
      style="margin-left: 0"
      quaternary
      circle
      @click="windowMin"
    >
      <template #icon>
        <n-icon :depth="2">
          <Subtract16Regular />
        </n-icon>
      </template>
    </n-button>
    <n-button :focusable="false" class="bar-icon" tag="div" quaternary circle @click="maxOrRestore">
      <template #icon>
        <n-icon :depth="2">
          <Maximize16Regular v-if="defaultWindowState" />
          <Window16Regular v-else />
        </n-icon>
      </template>
    </n-button>
    <n-button :focusable="false" class="bar-icon" tag="div" quaternary circle @click="winClose">
      <template #icon>
        <n-icon :depth="2">
          <Dismiss16Regular />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<style scoped lang="scss">
.title-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-app-region: no-drag;
  .n-divider {
    margin-left: 16px;
  }
  .bar-icon {
    margin-left: 8px;
  }
}
.close-tip {
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
