<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
      <div class="bg-surface-solid/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">{{ editKey ? '编辑自定义格式' : '添加自定义格式' }}</h3>
            <button @click="$emit('close')" class="text-text-secondary hover:text-danger transition-colors text-xl"><SvgIcon name="x" size="20" /></button>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-2 p-2 bg-info/5 rounded-lg border border-info/10 mb-3">
              <SvgIcon name="info" size="14" className="text-info mt-0.5 shrink-0" />
              <span class="text-xs text-text-secondary">自定义格式使用正则表达式匹配章节标题，添加后可在多选组合中使用</span>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">格式名称</label>
              <input v-model="form.name" type="text" class="w-full px-3 py-2 border border-border rounded-lg bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="例如：我的自定义格式">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">正则表达式</label>
              <input v-model="form.pattern" type="text" class="w-full px-3 py-2 border border-border rounded-lg bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm" placeholder="例如：^\s*第[\d]+章\s*.+">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">示例文本（每行一个）</label>
              <textarea v-model="form.examples" rows="3" class="w-full px-3 py-2 border border-border rounded-lg bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm" placeholder="第一章 开始&#10;第二章 发展"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">描述</label>
              <input v-model="form.description" type="text" class="w-full px-3 py-2 border border-border rounded-lg bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="描述这个格式的用途">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">默认章节级别</label>
              <select v-model="form.level" class="w-full px-3 py-2 border border-border rounded-lg bg-bg/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option v-for="lvl in [1,2,3,4,5,6]" :key="lvl" :value="lvl">H{{ lvl }} - {{ getLevelDescription(lvl) }}</option>
              </select>
            </div>
            <div class="p-3 bg-bg/50 rounded-lg border border-primary/20">
              <div class="text-xs text-text-secondary mb-2">测试正则表达式</div>
              <input v-model="testInput" type="text" class="w-full px-2 py-1.5 border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/20" placeholder="输入测试文本...">
              <div v-if="testResult !== null" class="mt-2">
                <div v-if="testResult" class="text-sm px-3 py-2 bg-success/10 text-success rounded border border-success/20"><SvgIcon name="check" size="14" className="mr-1 inline" />匹配成功</div>
                <div v-else class="text-sm px-3 py-2 bg-danger/10 text-danger rounded border border-danger/20"><SvgIcon name="x" size="14" className="mr-1 inline" />不匹配</div>
              </div>
            </div>
            <div class="flex gap-2 pt-2">
              <button @click="save" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity">{{ editKey ? '保存修改' : '添加格式' }}</button>
              <button v-if="editKey" @click="$emit('delete')" class="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 transition-colors">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
  visible: Boolean,
  editKey: String,
  initialData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save', 'delete']);

const form = reactive({ name: '', pattern: '', examples: '', description: '', level: 2 });
const testInput = ref('');
const testResult = ref(null);

watch(() => props.visible, (val) => {
  if (val) {
    if (props.editKey && props.initialData) {
      form.name = props.initialData.name || '';
      form.pattern = props.initialData.pattern ? (props.initialData.pattern.source || String(props.initialData.pattern)) : '';
      form.examples = props.initialData.examples ? props.initialData.examples.join('\n') : '';
      form.description = props.initialData.description || '';
      form.level = props.initialData.level || 2;
    } else {
      form.name = ''; form.pattern = ''; form.examples = ''; form.description = ''; form.level = 2;
    }
    testInput.value = ''; testResult.value = null;
  }
});

watch(testInput, (val) => {
  if (!val || !form.pattern) { testResult.value = null; return; }
  try {
    const regex = new RegExp(form.pattern);
    testResult.value = regex.test(val);
  } catch (e) { testResult.value = null; }
});

function getLevelDescription(level) {
  const descriptions = { 1: '卷/部级别', 2: '章级别', 3: '节级别', 4: '小节级别', 5: '小标题', 6: '最小标题' };
  return descriptions[level] || '章级别';
}

function save() {
  try {
    const regex = new RegExp(form.pattern);
    emit('save', {
      name: form.name,
      pattern: regex,
      examples: form.examples.split('\n').filter(e => e.trim()),
      description: form.description,
      level: parseInt(form.level) || 2
    });
  } catch (e) {
    alert('正则表达式无效: ' + e.message);
  }
}
</script>
