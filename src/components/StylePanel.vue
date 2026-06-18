<template>
  <div class="space-y-5">
    <div class="glass-card p-4 space-y-5 animate-fade-in">
      <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
        <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
        <span class="text-xs text-text-secondary">调整排版参数以适配您的阅读习惯。所有设置会实时预览并保存到本地。</span>
      </div>

      <!-- Sliders -->
      <div v-for="slider in styleSliders" :key="slider.key">
        <div class="flex justify-between mb-2">
          <label class="text-sm font-medium">{{ slider.label }}</label>
          <span class="text-sm text-primary">{{ style[slider.key] }}{{ slider.unit }}</span>
        </div>
        <input
          :value="style[slider.key]"
          @input="onStyleChange(slider.key, Number($event.target.value))"
          type="range"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          class="w-full"
        >
      </div>

      <!-- Selects -->
      <div>
        <label class="block text-sm font-medium mb-2">缩进风格</label>
        <select
          :value="style.indentStyle"
          @change="onStyleChange('indentStyle', $event.target.value)"
          class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="custom">自定义调节</option>
          <option value="no-indent">无缩进风格</option>
          <option value="kindle-standard">Kindle标准缩进</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">文本对齐</label>
        <select
          :value="style.textAlign"
          @change="onStyleChange('textAlign', $event.target.value)"
          class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="justify">两端对齐 (推荐)</option>
          <option value="left">左对齐</option>
          <option value="center">居中对齐</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">章节标题对齐</label>
        <select
          :value="style.titleAlign"
          @change="onStyleChange('titleAlign', $event.target.value)"
          class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="center">居中对齐 (推荐)</option>
          <option value="left">居左对齐</option>
          <option value="right">居右对齐</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Kindle字体跟随</label>
        <select
          :value="style.kindleFontFollow"
          @change="onStyleChange('kindleFontFollow', $event.target.value)"
          class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="keep-current">保持当前设置</option>
          <option value="complete-follow">完全跟随用户设置</option>
          <option value="title-follow-body">标题跟随正文字体</option>
          <option value="unified-family">标题正文同步设置</option>
        </select>
      </div>

      <!-- Toggles -->
      <div class="space-y-3">
        <label v-for="toggle in styleToggles" :key="toggle.key" class="flex items-center justify-between cursor-pointer">
          <span class="text-sm font-medium">{{ toggle.label }}</span>
          <div class="toggle-switch">
            <input
              :checked="style[toggle.key]"
              type="checkbox"
              @change="onStyleChange(toggle.key, $event.target.checked)"
            >
            <span class="toggle-slider"></span>
          </div>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-2">
        <button @click="$emit('resetStyle')" class="px-4 py-2 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
          <SvgIcon name="rotateCcw" size="14" />
          <span>重置</span>
        </button>
        <button @click="$emit('saveStyleConfig')" class="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
          <SvgIcon name="save" size="14" />
          <span>保存</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

const props = defineProps({
  style: { type: Object, default: () => ({}) },
  styleSliders: { type: Array, default: () => [] },
  styleToggles: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:style', 'resetStyle', 'saveStyleConfig'])

function onStyleChange(key, value) {
  emit('update:style', { ...props.style, [key]: value })
}
</script>
