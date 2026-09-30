<script setup>
import { storeToRefs } from 'pinia'
import { useRouter, RouterLink } from 'vue-router'
import { Home16Regular, Settings16Regular } from '@vicons/fluent'
import { appStatus, musicData, appSettings } from '@renderer/stores'
import { computed, h, ref } from 'vue'

const router = useRouter()
const music = musicData()
const status = appStatus()
const settings = appSettings()
const { siderShowCover } = storeToRefs(settings)
const { asideMenuCollapsed, showSider, showFullPlayer, playIndex, playMode, playHeartbeatMode } =
  storeToRefs(status)
const { playList, playListOld, playSongData, privateFmSong } = storeToRefs(music)

// 子组件
const coverDropdownRef = ref(null)
const createPlaylistRef = ref(null)

// 菜单数据
const mainMenuRef = ref(null)
const menuActiveKey = ref(router.currentRoute.value.name ?? 'home')
const menuOptions = computed(() => [
  {
    type: 'group',
    label: '选项',
    key: 'option',
    children: []
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'home'
          }
        },
        () => ['本地音乐']
      ),
    key: 'home',
    icon: () => h(Home16Regular)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'settings'
          }
        },
        () => ['设置']
      ),
    key: 'settings',
    icon: () => h(Settings16Regular)
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
    :class="['main-menu', { cover: siderShowCover }]"
    :collapsed="asideMenuCollapsed.value"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :default-expanded-keys="['user-playlists', 'favorite-playlists']"
    :indent="0"
    :options="menuOptions"
    :root-indent="showSider ? 36 : 26"
    @contextmenu.stop
    @update:value="checkMenuItem"
  />
</template>

<style lang="scss" scoped></style>
