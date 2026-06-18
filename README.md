# TXT 转 EPUB 转换器

基于 Vue 3 + Vite + Tailwind CSS 构建的本地 TXT 转 EPUB 转换工具，纯浏览器端运行，无需后端服务。

借鉴了 [proton1.cn](https://ebook.proton1.cn/txt2epub.html) 工具的功能特性，根据界面功能**净室实现**，并在章节识别规则、封面生成模板、排版样式等方面进行了优化。

<img width="1893" height="873" alt="图片" src="https://github.com/user-attachments/assets/57d10ced-73b9-42eb-b820-9606ddb43b31" />
<img width="1900" height="870" alt="图片" src="https://github.com/user-attachments/assets/c1f22816-a44f-4748-8fc7-5174fde2c721" />
<img width="1892" height="863" alt="图片" src="https://github.com/user-attachments/assets/53cb9b9b-728c-43b6-a825-4e067bea288b" />
<img width="1900" height="857" alt="图片" src="https://github.com/user-attachments/assets/ebaa032d-f412-4fd8-8290-a5a4db071da9" />

## 功能特性

### 文件处理
- 自动检测文件编码（基于 jschardet），支持 GBK、UTF-8、Big5 等多种编码
- 拖拽或点击上传 TXT 文件
- 自动解析文件名，提取书名、作者等信息

### 元数据管理
- 书名、作者、语言、标识符等 EPUB 元数据编辑
- 自动从文件名提取书名和作者
- 多种文件名格式预设，支持自定义占位符模板

### 封面设置
- 9 种封面比例预设（标准、正方形、黄金比例、Kindle 等），支持自定义尺寸
- 上传自定义封面图片（支持拖拽）
- 12 种内置封面模板自动生成（极简、渐变、水墨、花卉、霓虹、复古等）
- 9 种颜色主题可选

### 章节识别
- **32 种内置识别规则**，覆盖中文数字、阿拉伯数字、英文、特殊符号、括号编号等格式
- 6 种预设模板（混合模式、网络小说、传统出版、轻小说、晋江、激进模式）
- 前置筛选器：要求空行、跳过缩进行、前缀长度限制
- 后置筛选器：排除日期、纯数字、过长标题
- 每条规则支持查看详情（正则表达式、示例、描述）
- 每条规则可独立设置 H1-H6 章节层级
- 支持添加自定义识别规则（正则表达式）
- 章节目录支持手动勾选/取消、拖拽排序

### 排版样式
- 字体大小、行高、段间距、缩进等参数实时调节
- 缩进风格（自定义、无缩进、Kindle 标准）
- 文本对齐、标题对齐
- Kindle 字体跟随策略
- 高级 CSS 自定义入口

### 界面
- 暗色毛玻璃主题 + 日间模式切换
- 左侧导航栏 + 右侧内容区布局
- SVG 图标系统
- 主题偏好自动保存

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 | 前端框架（Composition API） |
| Vite 6 | 构建工具 |
| Tailwind CSS 4 | 样式框架 |
| JSZip | EPUB 文件生成 |
| jschardet | 文件编码检测 |

## 项目结构

```
src/
├── components/
│   ├── CoverSettingsPanel.vue   # 封面设置面板
│   ├── FormatDetailDialog.vue   # 规则详情弹窗
│   ├── FormatEditDialog.vue     # 自定义规则编辑弹窗
│   └── SvgIcon.vue              # SVG 图标组件
├── utils/
│   ├── chapterPatterns.js       # 32 种章节识别规则 + 筛选器
│   ├── coverGenerator.js        # 12 种封面模板 + Canvas 绘制
│   ├── encodingDetector.js      # 编码检测与文本读取
│   ├── epubGenerator.js         # EPUB 3.0 生成与下载
│   └── filenameParser.js        # 文件名解析与格式化
├── App.vue                      # 主应用组件
├── main.js                      # 入口文件
└── style.css                    # 全局样式（暗色/日间主题）
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 使用说明

1. 上传 TXT 文件，工具自动检测编码并解析文件名
2. 在「元数据」页面确认/编辑书名、作者等信息
3. 在「识别」页面选择章节识别预设或自定义规则，点击「识别章节」
4. 在「目录」页面查看识别结果，调整章节层级和选中状态
5. （可选）在「封面」页面上传或生成封面
6. （可选）在「样式」页面调整排版参数
7. 点击右下角「转换为 EPUB」按钮，自动下载生成的 EPUB 文件

## 许可证

MIT
