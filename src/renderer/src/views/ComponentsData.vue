<script setup lang="ts">
// 数据进阶演示：日期时间 / 级联树形 / 上传取色 / 列表统计
import { ref } from 'vue'
import type { CascaderOption, TreeSelectOption, UploadFileInfo } from 'naive-ui'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'

/* ---------- 日期与时间 ---------- */
// n-date-picker / n-time-picker 的绑定值均为毫秒时间戳
const dateValue = ref<number | null>(null)
const timeValue = ref<number | null>(null)

const fmtDate = (v: number | null) => (v === null ? '未选择' : new Date(v).toLocaleDateString('zh-CN'))
const fmtTime = (v: number | null) => (v === null ? '未选择' : new Date(v).toLocaleTimeString('zh-CN'))

/* ---------- 级联与树形选择 ---------- */
const regionValue = ref<string | number | null>(null)
const componentValue = ref<string | number | null>(null)

// 三级省市区模拟数据
const regionOptions: CascaderOption[] = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
        children: [
          { label: '天河区', value: 'tianhe' },
          { label: '越秀区', value: 'yuexiu' },
          { label: '海珠区', value: 'haizhu' }
        ]
      },
      {
        label: '深圳市',
        value: 'shenzhen',
        children: [
          { label: '南山区', value: 'nanshan' },
          { label: '福田区', value: 'futian' }
        ]
      }
    ]
  },
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' }
        ]
      }
    ]
  }
]

// 两层树数据
const treeOptions: TreeSelectOption[] = [
  {
    key: 'ui',
    label: '界面组件',
    children: [
      { key: 'ui-button', label: '按钮 Button' },
      { key: 'ui-input', label: '输入 Input' },
      { key: 'ui-select', label: '选择 Select' }
    ]
  },
  {
    key: 'data',
    label: '数据组件',
    children: [
      { key: 'data-table', label: '表格 Table' },
      { key: 'data-list', label: '列表 List' },
      { key: 'data-statistic', label: '统计 Statistic' }
    ]
  }
]

/* ---------- 上传与取色 ---------- */
// 手动上传模式：只收集文件，不发起任何请求
const uploadFiles = ref<UploadFileInfo[]>([])
const colorValue = ref('#18A058FF')

/* ---------- 列表与统计 ---------- */
interface DemoThingItem {
  tag: string
  title: string
  description: string
}

const listItems: DemoThingItem[] = [
  {
    tag: '录入',
    title: '基础与表单',
    description: '按钮、输入、选择、校验等录入类组件，见「基础组件」与「表单校验」演示页。'
  },
  {
    tag: '交互',
    title: '反馈与导航',
    description: '消息、模态框、抽屉与菜单、标签页等交互骨架，见「反馈交互」「导航结构」演示页。'
  },
  {
    tag: '展示',
    title: '数据与可视化',
    description: '表格、列表、统计数字等展示型组件，本页即其进阶演示，全部本地模拟无网络请求。'
  }
]
</script>

<template>
  <div class="data-demo">
    <DemoPageHeader
      title="数据进阶"
      description="Naive UI 数据录入与展示的进阶演示：日期时间选择、级联与树形选择、上传与取色、列表与统计；全部为本地模拟数据，交互结果实时回显。"
    />
    <!-- 日期与时间 -->
    <DemoSection
      title="日期与时间"
      description="n-date-picker 与 n-time-picker 的绑定值都是毫秒时间戳（number | null），下方实时回显。"
    >
      <n-grid :x-gap="16" :y-gap="12" cols="1 m:2" responsive="screen">
        <n-grid-item>
          <n-date-picker v-model:value="dateValue" type="date" clearable placeholder="选择日期" />
        </n-grid-item>
        <n-grid-item>
          <n-time-picker v-model:value="timeValue" clearable placeholder="选择时间" />
        </n-grid-item>
      </n-grid>
      <n-flex :size="24" align="center" wrap>
        <n-text depth="2">日期绑定值：{{ fmtDate(dateValue) }}</n-text>
        <n-text depth="2">时间绑定值：{{ fmtTime(timeValue) }}</n-text>
      </n-flex>
    </DemoSection>
    <!-- 级联与树形选择 -->
    <DemoSection
      title="级联与树形选择"
      description="n-cascader 使用三级省市区数据，n-tree-select 使用两层树数据；选项均为本地常量。"
    >
      <n-grid :x-gap="16" :y-gap="12" cols="1 m:2" responsive="screen">
        <n-grid-item>
          <n-cascader
            v-model:value="regionValue"
            :options="regionOptions"
            clearable
            placeholder="选择省 / 市 / 区"
          />
        </n-grid-item>
        <n-grid-item>
          <n-tree-select
            v-model:value="componentValue"
            :options="treeOptions"
            default-expand-all
            clearable
            placeholder="选择组件分类"
          />
        </n-grid-item>
      </n-grid>
      <n-flex :size="24" align="center" wrap>
        <n-text depth="2">级联绑定值：{{ regionValue ?? '未选择' }}</n-text>
        <n-text depth="2">树形绑定值：{{ componentValue ?? '未选择' }}</n-text>
      </n-flex>
    </DemoSection>
    <!-- 上传与取色 -->
    <DemoSection
      title="上传与取色"
      description="n-upload 为手动上传模式（default-upload=false，action 仅为占位），只收集文件列表不发起请求；n-color-picker 实时回显所选色值。"
    >
      <n-grid :x-gap="16" :y-gap="12" cols="1 m:2" responsive="screen">
        <n-grid-item>
          <n-upload
            v-model:file-list="uploadFiles"
            action="#"
            :default-upload="false"
            :max="3"
          >
            <n-button>选择文件（最多 3 个）</n-button>
          </n-upload>
        </n-grid-item>
        <n-grid-item>
          <n-color-picker v-model:value="colorValue" :modes="['hex']" :show-alpha="true" />
        </n-grid-item>
      </n-grid>
      <n-flex :size="24" align="center" wrap>
        <n-text depth="2">
          已选 {{ uploadFiles.length }}/3 个文件
          <template v-if="uploadFiles.length">：{{ uploadFiles.map((f) => f.name).join('、') }}</template>
        </n-text>
        <n-flex :size="8" align="center">
          <span class="color-chip" :style="{ backgroundColor: colorValue }" />
          <n-text depth="2">色值：{{ colorValue }}</n-text>
        </n-flex>
      </n-flex>
    </DemoSection>
    <!-- 列表与统计 -->
    <DemoSection
      title="列表与统计"
      description="n-list + n-thing 以「标题 + 描述」组织条目，n-statistic 呈现关键数字，n-number-animation 提供入场滚动动画。"
    >
      <n-list bordered hoverable>
        <n-list-item v-for="item in listItems" :key="item.title">
          <n-thing :title="item.title" :description="item.description">
            <template #header-extra>
              <n-tag size="small" :bordered="false">{{ item.tag }}</n-tag>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
      <n-flex :size="40" align="center" wrap>
        <n-statistic label="组件总数" value="50+" />
        <n-statistic label="演示页" :value="8" />
        <n-statistic label="测试用例" :value="18" />
        <n-statistic label="数字动画">
          <n-number-animation :from="0" :to="1024" show-separator />
        </n-statistic>
      </n-flex>
    </DemoSection>
  </div>
</template>

<style lang="scss" scoped>
.data-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .color-chip {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid rgba(128, 128, 128, 0.35);
  }
}
</style>
