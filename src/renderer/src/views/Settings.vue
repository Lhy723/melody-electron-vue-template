<script setup lang="ts">
// 模板设置页：外观与布局偏好的持久化示例
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { SelectOption } from 'naive-ui'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'
import { appStatus, appSettings } from '@renderer/stores'

// 主题选项值类型：dark / light / auto
type ThemeOptionValue = 'dark' | 'light' | 'auto'

// 主题选项类型
interface ThemeOption {
  label: string
  value: ThemeOptionValue
}

const status = appStatus()
const settings = appSettings()
const { asideMenuCollapsed, showPlayBar } = storeToRefs(status)
const { showSider, siderShowCover, themeType, themeAuto, loadSize, systemFonts } =
  storeToRefs(settings)

const themeOptions: ThemeOption[] = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'auto' }
]
const currentThemeValue = computed<ThemeOptionValue>(
  () => (themeAuto.value ? 'auto' : themeType.value)
)
const setTheme = (value: ThemeOptionValue): void => {
  if (value === 'auto') {
    themeAuto.value = true
  } else {
    themeAuto.value = false
    themeType.value = value
  }
}

const fontOptions: SelectOption[] = ['HarmonyOS Sans', 'Lato', 'Fira Code', 'system-ui'].map(
  (f) => ({
    label: f,
    value: f
  })
)
</script>

<template>
  <div class="settings-page">
    <DemoPageHeader
      title="模板设置"
      description="所有开关都写入 Pinia store 并持久化到 localStorage，是模板偏好设置的完整示例。"
    />
    <n-grid :x-gap="16" :y-gap="16" cols="1 l:2" responsive="screen">
      <!-- 外观 -->
      <n-grid-item>
        <DemoSection title="外观" description="主题与字体的全局偏好。">
          <n-form label-placement="left" label-width="90">
            <n-form-item label="主题">
              <n-radio-group :value="currentThemeValue" @update:value="setTheme">
                <n-radio-button v-for="opt in themeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </n-radio-button>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="界面字体">
              <n-select v-model:value="systemFonts" :options="fontOptions" />
            </n-form-item>
          </n-form>
        </DemoSection>
      </n-grid-item>
      <!-- 布局 -->
      <n-grid-item>
        <DemoSection title="布局" description="直接控制模板骨架的可见区域。">
          <n-flex vertical :size="16">
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
      </n-grid-item>
      <!-- 行为 -->
      <n-grid-item :span="2">
        <DemoSection title="数据行为" description="每页加载数量是业务侧常用的列表参数示例。">
          <n-form label-placement="left" label-width="120" style="max-width: 420px">
            <n-form-item label="每页加载数量">
              <n-slider v-model:value="loadSize" :min="10" :max="100" :step="10" :mark="{ 10: '10', 50: '50', 100: '100' }" />
            </n-form-item>
          </n-form>
          <n-text depth="3" class="selectable">当前值：{{ loadSize }} 条 / 页（已持久化）</n-text>
        </DemoSection>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .selectable {
    user-select: text !important;
  }
}
</style>
