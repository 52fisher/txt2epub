<template>
  <AppLayout
    v-model:activeNav="activeNav"
    :isDarkMode="isDarkMode"
    :fileLoaded="fileLoaded"
    :fileName="fileName"
    :fileSize="fileSize"
    :chapters="chapters"
    :selectedChapters="selectedChapters"
    :isConverting="isConverting"
    @toggleTheme="toggleTheme"
    @convert="convertToEpub"
  >
    <!-- File Upload (no file loaded) -->
    <div v-if="!fileLoaded" class="animate-fade-in max-w-2xl mx-auto mt-12">
      <div
        class="glass-card border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200"
        :class="{ 'drag-active': isDragging }"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div class="flex justify-center mb-5">
          <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SvgIcon name="upload" size="36" className="text-primary" />
          </div>
        </div>
        <h3 class="text-xl font-semibold mb-2">选择或拖拽 TXT 文件</h3>
        <p class="text-text-secondary mb-2">支持自动检测编码，智能识别章节格式</p>
        <p class="text-xs text-text-secondary/60 mb-8">支持 .txt 格式文件</p>
        <button
          @click="$refs.fileInput.click()"
          class="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 font-medium flex items-center gap-2 mx-auto"
        >
          <SvgIcon name="upload" size="18" />
          <span>选择文件</span>
        </button>
        <input ref="fileInput" type="file" accept=".txt" class="hidden" @change="handleFileSelect">
      </div>
    </div>

    <!-- Settings Panels -->
    <div v-else class="space-y-5 animate-fade-in max-w-4xl">
      <FilePanel
        v-if="activeNav === 'file'"
        :fileName="fileName"
        :fileSize="fileSize"
        :chapters="chapters"
        :encoding="encoding"
        :isDetectingEncoding="isDetectingEncoding"
        :detectedEncoding="detectedEncoding"
        :showTextEditor="showTextEditor"
        :fileContent="fileContent"
        @reReadFile="reReadFile"
        @autoDetectEncoding="autoDetectEncoding"
        @resetFile="resetFile"
        @update:encoding="encoding = $event"
        @update:showTextEditor="showTextEditor = $event"
        @update:fileContent="onTextEdit"
      />

      <MetadataPanel
        v-if="activeNav === 'metadata'"
        :metadata="metadata"
        :settings="settings"
        :filenameSettings="filenameSettings"
        :filenamePreview="filenamePreview"
        :filenameFormatPresets="filenameFormatPresets"
        :customTemplatePresets="customTemplatePresets"
        @update:metadata="Object.assign(metadata, $event)"
        @update:settings="Object.assign(settings, $event)"
        @updateFilenamePreview="updateFilenamePreview"
        @onFilenameSettingsChange="onFilenameSettingsChange"
        @onFilenameFormatChange="onFilenameFormatChange"
        @onCustomTemplateInput="onCustomTemplateInput"
        @applyCustomTemplatePreset="applyCustomTemplatePreset"
      />

      <CoverPanel
        v-if="activeNav === 'cover'"
        :coverPreview="coverPreview"
        @generate="generateCover"
        @randomize="randomizeCover"
        @upload="processCover"
        @remove="removeCover"
      />

      <RecognitionPanel
        v-if="activeNav === 'recognition'"
        :activeRecognitionTab="activeRecognitionTab"
        :selectedPatterns="selectedPatterns"
        :allChapterFormats="allChapterFormats"
        :presetTemplates="presetTemplates"
        :recognitionTabs="recognitionTabs"
        :preFilters="preFilters"
        :postFilters="postFilters"
        :isTemplateActiveFn="isTemplateActive"
        @update:activeRecognitionTab="activeRecognitionTab = $event"
        @applyTemplate="applyTemplate"
        @togglePattern="togglePattern"
        @selectAllPatterns="selectAllPatterns"
        @clearAllPatterns="clearAllPatterns"
        @openFormatDetail="openFormatDetail"
        @openFormatEdit="openFormatEdit"
      />

      <ChaptersPanel
        v-if="activeNav === 'chapters'"
        :chapters="chapters"
        :selectedChaptersCount="selectedChapters.length"
        :chaptersCount="chapters.length"
        :chapterListOptions="chapterListOptions"
        @selectAllChapters="selectAllChapters"
        @clearAllChapters="clearAllChapters"
        @resetChapterNumbers="resetChapterNumbers"
        @updateChapter="onChapterUpdate"
      />

      <StylePanel
        v-if="activeNav === 'style'"
        :style="style"
        :styleSliders="styleSliders"
        :styleToggles="styleToggles"
        @update:style="Object.assign(style, $event)"
        @resetStyle="resetStyle"
        @saveStyleConfig="saveStyleConfig"
      />

      <AdvancedPanel
        v-if="activeNav === 'advanced'"
        :customCSS="style.customCSS"
        @update:customCSS="style.customCSS = $event"
        @applyDefaultCSS="applyDefaultCSS"
        @clearCSS="style.customCSS = ''"
      />
    </div>
  </AppLayout>

  <!-- Format Detail Dialog -->
  <FormatDetailDialog
    :visible="showFormatDetail"
    :data="formatDetailData"
    @close="closeFormatDetail"
  />

  <!-- Format Edit Dialog -->
  <FormatEditDialog
    :visible="showFormatEdit"
    :edit-key="editingFormatKey"
    :initial-data="editingFormatInitialData"
    @save="saveCustomFormat"
    @delete="deleteCustomFormat"
    @close="closeFormatEdit"
  />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useTheme } from './composables/useTheme.js'
import { useFilename } from './composables/useFilename.js'
import { useStyle } from './composables/useStyle.js'
import { useChapters } from './composables/useChapters.js'
import { useFile } from './composables/useFile.js'
import { useCover } from './composables/useCover.js'
import { generateEpub, downloadBlob } from './utils/epubGenerator.js'
import { presetTemplates, getChapterContents, getPrefaceContent } from './utils/chapterPatterns.js'
import SvgIcon from './components/SvgIcon.vue'
import AppLayout from './components/AppLayout.vue'
import FilePanel from './components/FilePanel.vue'
import MetadataPanel from './components/MetadataPanel.vue'
import CoverPanel from './components/CoverPanel.vue'
import RecognitionPanel from './components/RecognitionPanel.vue'
import ChaptersPanel from './components/ChaptersPanel.vue'
import StylePanel from './components/StylePanel.vue'
import AdvancedPanel from './components/AdvancedPanel.vue'
import FormatDetailDialog from './components/FormatDetailDialog.vue'
import FormatEditDialog from './components/FormatEditDialog.vue'

// Theme
const { isDarkMode, toggleTheme } = useTheme()

// Metadata & Settings
const metadata = reactive({ title: '', author: '', description: '' })
const settings = reactive({ generateToc: false, prefaceTitle: '', customPrefaceTitle: '' })

// Filename
const {
  filenameSettings, filenamePreview,
  updateFilenamePreview, onFilenameSettingsChange, onFilenameFormatChange,
  onCustomTemplateInput, applyCustomTemplatePreset,
  filenameFormatPresets, customTemplatePresets
} = useFilename(metadata)

// Style
const { style, styleSliders, styleToggles, resetStyle, saveStyleConfig, applyDefaultCSS } = useStyle()

// Chapters
const fileContent = ref('')
const {
  selectedPatterns, activeRecognitionTab, chapters,
  preFilters, postFilters, chapterListOptions,
  customFormats, allChapterFormats, selectedChapters, recognitionTabs,
  showFormatDetail, formatDetailData, showFormatEdit, editingFormatKey, editingFormatInitialData,
  detectChaptersFromContent, applyTemplate, isTemplateActive,
  togglePattern, selectAllPatterns, clearAllPatterns,
  selectAllChapters, clearAllChapters, resetChapterNumbers,
  onChapterLevelChange, getLevelColorClass,
  openFormatDetail, closeFormatDetail, openFormatEdit, closeFormatEdit,
  saveCustomFormat, deleteCustomFormat
} = useChapters(fileContent)

// File
const {
  isDragging, fileLoaded, fileName, fileSize, encoding, rawFile,
  isDetectingEncoding, detectedEncoding, showTextEditor,
  handleFileSelect, handleDrop, processFile, autoDetectEncoding,
  readFile, reReadFile, onTextEdit, resetFile
} = useFile(metadata, filenameSettings, updateFilenamePreview, detectChaptersFromContent, () => {
  // 文件加载后应用推荐预设模板
  const recommendedPreset = presetTemplates.find(t => t.name === '混合模式 (推荐)')
  if (recommendedPreset) {
    selectedPatterns.value = [...recommendedPreset.patterns]
  }
}, fileContent)

// Cover
const {
  coverImage, coverPreview, coverSettingsPanel,
  processCover, removeCover, generateCover, randomizeCover
} = useCover(metadata)

// Navigation
const activeNav = ref('file')

// Conversion state
const isConverting = ref(false)

// Chapter update handler
function onChapterUpdate({ index, field, value }) {
  if (chapters.value[index]) {
    chapters.value[index][field] = value
  }
}

// EPUB Conversion
async function convertToEpub() {
  if (selectedChapters.value.length === 0) return
  isConverting.value = true

  try {
    const chapterContents = getChapterContents(fileContent.value, selectedChapters.value)

    let prefaceContent = ''
    let prefaceTitle = ''
    if (settings.prefaceTitle && selectedChapters.value.length > 0) {
      const firstChapterLine = selectedChapters.value[0].lineNumber
      prefaceContent = getPrefaceContent(fileContent.value, firstChapterLine)
      prefaceTitle = settings.prefaceTitle === 'custom' ? settings.customPrefaceTitle : settings.prefaceTitle
    }

    const blob = await generateEpub({
      metadata: {
        title: metadata.title || fileName.value,
        author: metadata.author || 'Unknown',
        description: metadata.description,
        prefaceTitle
      },
      chapters: chapterContents,
      style: { ...style },
      coverImage: coverImage.value,
      generateToc: settings.generateToc,
      prefaceContent,
      prefaceTitle
    })

    const outputName = (filenamePreview.value || metadata.title || fileName.value) + '.epub'
    downloadBlob(blob, outputName)
  } catch (error) {
    console.error('Conversion failed:', error)
    alert('转换失败: ' + error.message)
  } finally {
    isConverting.value = false
  }
}
</script>
