<script setup>
// 表单与校验演示：完整提交流程
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'
import { demoFormRules, demoSelectOptions } from '@renderer/utils/demoData'

const message = useMessage()
const formRef = ref(null)

// 表单数据
const formValue = ref({
  username: '',
  email: '',
  age: null,
  city: null,
  note: ''
})

// 提交状态
const submitting = ref(false)
const submitResult = ref(null)

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('表单校验未通过，请检查标红项')
      return
    }
    submitting.value = true
    // 模拟异步提交
    setTimeout(() => {
      submitting.value = false
      submitResult.value = { ...formValue.value, time: new Date().toLocaleTimeString() }
      message.success('提交成功，结果见下方 JSON')
    }, 800)
  })
}

const handleReset = () => {
  formRef.value?.restoreValidation()
  formValue.value = { username: '', email: '', age: null, city: null, note: '' }
  submitResult.value = null
}
</script>

<template>
  <div class="form-demo">
    <DemoPageHeader
      title="表单与校验"
      description="一个完整的表单交互闭环：字段校验、异步提交、结果反馈与重置，可直接作为业务表单的起点。"
    />
    <n-grid :x-gap="16" cols="1 l:2" responsive="screen">
      <!-- 表单 -->
      <n-grid-item>
        <DemoSection
          title="示例表单"
          description="用户名与邮箱为必填，年龄有自定义范围校验，提交前统一校验。"
        >
          <n-form
            ref="formRef"
            :model="formValue"
            :rules="demoFormRules"
            label-placement="top"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="formValue.username" placeholder="请输入用户名" clearable />
            </n-form-item>
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="formValue.email" placeholder="name@example.com" clearable />
            </n-form-item>
            <n-form-item label="年龄（选填）" path="age">
              <n-input-number v-model:value="formValue.age" :min="0" :max="150" placeholder="0-150" style="width: 100%" />
            </n-form-item>
            <n-form-item label="城市" path="city">
              <n-select v-model:value="formValue.city" :options="demoSelectOptions" placeholder="请选择城市" />
            </n-form-item>
            <n-form-item label="备注（选填）" path="note">
              <n-input
                v-model:value="formValue.note"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="补充信息"
              />
            </n-form-item>
            <n-flex :size="12">
              <n-button type="primary" :loading="submitting" @click="handleSubmit">提交</n-button>
              <n-button quaternary @click="handleReset">重置</n-button>
            </n-flex>
          </n-form>
        </DemoSection>
      </n-grid-item>
      <!-- 结果 -->
      <n-grid-item>
        <DemoSection title="提交结果" description="提交成功后以结构化形式展示表单数据，便于接入真实接口。">
          <n-empty v-if="!submitResult" description="还没有提交，左侧填写并提交试试">
            <template #extra>
              <n-text depth="3" class="selectable">校验失败时会有消息提示</n-text>
            </template>
          </n-empty>
          <n-code v-else :code="JSON.stringify(submitResult, null, 2)" language="json" show-line-numbers />
        </DemoSection>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.form-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .selectable {
    user-select: text !important;
  }
}
</style>
