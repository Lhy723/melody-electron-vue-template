<script setup lang="ts"></script>

<template>
  <!-- 调整 naive-ui 的字重配置 -->
  <n-config-provider :theme-overrides="{ common: { fontWeightStrong: '1000' } }" abstract>
    <slot />
  </n-config-provider>
</template>
