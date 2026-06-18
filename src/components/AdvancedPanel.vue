<template>
  <div class="space-y-5">
    <div class="glass-card p-4 space-y-3 animate-fade-in">
      <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
        <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
        <span class="text-xs text-text-secondary">为熟悉 CSS 的用户提供自定义样式入口，将与上方配置合并输出。</span>
      </div>
      <textarea
        :value="customCSS"
        @input="$emit('update:customCSS', $event.target.value)"
        rows="6"
        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
        placeholder="/* 自定义CSS代码 */"
      ></textarea>
      <div class="flex gap-2">
        <button @click="$emit('applyDefaultCSS')" class="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
          <SvgIcon name="clipboard" size="14" />
          <span>应用默认</span>
        </button>
        <button @click="$emit('clearCSS')" class="px-4 py-2 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
          <SvgIcon name="trash" size="14" />
          <span>清空</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

defineProps({
  customCSS: { type: String, default: '' }
})

defineEmits(['update:customCSS', 'applyDefaultCSS', 'clearCSS'])
</script>
