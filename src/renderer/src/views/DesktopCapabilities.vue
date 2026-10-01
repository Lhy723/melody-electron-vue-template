<script setup>
// 桌面能力演示：文件对话框 / 拖拽读取 / 主进程存储 / HTTP 代理 / 文件日志 / 检查更新
// 全部通过 preload 以 contextBridge 暴露的 window.electron（页面内直接写作 electron）与主进程 IPC 通信
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import {
  FolderOpen16Regular,
  Save16Regular,
  ArrowClockwise16Regular,
  ArrowDownload16Regular,
  Globe16Regular,
  History16Regular
} from '@vicons/fluent'
import DemoPageHeader from '@renderer/components/demo/DemoPageHeader.vue'
import DemoSection from '@renderer/components/demo/DemoSection.vue'

const message = useMessage()

// IPC 异常统一转成可读文案
const errMsg = (err) => (err instanceof Error ? err.message : String(err ?? '未知错误'))

/* ---------- 1. 打开与保存文件 ---------- */
const openedFile = reactive({ path: '', name: '', content: '' })
const opening = ref(false)
const saving = ref(false)

const openFile = async () => {
  opening.value = true
  try {
    const res = await electron.openFile()
    if (res.canceled) {
      message.info('已取消选择文件')
      return
    }
    openedFile.path = res.path ?? ''
    openedFile.name = res.name ?? ''
    openedFile.content = res.content ?? ''
    message.success(`已打开：${openedFile.name || openedFile.path}`)
  } catch (err) {
    message.error(`打开文件失败：${errMsg(err)}`)
  } finally {
    opening.value = false
  }
}

const saveOpenedFile = async () => {
  saving.value = true
  try {
    const res = await electron.saveTextFile(openedFile.content, openedFile.name || 'demo.txt')
    if (res.canceled) {
      message.info('已取消保存')
      return
    }
    message.success(`已保存到：${res.path}`)
  } catch (err) {
    message.error(`保存文件失败：${errMsg(err)}`)
  } finally {
    saving.value = false
  }
}

/* ---------- 2. 拖拽打开文件 ---------- */
const droppedFile = reactive({ path: '', name: '', content: '' })
const dropHover = ref(false)
const readingDrop = ref(false)

// 渲染进程出于 Chromium 安全限制拿不到拖拽 File 对象的真实磁盘路径，
// preload 内部需使用 Electron 的 webUtils.getPathForFile(file) 把 File 换成真实路径，
// 再把路径交给主进程读取，因此这里先调 getPathForFile，再调 readDroppedFile。
const onDrop = async (e) => {
  dropHover.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) {
    message.warning('未检测到拖入的文件')
    return
  }
  readingDrop.value = true
  try {
    // 兼容同步 string 与 Promise<string> 两种实现
    const filePath = await electron.getPathForFile(file)
    const res = await electron.readDroppedFile(filePath)
    if (!res.ok) {
      message.error(res.message || '读取拖拽文件失败')
      return
    }
    droppedFile.path = res.path ?? filePath
    droppedFile.name = res.name ?? file.name
    droppedFile.content = res.content ?? ''
    message.success(`已读取：${droppedFile.name}`)
  } catch (err) {
    message.error(`读取拖拽文件失败：${errMsg(err)}`)
  } finally {
    readingDrop.value = false
  }
}

/* ---------- 3. 主进程存储 ---------- */
const storeKey = ref('demo')
const storeValue = ref('')
const storeResult = ref('')
const savingStore = ref(false)
const readingStore = ref(false)

const saveStore = async () => {
  const key = storeKey.value.trim()
  if (!key) {
    message.warning('请输入键名')
    return
  }
  savingStore.value = true
  try {
    await electron.storeSet(key, storeValue.value)
    message.success(`已写入「${key}」`)
  } catch (err) {
    message.error(`写入失败：${errMsg(err)}`)
  } finally {
    savingStore.value = false
  }
}

const readStore = async () => {
  const key = storeKey.value.trim()
  if (!key) {
    message.warning('请输入键名')
    return
  }
  readingStore.value = true
  try {
    const value = await electron.storeGet(key)
    storeResult.value = value === undefined || value === null ? '（未设置）' : String(value)
  } catch (err) {
    message.error(`读取失败：${errMsg(err)}`)
  } finally {
    readingStore.value = false
  }
}

/* ---------- 4. 主进程 HTTP 代理 ---------- */
const httpUrl = ref('https://api.github.com/repos/Lhy723/melody-electron-vue-template')
const httpLoading = ref(false)
const httpStatus = ref(0)
const httpText = ref('')

const requestHttp = async () => {
  const url = httpUrl.value.trim()
  if (!url) {
    message.warning('请输入请求地址')
    return
  }
  httpLoading.value = true
  try {
    const res = await electron.httpGet(url)
    httpStatus.value = res.status ?? 0
    // 只展示前 500 字符，完整响应请自行展开日志
    httpText.value = (res.text ?? '').slice(0, 500)
    if (!res.ok) {
      message.error(res.message || `请求失败（HTTP ${res.status ?? '无状态'}）`)
      return
    }
    message.success(`请求成功（HTTP ${res.status}）`)
  } catch (err) {
    message.error(`请求失败：${errMsg(err)}`)
  } finally {
    httpLoading.value = false
  }
}

/* ---------- 5. 文件日志 ---------- */
const logMessage = ref('')
const logPath = ref('')
const writingLog = ref(false)

const writeLog = async () => {
  const text = logMessage.value.trim()
  if (!text) {
    message.warning('请输入日志内容')
    return
  }
  writingLog.value = true
  try {
    logPath.value = await electron.logWrite(text)
    message.success('已写入日志文件')
  } catch (err) {
    message.error(`写入日志失败：${errMsg(err)}`)
  } finally {
    writingLog.value = false
  }
}

/* ---------- 6. 检查更新 ---------- */
const checkingUpdate = ref(false)
const updateResult = ref(null)
const updateStateText = ref('')

// onUpdateState 各 phase 的中文文案
const updatePhaseText = {
  checking: '正在检查更新…',
  available: '发现新版本',
  none: '当前已是最新版本',
  downloading: '正在下载更新',
  downloaded: '更新包下载完成，等待安装',
  error: '更新出错'
}

// 订阅主进程更新事件；onUpdateState 返回取消订阅函数，卸载时调用
// 浏览器直接预览（无 preload）时 electron 不存在，做防御性跳过
let cancelUpdateState = null
onMounted(() => {
  if (typeof electron === 'undefined') return
  cancelUpdateState = electron.onUpdateState((payload) => {
    const base = updatePhaseText[payload.phase] ?? payload.phase
    let text = base
    if (payload.phase === 'downloading' && payload.percent != null) {
      text = `${base}：${Math.round(payload.percent)}%`
    } else if (payload.version) {
      text = `${base}（v${payload.version}）`
    }
    if (payload.message) text += `：${payload.message}`
    updateStateText.value = text
  })
})
onUnmounted(() => {
  cancelUpdateState?.()
  cancelUpdateState = null
})

const checkForUpdate = async () => {
  checkingUpdate.value = true
  try {
    const res = await electron.checkForUpdates()
    updateResult.value = res
    if (res.supported) {
      message.success(res.version ? `检查完成，当前版本 v${res.version}` : '检查完成')
    } else {
      message.info(res.reason || res.error || '当前环境不支持自动更新')
    }
  } catch (err) {
    message.error(`检查更新失败：${errMsg(err)}`)
  } finally {
    checkingUpdate.value = false
  }
}

const updateResultText = computed(() => {
  const res = updateResult.value
  if (!res) return ''
  if (res.supported) {
    return `支持自动更新${res.version ? `，当前版本 v${res.version}` : ''}`
  }
  const reason = res.reason || res.error || ''
  return `当前环境不支持自动更新${reason ? `：${reason}` : ''}`
})
</script>

<template>
  <div class="desktop-demo">
    <DemoPageHeader
      title="桌面能力"
      description="主进程 IPC 能力的可交互演示：通过 preload 暴露的 electron API 完成文件对话框、拖拽读取、键值存储、HTTP 代理、文件日志与自动更新。"
    />

    <!-- 1. 打开与保存文件 -->
    <DemoSection
      title="打开与保存文件"
      description="调用主进程的原生文件对话框：打开后读取文本内容，可在此编辑，保存时写入所选位置。"
    >
      <n-flex :size="12" wrap>
        <n-button :loading="opening" :focusable="false" secondary @click="openFile">
          <template #icon>
            <n-icon><FolderOpen16Regular /></n-icon>
          </template>
          打开文件
        </n-button>
        <n-button :loading="saving" :focusable="false" secondary @click="saveOpenedFile">
          <template #icon>
            <n-icon><Save16Regular /></n-icon>
          </template>
          保存内容
        </n-button>
      </n-flex>
      <template v-if="openedFile.path">
        <n-text depth="3" class="selectable">当前文件：{{ openedFile.path }}</n-text>
        <n-input
          v-model:value="openedFile.content"
          type="textarea"
          :rows="6"
          placeholder="文件内容会显示在这里，可直接编辑后保存"
        />
      </template>
      <n-text v-else depth="3">还没有打开文件，点击上方按钮试试。</n-text>
    </DemoSection>

    <!-- 2. 拖拽打开文件 -->
    <DemoSection
      title="拖拽打开文件"
      description="把文件从资源管理器直接拖进窗口：preload 先把 File 对象换成真实路径，再由主进程读取内容。"
    >
      <div
        class="dropzone"
        :class="{ 'dropzone--active': dropHover }"
        @dragover.prevent="dropHover = true"
        @dragleave.prevent="dropHover = false"
        @drop.prevent="onDrop"
      >
        <n-spin v-if="readingDrop" size="small" />
        <template v-else>
          <n-text depth="3">把任意文件拖到这里</n-text>
          <n-text depth="3" class="selectable">拖入后 preload 用 webUtils 换取磁盘路径，不支持拖入文件夹。</n-text>
        </template>
      </div>
      <template v-if="droppedFile.name">
        <n-text depth="3" class="selectable">已读取：{{ droppedFile.name }}（{{ droppedFile.path }}）</n-text>
        <n-input :value="droppedFile.content" type="textarea" :rows="6" readonly placeholder="拖拽文件内容" />
      </template>
    </DemoSection>

    <!-- 3. 主进程存储 -->
    <DemoSection
      title="主进程存储"
      description="由主进程统一读写的键值对，持久化保存到本地文件，跨窗口、跨重启可用。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-input v-model:value="storeKey" placeholder="键名，如 demo" style="width: 200px" />
        <n-input v-model:value="storeValue" placeholder="要保存的值" style="width: 260px" />
        <n-button :loading="savingStore" :focusable="false" secondary @click="saveStore">
          <template #icon>
            <n-icon><Save16Regular /></n-icon>
          </template>
          保存
        </n-button>
        <n-button :loading="readingStore" :focusable="false" secondary @click="readStore">
          <template #icon>
            <n-icon><ArrowDownload16Regular /></n-icon>
          </template>
          读取
        </n-button>
      </n-flex>
      <n-text v-if="storeResult" depth="2" class="selectable">读取「{{ storeKey }}」：{{ storeResult }}</n-text>
      <n-text depth="3" class="selectable">窗口大小位置已自动记忆，重启恢复。</n-text>
    </DemoSection>

    <!-- 4. 主进程 HTTP 代理 -->
    <DemoSection
      title="主进程 HTTP 代理"
      description="由主进程发起 GET 请求，绕开渲染进程的 CORS 限制，适合访问第三方开放接口。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-input
          v-model:value="httpUrl"
          placeholder="https://…"
          style="flex: 1 1 320px"
          @keyup.enter="requestHttp"
        />
        <n-button :loading="httpLoading" :focusable="false" secondary @click="requestHttp">
          <template #icon>
            <n-icon><Globe16Regular /></n-icon>
          </template>
          发起请求
        </n-button>
      </n-flex>
      <template v-if="httpStatus">
        <n-flex :size="8" align="center">
          <n-tag :type="httpStatus >= 200 && httpStatus < 300 ? 'success' : 'error'" size="small" round>
            HTTP {{ httpStatus }}
          </n-tag>
        </n-flex>
        <pre class="http-text selectable">{{ httpText || '（响应内容为空）' }}</pre>
      </template>
    </DemoSection>

    <!-- 5. 文件日志 -->
    <DemoSection
      title="文件日志"
      description="把内容追加写入主进程的日志文件，方便排查打包后无法打开 DevTools 的运行问题。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-input
          v-model:value="logMessage"
          placeholder="要写入的日志内容"
          style="flex: 1 1 280px"
          @keyup.enter="writeLog"
        />
        <n-button :loading="writingLog" :focusable="false" secondary @click="writeLog">
          <template #icon>
            <n-icon><History16Regular /></n-icon>
          </template>
          写入日志
        </n-button>
      </n-flex>
      <n-text v-if="logPath" depth="3" class="selectable">日志文件：{{ logPath }}</n-text>
    </DemoSection>

    <!-- 6. 检查更新 -->
    <DemoSection
      title="检查更新"
      description="由主进程执行检查、下载与安装的完整更新流程；开发环境下没有安装包与更新源，会返回不支持及原因，如实展示。"
    >
      <n-flex :size="12" align="center" wrap>
        <n-button :loading="checkingUpdate" :focusable="false" secondary @click="checkForUpdate">
          <template #icon>
            <n-icon><ArrowClockwise16Regular /></n-icon>
          </template>
          检查更新
        </n-button>
      </n-flex>
      <n-text v-if="updateResultText" class="selectable">检查结果：{{ updateResultText }}</n-text>
      <n-text v-if="updateStateText" depth="3" class="selectable">更新状态：{{ updateStateText }}</n-text>
    </DemoSection>
  </div>
</template>

<style lang="scss" scoped>
.desktop-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .selectable {
    user-select: text !important;
  }
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 110px;
    padding: 16px;
    border: 1.5px dashed rgba(128, 128, 128, 0.4);
    border-radius: 8px;
    text-align: center;
    transition:
      border-color 0.2s,
      background-color 0.2s;
    &--active {
      border-color: var(--primary-color, #18a058);
      background-color: rgba(24, 160, 88, 0.06);
    }
  }
  .http-text {
    margin: 0;
    max-height: 220px;
    padding: 10px 12px;
    overflow: auto;
    border-radius: 8px;
    background-color: rgba(128, 128, 128, 0.08);
    font-size: 12px;
    font-family: Consolas, 'Courier New', monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
