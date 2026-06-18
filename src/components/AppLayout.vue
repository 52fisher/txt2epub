<template>
  <div class="min-h-screen bg-bg text-text relative flex">
    <!-- Background Pattern -->
    <div class="fixed inset-0 pointer-events-none opacity-30" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>

    <!-- Left Sidebar Navigation -->
    <aside class="fixed left-0 top-0 bottom-0 w-[240px] bg-surface/60 backdrop-blur-xl border-r border-border z-40 flex flex-col">
      <!-- Logo -->
      <div class="px-5 py-4 border-b border-border flex items-center gap-2.5">
        <SvgIcon name="book" size="22" className="text-primary" />
        <h1 class="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TXT 转 EPUB</h1>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <button
          v-for="item in navItems"
          :key="item.key"
          @click="$emit('update:activeNav', item.key)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
          :class="activeNav === item.key
            ? 'bg-primary/10 text-primary'
            : 'text-text-secondary hover:bg-white/5 hover:text-text'"
        >
          <span v-if="activeNav === item.key" class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"></span>
          <SvgIcon :name="item.icon" size="18" :className="activeNav === item.key ? 'text-primary' : 'text-text-secondary'" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="ml-auto text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded-full">{{ item.badge }}</span>
        </button>
      </nav>

      <!-- Theme Toggle -->
      <div class="px-3 py-2 border-t border-border">
        <button
          @click="$emit('toggleTheme')"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-text-secondary hover:bg-white/5 hover:text-text"
        >
          <SvgIcon :name="isDarkMode ? 'sun' : 'moon'" size="18" className="text-text-secondary" />
          <span>{{ isDarkMode ? '日间模式' : '夜间模式' }}</span>
        </button>
      </div>

      <!-- Footer info -->
      <div class="px-5 py-3 border-t border-border text-[11px] text-text-secondary">
        TXT 转 EPUB v2.0.0
      </div>
    </aside>

    <!-- Right Content Area -->
    <div class="ml-[240px] flex-1 flex flex-col min-h-screen">
      <!-- Top Header Bar -->
      <header class="bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-30">
        <div class="px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-text-secondary">
            <SvgIcon name="fileText" size="16" className="text-text-secondary" />
            <span v-if="fileLoaded">{{ fileName }}</span>
            <span v-else>未选择文件</span>
          </div>
          <div class="text-sm text-text-secondary" v-if="fileLoaded">
            {{ fileSize }} | {{ chapters.length }} 个章节 | 已选 {{ selectedChapters.length }} 个
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 px-6 py-6 pb-32">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="text-center py-4 text-sm text-text-secondary">
        <div class="px-6">
          <div class="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3"></div>
          TXT 转 EPUB 转换器 v2.1.0
        </div>
      </footer>
    </div>

    <!-- Sticky Convert Button -->
    <div
      v-if="fileLoaded"
      class="fixed bottom-0 right-0 left-[240px] z-50 px-6 py-4 bg-gradient-to-t from-bg via-bg to-transparent"
    >
      <button
        @click="$emit('convert')"
        :disabled="isConverting || selectedChapters.length === 0"
        class="w-full max-w-4xl mx-auto py-4 bg-gradient-to-r from-primary via-primary to-accent text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <span v-if="isConverting" class="animate-spin">
          <SvgIcon name="rotateCcw" size="20" />
        </span>
        <SvgIcon v-else name="zap" size="20" />
        <span>{{ isConverting ? '转换中...' : '转换为EPUB' }}</span>
        <span v-if="!isConverting" class="text-sm font-normal opacity-80">({{ selectedChapters.length }} 个章节)</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

defineProps({
  activeNav: { type: String, default: 'file' },
  isDarkMode: { type: Boolean, default: true },
  fileLoaded: { type: Boolean, default: false },
  fileName: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  chapters: { type: Array, default: () => [] },
  selectedChapters: { type: Array, default: () => [] },
  isConverting: { type: Boolean, default: false }
})

defineEmits(['update:activeNav', 'toggleTheme', 'convert'])

const navItems = [
  { key: 'file', label: '文件', icon: 'fileText' },
  { key: 'metadata', label: '元数据', icon: 'clipboard' },
  { key: 'cover', label: '封面', icon: 'image' },
  { key: 'recognition', label: '识别', icon: 'search' },
  { key: 'chapters', label: '目录', icon: 'list' },
  { key: 'style', label: '样式', icon: 'palette', badge: 'Beta' },
  { key: 'advanced', label: '高级', icon: 'code' }
]
</script>
