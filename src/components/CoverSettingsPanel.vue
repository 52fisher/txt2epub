<template>
  <div class="space-y-4">
    <!-- Cover Ratio -->
    <div class="p-3 bg-bg/50 rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium"><SvgIcon name="type" size="14" className="text-primary mr-1" /> 封面比例</span>
        <span class="text-xs text-text-secondary">{{ settings.width }}×{{ settings.height }}</span>
      </div>
      <select v-model="settings.ratioPreset" @change="onRatioChange" class="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20">
        <optgroup label="常用比例">
          <option value="standard">标准 (2:3)</option>
          <option value="square">正方形 (1:1)</option>
          <option value="golden">黄金比例 (600×970)</option>
        </optgroup>
        <optgroup label="特殊比例">
          <option value="widescreen">宽屏 (16:9)</option>
          <option value="tall">高长 (9:16)</option>
          <option value="a4">A4比例 (600×849)</option>
          <option value="kindle_classic">Kindle经典 (3:4)</option>
          <option value="kindle_oasis">Kindle Oasis (1264×1680)</option>
          <option value="kindle_scribe">Kindle Scribe (3:4)</option>
        </optgroup>
        <optgroup label="自定义">
          <option value="custom">自定义</option>
        </optgroup>
      </select>
      <div v-if="settings.ratioPreset === 'custom'" class="flex items-center gap-2 mt-2">
        <input v-model.number="settings.width" type="number" min="100" max="2000" step="10" class="w-24 px-2 py-1 border border-border rounded text-sm text-center bg-bg/50" placeholder="宽">
        <span class="text-xs text-text-secondary">×</span>
        <input v-model.number="settings.height" type="number" min="100" max="2000" step="10" class="w-24 px-2 py-1 border border-border rounded text-sm text-center bg-bg/50" placeholder="高">
      </div>
    </div>
    <!-- Cover Tabs -->
    <div class="flex border-b border-border">
      <button @click="activeTab = 'upload'" class="px-4 py-2 text-sm font-medium transition-colors relative" :class="activeTab === 'upload' ? 'text-primary' : 'text-text-secondary hover:text-text'">
        <SvgIcon name="upload" size="14" className="mr-1" /> 上传图片
        <div v-if="activeTab === 'upload'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      </button>
      <button @click="activeTab = 'generate'" class="px-4 py-2 text-sm font-medium transition-colors relative" :class="activeTab === 'generate' ? 'text-primary' : 'text-text-secondary hover:text-text'">
        <SvgIcon name="sparkles" size="14" className="mr-1" /> 生成封面
        <div v-if="activeTab === 'generate'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      </button>
    </div>
    <!-- Upload Section -->
    <div v-if="activeTab === 'upload'">
      <div class="border-2 border-dashed border-border rounded-xl p-8 text-center transition-all" :class="{ 'drag-active': isDragging }" @dragenter.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @dragover.prevent @drop.prevent="onDrop">
        <div v-if="!coverPreview" class="space-y-3">
          <div><SvgIcon name="image" size="40" className="text-primary/60" /></div>
          <p class="text-text-secondary">点击或拖拽上传封面图片</p>
          <button @click="$refs.fileInput.click()" class="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">选择封面图片</button>
        </div>
        <div v-else class="relative inline-block">
          <img :src="coverPreview" class="max-h-48 rounded-lg shadow-md">
          <button @click="removeCover" class="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full text-xs hover:bg-danger/80 transition-colors"><SvgIcon name="x" size="12" /></button>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelect">
      </div>
      <div class="mt-2 flex items-center gap-2">
        <input v-model="settings.skipCropping" type="checkbox" id="skipCropping" class="w-4 h-4 rounded border-border text-primary focus:ring-primary">
        <label for="skipCropping" class="text-sm text-text-secondary">不裁切，直接使用原图</label>
      </div>
      <div class="flex items-start gap-2 p-2 bg-info/5 rounded-lg border border-info/10 mt-2">
        <SvgIcon name="info" size="14" className="text-info mt-0.5 shrink-0" />
        <span class="text-xs text-text-secondary">支持JPG、PNG等格式，可选择比例并进行裁切</span>
      </div>
    </div>
    <!-- Generate Section -->
    <div v-if="activeTab === 'generate'" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium mb-1 text-text-secondary">封面模板</label>
          <select v-model="gen.template" class="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="minimal">极简纯净</option>
            <option value="gradient">柔和渐变</option>
            <option value="border">边框设计</option>
            <option value="ink">水墨风格</option>
            <option value="floral">花卉淡雅</option>
            <option value="neon">霓虹灯效</option>
            <option value="vintage">复古牛皮纸</option>
            <option value="geometric">几何图案</option>
            <option value="starfield">星空深空</option>
            <option value="bamboo">竹韵清风</option>
            <option value="wave">波浪纹理</option>
            <option value="typewriter">打字机风格</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1 text-text-secondary">颜色主题</label>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="theme in colorThemes" :key="theme.key" @click="gen.colorTheme = theme.key" class="w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center" :class="gen.colorTheme === theme.key ? 'border-primary scale-110' : 'border-transparent'" :title="theme.name">
              <span class="w-5 h-5 rounded-full" :style="{ background: theme.primary }"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="$emit('generate')" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg text-sm hover:opacity-90 transition-opacity"><SvgIcon name="sparkles" size="14" className="mr-1" /> 生成封面</button>
        <button @click="$emit('randomize')" class="px-4 py-2 bg-border text-text-secondary rounded-lg text-sm hover:bg-border/80 transition-colors"><SvgIcon name="wand" size="14" className="mr-1" /> 随机</button>
      </div>
      <div class="flex items-start gap-2 p-2 bg-info/5 rounded-lg border border-info/10">
        <SvgIcon name="info" size="14" className="text-info mt-0.5 shrink-0" />
        <span class="text-xs text-text-secondary">自动使用已输入的书名和作者生成封面，支持多种比例</span>
      </div>
    </div>
    <!-- Cover Preview -->
    <div v-if="coverPreview" class="flex justify-center">
      <div class="relative">
        <img :src="coverPreview" class="max-h-64 rounded-lg shadow-md" :style="{ maxWidth: settings.width + 'px' }">
        <button @click="removeCover" class="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full text-xs hover:bg-danger/80 transition-colors shadow"><SvgIcon name="x" size="12" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { coverColorThemes, coverRatioPresets } from '../utils/coverGenerator.js';
import SvgIcon from './SvgIcon.vue';

defineProps({
  coverPreview: String
});

const emit = defineEmits(['generate', 'randomize', 'upload', 'remove']);

const activeTab = ref('upload');
const isDragging = ref(false);

const settings = reactive({
  ratioPreset: 'standard',
  width: 600,
  height: 900,
  skipCropping: false
});

const gen = reactive({
  template: 'minimal',
  colorTheme: 'dark'
});

const colorThemes = coverColorThemes;

function onRatioChange() {
  const preset = coverRatioPresets[settings.ratioPreset];
  if (preset) { settings.width = preset.width; settings.height = preset.height; }
}

function onFileSelect(event) {
  const file = event.target.files[0];
  if (file) emit('upload', file);
}

function onDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) emit('upload', file);
}

function removeCover() { emit('remove'); }

defineExpose({ settings, gen });
</script>
