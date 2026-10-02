<script setup lang="ts">
// 导航结构演示：Tabs / Breadcrumb / Pagination / Steps / Collapse / Timeline
import { ref } from 'vue'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'
import { demoTabPanes, demoTimelineData } from '@renderer/utils/demoData'

// 分页
const page = ref(1)

// 步骤
const currentStep = ref(1)
const nextStep = () => {
  currentStep.value = Math.min(currentStep.value + 1, 3)
}

// 折叠
const expandedNames = ref<string[]>(['first'])

// 标签页
const activeTab = ref(demoTabPanes[0])
</script>

<template>
  <div class="navigation-demo">
    <DemoPageHeader
      title="导航结构"
      description="桌面应用里的内容分区与流程引导组件，可与侧边菜单、路由配合使用。"
    />
    <!-- 标签页 -->
    <DemoSection title="标签页 Tabs" description="同层内容的分区切换，支持胶囊与分段样式。">
      <n-tabs v-model:value="activeTab" type="line">
        <n-tab-pane v-for="pane in demoTabPanes" :key="pane" :name="pane" :tab="pane">
          <n-p depth="2" class="selectable">{{ pane }} 的内容区域，切换标签时保持各自状态。</n-p>
        </n-tab-pane>
      </n-tabs>
      <n-tabs type="segment" animated>
        <n-tab-pane name="seg1" tab="分段一">分段样式一</n-tab-pane>
        <n-tab-pane name="seg2" tab="分段二">分段样式二</n-tab-pane>
      </n-tabs>
    </DemoSection>
    <!-- 面包屑 -->
    <DemoSection title="面包屑 Breadcrumb" description="表达页面层级路径，可与路由联动。">
      <n-breadcrumb>
        <n-breadcrumb-item>模板</n-breadcrumb-item>
        <n-breadcrumb-item>导航结构</n-breadcrumb-item>
        <n-breadcrumb-item>面包屑</n-breadcrumb-item>
      </n-breadcrumb>
    </DemoSection>
    <!-- 分页 -->
    <DemoSection title="分页 Pagination" description="列表数据的分页控制，当前页受控展示。">
      <n-flex align="center" :size="16" wrap>
        <n-pagination v-model:page="page" :page-count="12" show-quick-jumper />
        <n-text depth="3">当前第 {{ page }} 页</n-text>
      </n-flex>
    </DemoSection>
    <!-- 步骤条 -->
    <DemoSection title="步骤条 Steps" description="引导用户完成多阶段流程，可点击推进。">
      <n-steps :current="currentStep" size="small">
        <n-step title="选择模板" description="确定基础布局" />
        <n-step title="调整组件" description="替换为业务内容" />
        <n-step title="打包发布" description="生成安装包" />
      </n-steps>
      <n-flex>
        <n-button size="small" secondary @click="currentStep = Math.max(currentStep - 1, 1)">上一步</n-button>
        <n-button size="small" type="primary" secondary @click="nextStep">下一步</n-button>
      </n-flex>
    </DemoSection>
    <!-- 折叠 -->
    <DemoSection title="折叠面板 Collapse" description="分区收纳长内容，手风琴模式可只展开一项。">
      <n-collapse v-model:expanded-names="expandedNames" accordion>
        <n-collapse-item title="什么是这个模板？" name="first">
          基于 electron-vite 的 Vue3 桌面应用骨架，内置无边框窗口与主题体系。
        </n-collapse-item>
        <n-collapse-item title="如何新增页面？" name="second">
          在 views 下新建组件，在 routes.js 注册路由，再往 Menu.vue 的菜单数据里加一项。
        </n-collapse-item>
        <n-collapse-item title="如何定制主题？" name="third">
          参考「窗口与主题」演示页，修改 ConfigProvider 的 themeOverrides。
        </n-collapse-item>
      </n-collapse>
    </DemoSection>
    <!-- 时间线 -->
    <DemoSection title="时间线 Timeline" description="按时间或阶段组织的事件列表。">
      <n-timeline>
        <n-timeline-item
          v-for="item in demoTimelineData"
          :key="item.title"
          :type="item.type"
          :title="item.title"
          :content="item.time"
        />
      </n-timeline>
    </DemoSection>
  </div>
</template>

<style lang="scss" scoped>
.navigation-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
