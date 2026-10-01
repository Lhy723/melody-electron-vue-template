<script setup>
// 演示页通用页头：标题 + 描述
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="demo-page-header">
    <n-h2 class="demo-title">{{ title }}</n-h2>
    <n-p v-if="description" depth="3" class="demo-desc selectable">{{ description }}</n-p>
  </div>
</template>

<style lang="scss" scoped>
.demo-page-header {
  margin-bottom: 20px;
  .demo-title {
    margin-bottom: 4px;
  }
  .demo-desc {
    user-select: text !important;
  }
}
</style>
