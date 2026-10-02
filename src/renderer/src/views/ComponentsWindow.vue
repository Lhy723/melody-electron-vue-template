<script setup lang="ts">
// 窗口与主题演示：窗口控制 / 主题切换 / 布局开关
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOsTheme } from 'naive-ui'
import {
  Subtract16Regular,
  Maximize16Regular,
  Window16Regular,
  Dismiss16Regular
} from '@vicons/fluent'
import { WeatherSunny16Regular, WeatherMoon16Regular } from '@vicons/fluent'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'
import { appStatus, appSettings } from '@renderer/stores'

// preload 以 contextBridge 暴露的 window.electron（页面内直接写作 electron）
declare const electron: {
  minimize: () => void
  toggleMaximize: () => void
  close: () => void
}

const status = appStatus()
const settings = appSettings()
const { asideMenuCollapsed, showPlayBar } = storeToRefs(status)
const { showSider, siderShowCover, themeType, themeAuto, closeTip, closeType } = storeToRefs(settings)

const osTheme = useOsTheme()

// 当前生效主题：手动优先，跟随系统时读 OS
const effectiveTheme = computed(() => {
  if (themeAuto.value) {
    return osTheme.value === 'dark' ? 'dark' : 'light'
  }
  return themeType.value
})

// 主题选项
const themeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'auto' }
]
const setTheme = (value: 'light' | 'dark' | 'auto') => {
  if (value === 'auto') {
    themeAuto.value = true
  } else {
    themeAuto.value = false
    themeType.value = value
  }
}
const currentThemeValue = computed(() => (themeAuto.value ? 'auto' : themeType.value))

// 窗口控制（走主进程 IPC）
const windowActions = [
  { key: 'min', label: '最小化', icon: Subtract16Regular, action: () => electron.minimize() },
  {
    key: 'max',
    label: '最大化 / 还原',
    icon: Maximize16Regular,
    action: () => electron.toggleMaximize()
  },
  { key: 'close', label: '关闭窗口', icon: Dismiss16Regular, action: () => electron.close() }
]
</script>

<template>
  <div class="window-demo">
    <DemoPageHeader
      title="窗口与主题"
      description="模板的桌面侧能力：自绘标题栏的窗口控制、明暗主题切换，以及由 Pinia 持久化的布局偏好。"
    />
    <!-- 窗口控制 -->
    <DemoSection
      title="窗口控制"
      description="无边框窗口的标题栏按钮，通过 preload 暴露的最小 IPC 通道控制主进程窗口。"
    >
      <n-flex :size="12" wrap>
        <n-button v-for="item in windowActions" :key="item.key" :focusable="false" secondary @click="item.action">
          <template #icon>
            <n-icon>
              <component :is="item.icon" />
            </n-icon>
          </template>
          {{ item.label }}
        </n-button>
      </n-flex>
      <n-text depth="3" class="selectable">
        也可以直接点击右上角标题栏的
        <n-icon :size="14" style="vertical-align: -2px"><Window16Regular /></n-icon>
        图标按钮。
      </n-text>
    </DemoSection>
    <!-- 主题切换 -->
    <DemoSection
      title="明暗主题"
      description="切换后立即生效；选择「跟随系统」时与操作系统外观保持一致。偏好会被持久化。"
    >
      <n-flex :size="16" align="center" wrap>
        <n-radio-group :value="currentThemeValue" @update:value="setTheme">
          <n-radio-button v-for="opt in themeOptions" :key="opt.value" :value="opt.value">
            <n-flex :size="6" align="center">
              <n-icon :size="14">
                <WeatherSunny16Regular v-if="opt.value === 'light'" />
                <WeatherMoon16Regular v-else-if="opt.value === 'dark'" />
                <Desktop16Regular v-else />
              </n-icon>
              {{ opt.label }}
            </n-flex>
          </n-radio-button>
        </n-radio-group>
        <n-tag :type="effectiveTheme === 'dark' ? 'info' : 'warning'" size="small" round>
          当前生效：{{ effectiveTheme === 'dark' ? '深色' : '浅色' }}
        </n-tag>
      </n-flex>
    </DemoSection>
    <!-- 布局偏好 -->
    <DemoSection
      title="布局偏好"
      description="这些开关直接作用于本模板的真实布局：侧边栏显隐、菜单折叠、播放条显隐等。"
    >
      <n-flex :size="24" vertical>
        <n-flex :size="16" align="center">
          <n-switch v-model:value="showSider" size="small" />
          <n-text>显示侧边栏</n-text>
        </n-flex>
        <n-flex :size="16" align="center">
          <n-switch v-model:value="asideMenuCollapsed" size="small" />
          <n-text>折叠侧边菜单</n-text>
        </n-flex>
        <n-flex :size="16" align="center">
          <n-switch v-model:value="siderShowCover" size="small" />
          <n-text>侧边栏封面样式</n-text>
        </n-flex>
        <n-flex :size="16" align="center">
          <n-switch v-model:value="showPlayBar" size="small" />
          <n-text>显示底部播放条（占位）</n-text>
        </n-flex>
      </n-flex>
    </DemoSection>
    <!-- 持久化演示 -->
    <DemoSection
      title="设置持久化"
      description="appSettings store 通过 pinia-plugin-persistedstate 写入 localStorage，重启应用后仍保留。"
    >
      <n-flex :size="24" vertical>
        <n-flex :size="16" align="center">
          <n-switch v-model:value="closeTip" size="small" />
          <n-text>关闭窗口时弹出提醒</n-text>
        </n-flex>
        <n-form label-placement="left" label-width="90" style="max-width: 380px">
          <n-form-item label="关闭行为">
            <n-radio-group v-model:value="closeType">
              <n-radio value="close">直接关闭</n-radio>
              <n-radio value="hide">最小化到任务栏</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-form>
        <n-text depth="3" class="selectable">试着切换后重启应用，选择会被记住。</n-text>
      </n-flex>
    </DemoSection>
  </div>
</template>

<style lang="scss" scoped>
.window-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .selectable {
    user-select: text !important;
  }
}
</style>
