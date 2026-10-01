<script setup>
import { storeToRefs } from 'pinia'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  Home16Regular,
  Settings16Regular,
  Grid16Regular,
  CheckboxChecked16Regular,
  ChatMultiple16Regular,
  List16Regular,
  Desktop16Regular
} from '@vicons/fluent'
import { computed, h, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const menuActiveKey = ref(route.name ?? 'home')

// 路由变化时同步菜单高亮（覆盖菜单外的编程式跳转）
watch(
  () => route.name,
  (name) => {
    if (name && name !== menuActiveKey.value) menuActiveKey.value = name
  }
)

// 菜单数据
const mainMenuRef = ref(null)
const menuOptions = computed(() => [
  {
    type: 'group',
    label: '模板',
    key: 'template',
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'home' }
            },
            () => ['主页']
          ),
        key: 'home',
        icon: () => h(Home16Regular)
      }
    ]
  },
  {
    type: 'group',
    label: '组件展示',
    key: 'components',
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'components-basic' }
            },
            () => ['基础组件']
          ),
        key: 'components-basic',
        icon: () => h(Grid16Regular)
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'components-form' }
            },
            () => ['表单校验']
          ),
        key: 'components-form',
        icon: () => h(CheckboxChecked16Regular)
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'components-feedback' }
            },
            () => ['反馈交互']
          ),
        key: 'components-feedback',
        icon: () => h(ChatMultiple16Regular)
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'components-navigation' }
            },
            () => ['导航结构']
          ),
        key: 'components-navigation',
        icon: () => h(List16Regular)
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'components-window' }
            },
            () => ['窗口与主题']
          ),
        key: 'components-window',
        icon: () => h(Desktop16Regular)
      }
    ]
  },
  {
    type: 'group',
    label: '偏好',
    key: 'preference',
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: 'settings' }
            },
            () => ['设置']
          ),
        key: 'settings',
        icon: () => h(Settings16Regular)
      }
    ]
  }
])
const checkMenuItem = async (key) => {
  menuActiveKey.value = key
  mainMenuRef.value?.showOption(key)
}
</script>

<template>
  <n-menu
    ref="mainMenuRef"
    v-model:value="menuActiveKey"
    class="main-menu"
    :collapsed="asideMenuCollapsed"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :indent="0"
    :options="menuOptions"
    :root-indent="36"
    @contextmenu.stop
    @update:value="checkMenuItem"
  />
</template>

<style lang="scss" scoped>
.main-menu {
  padding-bottom: 12px;
}
</style>
