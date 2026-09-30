<!--搜索框-->
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Search16Regular } from '@vicons/fluent'
import { appStatus, musicData } from '@renderer/stores'

const router = useRouter()
const music = musicData()
const status = appStatus()
const { playSongData } = storeToRefs(music)
const { searchInputFocus } = storeToRefs(status)

// 搜索框数据
const searchInpRef = ref(null)
const searchInputValue = ref('')
const searchInterval = ref(null)
const searchRealkeyword = ref(null)
const searchPlaceholder = ref('搜索音乐')

// 搜索框输入限制
const noSideSpace = (value) => !value.startsWith(' ')
// 搜索框 聚焦
const searchInputToFocus = () => {
  searchInpRef.value?.focus()
  searchInputFocus.value = true
}
// 搜索框 取消聚焦
const closeSearch = () => {
  // 取消聚焦状态
  status.searchInputFocus = false
  searchInpRef.value?.blur()
}
// 更换搜索框关键词
const updatePlaceholder = async () => {
  searchPlaceholder.value = '搜索音乐'
}
// 更新搜索框关键词
const changePlaceholder = () => {
  updatePlaceholder()
  // 5分钟
  searchInterval.value = setInterval(updatePlaceholder, 5 * 60 * 1000)
}

// 前往搜索
const toSearch = (val) => {
  // 未输入内容且不存在推荐
  if (!val && searchPlaceholder.value === '搜索音乐') return false
  // 取消聚焦状态
  closeSearch()
  // 触发测试
  if (Number(val) === 114514) return router.push('/test')
  // 写入搜索历史

  // 前往
  router.push({
    path: '/search/songs',
    query: {
      keywords: val?.trim()
    }
  })
}
onMounted(() => {
  changePlaceholder()
})

onBeforeUnmount(() => {
  clearInterval(searchInterval.value)
})
</script>

<template>
  <div class="search-input">
    <n-input
      ref="searchInpRef"
      v-model:value="searchInputValue"
      :class="searchInputFocus ? 'input focus' : 'input'"
      :input-props="{ autoComplete: false }"
      :placeholder="searchPlaceholder"
      :allow-input="noSideSpace"
      round
      clearable
      @focus="searchInputToFocus"
      @keyup.enter="toSearch(searchInputValue)"
      @click.stop
    >
      <template #prefix>
        <n-icon>
          <Search16Regular />
        </n-icon>
      </template>
    </n-input>
    <!-- 搜索框遮罩 -->
    <Transition name="fade" mode="out-in">
      <div v-show="searchInputFocus" class="search-mask" @click.stop="searchInputFocus = false" />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.search-input {
  position: relative;
  -webkit-app-region: no-drag;
  .input {
    width: 200px;
    z-index: 11;
    transition: width 0.3s;
    &.focus {
      width: 300px;
    }
  }
  .search-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: #00000040;
    backdrop-filter: blur(20px);
    -webkit-app-region: no-drag;
  }
  @media (max-width: 700px) {
    width: 100%;
    margin-right: 12px;
    .input {
      width: 100%;
      &.focus {
        width: 100%;
      }
    }
  }
  @media (max-width: 512px) {
    .search-mask {
      background-color: transparent;
      backdrop-filter: blur(0);
    }
  }
}
</style>
