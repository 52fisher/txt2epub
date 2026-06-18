<template>
  <div class="space-y-5">
    <div class="glass-card overflow-hidden">
      <div class="p-4 border-b border-border flex items-center gap-2">
        <SvgIcon name="image" size="18" className="text-primary" />
        <h3 class="font-semibold">封面设置</h3>
      </div>
      <div class="p-4">
        <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10 mb-4">
          <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
          <span class="text-xs text-text-secondary">支持上传图片或自动生成封面。生成封面会根据书名和作者自动排版。</span>
        </div>
        <CoverSettingsPanel
          :cover-preview="coverPreview"
          @generate="$emit('generate')"
          @randomize="$emit('randomize')"
          @upload="$emit('upload', $event)"
          @remove="$emit('remove')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'
import CoverSettingsPanel from './CoverSettingsPanel.vue'

defineProps({
  coverPreview: { type: String, default: '' }
})

defineEmits(['generate', 'randomize', 'upload', 'remove'])
</script>
