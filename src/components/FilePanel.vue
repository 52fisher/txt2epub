<template>
  <div class="space-y-5">
    <div class="glass-card overflow-hidden">
      <div class="p-4 border-b border-border flex items-center gap-2">
        <SvgIcon name="fileText" size="18" className="text-primary" />
        <h3 class="font-semibold">文件信息</h3>
      </div>
      <div class="p-4 space-y-4">
        <div class="flex items-start gap-3 p-3 bg-bg/50 rounded-lg">
          <SvgIcon name="fileText" size="20" className="text-primary mt-0.5 shrink-0" />
          <div>
            <div class="font-medium">{{ fileName }}</div>
            <div class="text-sm text-text-secondary">{{ fileSize }} | {{ chapters.length }} 个章节</div>
          </div>
        </div>

        <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
          <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
          <span class="text-xs text-text-secondary">上传 TXT 文件后，系统会自动检测编码格式。如遇乱码，可手动切换编码重新读取。</span>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <select
              :value="encoding"
              @change="$emit('update:encoding', $event.target.value); $emit('reReadFile')"
              class="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="UTF-8">UTF-8</option>
              <option value="GBK">GBK (兼容 GB2312)</option>
              <option value="GB18030">GB18030 (中文国标)</option>
              <option value="Big5">Big5 (繁体中文)</option>
              <option value="Shift_JIS">Shift_JIS (日文)</option>
              <option value="EUC-KR">EUC-KR (韩文)</option>
              <option value="ISO-8859-1">ISO-8859-1 (西欧)</option>
              <option value="Windows-1252">Windows-1252 (西欧)</option>
            </select>
            <button
              @click="$emit('autoDetectEncoding')"
              class="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1"
              :disabled="isDetectingEncoding"
            >
              <span v-if="isDetectingEncoding" class="animate-spin text-xs">
                <SvgIcon name="rotateCcw" size="12" />
              </span>
              <SvgIcon v-else name="wand" size="14" />
              <span>自动识别</span>
            </button>
            <span v-if="detectedEncoding" class="text-xs text-info">
              识别结果: {{ detectedEncoding.encoding }} ({{ (detectedEncoding.confidence * 100).toFixed(0) }}%)
            </span>
          </div>
          <button
            @click="$emit('resetFile')"
            class="px-3 py-1.5 text-sm bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-all flex items-center gap-1"
          >
            <SvgIcon name="rotateCcw" size="14" />
            <span>重新选择</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Text Editor -->
    <div class="glass-card overflow-hidden">
      <div class="p-4 border-b border-border flex items-center justify-between">
        <div class="flex items-center gap-2">
          <SvgIcon name="edit" size="18" className="text-primary" />
          <h3 class="font-semibold">文本编辑</h3>
        </div>
        <button
          @click="$emit('update:showTextEditor', !showTextEditor)"
          class="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1"
        >
          <SvgIcon name="edit" size="14" />
          <span>{{ showTextEditor ? '收起' : '编辑' }}</span>
        </button>
      </div>
      <div v-if="showTextEditor" class="p-4 space-y-3 animate-fade-in">
        <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
          <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
          <span class="text-xs text-text-secondary">可直接修改文本内容，修改后会实时重新识别章节。适用于清理无用内容或修正格式。</span>
        </div>
        <textarea
          :value="fileContent"
          @input="$emit('update:fileContent', $event.target.value)"
          class="w-full h-64 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm resize-y"
          placeholder="文本内容..."
        ></textarea>
      </div>
      <div v-else class="p-4 text-sm text-text-secondary">
        点击"编辑"按钮展开文本编辑器
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

defineProps({
  fileName: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  chapters: { type: Array, default: () => [] },
  encoding: { type: String, default: 'UTF-8' },
  isDetectingEncoding: { type: Boolean, default: false },
  detectedEncoding: { type: Object, default: null },
  showTextEditor: { type: Boolean, default: false },
  fileContent: { type: String, default: '' }
})

defineEmits([
  'reReadFile',
  'autoDetectEncoding',
  'resetFile',
  'update:encoding',
  'update:showTextEditor',
  'update:fileContent'
])
</script>
