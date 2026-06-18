// 文件名设置逻辑
import { ref, reactive } from 'vue'
import {
  generateFilename,
  filenameFormatPresets,
  customTemplatePresets,
  saveFilenameSettings,
  loadFilenameSettings
} from '../utils/filenameParser.js'

/**
 * 文件名设置组合式函数
 * @param {Object} metadata - 响应式的元数据对象
 */
export function useFilename(metadata) {
  // 文件名设置（从 localStorage 加载）
  const filenameSettings = reactive(loadFilenameSettings())
  // 文件名预览
  const filenamePreview = ref('')

  /**
   * 更新文件名预览
   */
  function updateFilenamePreview() {
    const title = metadata.title || ''
    const author = metadata.author || ''
    filenamePreview.value = generateFilename(
      filenameSettings.format,
      title,
      author,
      filenameSettings.customTemplate
    )
  }

  /**
   * 文件名设置变更时保存并更新预览
   */
  function onFilenameSettingsChange() {
    saveFilenameSettings(filenameSettings)
    updateFilenamePreview()
  }

  /**
   * 文件名格式变更时保存并更新预览
   */
  function onFilenameFormatChange() {
    saveFilenameSettings(filenameSettings)
    updateFilenamePreview()
  }

  /**
   * 自定义模板输入时保存并更新预览
   */
  function onCustomTemplateInput() {
    saveFilenameSettings(filenameSettings)
    updateFilenamePreview()
  }

  /**
   * 应用自定义模板预设
   */
  function applyCustomTemplatePreset(tp) {
    filenameSettings.customTemplate = tp.template
    saveFilenameSettings(filenameSettings)
    updateFilenamePreview()
  }

  return {
    // 响应式状态
    filenameSettings,
    filenamePreview,
    // 函数
    updateFilenamePreview,
    onFilenameSettingsChange,
    onFilenameFormatChange,
    onCustomTemplateInput,
    applyCustomTemplatePreset,
    // 导出常量
    filenameFormatPresets,
    customTemplatePresets
  }
}
