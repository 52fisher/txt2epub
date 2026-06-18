<template>
  <div class="min-h-screen bg-bg text-text relative flex">
    <!-- Background Pattern -->
    <div class="fixed inset-0 pointer-events-none opacity-30" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>

    <!-- Left Sidebar Navigation -->
    <aside class="fixed left-0 top-0 bottom-0 w-[240px] bg-surface/60 backdrop-blur-xl border-r border-border z-40 flex flex-col">
      <!-- Logo -->
      <div class="px-5 py-4 border-b border-border flex items-center gap-2.5">
        <SvgIcon name="book" size="22" className="text-primary" />
        <h1 class="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TXT 转 EPUB</h1>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <button
          v-for="item in navItems"
          :key="item.key"
          @click="activeNav = item.key"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
          :class="activeNav === item.key
            ? 'bg-primary/10 text-primary'
            : 'text-text-secondary hover:bg-white/5 hover:text-text'"
        >
          <span v-if="activeNav === item.key" class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"></span>
          <SvgIcon :name="item.icon" size="18" :className="activeNav === item.key ? 'text-primary' : 'text-text-secondary'" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="ml-auto text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded-full">{{ item.badge }}</span>
        </button>
      </nav>

      <!-- Theme Toggle -->
      <div class="px-3 py-2 border-t border-border">
        <button
          @click="toggleTheme"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-text-secondary hover:bg-white/5 hover:text-text"
        >
          <SvgIcon :name="isDarkMode ? 'sun' : 'moon'" size="18" className="text-text-secondary" />
          <span>{{ isDarkMode ? '日间模式' : '夜间模式' }}</span>
        </button>
      </div>

      <!-- Footer info -->
      <div class="px-5 py-3 border-t border-border text-[11px] text-text-secondary">
        TXT 转 EPUB v2.0.0
      </div>
    </aside>

    <!-- Right Content Area -->
    <div class="ml-[240px] flex-1 flex flex-col min-h-screen">
      <!-- Top Header Bar -->
      <header class="bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-30">
        <div class="px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-text-secondary">
            <SvgIcon name="fileText" size="16" className="text-text-secondary" />
            <span v-if="fileLoaded">{{ fileName }}</span>
            <span v-else>未选择文件</span>
          </div>
          <div class="text-sm text-text-secondary" v-if="fileLoaded">
            {{ fileSize }} | {{ chapters.length }} 个章节 | 已选 {{ selectedChapters.length }} 个
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 px-6 py-6 pb-32">
        <!-- File Upload Section -->
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
            <input
              ref="fileInput"
              type="file"
              accept=".txt"
              class="hidden"
              @change="handleFileSelect"
            >
          </div>
        </div>

        <!-- Settings Panel -->
        <div v-else class="space-y-5 animate-fade-in max-w-4xl">
          <!-- File Info & Encoding -->
          <div v-if="activeNav === 'file'" class="space-y-5">
            <div class="glass-card overflow-hidden">
              <div class="p-4 border-b border-border flex items-center gap-2">
                <SvgIcon name="fileText" size="18" className="text-primary" />
                <h3 class="font-semibold">文件信息</h3>
              </div>
              <div class="p-4 space-y-4">
                <div class="flex items-start gap-3 p-3 bg-bg/50 rounded-lg">
                  <SvgIcon name="fileText" size="20" className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div class="font-medium">{{ fileName }}</div>
                    <div class="text-sm text-text-secondary">{{ fileSize }} | {{ chapters.length }} 个章节</div>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">上传 TXT 文件后，系统会自动检测编码格式。如遇乱码，可手动切换编码重新读取。</span>
                </div>

                <div class="flex items-center gap-3 flex-wrap">
                  <div class="flex items-center gap-2">
                    <select v-model="encoding" @change="reReadFile" class="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="UTF-8">UTF-8</option>
                      <option value="GBK">GBK (兼容 GB2312)</option>
                      <option value="GB18030">GB18030 (中文国标)</option>
                      <option value="Big5">Big5 (繁体中文)</option>
                      <option value="Shift_JIS">Shift_JIS (日文)</option>
                      <option value="EUC-KR">EUC-KR (韩文)</option>
                      <option value="ISO-8859-1">ISO-8859-1 (西欧)</option>
                      <option value="Windows-1252">Windows-1252 (西欧)</option>
                    </select>
                    <button
                      @click="autoDetectEncoding"
                      class="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1"
                      :disabled="isDetectingEncoding"
                    >
                      <span v-if="isDetectingEncoding" class="animate-spin text-xs">
                        <SvgIcon name="rotateCcw" size="12" />
                      </span>
                      <SvgIcon v-else name="wand" size="14" />
                      <span>自动识别</span>
                    </button>
                    <span v-if="detectedEncoding" class="text-xs text-info">
                      识别结果: {{ detectedEncoding.encoding }} ({{ (detectedEncoding.confidence * 100).toFixed(0) }}%)
                    </span>
                  </div>
                  <button
                    @click="resetFile"
                    class="px-3 py-1.5 text-sm bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-all flex items-center gap-1"
                  >
                    <SvgIcon name="rotateCcw" size="14" />
                    <span>重新选择</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Text Editor -->
            <div class="glass-card overflow-hidden">
              <div class="p-4 border-b border-border flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <SvgIcon name="edit" size="18" className="text-primary" />
                  <h3 class="font-semibold">文本编辑</h3>
                </div>
                <button
                  @click="showTextEditor = !showTextEditor"
                  class="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1"
                >
                  <SvgIcon name="edit" size="14" />
                  <span>{{ showTextEditor ? '收起' : '编辑' }}</span>
                </button>
              </div>
              <div v-if="showTextEditor" class="p-4 space-y-3 animate-fade-in">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">可直接修改文本内容，修改后会实时重新识别章节。适用于清理无用内容或修正格式。</span>
                </div>
                <textarea
                  v-model="fileContent"
                  @input="onTextEdit"
                  class="w-full h-64 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm resize-y"
                  placeholder="文本内容..."
                ></textarea>
              </div>
              <div v-else class="p-4 text-sm text-text-secondary">
                点击"编辑"按钮展开文本编辑器
              </div>
            </div>
          </div>

          <!-- Book Metadata -->
          <div v-if="activeNav === 'metadata'" class="space-y-5">
            <div class="glass-card overflow-hidden">
              <div class="p-4 border-b border-border flex items-center gap-2">
                <SvgIcon name="clipboard" size="18" className="text-primary" />
                <h3 class="font-semibold">电子书信息设置</h3>
              </div>
              <div class="p-4 space-y-4">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">书名和作者会显示在 EPUB 的元数据中。开启自动整理可从文件名智能提取信息。</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5">书名</label>
                    <input
                      v-model="metadata.title"
                      type="text"
                      @input="updateFilenamePreview"
                      class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="输入书名"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5">作者</label>
                    <input
                      v-model="metadata.author"
                      type="text"
                      @input="updateFilenamePreview"
                      class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="输入作者名"
                    >
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5">内容简介</label>
                  <textarea
                    v-model="metadata.description"
                    rows="2"
                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="输入内容简介（可选）"
                  ></textarea>
                </div>

                <!-- Filename format settings -->
                <div class="space-y-3 p-3 bg-bg/50 rounded-lg">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium">自动整理文件名</label>
                    <div class="toggle-switch">
                      <input v-model="filenameSettings.autoParse" type="checkbox" @change="onFilenameSettingsChange">
                      <span class="toggle-slider"></span>
                    </div>
                  </div>
                  <div class="text-xs text-text-secondary">
                    自动从文件名中提取书名和作者 (格式: 《书名》作者：作者名 或 书名 - 作者)
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium">文件名格式</label>
                    <select
                      v-model="filenameSettings.format"
                      @change="onFilenameFormatChange"
                      class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    >
                      <option v-for="preset in filenameFormatPresets" :key="preset.key" :value="preset.key">
                        {{ preset.name }}
                      </option>
                    </select>

                    <!-- Custom template section -->
                    <div v-if="filenameSettings.format === 'custom'" class="space-y-2 animate-fade-in">
                      <div>
                        <label class="block text-xs font-medium mb-1 text-text-secondary">常用模板</label>
                        <div class="flex flex-wrap gap-1.5">
                          <button
                            v-for="tp in customTemplatePresets"
                            :key="tp.template"
                            @click="applyCustomTemplatePreset(tp)"
                            class="px-2 py-1 text-xs border border-border rounded hover:border-primary hover:text-primary transition-colors"
                            :class="{ 'border-primary text-primary bg-primary/5': filenameSettings.customTemplate === tp.template }"
                          >
                            {{ tp.label }}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-medium mb-1 text-text-secondary">自定义模板</label>
                        <input
                          v-model="filenameSettings.customTemplate"
                          @input="onCustomTemplateInput"
                          type="text"
                          class="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                          placeholder="输入模板，如：{书名}-{作者名}"
                        >
                        <div class="text-xs text-text-secondary mt-1">
                          可用占位符：{书名} {作者名}（也可简写为 {作者}）
                        </div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-medium mb-1 text-text-secondary">文件名预览</label>
                      <div class="flex items-center gap-2">
                        <input
                          v-model="filenamePreview"
                          type="text"
                          class="flex-1 px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                          placeholder="文件名"
                        >
                        <span class="text-xs text-text-secondary whitespace-nowrap">.epub</span>
                      </div>
                      <div class="text-xs text-text-secondary mt-1">
                        选择格式会自动生成文件名，也可以直接编辑预览框自定义
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-6 flex-wrap">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <div class="toggle-switch">
                      <input v-model="settings.generateToc" type="checkbox">
                      <span class="toggle-slider"></span>
                    </div>
                    <span class="text-sm">生成目录页</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <span class="text-sm">正文前内容标题</span>
                    <select v-model="settings.prefaceTitle" class="px-2 py-1 border border-border rounded text-sm">
                      <option value="">关闭</option>
                      <option value="简介">简介</option>
                      <option value="序章">序章</option>
                      <option value="前言">前言</option>
                      <option value="custom">自定义</option>
                    </select>
                    <input
                      v-if="settings.prefaceTitle === 'custom'"
                      v-model="settings.customPrefaceTitle"
                      type="text"
                      class="px-2 py-1 border border-border rounded text-sm w-24"
                      placeholder="标题"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cover Settings -->
          <div v-if="activeNav === 'cover'" class="space-y-5">
            <div class="glass-card overflow-hidden">
              <div class="p-4 border-b border-border flex items-center gap-2">
                <SvgIcon name="image" size="18" className="text-primary" />
                <h3 class="font-semibold">封面设置</h3>
              </div>
              <div class="p-4">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10 mb-4">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">支持上传图片或自动生成封面。生成封面会根据书名和作者自动排版。</span>
                </div>
                <CoverSettingsPanel
                  ref="coverSettingsPanel"
                  :cover-preview="coverPreview"
                  @generate="generateCover"
                  @randomize="randomizeCover"
                  @upload="processCover"
                  @remove="removeCover"
                />
              </div>
            </div>
          </div>

          <!-- Chapter Recognition -->
          <div v-if="activeNav === 'recognition'" class="space-y-5">
            <div class="glass-card overflow-hidden">
              <div class="p-4 border-b border-border flex items-center gap-2">
                <SvgIcon name="search" size="18" className="text-primary" />
                <h3 class="font-semibold">章节识别</h3>
              </div>
              <div class="p-4 space-y-4">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">选择适合您文本的章节格式模板，或使用多选组合自定义。点击格式标签的眼睛图标可查看详情。</span>
                </div>

                <!-- Recognition Tabs -->
                <div class="flex border-b border-border">
                  <button
                    v-for="tab in recognitionTabs"
                    :key="tab.key"
                    @click="activeRecognitionTab = tab.key"
                    class="px-4 py-3 text-sm font-medium transition-colors relative"
                    :class="activeRecognitionTab === tab.key ? 'text-primary' : 'text-text-secondary hover:text-text'"
                  >
                    {{ tab.name }}
                    <span v-if="tab.badge" class="ml-1 text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded-full">{{ tab.badge }}</span>
                    <div v-if="activeRecognitionTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                  </button>
                </div>

                <!-- Preset Templates Tab -->
                <div v-if="activeRecognitionTab === 'preset'" class="animate-fade-in">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                      v-for="template in presetTemplates"
                      :key="template.name"
                      @click="applyTemplate(template)"
                      class="p-4 border border-border rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                      :class="{ 'border-primary bg-primary/5 ring-1 ring-primary': isTemplateActive(template) }"
                    >
                      <div class="font-medium text-sm mb-1">{{ template.name }}</div>
                      <div class="text-xs text-text-secondary">{{ template.description }}</div>
                      <div class="mt-2 flex flex-wrap gap-1">
                        <span v-for="p in template.patterns.slice(0, 3)" :key="p" class="text-xs bg-border px-1.5 py-0.5 rounded">
                          {{ allChapterFormats[p]?.name || p }}
                        </span>
                        <span v-if="template.patterns.length > 3" class="text-xs text-text-secondary">+{{ template.patterns.length - 3 }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Multi-select Tab -->
                <div v-if="activeRecognitionTab === 'multiselect'" class="animate-fade-in">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-sm text-text-secondary">选择要识别的章节格式</span>
                    <div class="flex gap-2">
                      <button @click="selectAllPatterns" class="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
                        <SvgIcon name="check" size="14" />
                        <span>全选</span>
                      </button>
                      <button @click="clearAllPatterns" class="px-3 py-1 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
                        <SvgIcon name="x" size="14" />
                        <span>清空</span>
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="(pattern, key) in allChapterFormats"
                      :key="key"
                      class="relative group"
                    >
                      <button
                        @click="togglePattern(key)"
                        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                        :class="selectedPatterns.includes(key)
                          ? 'bg-primary text-white'
                          : 'bg-border text-text-secondary hover:bg-border/80'"
                      >
                        {{ pattern.name }}
                      </button>
                      <!-- Eye icon - visible on hover -->
                      <button
                        v-if="pattern.isSystem"
                        @click.stop="openFormatDetail(key, pattern)"
                        class="absolute -top-2 -right-2 w-5 h-5 bg-info text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm hover:bg-info-dark"
                        title="查看详情"
                      >
                        <SvgIcon name="eye" size="12" />
                      </button>
                      <!-- Edit icon for custom formats -->
                      <button
                        v-else
                        @click.stop="openFormatEdit(key, pattern)"
                        class="absolute -top-2 -right-2 w-5 h-5 bg-success text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm hover:bg-success-dark"
                        title="编辑"
                      >
                        <SvgIcon name="edit" size="12" />
                      </button>
                    </div>
                  </div>
                  <!-- Add Custom Format Button -->
                  <div class="mt-4 pt-4 border-t border-border">
                    <button
                      @click="openFormatEdit(null, null)"
                      class="px-4 py-2 text-sm bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors flex items-center gap-1"
                    >
                      <SvgIcon name="plus" size="14" />
                      <span>添加格式</span>
                    </button>
                  </div>
                </div>

                <!-- Pre-filter Tab -->
                <div v-if="activeRecognitionTab === 'prefilter'" class="space-y-4 animate-fade-in">
                  <div class="text-sm text-text-secondary mb-2">前置筛选器 - 在识别前过滤内容</div>
                  <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
                    <div>
                      <div class="text-sm font-medium">{{ preFilters.requireEmptyLine.name }}</div>
                      <div class="text-xs text-text-secondary">{{ preFilters.requireEmptyLine.description }}</div>
                    </div>
                    <div class="toggle-switch">
                      <input v-model="preFilters.requireEmptyLine.enabled" type="checkbox">
                      <span class="toggle-slider"></span>
                    </div>
                  </label>
                  <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
                    <div>
                      <div class="text-sm font-medium">{{ preFilters.skipIndented.name }}</div>
                      <div class="text-xs text-text-secondary">{{ preFilters.skipIndented.description }}</div>
                    </div>
                    <div class="toggle-switch">
                      <input v-model="preFilters.skipIndented.enabled" type="checkbox">
                      <span class="toggle-slider"></span>
                    </div>
                  </label>
                  <div class="p-3 bg-bg/50 rounded-lg">
                    <div class="flex justify-between mb-2">
                      <div>
                        <div class="text-sm font-medium">{{ preFilters.prefixLengthLimit.name }}</div>
                        <div class="text-xs text-text-secondary">{{ preFilters.prefixLengthLimit.description }}</div>
                      </div>
                      <span class="text-sm text-primary">{{ preFilters.prefixLengthLimit.value }}</span>
                    </div>
                    <input
                      v-model.number="preFilters.prefixLengthLimit.value"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      class="w-full"
                    >
                  </div>
                  <div class="p-3 bg-bg/50 rounded-lg">
                    <div class="flex justify-between mb-2">
                      <div>
                        <div class="text-sm font-medium">{{ preFilters.titleLineCount.name }}</div>
                        <div class="text-xs text-text-secondary">{{ preFilters.titleLineCount.description }}</div>
                      </div>
                      <span class="text-sm text-primary">{{ preFilters.titleLineCount.value }}</span>
                    </div>
                    <input
                      v-model.number="preFilters.titleLineCount.value"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      class="w-full"
                    >
                  </div>

                  <!-- Post-filter (inside same tab) -->
                  <div class="border-t border-border pt-4 mt-4">
                    <div class="text-sm text-text-secondary mb-3">后置筛选器 - 被筛选的章节仍会显示但默认不选中</div>
                    <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
                      <div>
                        <div class="text-sm font-medium">{{ postFilters.excludeDates.name }}</div>
                        <div class="text-xs text-text-secondary">{{ postFilters.excludeDates.description }}</div>
                      </div>
                      <div class="toggle-switch">
                        <input v-model="postFilters.excludeDates.enabled" type="checkbox">
                        <span class="toggle-slider"></span>
                      </div>
                    </label>
                    <label class="flex items-center justify-between cursor-pointer p-3 bg-bg/50 rounded-lg">
                      <div>
                        <div class="text-sm font-medium">{{ postFilters.excludePureNumbers.name }}</div>
                        <div class="text-xs text-text-secondary">{{ postFilters.excludePureNumbers.description }}</div>
                      </div>
                      <div class="toggle-switch">
                        <input v-model="postFilters.excludePureNumbers.enabled" type="checkbox">
                        <span class="toggle-slider"></span>
                      </div>
                    </label>
                    <div class="p-3 bg-bg/50 rounded-lg">
                      <div class="flex items-center justify-between mb-2">
                        <div>
                          <div class="text-sm font-medium">{{ postFilters.excludeLongTitles.name }}</div>
                          <div class="text-xs text-text-secondary">{{ postFilters.excludeLongTitles.description }}</div>
                        </div>
                        <div class="toggle-switch">
                          <input v-model="postFilters.excludeLongTitles.enabled" type="checkbox">
                          <span class="toggle-slider"></span>
                        </div>
                      </div>
                      <div v-if="postFilters.excludeLongTitles.enabled" class="flex items-center gap-2 mt-2">
                        <span class="text-xs text-text-secondary">超过</span>
                        <input
                          v-model.number="postFilters.excludeLongTitles.maxTitleLength"
                          type="number"
                          min="10"
                          max="200"
                          class="w-16 px-2 py-1 border border-border rounded text-sm text-center"
                        >
                        <span class="text-xs text-text-secondary">个字符</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chapter List -->
          <div v-if="activeNav === 'chapters'" class="space-y-5">
            <div class="glass-card overflow-hidden">
              <div class="p-4 border-b border-border flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <SvgIcon name="list" size="18" className="text-primary" />
                  <h3 class="font-semibold">章节目录选择</h3>
                  <span class="text-sm text-text-secondary">({{ selectedChapters.length }} / {{ chapters.length }})</span>
                </div>
                <div class="flex gap-2">
                  <button @click="selectAllChapters" class="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
                    <SvgIcon name="check" size="14" />
                    <span>全选</span>
                  </button>
                  <button @click="clearAllChapters" class="px-3 py-1 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
                    <SvgIcon name="x" size="14" />
                    <span>全不选</span>
                  </button>
                  <button @click="resetChapterNumbers" class="px-3 py-1 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
                    <SvgIcon name="hash" size="14" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
              <div class="p-3 bg-bg/50 border-b border-border flex items-center gap-6 flex-wrap">
                <label class="flex items-center gap-2 cursor-pointer">
                  <div class="toggle-switch">
                    <input v-model="chapterListOptions.showChapterNumbers" type="checkbox">
                    <span class="toggle-slider"></span>
                  </div>
                  <span class="text-sm">显示章节序号</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <div class="toggle-switch">
                    <input v-model="chapterListOptions.deduplicate" type="checkbox">
                    <span class="toggle-slider"></span>
                  </div>
                  <span class="text-sm">忽略重复章节</span>
                </label>
              </div>
              <div class="max-h-80 overflow-y-auto p-2">
                <div
                  v-for="(chapter, index) in chapters"
                  :key="index"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <input
                    v-model="chapter.selected"
                    type="checkbox"
                    class="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  >
                  <span class="text-sm text-text-secondary w-8">{{ index + 1 }}</span>
                  <span class="flex-1 text-sm truncate">{{ chapter.title }}</span>
                  <span class="text-xs text-text-secondary">行 {{ chapter.lineNumber }}</span>
                  <!-- Chapter Level Selector -->
                  <select
                    v-model="chapter.level"
                    @change="onChapterLevelChange(chapter)"
                    class="text-xs px-1.5 py-0.5 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/20"
                    :class="getLevelColorClass(chapter.level)"
                  >
                    <option v-for="lvl in [1,2,3,4,5,6]" :key="lvl" :value="lvl">
                      H{{ lvl }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="p-3 bg-bg/50 border-t border-border">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">勾选需要生成目录的章节标题。H1-H6 表示层级关系，H1 为最高级（如卷/部）。被后置筛选器过滤的章节默认不选中，但您仍可手动勾选。</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Style Settings -->
          <div v-if="activeNav === 'style'" class="space-y-5">
            <div class="glass-card p-4 space-y-5 animate-fade-in">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">调整排版参数以适配您的阅读习惯。所有设置会实时预览并保存到本地。</span>
                </div>

                <!-- Sliders -->
                <div v-for="slider in styleSliders" :key="slider.key">
                  <div class="flex justify-between mb-2">
                    <label class="text-sm font-medium">{{ slider.label }}</label>
                    <span class="text-sm text-primary">{{ style[slider.key] }}{{ slider.unit }}</span>
                  </div>
                  <input
                    v-model.number="style[slider.key]"
                    type="range"
                    :min="slider.min"
                    :max="slider.max"
                    :step="slider.step"
                    class="w-full"
                  >
                </div>

                <!-- Selects -->
                <div>
                  <label class="block text-sm font-medium mb-2">缩进风格</label>
                  <select v-model="style.indentStyle" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="custom">自定义调节</option>
                    <option value="no-indent">无缩进风格</option>
                    <option value="kindle-standard">Kindle标准缩进</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">文本对齐</label>
                  <select v-model="style.textAlign" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="justify">两端对齐 (推荐)</option>
                    <option value="left">左对齐</option>
                    <option value="center">居中对齐</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">章节标题对齐</label>
                  <select v-model="style.titleAlign" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="center">居中对齐 (推荐)</option>
                    <option value="left">居左对齐</option>
                    <option value="right">居右对齐</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Kindle字体跟随</label>
                  <select v-model="style.kindleFontFollow" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="keep-current">保持当前设置</option>
                    <option value="complete-follow">完全跟随用户设置</option>
                    <option value="title-follow-body">标题跟随正文字体</option>
                    <option value="unified-family">标题正文同步设置</option>
                  </select>
                </div>

                <!-- Toggles -->
                <div class="space-y-3">
                  <label v-for="toggle in styleToggles" :key="toggle.key" class="flex items-center justify-between cursor-pointer">
                    <span class="text-sm font-medium">{{ toggle.label }}</span>
                    <div class="toggle-switch">
                      <input v-model="style[toggle.key]" type="checkbox">
                      <span class="toggle-slider"></span>
                    </div>
                  </label>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2 pt-2">
                  <button @click="resetStyle" class="px-4 py-2 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
                    <SvgIcon name="rotateCcw" size="14" />
                    <span>重置</span>
                  </button>
                  <button @click="saveStyleConfig" class="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
                    <SvgIcon name="save" size="14" />
                    <span>保存</span>
                  </button>
                </div>
            </div>
          </div>

          <!-- Advanced CSS -->
          <div v-if="activeNav === 'advanced'" class="space-y-5">
            <div class="glass-card p-4 space-y-3 animate-fade-in">
                <div class="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/10">
                  <SvgIcon name="info" size="16" className="text-info mt-0.5 shrink-0" />
                  <span class="text-xs text-text-secondary">为熟悉 CSS 的用户提供自定义样式入口，将与上方配置合并输出。</span>
                </div>
                <textarea
                  v-model="style.customCSS"
                  rows="6"
                  class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                  placeholder="/* 自定义CSS代码 */"
                ></textarea>
                <div class="flex gap-2">
                  <button @click="applyDefaultCSS" class="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-sm hover:shadow-primary/10 transition-all flex items-center gap-1">
                    <SvgIcon name="clipboard" size="14" />
                    <span>应用默认</span>
                  </button>
                  <button @click="style.customCSS = ''" class="px-4 py-2 text-sm bg-border text-text-secondary rounded-lg hover:bg-border/80 transition-colors flex items-center gap-1">
                    <SvgIcon name="trash" size="14" />
                    <span>清空</span>
                  </button>
                </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="text-center py-4 text-sm text-text-secondary">
        <div class="px-6">
          <div class="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3"></div>
          TXT 转 EPUB 转换器 v2.0.0
        </div>
      </footer>
    </div>

    <!-- Sticky Convert Button -->
    <div
      v-if="fileLoaded"
      class="fixed bottom-0 right-0 left-[240px] z-50 px-6 py-4 bg-gradient-to-t from-bg via-bg to-transparent"
    >
      <button
        @click="convertToEpub"
        :disabled="isConverting || selectedChapters.length === 0"
        class="w-full max-w-4xl mx-auto py-4 bg-gradient-to-r from-primary via-primary to-accent text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <span v-if="isConverting" class="animate-spin">
          <SvgIcon name="rotateCcw" size="20" />
        </span>
        <SvgIcon v-else name="zap" size="20" />
        <span>{{ isConverting ? '转换中...' : '转换为EPUB' }}</span>
        <span v-if="!isConverting" class="text-sm font-normal opacity-80">({{ selectedChapters.length }} 个章节)</span>
      </button>
    </div>

    <!-- Format Detail Dialog (component) -->
    <FormatDetailDialog
      :visible="showFormatDetail"
      :data="formatDetailData"
      @close="closeFormatDetail"
    />

    <!-- Format Edit Dialog (component) -->
    <FormatEditDialog
      :visible="showFormatEdit"
      :edit-key="editingFormatKey"
      :initial-data="editingFormatInitialData"
      @save="saveCustomFormat"
      @delete="deleteCustomFormat"
      @close="closeFormatEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import {
  chapterPatterns,
  presetTemplates,
  preFilterOptions,
  postFilterOptions,
  detectChapters,
  applyPostFilters,
  getChapterContents,
  getPrefaceContent,
  loadCustomFormats,
  saveCustomFormats,
  getAllChapterFormats,
  getDefaultLevel,
  normalizeLevel,
  CUSTOM_FORMATS_KEY
} from './utils/chapterPatterns.js';
import { generateEpub, downloadBlob } from './utils/epubGenerator.js';
import { detectEncoding, readFileAsArrayBuffer, readFileAsText } from './utils/encodingDetector.js';
import {
  parseFilenameMetadata, extractAuthorFromText,
  generateFilename, filenameFormatPresets, customTemplatePresets,
  saveFilenameSettings, loadFilenameSettings
} from './utils/filenameParser.js';
import { generateCoverImage, coverColorThemes } from './utils/coverGenerator.js';
import CoverSettingsPanel from './components/CoverSettingsPanel.vue';
import FormatDetailDialog from './components/FormatDetailDialog.vue';
import FormatEditDialog from './components/FormatEditDialog.vue';
import SvgIcon from './components/SvgIcon.vue';

// State
const isDragging = ref(false);
const isDarkMode = ref(localStorage.getItem('txt2epub_theme') !== 'light');
const fileLoaded = ref(false);
const fileName = ref('');
const fileSize = ref('');
const fileContent = ref('');
const encoding = ref('UTF-8');
const rawFile = ref(null);
const chapters = ref([]);
const selectedPatterns = ref(Object.keys(chapterPatterns));
const activeRecognitionTab = ref('preset');
const showTextEditor = ref(false);
const isConverting = ref(false);
const coverImage = ref(null);
const coverPreview = ref('');

// Navigation
const activeNav = ref('file');
const navItems = [
  { key: 'file', label: '文件', icon: 'fileText' },
  { key: 'metadata', label: '元数据', icon: 'clipboard' },
  { key: 'cover', label: '封面', icon: 'image' },
  { key: 'recognition', label: '识别', icon: 'search' },
  { key: 'chapters', label: '目录', icon: 'list' },
  { key: 'style', label: '样式', icon: 'palette', badge: 'Beta' },
  { key: 'advanced', label: '高级', icon: 'code' }
];

// Cover settings panel ref
const coverSettingsPanel = ref(null);

// Encoding detection state
const isDetectingEncoding = ref(false);
const detectedEncoding = ref(null);

// Filename settings
const filenameSettings = reactive(loadFilenameSettings());
const filenamePreview = ref('');

// Custom formats
const customFormats = ref(loadCustomFormats());
const allChapterFormats = computed(() => ({ ...chapterPatterns, ...customFormats.value }));

// Format detail dialog
const showFormatDetail = ref(false);
const formatDetailData = ref({});

// Format edit dialog
const showFormatEdit = ref(false);
const editingFormatKey = ref(null);
const editingFormatInitialData = computed(() => {
  if (!editingFormatKey.value || !customFormats.value[editingFormatKey.value]) return null;
  return customFormats.value[editingFormatKey.value];
});

const recognitionTabs = [
  { key: 'preset', name: '📋 预设模板' },
  { key: 'multiselect', name: '🎯 多选组合', badge: 'Beta' },
  { key: 'prefilter', name: '🔍 筛选器' }
];

const metadata = reactive({
  title: '',
  author: '',
  description: ''
});

const settings = reactive({
  generateToc: false,
  prefaceTitle: '',
  customPrefaceTitle: ''
});

const preFilters = reactive({
  requireEmptyLine: { ...preFilterOptions.requireEmptyLine },
  skipIndented: { ...preFilterOptions.skipIndented },
  prefixLengthLimit: { ...preFilterOptions.prefixLengthLimit },
  titleLineCount: { ...preFilterOptions.titleLineCount }
});

const postFilters = reactive({
  excludeDates: { ...postFilterOptions.excludeDates },
  excludePureNumbers: { ...postFilterOptions.excludePureNumbers },
  excludeLongTitles: { ...postFilterOptions.excludeLongTitles }
});

const chapterListOptions = reactive({
  showChapterNumbers: false,
  deduplicate: false
});

const style = reactive({
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
});

const styleSliders = [
  { key: 'paragraphIndent', label: '段落缩进', min: 0, max: 4, step: 0.5, unit: 'em' },
  { key: 'titleSize', label: '标题大小', min: 1, max: 2, step: 0.1, unit: 'em' },
  { key: 'chapterTopMargin', label: '章节上方留白', min: 0, max: 3, step: 0.5, unit: 'em' },
  { key: 'chapterBottomMargin', label: '章节下方留白', min: 0, max: 3, step: 0.5, unit: 'em' },
  { key: 'pageMargin', label: '页面边距', min: 0, max: 3, step: 0.5, unit: 'em' },
  { key: 'lineHeight', label: '行高', min: 1, max: 2, step: 0.1, unit: '' },
  { key: 'paragraphSpacing', label: '段间距', min: 0, max: 2, step: 0.1, unit: 'em' },
  { key: 'tocSpacing', label: '目录条目间距', min: 0, max: 1, step: 0.1, unit: 'em' }
];

const styleToggles = [
  { key: 'removeEmptyLines', label: '去除空行' },
  { key: 'nightMode', label: '夜间模式（黑底白字）' },
  { key: 'chapterTitleLine', label: '章节标题横线' },
  { key: 'titleBold', label: '章节标题加粗' },
  { key: 'chapterNav', label: '章节导航' },
  { key: 'chapterContinuous', label: '章节连续模式' }
];

// Computed
const selectedChapters = computed(() => chapters.value.filter(c => c.selected));

// Watch pattern changes
watch([selectedPatterns, preFilters], () => {
  if (fileContent.value) {
    detectChaptersFromContent();
  }
}, { deep: true });

watch(postFilters, () => {
  if (fileContent.value) {
    detectChaptersFromContent();
  }
}, { deep: true });

watch(chapterListOptions, () => {
  if (fileContent.value) {
    detectChaptersFromContent();
  }
}, { deep: true });

// File handling
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) processFile(file);
}

function handleDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.name.endsWith('.txt')) {
    processFile(file);
  }
}

async function processFile(file) {
  rawFile.value = file;
  fileName.value = file.name.replace('.txt', '');
  fileSize.value = formatFileSize(file.size);

  // Auto-detect encoding
  await autoDetectEncoding();

  // Auto-organize filename
  if (filenameSettings.autoParse) {
    const parsed = parseFilenameMetadata(file.name);
    metadata.title = parsed.title;
    if (parsed.author) {
      metadata.author = parsed.author;
    }
  } else {
    metadata.title = file.name.replace(/\.txt$/i, '');
  }

  // Update filename preview
  updateFilenamePreview();

  // Apply recommended preset template
  const recommendedPreset = presetTemplates.find(t => t.name === '混合模式 (推荐)');
  if (recommendedPreset) {
    selectedPatterns.value = [...recommendedPreset.patterns];
  }

  readFile();
}

async function autoDetectEncoding() {
  if (!rawFile.value) return;

  isDetectingEncoding.value = true;
  try {
    const buffer = await readFileAsArrayBuffer(rawFile.value);
    const result = detectEncoding(buffer);
    detectedEncoding.value = result;

    if (result.encoding && result.encoding !== encoding.value) {
      encoding.value = result.encoding;
      // Re-read file with detected encoding
      const text = await readFileAsText(rawFile.value, result.encoding);
      fileContent.value = text;
      detectChaptersFromContent();
      fileLoaded.value = true;

      // Try to extract author from text content
      const textAuthor = extractAuthorFromText(text);
      if (textAuthor && !metadata.author) {
        metadata.author = textAuthor;
      }
    }
  } catch (error) {
    console.error('Encoding detection failed:', error);
  } finally {
    isDetectingEncoding.value = false;
  }
}

function readFile() {
  if (!rawFile.value) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileContent.value = e.target.result;
    detectChaptersFromContent();
    fileLoaded.value = true;

    // Try to extract author from text content
    const textAuthor = extractAuthorFromText(e.target.result);
    if (textAuthor && !metadata.author) {
      metadata.author = textAuthor;
    }
  };
  reader.readAsText(rawFile.value, encoding.value);
}

function reReadFile() {
  readFile();
}

function onTextEdit() {
  detectChaptersFromContent();
}

function detectChaptersFromContent() {
  const patterns = selectedPatterns.value.map(key => ({
    ...allChapterFormats.value[key],
    key,
    id: key
  }));
  const preFilterSettings = {
    requireEmptyLine: preFilters.requireEmptyLine.enabled,
    skipIndented: preFilters.skipIndented.enabled,
    prefixLengthLimit: preFilters.prefixLengthLimit.value,
    titleLineCount: preFilters.titleLineCount.value
  };

  let detected = detectChapters(fileContent.value, patterns, preFilterSettings);

  // Apply post-filters (date, pure numbers, long titles)
  detected = detected.map(ch => {
    const title = ch.title.trim();
    let filteredOut = false;

    // Date format check
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
      ];
      if (datePatterns.some(p => p.test(title))) {
        filteredOut = true;
      }
    }

    // Pure numbers check
    if (!filteredOut && postFilters.excludePureNumbers.enabled) {
      if (/^\d+$/.test(title)) {
        filteredOut = true;
      }
    }

    // Long title check
    if (!filteredOut && postFilters.excludeLongTitles.enabled) {
      const maxLen = postFilters.excludeLongTitles.maxTitleLength || 40;
      if (title.length > maxLen) {
        filteredOut = true;
      }
    }

    return {
      ...ch,
      selected: !filteredOut,
      filteredOut
    };
  });

  // Apply deduplicate
  if (chapterListOptions.deduplicate) {
    detected = detected.filter((ch, idx) => {
      if (idx === 0) return true;
      const prev = detected[idx - 1];
      return ch.title !== prev.title;
    });
  }

  // Apply chapter numbers
  if (chapterListOptions.showChapterNumbers) {
    detected = detected.map((ch, idx) => ({
      ...ch,
      displayTitle: `${idx + 1}. ${ch.title}`
    }));
  }

  chapters.value = detected;
}

// Filename settings functions
function updateFilenamePreview() {
  const title = metadata.title || '';
  const author = metadata.author || '';
  filenamePreview.value = generateFilename(
    filenameSettings.format,
    title,
    author,
    filenameSettings.customTemplate
  );
}

function onFilenameSettingsChange() {
  saveFilenameSettings(filenameSettings);
  updateFilenamePreview();
}

function onFilenameFormatChange() {
  saveFilenameSettings(filenameSettings);
  updateFilenamePreview();
}

function onCustomTemplateInput() {
  saveFilenameSettings(filenameSettings);
  updateFilenamePreview();
}

function applyCustomTemplatePreset(tp) {
  filenameSettings.customTemplate = tp.template;
  saveFilenameSettings(filenameSettings);
  updateFilenamePreview();
}

// Theme toggle
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();
}

function applyTheme() {
  if (isDarkMode.value) {
    document.documentElement.classList.remove('light');
    localStorage.setItem('txt2epub_theme', 'dark');
  } else {
    document.documentElement.classList.add('light');
    localStorage.setItem('txt2epub_theme', 'light');
  }
}

// Apply theme on mount
applyTheme();

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function resetFile() {
  fileLoaded.value = false;
  fileName.value = '';
  fileSize.value = '';
  fileContent.value = '';
  rawFile.value = null;
  chapters.value = [];
  metadata.title = '';
  metadata.author = '';
  metadata.description = '';
  coverImage.value = null;
  coverPreview.value = '';
  detectedEncoding.value = null;
}

// Cover handling
function processCover(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    coverPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  const blobReader = new FileReader();
  blobReader.onload = (e) => {
    coverImage.value = e.target.result;
  };
  blobReader.readAsArrayBuffer(file);
}

function removeCover() {
  coverImage.value = null;
  coverPreview.value = '';
}

// Cover generation using coverGenerator utility
async function generateCover() {
  const panel = coverSettingsPanel.value;
  if (!panel) return;

  const { settings, gen } = panel;
  try {
    const result = await generateCoverImage({
      width: settings.width,
      height: settings.height,
      template: gen.template,
      colorTheme: gen.colorTheme,
      title: metadata.title || '未命名',
      author: metadata.author || ''
    });
    coverPreview.value = result.dataUrl;
    coverImage.value = result.arrayBuffer;
  } catch (error) {
    console.error('Cover generation failed:', error);
  }
}

function randomizeCover() {
  const panel = coverSettingsPanel.value;
  if (!panel) return;

  const templates = ['minimal', 'gradient', 'border', 'ink', 'floral', 'neon', 'vintage', 'geometric', 'starfield', 'bamboo', 'wave', 'typewriter'];
  const themes = coverColorThemes.map(t => t.key);
  panel.gen.template = templates[Math.floor(Math.random() * templates.length)];
  panel.gen.colorTheme = themes[Math.floor(Math.random() * themes.length)];
  generateCover();
}

// Template handling
function applyTemplate(template) {
  selectedPatterns.value = [...template.patterns];
}

function isTemplateActive(template) {
  return template.patterns.every(p => selectedPatterns.value.includes(p)) &&
         template.patterns.length === selectedPatterns.value.length;
}

// Pattern selection
function togglePattern(key) {
  const idx = selectedPatterns.value.indexOf(key);
  if (idx > -1) {
    selectedPatterns.value.splice(idx, 1);
  } else {
    selectedPatterns.value.push(key);
  }
}

function selectAllPatterns() {
  selectedPatterns.value = Object.keys(allChapterFormats.value);
}

function clearAllPatterns() {
  selectedPatterns.value = [];
}

// Chapter selection
function selectAllChapters() {
  chapters.value.forEach(c => c.selected = true);
}

function clearAllChapters() {
  chapters.value.forEach(c => c.selected = false);
}

function resetChapterNumbers() {
  chapters.value.forEach((ch) => {
    ch.displayTitle = ch.title;
  });
}

// Chapter level
function onChapterLevelChange(chapter) {
  // Level changed
}

function getLevelColorClass(level) {
  const colors = {
    1: 'bg-warning/10 text-warning border-warning/30',
    2: 'bg-primary/10 text-primary border-primary/30',
    3: 'bg-success/10 text-success border-success/30',
    4: 'bg-info/10 text-info border-info/30',
    5: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30',
    6: 'bg-border text-text-secondary border-border'
  };
  return colors[level] || colors[2];
}

// Format detail dialog
function openFormatDetail(key, pattern) {
  formatDetailData.value = {
    ...pattern,
    key
  };
  showFormatDetail.value = true;
}

function closeFormatDetail() {
  showFormatDetail.value = false;
  formatDetailData.value = {};
}

// Format edit dialog
function openFormatEdit(key, pattern) {
  editingFormatKey.value = key;
  showFormatEdit.value = true;
}

function closeFormatEdit() {
  showFormatEdit.value = false;
  editingFormatKey.value = null;
}

function saveCustomFormat(data) {
  const key = editingFormatKey.value || 'custom_' + Date.now();
  const formatData = {
    id: key,
    name: data.name,
    pattern: data.pattern,
    examples: data.examples,
    description: data.description,
    level: data.level,
    enabled: true,
    isSystem: false
  };

  customFormats.value[key] = formatData;
  saveCustomFormats(customFormats.value);

  // Add to selected patterns if new
  if (!editingFormatKey.value && !selectedPatterns.value.includes(key)) {
    selectedPatterns.value.push(key);
  }

  closeFormatEdit();
}

function deleteCustomFormat() {
  if (!editingFormatKey.value) return;
  if (confirm('确定要删除这个自定义格式吗？')) {
    delete customFormats.value[editingFormatKey.value];
    saveCustomFormats(customFormats.value);

    // Remove from selected patterns
    const idx = selectedPatterns.value.indexOf(editingFormatKey.value);
    if (idx > -1) {
      selectedPatterns.value.splice(idx, 1);
    }

    closeFormatEdit();
  }
}

// Style handling
function resetStyle() {
  style.paragraphIndent = 2;
  style.titleSize = 1.4;
  style.chapterTopMargin = 1;
  style.chapterBottomMargin = 1;
  style.pageMargin = 0;
  style.lineHeight = 1.3;
  style.paragraphSpacing = 0.5;
  style.tocSpacing = 0.2;
  style.textAlign = 'justify';
  style.titleAlign = 'center';
  style.titleBold = true;
  style.nightMode = false;
  style.titleUnderline = false;
  style.removeEmptyLines = false;
  style.chapterNav = false;
  style.kindleFontFollow = 'keep-current';
  style.chapterContinuous = false;
  style.chapterTitleLine = false;
  style.indentStyle = 'custom';
  style.customCSS = '';
}

function saveStyleConfig() {
  localStorage.setItem('txt2epub_style', JSON.stringify({ ...style }));
  alert('样式配置已保存到本地！');
}

function applyDefaultCSS() {
  style.customCSS = `/* 默认CSS样式 */
h2 {
  color: #333;
}

p {
  text-align: justify;
}`;
}

// Load saved style
const savedStyle = localStorage.getItem('txt2epub_style');
if (savedStyle) {
  try {
    const parsed = JSON.parse(savedStyle);
    Object.assign(style, parsed);
  } catch (e) {
    console.error('Failed to load saved style:', e);
  }
}

// Conversion
async function convertToEpub() {
  if (selectedChapters.value.length === 0) return;

  isConverting.value = true;

  try {
    const chapterContents = getChapterContents(fileContent.value, selectedChapters.value);

    // Get preface content
    let prefaceContent = '';
    let prefaceTitle = '';
    if (settings.prefaceTitle && selectedChapters.value.length > 0) {
      const firstChapterLine = selectedChapters.value[0].lineNumber;
      prefaceContent = getPrefaceContent(fileContent.value, firstChapterLine);
      prefaceTitle = settings.prefaceTitle === 'custom' ? settings.customPrefaceTitle : settings.prefaceTitle;
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
    });

    const outputName = (filenamePreview.value || metadata.title || fileName.value) + '.epub';
    downloadBlob(blob, outputName);
  } catch (error) {
    console.error('Conversion failed:', error);
    alert('转换失败: ' + error.message);
  } finally {
    isConverting.value = false;
  }
}
</script>
