// 章节检测与管理逻辑
import { ref, computed, reactive, watch } from 'vue'
import {
  chapterPatterns,
  presetTemplates,
  preFilterOptions,
  postFilterOptions,
  detectChapters,
  loadCustomFormats,
  saveCustomFormats,
  CUSTOM_FORMATS_KEY
} from '../utils/chapterPatterns.js'

/**
 * 章节检测组合式函数
 * @param {import('vue').Ref<string>} fileContent - 文件文本内容的 ref
 */
export function useChapters(fileContent) {
  // 已选中的章节格式 pattern key 列表
  const selectedPatterns = ref(Object.keys(chapterPatterns))
  // 当前识别标签页
  const activeRecognitionTab = ref('preset')
  // 检测到的章节列表
  const chapters = ref([])

  // 前置筛选器设置
  const preFilters = reactive({
    requireEmptyLine: { ...preFilterOptions.requireEmptyLine },
    skipIndented: { ...preFilterOptions.skipIndented },
    prefixLengthLimit: { ...preFilterOptions.prefixLengthLimit },
    titleLineCount: { ...preFilterOptions.titleLineCount }
  })

  // 后置筛选器设置
  const postFilters = reactive({
    excludeDates: { ...postFilterOptions.excludeDates },
    excludePureNumbers: { ...postFilterOptions.excludePureNumbers },
    excludeLongTitles: { ...postFilterOptions.excludeLongTitles }
  })

  // 章节列表选项
  const chapterListOptions = reactive({
    showChapterNumbers: false,
    deduplicate: false
  })

  // 自定义格式
  const customFormats = ref(loadCustomFormats())

  // 所有章节格式（系统 + 自定义）
  const allChapterFormats = computed(() => ({ ...chapterPatterns, ...customFormats.value }))

  // 已选中的章节（computed）
  const selectedChapters = computed(() => chapters.value.filter(c => c.selected))

  // 识别标签页配置
  const recognitionTabs = [
    { key: 'preset', name: '📋 预设模板' },
    { key: 'multiselect', name: '🎯 多选组合', badge: 'Beta' },
    { key: 'prefilter', name: '🔍 筛选器' }
  ]

  // 格式详情对话框状态
  const showFormatDetail = ref(false)
  const formatDetailData = ref({})

  // 格式编辑对话框状态
  const showFormatEdit = ref(false)
  const editingFormatKey = ref(null)
  const editingFormatInitialData = computed(() => {
    if (!editingFormatKey.value || !customFormats.value[editingFormatKey.value]) return null
    return customFormats.value[editingFormatKey.value]
  })

  /**
   * 从文件内容中检测章节
   */
  function detectChaptersFromContent() {
    const patterns = selectedPatterns.value.map(key => ({
      ...allChapterFormats.value[key],
      key,
      id: key
    }))
    const preFilterSettings = {
      requireEmptyLine: preFilters.requireEmptyLine.enabled,
      skipIndented: preFilters.skipIndented.enabled,
      prefixLengthLimit: preFilters.prefixLengthLimit.value,
      titleLineCount: preFilters.titleLineCount.value
    }

    let detected = detectChapters(fileContent.value, patterns, preFilterSettings)

    // 应用后置筛选器（日期、纯数字、过长标题）
    detected = detected.map(ch => {
      const title = ch.title.trim()
      let filteredOut = false

      // 日期格式检查
      if (postFilters.excludeDates.enabled) {
        const datePatterns = [
          /^\d{4}[\/\-\.年]\d{1,2}[\/\-\.月]\d{1,2}[日]?$/,
          /^\d{4}[\/\-\.年]\d{1,2}[月]?$/,
          /^\d{1,2}[\/\-\.月]\d{1,2}[日]?$/,
          /^\d{4}年.*$/,
          /^公元\d+年.*$/,
          /^\d{4}-\d{2}-\d{2}$/,
          /^\d{2}\/\d{2}\/\d{4}$/,
          /^\d{1,2}月\d{1,2}日$/,
          /^\d{4}年代$/,
          /^\d{2}世纪$/
        ]
        if (datePatterns.some(p => p.test(title))) {
          filteredOut = true
        }
      }

      // 纯数字检查
      if (!filteredOut && postFilters.excludePureNumbers.enabled) {
        if (/^\d+$/.test(title)) {
          filteredOut = true
        }
      }

      // 过长标题检查
      if (!filteredOut && postFilters.excludeLongTitles.enabled) {
        const maxLen = postFilters.excludeLongTitles.maxTitleLength || 40
        if (title.length > maxLen) {
          filteredOut = true
        }
      }

      return {
        ...ch,
        selected: !filteredOut,
        filteredOut
      }
    })

    // 应用去重
    if (chapterListOptions.deduplicate) {
      detected = detected.filter((ch, idx) => {
        if (idx === 0) return true
        const prev = detected[idx - 1]
        return ch.title !== prev.title
      })
    }

    // 应用章节编号
    if (chapterListOptions.showChapterNumbers) {
      detected = detected.map((ch, idx) => ({
        ...ch,
        displayTitle: `${idx + 1}. ${ch.title}`
      }))
    }

    chapters.value = detected
  }

  /**
   * 应用预设模板
   */
  function applyTemplate(template) {
    selectedPatterns.value = [...template.patterns]
  }

  /**
   * 判断预设模板是否激活
   */
  function isTemplateActive(template) {
    return template.patterns.every(p => selectedPatterns.value.includes(p)) &&
           template.patterns.length === selectedPatterns.value.length
  }

  /**
   * 切换单个格式的选中状态
   */
  function togglePattern(key) {
    const idx = selectedPatterns.value.indexOf(key)
    if (idx > -1) {
      selectedPatterns.value.splice(idx, 1)
    } else {
      selectedPatterns.value.push(key)
    }
  }

  /**
   * 全选所有格式
   */
  function selectAllPatterns() {
    selectedPatterns.value = Object.keys(allChapterFormats.value)
  }

  /**
   * 清空所有已选格式
   */
  function clearAllPatterns() {
    selectedPatterns.value = []
  }

  /**
   * 全选所有章节
   */
  function selectAllChapters() {
    chapters.value.forEach(c => c.selected = true)
  }

  /**
   * 取消选中所有章节
   */
  function clearAllChapters() {
    chapters.value.forEach(c => c.selected = false)
  }

  /**
   * 重置章节编号显示
   */
  function resetChapterNumbers() {
    chapters.value.forEach((ch) => {
      ch.displayTitle = ch.title
    })
  }

  /**
   * 章节层级变更回调
   */
  function onChapterLevelChange(chapter) {
    // 层级已变更
  }

  /**
   * 根据层级获取颜色 class
   */
  function getLevelColorClass(level) {
    const colors = {
      1: 'bg-warning/10 text-warning border-warning/30',
      2: 'bg-primary/10 text-primary border-primary/30',
      3: 'bg-success/10 text-success border-success/30',
      4: 'bg-info/10 text-info border-info/30',
      5: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30',
      6: 'bg-border text-text-secondary border-border'
    }
    return colors[level] || colors[2]
  }

  // ===== 格式详情对话框 =====

  /**
   * 打开格式详情对话框
   */
  function openFormatDetail(key, pattern) {
    formatDetailData.value = {
      ...pattern,
      key
    }
    showFormatDetail.value = true
  }

  /**
   * 关闭格式详情对话框
   */
  function closeFormatDetail() {
    showFormatDetail.value = false
    formatDetailData.value = {}
  }

  // ===== 格式编辑对话框 =====

  /**
   * 打开格式编辑对话框
   */
  function openFormatEdit(key, pattern) {
    editingFormatKey.value = key
    showFormatEdit.value = true
  }

  /**
   * 关闭格式编辑对话框
   */
  function closeFormatEdit() {
    showFormatEdit.value = false
    editingFormatKey.value = null
  }

  /**
   * 保存自定义格式
   */
  function saveCustomFormat(data) {
    const key = editingFormatKey.value || 'custom_' + Date.now()
    const formatData = {
      id: key,
      name: data.name,
      pattern: data.pattern,
      examples: data.examples,
      description: data.description,
      level: data.level,
      enabled: true,
      isSystem: false
    }

    customFormats.value[key] = formatData
    saveCustomFormats(customFormats.value)

    // 如果是新建格式，添加到已选 patterns
    if (!editingFormatKey.value && !selectedPatterns.value.includes(key)) {
      selectedPatterns.value.push(key)
    }

    closeFormatEdit()
  }

  /**
   * 删除自定义格式
   */
  function deleteCustomFormat() {
    if (!editingFormatKey.value) return
    if (confirm('确定要删除这个自定义格式吗？')) {
      delete customFormats.value[editingFormatKey.value]
      saveCustomFormats(customFormats.value)

      // 从已选 patterns 中移除
      const idx = selectedPatterns.value.indexOf(editingFormatKey.value)
      if (idx > -1) {
        selectedPatterns.value.splice(idx, 1)
      }

      closeFormatEdit()
    }
  }

  // 监听 selectedPatterns 和 preFilters 变化，重新检测章节
  watch([selectedPatterns, preFilters], () => {
    if (fileContent.value) {
      detectChaptersFromContent()
    }
  }, { deep: true })

  // 监听 postFilters 变化，重新检测章节
  watch(postFilters, () => {
    if (fileContent.value) {
      detectChaptersFromContent()
    }
  }, { deep: true })

  // 监听 chapterListOptions 变化，重新检测章节
  watch(chapterListOptions, () => {
    if (fileContent.value) {
      detectChaptersFromContent()
    }
  }, { deep: true })

  return {
    // 响应式状态
    selectedPatterns,
    activeRecognitionTab,
    chapters,
    preFilters,
    postFilters,
    chapterListOptions,
    customFormats,
    allChapterFormats,
    selectedChapters,
    recognitionTabs,
    showFormatDetail,
    formatDetailData,
    showFormatEdit,
    editingFormatKey,
    editingFormatInitialData,
    // 函数
    detectChaptersFromContent,
    applyTemplate,
    isTemplateActive,
    togglePattern,
    selectAllPatterns,
    clearAllPatterns,
    selectAllChapters,
    clearAllChapters,
    resetChapterNumbers,
    onChapterLevelChange,
    getLevelColorClass,
    openFormatDetail,
    closeFormatDetail,
    openFormatEdit,
    closeFormatEdit,
    saveCustomFormat,
    deleteCustomFormat
  }
}
