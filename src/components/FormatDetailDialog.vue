<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
      <div class="bg-surface-solid/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">{{ data.name }}</h3>
            <button @click="$emit('close')" class="text-text-secondary hover:text-danger transition-colors text-xl"><SvgIcon name="x" size="20" /></button>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-2 p-2 bg-info/5 rounded-lg border border-info/10 mb-3">
              <SvgIcon name="info" size="14" className="text-info mt-0.5 shrink-0" />
              <span class="text-xs text-text-secondary">查看格式的正则表达式和示例，可在下方测试文本匹配效果</span>
            </div>
            <div class="p-3 bg-bg/50 rounded-lg">
              <div class="text-xs text-text-secondary mb-1">描述</div>
              <div class="text-sm">{{ data.description || '暂无描述' }}</div>
            </div>
            <div class="p-3 bg-bg/50 rounded-lg">
              <div class="text-xs text-text-secondary mb-1">正则表达式</div>
              <code class="text-sm font-mono bg-surface px-2 py-1 rounded border border-border block break-all">{{ data.pattern }}</code>
            </div>
            <div class="p-3 bg-bg/50 rounded-lg">
              <div class="text-xs text-text-secondary mb-2">示例文本</div>
              <div class="space-y-1">
                <div v-for="(example, idx) in data.examples" :key="idx" class="text-sm px-2 py-1 bg-surface rounded border border-border">{{ example }}</div>
              </div>
            </div>
            <div class="p-3 bg-bg/50 rounded-lg">
              <div class="text-xs text-text-secondary mb-1">默认章节级别</div>
              <div class="text-sm">H{{ data.level || 2 }} ({{ getLevelDescription(data.level || 2) }})</div>
            </div>
            <div class="flex gap-2">
              <span v-if="data.isSystem" class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">系统格式</span>
              <span v-else class="text-xs bg-success/10 text-success px-2 py-1 rounded-full">自定义格式</span>
            </div>
            <div class="p-3 bg-bg/50 rounded-lg border border-primary/20">
              <div class="text-xs text-text-secondary mb-2">正则表达式测试</div>
              <textarea v-model="testInput" rows="3" class="w-full px-2 py-1.5 border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/20" placeholder="输入测试文本..."></textarea>
              <div v-if="testResult !== null" class="mt-2">
                <div v-if="testResult" class="text-sm px-3 py-2 bg-success/10 text-success rounded border border-success/20"><SvgIcon name="check" size="14" className="mr-1 inline" />匹配成功</div>
                <div v-else class="text-sm px-3 py-2 bg-danger/10 text-danger rounded border border-danger/20"><SvgIcon name="x" size="14" className="mr-1 inline" />不匹配</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
  visible: Boolean,
  data: { type: Object, default: () => ({}) }
});

defineEmits(['close']);

const testInput = ref('');
const testResult = ref(null);

watch(() => props.visible, (val) => {
  if (val) { testInput.value = ''; testResult.value = null; }
});

watch(testInput, (val) => {
  if (!val || !props.data.pattern) { testResult.value = null; return; }
  try {
    const regex = new RegExp(props.data.pattern);
    testResult.value = regex.test(val);
  } catch (e) { testResult.value = null; }
});

function getLevelDescription(level) {
  const descriptions = { 1: '卷/部级别', 2: '章级别', 3: '节级别', 4: '小节级别', 5: '小标题', 6: '最小标题' };
  return descriptions[level] || '章级别';
}
</script>
