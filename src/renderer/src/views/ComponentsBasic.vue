<script setup lang="ts">
// 基础组件演示：按钮 / 输入 / 选择 / 数据展示 / 文件操作
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { FolderOpen16Regular, Save16Regular } from '@vicons/fluent'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'
import { demoTableColumns, demoTableData, demoSelectOptions } from '@renderer/utils/demoData'
import type { DemoTableRow } from '@renderer/utils/demoData'
import { useFileOps } from '@renderer/composables'

// 输入状态
const inputValue = ref('')
const textareaValue = ref('')
const selectValue = ref<string | null>(null)
const multipleSelectValue = ref<string[]>([])
const switchValue = ref(true)
const sliderValue = ref(30)
const rateValue = ref(3)

// 表格行
const rowKey = (row: DemoTableRow) => row.index

/* ---------- 文件操作（useFileOps 演示） ---------- */
const message = useMessage()
const { openTextFile, saveTextFile } = useFileOps()

// 打开文件结果
const openedFileName = ref('')
const openedFileContent = ref('')
const openingFile = ref(false)
const savingText = ref(false)

// IPC 异常统一转成可读文案
const errMsg = (err: unknown) => (err instanceof Error ? err.message : String(err ?? '未知错误'))

const openDemoFile = async () => {
  openingFile.value = true
  try {
    // 用户取消时 openTextFile 返回 null
    const res = await openTextFile()
    if (!res) {
      message.info('已取消选择文件')
      return
    }
    openedFileName.value = res.name || res.path || ''
    openedFileContent.value = res.content ?? ''
    message.success(`已打开：${openedFileName.value}`)
  } catch (err) {
    message.error(`打开文件失败：${errMsg(err)}`)
  } finally {
    openingFile.value = false
  }
}

const saveDemoText = async () => {
  savingText.value = true
  try {
    // 把上方多行文本另存为文件；用户取消时返回 null，成功返回保存路径
    const savedPath = await saveTextFile(textareaValue.value, 'demo.txt')
    if (savedPath === null) {
      message.info('已取消保存')
      return
    }
    message.success(`已保存到：${savedPath}`)
  } catch (err) {
    message.error(`保存文件失败：${errMsg(err)}`)
  } finally {
    savingText.value = false
  }
}
</script>

<template>
  <div class="basic-demo">
    <DemoPageHeader
      title="基础组件"
      description="展示 Naive UI 常用基础元素的状态与用法，均可直接交互：点击、输入、切换、拖动；另附 useFileOps 文件打开与保存演示。"
    />
    <!-- 按钮 -->
    <DemoSection
      title="按钮 Button"
      description="type 决定语义色，secondary / tertiary / quaternary 决定视觉强度，loading 与 disabled 是常用状态。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-button type="primary">主要按钮</n-button>
        <n-button type="info" secondary>次要按钮</n-button>
        <n-button tertiary>三级按钮</n-button>
        <n-button quaternary>四级按钮</n-button>
        <n-button dashed>虚线按钮</n-button>
        <n-button round>圆角按钮</n-button>
        <n-button circle type="primary">圆</n-button>
        <n-button type="primary" loading>加载中</n-button>
        <n-button disabled>禁用状态</n-button>
      </n-flex>
    </DemoSection>
    <!-- 输入 -->
    <DemoSection
      title="输入 Input"
      description="单行输入、多行文本与清空按钮；输入内容实时受控。"
    >
      <n-grid :x-gap="16" :y-gap="12" cols="1 m:2" responsive="screen">
        <n-grid-item>
          <n-input v-model:value="inputValue" clearable placeholder="请输入内容" />
        </n-grid-item>
        <n-grid-item>
          <n-input disabled placeholder="禁用状态的输入框" />
        </n-grid-item>
        <n-grid-item :span="2">
          <n-input
            v-model:value="textareaValue"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="多行文本，随内容自动伸缩"
          />
        </n-grid-item>
      </n-grid>
      <n-text v-if="inputValue" depth="2">你输入了：{{ inputValue }}</n-text>
    </DemoSection>
    <!-- 选择 -->
    <DemoSection
      title="选择 Select / Switch / Slider / Rate"
      description="从下拉选择到滑杆评分，覆盖常见取值控件；选项四为禁用示例。"
    >
      <n-grid :x-gap="16" :y-gap="12" cols="1 m:2" responsive="screen">
        <n-grid-item>
          <n-select v-model:value="selectValue" :options="demoSelectOptions" placeholder="单选" />
        </n-grid-item>
        <n-grid-item>
          <n-select
            v-model:value="multipleSelectValue"
            multiple
            :options="demoSelectOptions"
            placeholder="多选"
          />
        </n-grid-item>
        <n-grid-item>
          <n-flex :size="12" align="center">
            <n-switch v-model:value="switchValue" />
            <n-text depth="2">开关：{{ switchValue ? '开' : '关' }}</n-text>
          </n-flex>
        </n-grid-item>
        <n-grid-item>
          <n-slider v-model:value="sliderValue" :step="5" :mark="{ 0: '0', 100: '100' }" />
        </n-grid-item>
        <n-grid-item>
          <n-rate v-model:value="rateValue" allow-half />
        </n-grid-item>
      </n-grid>
    </DemoSection>
    <!-- 数据展示 -->
    <DemoSection
      title="数据展示 Card / Tag / Table"
      description="卡片承载区块，标签做状态标记，数据表格支持排序与分页。"
    >
      <n-data-table
        :columns="demoTableColumns"
        :data="demoTableData"
        :row-key="rowKey"
        :pagination="{ pageSize: 5 }"
        size="small"
        striped
      />
    </DemoSection>
    <!-- 文件操作 -->
    <DemoSection
      title="文件操作"
      description="通过组合式函数 useFileOps 调用主进程的原生文件对话框：打开文本文件回显内容，把上方多行文本另存到本地。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-button :loading="openingFile" :focusable="false" secondary @click="openDemoFile">
          <template #icon>
            <n-icon><FolderOpen16Regular /></n-icon>
          </template>
          打开文件
        </n-button>
        <n-button :loading="savingText" :focusable="false" secondary @click="saveDemoText">
          <template #icon>
            <n-icon><Save16Regular /></n-icon>
          </template>
          保存多行文本
        </n-button>
      </n-flex>
      <template v-if="openedFileName">
        <n-text depth="3">已打开：{{ openedFileName }}</n-text>
        <n-input :value="openedFileContent" type="textarea" :rows="4" readonly placeholder="文件内容" />
      </template>
      <n-text v-else depth="3">还没有打开文件，点击上方按钮试试。</n-text>
    </DemoSection>
  </div>
</template>

<style lang="scss" scoped>
.basic-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
