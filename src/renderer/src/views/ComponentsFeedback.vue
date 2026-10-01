<script setup>
// 反馈交互演示：Modal / Drawer / Message / Notification / Progress
import { ref } from 'vue'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'

const message = useMessage()
const dialog = useDialog()
const notification = useNotification()

// 模态框
const showModal = ref(false)
const showPresetModal = ref(false)

// 抽屉
const showDrawer = ref(false)
const drawerPlacement = ref('right')
const openDrawer = (placement) => {
  drawerPlacement.value = placement
  showDrawer.value = true
}

// 进度条
const progressValue = ref(65)

// 消息提示
const notifyTypes = ['info', 'success', 'warning', 'error']
const sendMessage = (type) => {
  message[type](`这是一条 ${type} 消息`)
}

// 对话框
const confirmDialog = () => {
  dialog.warning({
    title: '确认操作',
    content: '这是一个确认对话框示例，点击确定后关闭。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success('已确认')
    }
  })
}

// 通知
const pushNotification = (type) => {
  notification[type]({
    title: `${type} 通知`,
    content: '这是一条桌面风格的通知示例，可自动关闭。',
    duration: 3000
  })
}
</script>

<template>
  <div class="feedback-demo">
    <DemoPageHeader
      title="反馈交互"
      description="从轻量 message 到阻断式 modal，演示桌面应用常见的用户反馈形态；全部通过 Naive UI 的 Provider API 调用。"
    />
    <!-- 消息 -->
    <DemoSection title="消息 Message" description="轻量、自动消失的操作结果反馈。">
      <n-flex :size="12" wrap>
        <n-button v-for="type in notifyTypes" :key="type" :type="type" secondary @click="sendMessage(type)">
          {{ type }}
        </n-button>
      </n-flex>
    </DemoSection>
    <!-- 模态框 -->
    <DemoSection
      title="模态框 Modal"
      description="左侧为受控组件式 Modal，右侧为命令式确认对话框。"
    >
      <n-flex :size="12" wrap>
        <n-button type="primary" @click="showModal = true">打开 Modal</n-button>
        <n-button type="primary" secondary @click="showPresetModal = true">预设内容 Modal</n-button>
        <n-button type="warning" secondary @click="confirmDialog">确认对话框</n-button>
      </n-flex>
    </DemoSection>
    <!-- 抽屉 -->
    <DemoSection
      title="抽屉 Drawer"
      description="从四个方向滑出的面板，适合放设置、详情等次级内容。"
    >
      <n-flex :size="12" wrap>
        <n-button v-for="placement in ['right', 'left', 'top', 'bottom']" :key="placement" @click="openDrawer(placement)">
          {{ placement }}
        </n-button>
      </n-flex>
    </DemoSection>
    <!-- 通知 -->
    <DemoSection title="通知 Notification" description="右上角弹出，比 message 更醒目，适合异步结果。">
      <n-flex :size="12" wrap>
        <n-button v-for="type in notifyTypes" :key="type" :type="type" quaternary @click="pushNotification(type)">
          {{ type }} 通知
        </n-button>
      </n-flex>
    </DemoSection>
    <!-- 进度 -->
    <DemoSection title="进度 Progress" description="线性与环形进度，数值可交互调整。">
      <n-slider v-model:value="progressValue" :step="5" style="max-width: 420px" />
      <n-flex :size="40" align="center" wrap>
        <n-progress type="line" :percentage="progressValue" indicator-placement="inside" style="max-width: 420px" />
        <n-progress type="circle" :percentage="progressValue" />
      </n-flex>
    </DemoSection>

    <!-- 受控 Modal -->
    <n-modal v-model:show="showModal" preset="card" title="受控 Modal" style="width: 480px">
      <n-p depth="2">通过 v-model:show 控制显隐的模态框，可在内部放置表单或任意内容。</n-p>
      <template #footer>
        <n-flex justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="((showModal = false), message.success('已保存'))">保存</n-button>
        </n-flex>
      </template>
    </n-modal>
    <!-- 预设 Modal -->
    <n-modal v-model:show="showPresetModal" preset="dialog" title="预设内容" positive-text="好的">
      这是使用 preset="dialog" 的快速确认框。
    </n-modal>
    <!-- 抽屉面板 -->
    <n-drawer v-model:show="showDrawer" :placement="drawerPlacement" :width="360" :height="280">
      <n-drawer-content :title="`来自 ${drawerPlacement} 的抽屉`" closable>
        <n-p depth="2 selectable">抽屉内容区域，可滚动，用于承载次级操作或详情信息。</n-p>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style lang="scss" scoped>
.feedback-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
