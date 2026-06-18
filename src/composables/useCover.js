// 封面处理逻辑
import { ref } from 'vue'
import { generateCoverImage, coverColorThemes } from '../utils/coverGenerator.js'

/**
 * 封面处理组合式函数
 * @param {Object} metadata - 响应式的元数据对象
 */
export function useCover(metadata) {
  // 封面图片数据（ArrayBuffer）
  const coverImage = ref(null)
  // 封面预览（DataURL）
  const coverPreview = ref('')
  // 封面设置面板 ref
  const coverSettingsPanel = ref(null)

  /**
   * 处理上传的封面图片
   */
  function processCover(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    const blobReader = new FileReader()
    blobReader.onload = (e) => {
      coverImage.value = e.target.result
    }
    blobReader.readAsArrayBuffer(file)
  }

  /**
   * 移除封面
   */
  function removeCover() {
    coverImage.value = null
    coverPreview.value = ''
  }

  /**
   * 使用 coverGenerator 生成封面
   */
  async function generateCover() {
    const panel = coverSettingsPanel.value
    if (!panel) return

    const { settings, gen } = panel
    try {
      const result = await generateCoverImage({
        width: settings.width,
        height: settings.height,
        template: gen.template,
        colorTheme: gen.colorTheme,
        title: metadata.title || '未命名',
        author: metadata.author || ''
      })
      coverPreview.value = result.dataUrl
      coverImage.value = result.arrayBuffer
    } catch (error) {
      console.error('Cover generation failed:', error)
    }
  }

  /**
   * 随机生成封面（随机模板和配色）
   */
  function randomizeCover() {
    const panel = coverSettingsPanel.value
    if (!panel) return

    const templates = ['minimal', 'gradient', 'border', 'ink', 'floral', 'neon', 'vintage', 'geometric', 'starfield', 'bamboo', 'wave', 'typewriter']
    const themes = coverColorThemes.map(t => t.key)
    panel.gen.template = templates[Math.floor(Math.random() * templates.length)]
    panel.gen.colorTheme = themes[Math.floor(Math.random() * themes.length)]
    generateCover()
  }

  return {
    // 响应式状态
    coverImage,
    coverPreview,
    coverSettingsPanel,
    // 函数
    processCover,
    removeCover,
    generateCover,
    randomizeCover
  }
}
