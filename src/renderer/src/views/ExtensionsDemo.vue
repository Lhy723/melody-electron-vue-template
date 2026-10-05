<script setup lang="ts">
// 扩展库示例：@vueuse/core 与 ECharts——与 Naive UI 互补的场景库
import { computed, ref } from 'vue'
import { useOsTheme } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useClipboard, useMouse, useOnline } from '@vueuse/core'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import '@renderer/utils/echarts'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'
import { appSettings } from '@renderer/stores'

const settings = appSettings()
const { themeType, themeAuto } = storeToRefs(settings)
const osTheme = useOsTheme()

// 当前是否深色：手动优先，跟随系统时读取 OS——与 App.vue 的主题逻辑保持一致
const isDark = computed(() => {
  const base = themeAuto.value ? osTheme.value : themeType.value
  return base === 'dark'
})
const chartTheme = computed(() => (isDark.value ? 'dark' : undefined))

// ===== 剪贴板 =====
const clipText = ref('复制这段文案试试')
const { copy, copied } = useClipboard({ copiedDuring: 1500 })
const doCopy = () => {
  void copy(clipText.value)
}

// ===== 在线状态 =====
const isOnline = useOnline()

// ===== 鼠标轨迹 =====
const { x, y } = useMouse()

// ===== 图表 mock 数据（全部本地模拟）=====
const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const lineOption: EChartsOption = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: weekLabels },
  yAxis: { type: 'value' },
  series: [
    {
      name: '模拟播放次数',
      type: 'line',
      smooth: true,
      areaStyle: {},
      data: [120, 200, 150, 80, 70, 110, 130]
    }
  ]
}

const barOption: EChartsOption = {
  tooltip: {},
  grid: { left: 40, right: 16, top: 30, bottom: 28 },
  xAxis: { type: 'category', data: ['v1.0.0', 'v1.0.1'] },
  yAxis: { type: 'value' },
  series: [{ name: '构建次数', type: 'bar', data: [6, 3], barWidth: '40%' }]
}

const pieOption: EChartsOption = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      name: '访问占比',
      type: 'pie',
      radius: ['42%', '68%'],
      data: [
        { value: 40, name: '基础组件' },
        { value: 25, name: '桌面能力' },
        { value: 20, name: '反馈交互' },
        { value: 15, name: '其他' }
      ]
    }
  ]
}
</script>

<template>
  <div class="extensions-demo">
    <DemoPageHeader
      title="扩展库示例"
      description="两个与 Naive UI 互补的场景库：@vueuse/core（无头组合式工具集）与 ECharts（图表）。均为可选依赖，扩展者按需引入。"
    />
    <!-- VueUse -->
    <DemoSection
      title="剪贴板 Clipboard"
      description="useClipboard 一行接入系统剪贴板，copied 状态自动在复制后短暂置真。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-input v-model:value="clipText" style="max-width: 320px" />
        <n-button type="primary" secondary @click="doCopy">
          {{ copied ? '已复制 ✓' : '复制' }}
        </n-button>
      </n-flex>
    </DemoSection>
    <DemoSection
      title="在线状态 Online"
      description="useOnline 响应系统网络变化，适合桌面应用的离线降级提示。"
    >
      <n-flex :size="12" align="center">
        <n-tag :type="isOnline ? 'success' : 'error'" round>
          {{ isOnline ? '在线' : '离线' }}
        </n-tag>
        <n-text depth="3" class="selectable">断开网络试试，状态会实时变化。</n-text>
      </n-flex>
    </DemoSection>
    <DemoSection
      title="鼠标轨迹 Mouse"
      description="useMouse 返回实时坐标（已节流），常用于自定义拖拽与画板场景。"
    >
      <n-text code selectable>X: {{ Math.round(x) }} · Y: {{ Math.round(y) }}</n-text>
    </DemoSection>
    <!-- ECharts -->
    <DemoSection
      title="折线图 Line"
      description="vue-echarts 按需注册（仅折线 / 柱状 / 饼图 + Canvas 渲染器），随明暗主题自动切换配色。"
    >
      <VChart :option="lineOption" :theme="chartTheme" autoresize style="height: 300px" />
    </DemoSection>
    <n-grid :x-gap="16" :y-gap="16" cols="1 m:2" responsive="screen">
      <n-grid-item>
        <DemoSection title="柱状图 Bar" description="版本构建次数（本地模拟数据）。">
          <VChart :option="barOption" :theme="chartTheme" autoresize style="height: 280px" />
        </DemoSection>
      </n-grid-item>
      <n-grid-item>
        <DemoSection title="饼图 Pie" description="环形图示例，图例置于底部。">
          <VChart :option="pieOption" :theme="chartTheme" autoresize style="height: 280px" />
        </DemoSection>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.extensions-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
