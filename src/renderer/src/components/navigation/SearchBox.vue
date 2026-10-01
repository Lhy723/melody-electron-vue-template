<!--搜索框-->
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Search16Regular } from '@vicons/fluent'
import { appStatus } from '@renderer/stores'

const status = appStatus()
const { searchInputFocus } = storeToRefs(status)

// 搜索框数据（模板占位：在此接入你的搜索逻辑）
const searchInpRef = ref(null)
const searchInputValue = ref('')
const searchPlaceholder = ref('搜索')

// 搜索框输入限制
const noSideSpace = (value) => !value.startsWith(' ')
// 搜索框 聚焦
const searchInputToFocus = () => {
  searchInpRef.value?.focus()
  searchInputFocus.value = true
}
// 搜索框 取消聚焦
const closeSearch = () => {
  searchInputFocus.value = false
  searchInpRef.value?.blur()
}
// 前往搜索（模板占位：接入你的业务路由或接口）
const toSearch = (val) => {
  const keyword = val?.trim()
  if (!keyword) return
  closeSearch()
  searchInputValue.value = ''
}
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
