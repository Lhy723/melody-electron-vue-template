<script setup lang="ts">
// 演示区块卡片：统一标题、说明与内容区
defineProps<{
  // 区块标题
  title: string
  // 一句话说明
  description?: string
}>()
</script>

<template>
  <n-card class="demo-section" :title="title" embedded>
    <template #header-extra>
      <n-text depth="3" class="demo-section-tag">示例</n-text>
    </template>
    <n-p v-if="description" depth="3" class="demo-section-desc selectable">
      {{ description }}
    </n-p>
    <div class="demo-section-body">
      <slot />
    </div>
  </n-card>
</template>

<style lang="scss" scoped>
.demo-section {
  border-radius: 12px;
  .demo-section-tag {
    font-size: 12px;
  }
  .demo-section-desc {
    margin-bottom: 16px;
  }
  .demo-section-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .selectable {
      user-select: text !important;
    }
  }
}
</style>
