// 样式配置逻辑
import { reactive } from 'vue'

// 样式默认值
const defaultStyle = {
  paragraphIndent: 2,
  titleSize: 1.4,
  chapterTopMargin: 1,
  chapterBottomMargin: 1,
  pageMargin: 0,
  lineHeight: 1.3,
  paragraphSpacing: 0.5,
  tocSpacing: 0.2,
  textAlign: 'justify',
  titleAlign: 'center',
  titleBold: true,
  nightMode: false,
  titleUnderline: false,
  removeEmptyLines: false,
  chapterNav: false,
  kindleFontFollow: 'keep-current',
  chapterContinuous: false,
  chapterTitleLine: false,
  indentStyle: 'custom',
  customCSS: ''
}

// 样式响应式对象
const style = reactive({ ...defaultStyle })

// 滑块配置数组
const styleSliders = [
  { key: 'paragraphIndent', label: '段落缩进', min: 0, max: 4, step: 0.5, unit: 'em' },
  { key: 'titleSize', label: '标题大小', min: 1, max: 2, step: 0.1, unit: 'em' },
  { key: 'chapterTopMargin', label: '章节上方留白', min: 0, max: 3, step: 0.5, unit: 'em' },
  { key: 'chapterBottomMargin', label: '章节下方留白', min: 0, max: 3, step: 0.5, unit: 'em' },
  { key: 'pageMargin', label: '页面边距', min: 0, max: 3, step: 0.5, unit: 'em' },
  { key: 'lineHeight', label: '行高', min: 1, max: 2, step: 0.1, unit: '' },
  { key: 'paragraphSpacing', label: '段间距', min: 0, max: 2, step: 0.1, unit: 'em' },
  { key: 'tocSpacing', label: '目录条目间距', min: 0, max: 1, step: 0.1, unit: 'em' }
]

// 开关配置数组
const styleToggles = [
  { key: 'removeEmptyLines', label: '去除空行' },
  { key: 'nightMode', label: '夜间模式（黑底白字）' },
  { key: 'chapterTitleLine', label: '章节标题横线' },
  { key: 'titleBold', label: '章节标题加粗' },
  { key: 'chapterNav', label: '章节导航' },
  { key: 'chapterContinuous', label: '章节连续模式' }
]

// 初始化时从 localStorage 加载已保存的样式配置
const savedStyle = localStorage.getItem('txt2epub_style')
if (savedStyle) {
  try {
    const parsed = JSON.parse(savedStyle)
    Object.assign(style, parsed)
  } catch (e) {
    console.error('Failed to load saved style:', e)
  }
}

/**
 * 样式配置组合式函数
 */
export function useStyle() {
  /**
   * 重置样式到默认值
   */
  function resetStyle() {
    Object.assign(style, defaultStyle)
  }

  /**
   * 保存样式配置到 localStorage
   */
  function saveStyleConfig() {
    localStorage.setItem('txt2epub_style', JSON.stringify({ ...style }))
    alert('样式配置已保存到本地！')
  }

  /**
   * 应用默认 CSS 代码
   */
  function applyDefaultCSS() {
    style.customCSS = `/* 默认CSS样式 */
h2 {
  color: #333;
}

p {
  text-align: justify;
}`
  }

  return {
    // 响应式状态
    style,
    styleSliders,
    styleToggles,
    // 函数
    resetStyle,
    saveStyleConfig,
    applyDefaultCSS
  }
}
