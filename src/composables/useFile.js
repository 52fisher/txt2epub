// 文件处理逻辑
import { ref } from 'vue'
import { detectEncoding, readFileAsArrayBuffer, readFileAsText } from '../utils/encodingDetector.js'
import { parseFilenameMetadata, extractAuthorFromText } from '../utils/filenameParser.js'
import { presetTemplates } from '../utils/chapterPatterns.js'

/**
 * 文件处理组合式函数
 * @param {Object} metadata - 响应式的元数据对象
 * @param {Object} filenameSettings - 响应式的文件名设置对象
 * @param {Function} updateFilenamePreview - 更新文件名预览的函数
 * @param {Function} detectChaptersFromContent - 从内容中检测章节的函数
 * @param {Function} onFileLoaded - 文件加载完成后的回调（用于设置预设模板等）
 * @param {import('vue').Ref<string>} fileContent - 外部共享的文件内容 ref
 */
export function useFile(metadata, filenameSettings, updateFilenamePreview, detectChaptersFromContent, onFileLoaded, fileContent) {
  // 拖拽状态
  const isDragging = ref(false)
  // 文件是否已加载
  const fileLoaded = ref(false)
  // 文件名（不含扩展名）
  const fileName = ref('')
  // 文件大小（格式化后的字符串）
  const fileSize = ref('')
  // 当前编码
  const encoding = ref('UTF-8')
  // 原始文件对象
  const rawFile = ref(null)
  // 是否正在检测编码
  const isDetectingEncoding = ref(false)
  // 编码检测结果
  const detectedEncoding = ref(null)
  // 是否显示文本编辑器
  const showTextEditor = ref(false)

  /**
   * 处理文件选择事件
   */
  function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) processFile(file)
  }

  /**
   * 处理文件拖放事件
   */
  function handleDrop(event) {
    isDragging.value = false
    const file = event.dataTransfer.files[0]
    if (file && file.name.endsWith('.txt')) {
      processFile(file)
    }
  }

  /**
   * 处理文件：自动检测编码、自动解析文件名、读取文件内容
   */
  async function processFile(file) {
    rawFile.value = file
    fileName.value = file.name.replace('.txt', '')
    fileSize.value = formatFileSize(file.size)

    // 自动检测编码
    await autoDetectEncoding()

    // 自动整理文件名
    if (filenameSettings.autoParse) {
      const parsed = parseFilenameMetadata(file.name)
      metadata.title = parsed.title
      if (parsed.author) {
        metadata.author = parsed.author
      }
    } else {
      metadata.title = file.name.replace(/\.txt$/i, '')
    }

    // 更新文件名预览
    updateFilenamePreview()

    // 通知文件已加载（由调用方处理预设模板等逻辑）
    if (onFileLoaded) onFileLoaded()

    readFile()
  }

  /**
   * 自动检测文件编码
   */
  async function autoDetectEncoding() {
    if (!rawFile.value) return

    isDetectingEncoding.value = true
    try {
      const buffer = await readFileAsArrayBuffer(rawFile.value)
      const result = detectEncoding(buffer)
      detectedEncoding.value = result

      if (result.encoding && result.encoding !== encoding.value) {
        encoding.value = result.encoding
        // 用检测到的编码重新读取文件
        const text = await readFileAsText(rawFile.value, result.encoding)
        fileContent.value = text
        detectChaptersFromContent()
        fileLoaded.value = true

        // 尝试从文本内容中提取作者
        const textAuthor = extractAuthorFromText(text)
        if (textAuthor && !metadata.author) {
          metadata.author = textAuthor
        }
      }
    } catch (error) {
      console.error('Encoding detection failed:', error)
    } finally {
      isDetectingEncoding.value = false
    }
  }

  /**
   * 读取文件内容（使用当前编码）
   */
  function readFile() {
    if (!rawFile.value) return

    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target.result
      detectChaptersFromContent()
      fileLoaded.value = true

      // 尝试从文本内容中提取作者
      const textAuthor = extractAuthorFromText(e.target.result)
      if (textAuthor && !metadata.author) {
        metadata.author = textAuthor
      }
    }
    reader.readAsText(rawFile.value, encoding.value)
  }

  /**
   * 重新读取文件（切换编码后调用）
   */
  function reReadFile() {
    readFile()
  }

  /**
   * 文本编辑时触发重新检测章节
   */
  function onTextEdit() {
    detectChaptersFromContent()
  }

  /**
   * 重置文件状态
   */
  function resetFile() {
    fileLoaded.value = false
    fileName.value = ''
    fileSize.value = ''
    fileContent.value = ''
    rawFile.value = null
    detectedEncoding.value = null
  }

  /**
   * 格式化文件大小
   */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return {
    // 响应式状态
    isDragging,
    fileLoaded,
    fileName,
    fileSize,
    fileContent,
    encoding,
    rawFile,
    isDetectingEncoding,
    detectedEncoding,
    showTextEditor,
    // 函数
    handleFileSelect,
    handleDrop,
    processFile,
    autoDetectEncoding,
    readFile,
    reReadFile,
    onTextEdit,
    resetFile,
    formatFileSize
  }
}
