<template>
  <div class="space-y-5">
    <div class="glass-card overflow-hidden">
      <div class="p-4 border-b border-border flex items-center gap-2">
        <SvgIcon name="clipboard" size="18" className="text-primary" />
        <h3 class="font-semibold">电子书信息设置</h3>
      </div>
      <div class="p-4 space-y-4">
        <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
          <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
          <span class="text-xs text-text-secondary">书名和作者会显示在 EPUB 的元数据中。开启自动整理可从文件名智能提取信息。</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">书名</label>
            <input
              :value="metadata.title"
              @input="onMetadataInput('title', $event.target.value); $emit('updateFilenamePreview')"
              type="text"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="输入书名"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">作者</label>
            <input
              :value="metadata.author"
              @input="onMetadataInput('author', $event.target.value); $emit('updateFilenamePreview')"
              type="text"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="输入作者名"
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">内容简介</label>
          <textarea
            :value="metadata.description"
            @input="onMetadataInput('description', $event.target.value)"
            rows="2"
            class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="输入内容简介（可选）"
          ></textarea>
        </div>

        <!-- Filename format settings -->
        <div class="space-y-3 p-3 bg-bg/50 rounded-lg">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">自动整理文件名</label>
            <div class="toggle-switch">
              <input
                :checked="filenameSettings.autoParse"
                type="checkbox"
                @change="onFilenameSettingsChange({ ...filenameSettings, autoParse: $event.target.checked })"
              >
              <span class="toggle-slider"></span>
            </div>
          </div>
          <div class="text-xs text-text-secondary">
            自动从文件名中提取书名和作者 (格式: 《书名》作者：作者名 或 书名 - 作者)
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">文件名格式</label>
            <select
              :value="filenameSettings.format"
              @change="$emit('onFilenameFormatChange', $event.target.value)"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              <option v-for="preset in filenameFormatPresets" :key="preset.key" :value="preset.key">
                {{ preset.name }}
              </option>
            </select>

            <!-- Custom template section -->
            <div v-if="filenameSettings.format === 'custom'" class="space-y-2 animate-fade-in">
              <div>
                <label class="block text-xs font-medium mb-1 text-text-secondary">常用模板</label>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="tp in customTemplatePresets"
                    :key="tp.template"
                    @click="$emit('applyCustomTemplatePreset', tp)"
                    class="px-2 py-1 text-xs border border-border rounded hover:border-primary hover:text-primary transition-colors"
                    :class="{ 'border-primary text-primary bg-primary/5': filenameSettings.customTemplate === tp.template }"
                  >
                    {{ tp.label }}
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1 text-text-secondary">自定义模板</label>
                <input
                  :value="filenameSettings.customTemplate"
                  @input="$emit('onCustomTemplateInput', $event.target.value)"
                  type="text"
                  class="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                  placeholder="输入模板，如：{书名}-{作者名}"
                >
                <div class="text-xs text-text-secondary mt-1">
                  可用占位符：{书名} {作者名}（也可简写为 {作者}）
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1 text-text-secondary">文件名预览</label>
              <div class="flex items-center gap-2">
                <input
                  :value="filenamePreview"
                  type="text"
                  class="flex-1 px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  placeholder="文件名"
                >
                <span class="text-xs text-text-secondary whitespace-nowrap">.epub</span>
              </div>
              <div class="text-xs text-text-secondary mt-1">
                选择格式会自动生成文件名，也可以直接编辑预览框自定义
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6 flex-wrap">
          <label class="flex items-center gap-2 cursor-pointer">
            <div class="toggle-switch">
              <input
                :checked="settings.generateToc"
                type="checkbox"
                @change="onSettingsChange({ ...settings, generateToc: $event.target.checked })"
              >
              <span class="toggle-slider"></span>
            </div>
            <span class="text-sm">生成目录页</span>
          </label>
          <div class="flex items-center gap-2">
            <span class="text-sm">正文前内容标题</span>
            <select
              :value="settings.prefaceTitle"
              @change="onSettingsChange({ ...settings, prefaceTitle: $event.target.value })"
              class="px-2 py-1 border border-border rounded text-sm"
            >
              <option value="">关闭</option>
              <option value="简介">简介</option>
              <option value="序章">序章</option>
              <option value="前言">前言</option>
              <option value="custom">自定义</option>
            </select>
            <input
              v-if="settings.prefaceTitle === 'custom'"
              :value="settings.customPrefaceTitle"
              @input="onSettingsChange({ ...settings, customPrefaceTitle: $event.target.value })"
              type="text"
              class="px-2 py-1 border border-border rounded text-sm w-24"
              placeholder="标题"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

const props = defineProps({
  metadata: { type: Object, default: () => ({ title: '', author: '', description: '' }) },
  settings: { type: Object, default: () => ({ generateToc: false, prefaceTitle: '', customPrefaceTitle: '' }) },
  filenameSettings: { type: Object, default: () => ({ autoParse: false, format: 'title-author', customTemplate: '' }) },
  filenamePreview: { type: String, default: '' },
  filenameFormatPresets: { type: Array, default: () => [] },
  customTemplatePresets: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'update:metadata',
  'update:settings',
  'updateFilenamePreview',
  'onFilenameSettingsChange',
  'onFilenameFormatChange',
  'onCustomTemplateInput',
  'applyCustomTemplatePreset'
])

function onMetadataInput(key, value) {
  emit('update:metadata', { ...props.metadata, [key]: value })
}

function onSettingsChange(newSettings) {
  emit('update:settings', newSettings)
}
</script>
