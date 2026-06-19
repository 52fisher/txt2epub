// 版本信息与更新日志
// 每次发布新版本时，在此文件中添加新条目即可

export const APP_VERSION = 'v2.1.1'

export const changelogs = [
  {
    version: 'v2.1.1',
    date: '2026-06-19',
    dotColor: 'bg-primary',
    changes: [
      '新增版本信息独立模块（src/constants/version.js），方便后续维护',
      '侧边栏版本号点击可查看更新日志弹窗',
      '移除页脚重复版本信息，统一为一处展示',
    ]
  },
  {
    version: 'v2.1.0',
    date: '2026-06-19',
    dotColor: 'bg-primary',
    changes: [
      '架构重构：App.vue 从 1540 行精简到约 280 行，采用 Composables + 页面组件三层架构',
      '新增 6 个 Composables（useTheme/useFile/useChapters/useCover/useStyle/useFilename）',
      '新增 8 个页面组件（AppLayout/FilePanel/MetadataPanel/CoverPanel/RecognitionPanel/ChaptersPanel/StylePanel/AdvancedPanel）',
      '章节识别规则从 19 种扩展到 32 种，新增篇/场/正文标题/成对符号等规则',
      '增强现有规则：支持〇零两、壹贰叁数字，负向前瞻排除歧义',
      '新增 6 种预设模板（混合模式/网络小说/传统出版/轻小说/晋江/激进模式）',
      '打开文件自动应用「混合模式 (推荐)」预设',
      '修复自定义规则正则匹配失败的问题（trimmed 替代原始 line）',
      '新增日间/夜间模式切换，主题偏好自动保存',
      '新增 SVG 图标系统（30+ 图标），替代所有 emoji',
      '新增 GitHub Actions 自动部署到 GitHub Pages',
      '移除封面设置、样式、高级页面的折叠交互，内容直接展示',
      '优化侧边栏布局，每个模块配备信息提示'
    ]
  },
  {
    version: 'v2.0.0',
    date: '2026-06-18',
    dotColor: 'bg-accent',
    changes: [
      '全新暗色毛玻璃（Glassmorphism）UI 设计',
      '左侧导航栏 + 右侧内容区布局',
      '封面设置：12 种 Canvas 封面模板、9 种颜色主题、9 种比例预设',
      '代码重构：提取 coverGenerator.js、3 个 Vue 子组件',
      '文件名格式系统：6 种预设 + 自定义模板，支持占位符',
      'RegExp 序列化修复（localStorage 持久化自定义规则）',
      '章节后置筛选器与前置筛选器合并到同一标签页'
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-06-17',
    dotColor: 'bg-text-secondary',
    changes: [
      '基础 TXT 转 EPUB 功能',
      '自动检测文件编码（jschardet）',
      '18 种章节识别规则',
      '元数据编辑（书名、作者、简介）',
      'EPUB 3.0 标准输出',
      'H1-H6 动态章节层级',
      '自定义章节规则（正则表达式）',
      '规则详情弹窗（正则、示例、描述）',
      '排版样式参数调节'
    ]
  }
]
