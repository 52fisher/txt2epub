<template>
  <div class="space-y-5">
    <div class="glass-card overflow-hidden">
      <div class="p-4 border-b border-border flex items-center justify-between">
        <div class="flex items-center gap-2">
          <SvgIcon name="list" size="18" className="text-primary" />
          <h3 class="font-semibold">章节目录选择</h3>
          <span class="text-sm text-text-secondary">({{ selectedChaptersCount }} / {{ chaptersCount }})</span>
        </div>
        <div class="flex gap-2">
          <button @click="$emit('selectAllChapters')" class="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
            <SvgIcon name="check" size="14" />
            <span>全选</span>
          </button>
          <button @click="$emit('clearAllChapters')" class="px-3 py-1 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
            <SvgIcon name="x" size="14" />
            <span>全不选</span>
          </button>
          <button @click="$emit('resetChapterNumbers')" class="px-3 py-1 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
            <SvgIcon name="hash" size="14" />
            <span>重置</span>
          </button>
        </div>
      </div>
      <div class="p-3 bg-bg/50 border-b border-border flex items-center gap-6 flex-wrap">
        <label class="flex items-center gap-2 cursor-pointer">
          <div class="toggle-switch">
            <input
              :checked="chapterListOptions.showChapterNumbers"
              type="checkbox"
              @change="$emit('update:chapterListOptions', { ...chapterListOptions, showChapterNumbers: $event.target.checked })"
            >
            <span class="toggle-slider"></span>
          </div>
          <span class="text-sm">显示章节序号</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <div class="toggle-switch">
            <input
              :checked="chapterListOptions.deduplicate"
              type="checkbox"
              @change="$emit('update:chapterListOptions', { ...chapterListOptions, deduplicate: $event.target.checked })"
            >
            <span class="toggle-slider"></span>
          </div>
          <span class="text-sm">忽略重复章节</span>
        </label>
      </div>
      <div class="max-h-80 overflow-y-auto p-2">
        <div
          v-for="(chapter, index) in chapters"
          :key="index"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <input
            :checked="chapter.selected"
            @change="$emit('updateChapter', index, { ...chapter, selected: $event.target.checked })"
            type="checkbox"
            class="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          >
          <span class="text-sm text-text-secondary w-8">{{ index + 1 }}</span>
          <span class="flex-1 text-sm truncate">{{ chapter.title }}</span>
          <span class="text-xs text-text-secondary">行 {{ chapter.lineNumber }}</span>
          <!-- Chapter Level Selector -->
          <select
            :value="chapter.level"
            @change="$emit('onChapterLevelChange', { ...chapter, level: Number($event.target.value) })"
            class="text-xs px-1.5 py-0.5 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/20"
            :class="getLevelColorClass(chapter.level)"
          >
            <option v-for="lvl in [1,2,3,4,5,6]" :key="lvl" :value="lvl">
              H{{ lvl }}
            </option>
          </select>
        </div>
      </div>
      <div class="p-3 bg-bg/50 border-t border-border">
        <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
          <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
          <span class="text-xs text-text-secondary">勾选需要生成目录的章节标题。H1-H6 表示层级关系，H1 为最高级（如卷/部）。被后置筛选器过滤的章节默认不选中，但您仍可手动勾选。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

defineProps({
  chapters: { type: Array, default: () => [] },
  selectedChaptersCount: { type: Number, default: 0 },
  chaptersCount: { type: Number, default: 0 },
  chapterListOptions: { type: Object, default: () => ({ showChapterNumbers: false, deduplicate: false }) }
})

defineEmits([
  'update:chapterListOptions',
  'selectAllChapters',
  'clearAllChapters',
  'resetChapterNumbers',
  'updateChapter',
  'onChapterLevelChange'
])

function getLevelColorClass(level) {
  const classes = {
    1: 'text-red-500 border-red-500/30',
    2: 'text-orange-500 border-orange-500/30',
    3: 'text-yellow-500 border-yellow-500/30',
    4: 'text-green-500 border-green-500/30',
    5: 'text-blue-500 border-blue-500/30',
    6: 'text-purple-500 border-purple-500/30'
  }
  return classes[level] || 'text-text-secondary border-border'
}
</script>
