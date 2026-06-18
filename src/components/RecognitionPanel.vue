<template>
  <div class="space-y-5">
    <div class="glass-card overflow-hidden">
      <div class="p-4 border-b border-border flex items-center gap-2">
        <SvgIcon name="search" size="18" className="text-primary" />
        <h3 class="font-semibold">章节识别</h3>
      </div>
      <div class="p-4 space-y-4">
        <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
          <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
          <span class="text-xs text-text-secondary">选择适合您文本的章节格式模板，或使用多选组合自定义。点击格式标签的眼睛图标可查看详情。</span>
        </div>

        <!-- Recognition Tabs -->
        <div class="flex border-b border-border">
          <button
            v-for="tab in recognitionTabs"
            :key="tab.key"
            @click="$emit('update:activeRecognitionTab', tab.key)"
            class="px-4 py-3 text-sm font-medium transition-colors relative"
            :class="activeRecognitionTab === tab.key ? 'text-primary' : 'text-text-secondary hover:text-text'"
          >
            {{ tab.name }}
            <span v-if="tab.badge" class="ml-1 text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded-full">{{ tab.badge }}</span>
            <div v-if="activeRecognitionTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
          </button>
        </div>

        <!-- Preset Templates Tab -->
        <div v-if="activeRecognitionTab === 'preset'" class="animate-fade-in">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="template in presetTemplates"
              :key="template.name"
              @click="$emit('applyTemplate', template)"
              class="p-4 border border-border rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
              :class="{ 'border-primary bg-primary/5 ring-1 ring-primary': isTemplateActiveFn(template) }"
            >
              <div class="font-medium text-sm mb-1">{{ template.name }}</div>
              <div class="text-xs text-text-secondary">{{ template.description }}</div>
              <div class="mt-2 flex flex-wrap gap-1">
                <span v-for="p in template.patterns.slice(0, 3)" :key="p" class="text-xs bg-border px-1.5 py-0.5 rounded">
                  {{ allChapterFormats[p]?.name || p }}
                </span>
                <span v-if="template.patterns.length > 3" class="text-xs text-text-secondary">+{{ template.patterns.length - 3 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Multi-select Tab -->
        <div v-if="activeRecognitionTab === 'multiselect'" class="animate-fade-in">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-text-secondary">选择要识别的章节格式</span>
            <div class="flex gap-2">
              <button @click="$emit('selectAllPatterns')" class="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
                <SvgIcon name="check" size="14" />
                <span>全选</span>
              </button>
              <button @click="$emit('clearAllPatterns')" class="px-3 py-1 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
                <SvgIcon name="x" size="14" />
                <span>清空</span>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(pattern, key) in allChapterFormats"
              :key="key"
              class="relative group"
            >
              <button
                @click="$emit('togglePattern', key)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                :class="selectedPatterns.includes(key)
                  ? 'bg-primary text-white'
                  : 'bg-border text-text-secondary hover:bg-border/80'"
              >
                {{ pattern.name }}
              </button>
              <!-- Eye icon - visible on hover -->
              <button
                v-if="pattern.isSystem"
                @click.stop="$emit('openFormatDetail', key, pattern)"
                class="absolute -top-2 -right-2 w-5 h-5 bg-info text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm hover:bg-info-dark"
                title="查看详情"
              >
                <SvgIcon name="eye" size="12" />
              </button>
              <!-- Edit icon for custom formats -->
              <button
                v-else
                @click.stop="$emit('openFormatEdit', key, pattern)"
                class="absolute -top-2 -right-2 w-5 h-5 bg-success text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm hover:bg-success-dark"
                title="编辑"
              >
                <SvgIcon name="edit" size="12" />
              </button>
            </div>
          </div>
          <!-- Add Custom Format Button -->
          <div class="mt-4 pt-4 border-t border-border">
            <button
              @click="$emit('openFormatEdit', null, null)"
              class="px-4 py-2 text-sm bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors flex items-center gap-1"
            >
              <SvgIcon name="plus" size="14" />
              <span>添加格式</span>
            </button>
          </div>
        </div>

        <!-- Pre-filter Tab -->
        <div v-if="activeRecognitionTab === 'prefilter'" class="space-y-4 animate-fade-in">
          <div class="text-sm text-text-secondary mb-2">前置筛选器 - 在识别前过滤内容</div>
          <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
            <div>
              <div class="text-sm font-medium">{{ preFilters.requireEmptyLine.name }}</div>
              <div class="text-xs text-text-secondary">{{ preFilters.requireEmptyLine.description }}</div>
            </div>
            <div class="toggle-switch">
              <input
                :checked="preFilters.requireEmptyLine.enabled"
                type="checkbox"
                @change="$emit('update:preFilters', { ...preFilters, requireEmptyLine: { ...preFilters.requireEmptyLine, enabled: $event.target.checked } })"
              >
              <span class="toggle-slider"></span>
            </div>
          </label>
          <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
            <div>
              <div class="text-sm font-medium">{{ preFilters.skipIndented.name }}</div>
              <div class="text-xs text-text-secondary">{{ preFilters.skipIndented.description }}</div>
            </div>
            <div class="toggle-switch">
              <input
                :checked="preFilters.skipIndented.enabled"
                type="checkbox"
                @change="$emit('update:preFilters', { ...preFilters, skipIndented: { ...preFilters.skipIndented, enabled: $event.target.checked } })"
              >
              <span class="toggle-slider"></span>
            </div>
          </label>
          <div class="p-3 bg-bg/50 rounded-lg">
            <div class="flex justify-between mb-2">
              <div>
                <div class="text-sm font-medium">{{ preFilters.prefixLengthLimit.name }}</div>
                <div class="text-xs text-text-secondary">{{ preFilters.prefixLengthLimit.description }}</div>
              </div>
              <span class="text-sm text-primary">{{ preFilters.prefixLengthLimit.value }}</span>
            </div>
            <input
              :value="preFilters.prefixLengthLimit.value"
              @input="$emit('update:preFilters', { ...preFilters, prefixLengthLimit: { ...preFilters.prefixLengthLimit, value: Number($event.target.value) } })"
              type="range"
              min="0"
              max="10"
              step="1"
              class="w-full"
            >
          </div>
          <div class="p-3 bg-bg/50 rounded-lg">
            <div class="flex justify-between mb-2">
              <div>
                <div class="text-sm font-medium">{{ preFilters.titleLineCount.name }}</div>
                <div class="text-xs text-text-secondary">{{ preFilters.titleLineCount.description }}</div>
              </div>
              <span class="text-sm text-primary">{{ preFilters.titleLineCount.value }}</span>
            </div>
            <input
              :value="preFilters.titleLineCount.value"
              @input="$emit('update:preFilters', { ...preFilters, titleLineCount: { ...preFilters.titleLineCount, value: Number($event.target.value) } })"
              type="range"
              min="1"
              max="5"
              step="1"
              class="w-full"
            >
          </div>

          <!-- Post-filter (inside same tab) -->
          <div class="border-t border-border pt-4 mt-4">
            <div class="text-sm text-text-secondary mb-3">后置筛选器 - 被筛选的章节仍会显示但默认不选中</div>
            <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
              <div>
                <div class="text-sm font-medium">{{ postFilters.excludeDates.name }}</div>
                <div class="text-xs text-text-secondary">{{ postFilters.excludeDates.description }}</div>
              </div>
              <div class="toggle-switch">
                <input
                  :checked="postFilters.excludeDates.enabled"
                  type="checkbox"
                  @change="$emit('update:postFilters', { ...postFilters, excludeDates: { ...postFilters.excludeDates, enabled: $event.target.checked } })"
                >
                <span class="toggle-slider"></span>
              </div>
            </label>
            <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
              <div>
                <div class="text-sm font-medium">{{ postFilters.excludePureNumbers.name }}</div>
                <div class="text-xs text-text-secondary">{{ postFilters.excludePureNumbers.description }}</div>
              </div>
              <div class="toggle-switch">
                <input
                  :checked="postFilters.excludePureNumbers.enabled"
                  type="checkbox"
                  @change="$emit('update:postFilters', { ...postFilters, excludePureNumbers: { ...postFilters.excludePureNumbers, enabled: $event.target.checked } })"
                >
                <span class="toggle-slider"></span>
              </div>
            </label>
            <div class="p-3 bg-bg/50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <div class="text-sm font-medium">{{ postFilters.excludeLongTitles.name }}</div>
                  <div class="text-xs text-text-secondary">{{ postFilters.excludeLongTitles.description }}</div>
                </div>
                <div class="toggle-switch">
                  <input
                    :checked="postFilters.excludeLongTitles.enabled"
                    type="checkbox"
                    @change="$emit('update:postFilters', { ...postFilters, excludeLongTitles: { ...postFilters.excludeLongTitles, enabled: $event.target.checked } })"
                  >
                  <span class="toggle-slider"></span>
                </div>
              </div>
              <div v-if="postFilters.excludeLongTitles.enabled" class="flex items-center gap-2 mt-2">
                <span class="text-xs text-text-secondary">超过</span>
                <input
                  :value="postFilters.excludeLongTitles.maxTitleLength"
                  @input="$emit('update:postFilters', { ...postFilters, excludeLongTitles: { ...postFilters.excludeLongTitles, maxTitleLength: Number($event.target.value) } })"
                  type="number"
                  min="10"
                  max="200"
                  class="w-16 px-2 py-1 border border-border rounded text-sm text-center"
                >
                <span class="text-xs text-text-secondary">个字符</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

defineProps({
  activeRecognitionTab: { type: String, default: 'preset' },
  selectedPatterns: { type: Array, default: () => [] },
  allChapterFormats: { type: Object, default: () => ({}) },
  presetTemplates: { type: Array, default: () => [] },
  recognitionTabs: { type: Array, default: () => [] },
  preFilters: { type: Object, default: () => ({}) },
  postFilters: { type: Object, default: () => ({}) },
  isTemplateActiveFn: { type: Function, default: () => false }
})

defineEmits([
  'update:activeRecognitionTab',
  'applyTemplate',
  'isTemplateActive',
  'togglePattern',
  'selectAllPatterns',
  'clearAllPatterns',
  'openFormatDetail',
  'openFormatEdit',
  'update:preFilters',
  'update:postFilters'
])
</script>
