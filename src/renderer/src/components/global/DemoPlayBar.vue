<script setup lang="ts">
// 模板演示底栏：桌面应用常驻播放条的布局范例（不接音频，纯演示数据）
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Play16Regular,
  Pause16Regular,
  Next16Regular,
  Previous16Regular,
  Speaker116Regular,
  SpeakerMute16Regular,
  MusicNote216Regular
} from '@vicons/fluent'
import { useThemeVars } from 'naive-ui'
import { appStatus } from '@renderer/stores'

const status = appStatus()
const { playState, playSeek } = storeToRefs(status)

// 主题变量：底栏背景与边框跟随明暗主题
const themeVars = useThemeVars()
const barStyle = computed(() => ({
  backgroundColor: themeVars.value.cardColor,
  borderTopColor: themeVars.value.borderColor
}))
const coverStyle = computed(() => ({
  backgroundColor: themeVars.value.actionColor
}))

// 演示曲目数据
const demoSong = {
  name: '示例曲目 · Star Melody',
  artist: '模板演示'
}

// 模拟播放时长（秒）
const duration = ref(180)
const volume = ref(0.7)
const muted = ref(false)

// 播放进度：走 appStatus 的 playSeek（0-1），播放时定时推进
let timer: ReturnType<typeof setInterval> | null = null
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
onMounted(() => {
  timer = setInterval(() => {
    if (!playState.value) return
    playSeek.value = (playSeek.value + 0.1 / duration.value) % 1
  }, 100)
})
onBeforeUnmount(stopTimer)

// 时间格式化
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// 当前时间与进度
const currentTime = computed(() => playSeek.value * duration.value)
const progressPercent = computed(() => Math.round(playSeek.value * 100))

// 进度拖动
const seekTo = (value: number) => {
  playSeek.value = value / 100
}

// 切换播放
const togglePlay = () => {
  playState.value = !playState.value
}

// 音量
const toggleMute = () => {
  muted.value = !muted.value
}
</script>

<template>
  <footer id="demo-play-bar" class="demo-play-bar" :style="barStyle">
    <div class="bar-inner">
      <div class="left">
        <!-- 曲目信息 -->
        <n-icon :size="34" class="song-cover" :style="coverStyle">
          <MusicNote216Regular />
        </n-icon>
        <div class="song-info">
          <n-text class="song-name">{{ demoSong.name }}</n-text>
          <n-text depth="3" class="song-artist">{{ demoSong.artist }}</n-text>
        </div>
      </div>
      <!-- 播放控制 -->
      <div class="center">
        <n-flex :size="8" align="center" justify="center">
          <n-button :focusable="false" quaternary circle>
            <template #icon>
              <n-icon><Previous16Regular /></n-icon>
            </template>
          </n-button>
          <n-button :focusable="false" type="primary" circle @click="togglePlay">
            <template #icon>
              <n-icon :size="18">
                <Play16Regular v-if="!playState" />
                <Pause16Regular v-else />
              </n-icon>
            </template>
          </n-button>
          <n-button :focusable="false" quaternary circle>
            <template #icon>
              <n-icon><Next16Regular /></n-icon>
            </template>
          </n-button>
        </n-flex>
        <!-- 进度条 -->
        <n-flex :size="10" align="center" class="progress-row">
          <n-text depth="3" class="time-text">{{ formatTime(currentTime) }}</n-text>
          <n-slider
            class="progress-slider"
            :value="progressPercent"
            :tooltip="false"
            :format-tooltip="(v) => `${v}%`"
            @update:value="seekTo"
          />
          <n-text depth="3" class="time-text">{{ formatTime(duration) }}</n-text>
        </n-flex>
      </div>
      <!-- 音量 -->
      <div class="right">
        <n-button :focusable="false" quaternary circle @click="toggleMute">
          <template #icon>
            <n-icon>
              <SpeakerMute16Regular v-if="muted" />
              <Speaker116Regular v-else />
            </n-icon>
          </template>
        </n-button>
        <n-slider
          class="volume-slider"
          v-model:value="volume"
          :disabled="muted"
          :tooltip="false"
          :format-tooltip="(v) => `${v}%`"
        />
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
// 背景色与边框色由 useThemeVars 内联绑定，跟随明暗主题
.demo-play-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 100;
  border-top: 1px solid;
  .bar-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: 240px;
    min-width: 200px;
    .song-cover {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 8px;
    }
    .song-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
      .song-name,
      .song-artist {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .song-artist {
        font-size: 12px;
      }
    }
  }
  .center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    max-width: 620px;
    .progress-row {
      width: 100%;
      .progress-slider {
        flex: 1;
      }
      .time-text {
        font-size: 12px;
        font-variant-numeric: tabular-nums;
        min-width: 40px;
        text-align: center;
      }
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: 200px;
    min-width: 160px;
    justify-content: flex-end;
    .volume-slider {
      width: 100px;
    }
  }
}
</style>
