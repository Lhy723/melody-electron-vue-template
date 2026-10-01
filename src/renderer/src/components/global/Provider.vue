<script setup lang="ts">
import type { GlobalTheme } from 'naive-ui'

// 模板全局 Provider：主题与字重配置
defineProps({
  // Naive UI 主题对象：null 为浅色，darkTheme 为深色
  theme: {
    type: Object as () => GlobalTheme | null,
    default: null
  }
})
</script>

<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="{ common: { fontWeightStrong: '1000' } }"
    abstract
  >
    <n-global-style />
    <slot />
  </n-config-provider>
</template>
