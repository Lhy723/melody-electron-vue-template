// 模板演示数据
// 供各演示页使用的静态示例数据，全部为本地模拟，无网络请求

// 基础表格数据
export const demoTableColumns = [
  { title: '序号', key: 'index', width: 80 },
  { title: '组件', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '状态', key: 'status' }
]

export const demoTableData = [
  { index: 1, name: 'n-button', desc: '按钮：类型、次级、虚线、圆形等', status: '基础' },
  { index: 2, name: 'n-input', desc: '输入框：占位、禁用、成组', status: '基础' },
  { index: 3, name: 'n-switch', desc: '开关：受控切换', status: '基础' },
  { index: 4, name: 'n-select', desc: '选择器：单选与多选', status: '基础' },
  { index: 5, name: 'n-modal', desc: '模态框：确认流程', status: '反馈' },
  { index: 6, name: 'n-drawer', desc: '抽屉：侧滑面板', status: '反馈' },
  { index: 7, name: 'n-message', desc: '信息提示：轻量反馈', status: '反馈' },
  { index: 8, name: 'n-tabs', desc: '标签页：内容分区', status: '导航' },
  { index: 9, name: 'n-breadcrumb', desc: '面包屑：层级路径', status: '导航' },
  { index: 10, name: 'n-steps', desc: '步骤条：流程引导', status: '导航' }
]

// 选择器选项
export const demoSelectOptions = [
  { label: '选项一', value: 'one' },
  { label: '选项二', value: 'two' },
  { label: '选项三', value: 'three' },
  { label: '选项四', value: 'four', disabled: true }
]

// 标签页面板
export const demoTabPanes = ['概述', '规格参数', '用户评价', '相关推荐']

// 时间线数据
export const demoTimelineData = [
  { type: 'success', title: '初始化项目', time: '阶段一' },
  { type: 'info', title: '接入组件库', time: '阶段二' },
  { type: 'warning', title: '定制主题', time: '阶段三' },
  { type: 'info', title: '打包发布', time: '阶段四' }
]

// 表单规则示例
export const demoFormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: ['input', 'blur']
  },
  email: [
    { required: true, message: '请输入邮箱', trigger: ['input', 'blur'] },
    { type: 'email', message: '邮箱格式不正确', trigger: ['input', 'blur'] }
  ],
  age: {
    validator: (_rule, value) => {
      if (value === null || value === undefined) return true
      return (value >= 0 && value <= 150) || '年龄需在 0-150 之间'
    },
    trigger: ['input', 'blur']
  }
}
