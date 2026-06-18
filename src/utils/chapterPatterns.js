// Chapter recognition patterns for Chinese novels
// Enhanced with id, description, isSystem fields and default level mapping

export const chapterPatterns = {
  // 中文数字序号 (一、开篇)
  chineseNumSeq: {
    id: 'chineseNumSeq',
    name: '中文数字序号',
    pattern: /^\s*[一二三四五六七八九十百千]+[、\.\s]+.+/,
    examples: ['一、开篇', '二、发展'],
    description: '中文数字后跟顿号或空格的序号格式',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 大写中文数字序号 (壹、开篇)
  chineseUpperNumSeq: {
    id: 'chineseUpperNumSeq',
    name: '大写中文数字序号',
    pattern: /^\s*[壹贰叁肆伍陆柒捌玖拾佰仟]+[、\.\s]+.+/,
    examples: ['壹、开篇', '贰、发展'],
    description: '匹配以大写中文数字（壹贰叁肆伍陆柒捌玖拾）开头的章节标题',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 纯数字格式 (1. 标题)
  pureNumFormat: {
    id: 'pureNumFormat',
    name: '纯数字格式',
    pattern: /^\s*\d+[\.、\s]+[^\d].+/,
    examples: ['1. 标题', '2、内容', '001 标题'],
    description: '数字+空格/竖线/点号/顿号的格式',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 第N章格式（增强版：支持〇零两、壹贰叁、负向前瞻排除歧义）
  zhangFormat: {
    id: 'zhangFormat',
    name: '第N章格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}章.{0,30}$/,
    examples: ['第一章 开始', '第10章 战斗', '第〇一章 序', '第一〇三章'],
    description: '匹配"第N章"格式，支持阿拉伯数字、〇零、中文数字、大写数字',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 第N回格式（增强版：支持更多数字字符）
  huiFormat: {
    id: 'huiFormat',
    name: '第N回格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}回.{0,30}$/,
    examples: ['第一回 缘起', '第5回 相遇'],
    description: '专门匹配古典"回"格式的章节标题',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 第N部格式（增强版：负向前瞻排除"部分/分赛/游"等歧义）
  buFormat: {
    id: 'buFormat',
    name: '第N部格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}部(?!分|赛|游).{0,30}$/,
    examples: ['第一部 序章', '第二部 终章'],
    description: '匹配"第N部"格式，排除"部分"等歧义',
    enabled: true,
    level: 1,
    isSystem: true
  },
  // 第N集格式（增强版：负向前瞻排除"集合/合"等歧义）
  jiFormat: {
    id: 'jiFormat',
    name: '第N集格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}集(?!合|和).{0,30}$/,
    examples: ['第一集 开端', '第12集 高潮'],
    description: '匹配"第N集"格式，排除"集合/合集"等歧义',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 第N节格式（增强版：负向前瞻排除"节课"等歧义）
  jieFormat: {
    id: 'jieFormat',
    name: '第N节格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}节(?!课).{0,30}$/,
    examples: ['第一节 导论', '第1节：基础'],
    description: '匹配"第N节"格式，排除"节课"等歧义',
    enabled: true,
    level: 3,
    isSystem: true
  },
  // 第N篇格式（新增）
  pianFormat: {
    id: 'pianFormat',
    name: '第N篇格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}篇(?!张).{0,30}$/,
    examples: ['第一篇 起源', '上篇 风云'],
    description: '匹配"第N篇"格式，排除"张"等歧义',
    enabled: true,
    level: 1,
    isSystem: true
  },
  // 第N场格式（新增）
  changFormat: {
    id: 'changFormat',
    name: '第N场格式',
    pattern: /^\s*第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}场(?!和|合|比|电|是).{0,30}$/,
    examples: ['第一场 战斗', '第二场 对决'],
    description: '匹配"第N场"格式，排除"场合/场和"等歧义',
    enabled: true,
    level: 3,
    isSystem: true
  },
  // 英文章节格式（增强版：增加 Section/Part/Episode/No.）
  englishFormat: {
    id: 'englishChapterFormat',
    name: '英文章节格式',
    pattern: /^\s*(?:Chapter|CHAPTER|Ch\.?|Section|SECTION|Sec\.?|Part|PART|ＰＡＲＴ|Episode|EPISODE|No\.?|Vol\.?|Volume)\s{0,4}\d{1,4}.{0,30}$/i,
    examples: ['Chapter 1', 'CHAPTER ONE', 'Section 2', 'Part 3', 'Episode 4', 'No.5'],
    description: '英文章节格式，支持 Chapter/Section/Part/Episode/No./Volume',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 特殊符号格式（增强版：增加 ✦✧）
  specialSymbol: {
    id: 'specialSymbol',
    name: '特殊符号格式',
    pattern: /^\s*[☆★✦✧※＊].+/,
    examples: ['☆ 章节标题', '★ 重要内容', '✦ 特别篇'],
    description: '网文常用的星号等特殊符号',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 数字+装饰符号
  numWithDecor: {
    id: 'numWithDecoration',
    name: '数字+装饰符号',
    pattern: /^\s*[\d]+[♦◆◇▲△▼▽■□●○].+/,
    examples: ['1♦标题', '2●内容'],
    description: '数字配装饰符号的格式',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 特殊章节名（增强版：增加"内容简介"、"文章简介"、"引子"、"扉页"、"卷首语"）
  specialChapterName: {
    id: 'specialChapterName',
    name: '特殊章节名',
    pattern: /^\s*(?:内容?简介|文章简介|文案|楔子|序章|前言|正文(?!完|结)|终章|后记|尾声|番外|引子|扉页|卷首语).*/,
    examples: ['简介', '内容简介', '文案', '楔子', '序章', '前言', '引子'],
    description: '网文常见的特殊章节名称，包括简介/楔子/序章/前言/终章等',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 正文标题（新增：正文后跟空格和标题内容）
  bodyTitle: {
    id: 'bodyTitle',
    name: '正文标题',
    pattern: /^\s*正文\s{1,4}.{1,20}$/,
    examples: ['正文 我奶常山赵子龙', '正文  故事开始'],
    description: '"正文"后跟空格和标题内容，常见于网文',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 圆圈分隔符
  circleSeparator: {
    id: 'circleDelimiter',
    name: '圆圈分隔符',
    pattern: /^\s*[①②③④⑤⑥⑦⑧⑨⑩].+/,
    examples: ['① 标题', '② 内容'],
    description: '用圆圈符号包围的章节标题',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 等号分隔符
  equalSeparator: {
    id: 'equalsDelimiter',
    name: '等号分隔符',
    pattern: /^\s*={2,}\s*.+\s*={2,}\s*$/,
    examples: ['===章节名===', '==标题=='],
    description: '用等号包围的章节标题',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 括号编号
  bracketNumber: {
    id: 'bracketNumber',
    name: '括号编号',
    pattern: /^\s*[（(]\s*\d+\s*[）)]\s*.+/,
    examples: ['（1）标题', '(2) 内容'],
    description: '用括号包围数字的编号格式',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 中文括号章节
  chineseBracketChapter: {
    id: 'chineseBracketChapter',
    name: '中文括号章节',
    pattern: /^\s*[\(（\[［〔][一二三四五六七八九十百千万]+[\)）\]］〕].*|^\s*[\(（\[［〔]第[一二三四五六七八九十百千万]+[章节回部卷集][\)）\]］〕].*/,
    examples: ['（一）开篇', '[二]发展', '〔三〕高潮', '（第一章）', '[第二回]'],
    description: '用各种中文括号包围的中文数字章节',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 特殊符号括号章节（新增：【第一章 xxx】）
  specialBracketChapter: {
    id: 'specialBracketChapter',
    name: '特殊符号括号章节',
    pattern: /^\s*[【〔〖「『〈［\(]\s*(?:第|[Cc]hapter)\s*[\d零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,10}[章节].{0,20}$/,
    examples: ['【第一章 后面的符号可以没有', '〔第二章 标题'],
    description: '用特殊符号括号包围的章节标题，如【第一章 xxx】',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 成对符号标题（新增：『标题』、[标题] 等）
  pairedSymbolTitle: {
    id: 'pairedSymbolTitle',
    name: '成对符号标题',
    pattern: /^\s*[\[〈「『〖〔《（【\(].{1,30}[\)】）》〕〗』」〉\]]?\s*$/,
    examples: ['『加个直角引号更专业』', '(11)我奶常山赵子龙', '【标题】'],
    description: '用成对符号包围的标题，如『标题』、【标题】、(11)标题',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 卷N格式（增强版：支持〇零两等）
  juanFormat: {
    id: 'volumeChapter',
    name: '卷数格式',
    pattern: /^\s*(?:卷|第.{0,4}卷)\s*[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}.{0,30}$/,
    examples: ['卷一 起源', '第一卷 开始', '卷1 序幕', '第2卷 发展', '卷〇三'],
    description: '以卷为单位的章节格式，支持各种数字写法',
    enabled: true,
    level: 1,
    isSystem: true
  },
  // 番数格式
  fanFormat: {
    id: 'fanFormat',
    name: '番数格式',
    pattern: /^\s*番[一二三四五六七八九十百千万\d]+.*|^\s*番\d+.*/,
    examples: ['番一 后日谈', '番二 外传', '番1 特别篇', '番2 终章后'],
    description: '番外章节的编号格式，支持中文数字和阿拉伯数字',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 数字+可选分隔符+标题（新增：1、标题 或 02标题）
  numWithOptionalSep: {
    id: 'numWithOptionalSep',
    name: '数字+可选分隔符+标题',
    pattern: /^\s*\d{1,5}[:：,.，、_—\-]?.{1,30}$/,
    examples: ['1、这个就是标题', '02美好的明天', '3:标题', '4—标题'],
    description: '数字开头，可选分隔符后跟标题内容',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 大写数字+分隔符+标题（新增：一、标题 或 二十四章 标题）
  chineseNumWithSep: {
    id: 'chineseNumWithSep',
    name: '大写数字+分隔符+标题',
    pattern: /^\s*(?:序章|楔子|正文(?!完|结)|终章|后记|尾声|番外|[零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}章?)[ 、_—\-].{1,30}$/,
    examples: ['一、只有前面的数字有差别', '二十四章 我瞎编的标题', '楔子、故事开始'],
    description: '中文数字或特殊章节名后跟分隔符和标题',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 书名+括号序号（新增：标题(12)）
  titleWithBracketNum: {
    id: 'titleWithBracketNum',
    name: '书名+括号序号',
    pattern: /^[一-龥]{1,20}\s*[(（][\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}[)）]\s*$/,
    examples: ['标题后面数字有括号(12)', '书名（一）'],
    description: '中文书名后跟括号包裹的序号',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 书名+序号（新增：标题124）
  titleWithNum: {
    id: 'titleWithNum',
    name: '书名+序号',
    pattern: /^[一-龥]{1,20}\s*[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}\s*$/,
    examples: ['标题后面数字没有括号124', '书名三'],
    description: '中文书名后直接跟数字序号',
    enabled: true,
    level: 2,
    isSystem: true
  },
  // 分节/分页阅读（新增）
  pageBreakReading: {
    id: 'pageBreakReading',
    name: '分节/分页阅读',
    pattern: /^\s*(?:.{0,15}分[页节章段]阅读[-_ ]|第\s{0,4}[\d零一二两三四五六七八九十百千万]{1,6}\s{0,4}[页节]).{0,30}$/,
    examples: ['分节阅读', '分页阅读', '分段阅读', '第一页', '第二页'],
    description: '分节/分页/分段阅读标记或"第N页/节"格式',
    enabled: true,
    level: 3,
    isSystem: true
  },
  // 顶格标题（新增：非空白开头的短标题）
  topAlignedTitle: {
    id: 'topAlignedTitle',
    name: '顶格标题',
    pattern: /^\S.{0,19}$/,
    examples: ['20字以内顶格写的都是标题', '短标题'],
    description: '不超过20个字符的顶格非空白标题（激进规则，可能误匹配）',
    enabled: false,
    level: 2,
    isSystem: true
  },
  // 顶格中文标题（增强：扩展字符范围到龟）
  topAlignedChinese: {
    id: 'topAlignedChinese',
    name: '顶格中文标题',
    pattern: /^[一-龟]{1,20}$/,
    examples: ['楔子', '序章', '章节标题'],
    description: '不超过20个中文字符的顶格标题（激进规则，可能误匹配）',
    enabled: false,
    level: 2,
    isSystem: true
  },
  // 通用规则（新增：激进匹配，适配非常用格式）
  universalRule: {
    id: 'universalRule',
    name: '通用规则(激进)',
    pattern: /^.{0,6}(?:[引楔]子|正文(?!完|结)|[引序前]言|[序终]章|扉页|[上中下][部篇卷]|卷首语|后记|尾声|番外|={2,4}|第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?!课)|卷|页[、\s]|集(?!合|和)|部(?!分|赛|游)|篇(?!张))).{0,40}$|^.{0,6}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟a-z]{1,8}[、.\s].{0,20}$/,
    examples: ['激进规则，适配更多非常用格式'],
    description: '通用激进规则，适配更多非常用格式，可能产生误匹配',
    enabled: false,
    level: 2,
    isSystem: true
  }
};

// Default level mapping for each format
export const DEFAULT_FORMAT_LEVELS = {
  chineseNumSeq: 2,
  chineseUpperNumSeq: 2,
  pureNumFormat: 2,
  zhangFormat: 2,
  huiFormat: 2,
  buFormat: 1,
  jiFormat: 2,
  jieFormat: 3,
  pianFormat: 1,
  changFormat: 3,
  englishChapterFormat: 2,
  specialSymbol: 2,
  numWithDecoration: 2,
  specialChapterName: 2,
  bodyTitle: 2,
  circleDelimiter: 2,
  equalsDelimiter: 2,
  bracketNumber: 2,
  chineseBracketChapter: 2,
  specialBracketChapter: 2,
  pairedSymbolTitle: 2,
  volumeChapter: 1,
  fanFormat: 2,
  numWithOptionalSep: 2,
  chineseNumWithSep: 2,
  titleWithBracketNum: 2,
  titleWithNum: 2,
  pageBreakReading: 3,
  topAlignedTitle: 2,
  topAlignedChinese: 2,
  universalRule: 2,
};

const DEFAULT_LEVEL_FALLBACK = 2;

/**
 * Get default level for a format
 * @param {string} formatId
 * @returns {number}
 */
export function getDefaultLevel(formatId) {
  if (Object.prototype.hasOwnProperty.call(DEFAULT_FORMAT_LEVELS, formatId)) {
    return DEFAULT_FORMAT_LEVELS[formatId];
  }
  return DEFAULT_LEVEL_FALLBACK;
}

/**
 * Normalize level value
 * @param {string} formatId
 * @param {string|number} levelValue
 * @returns {number}
 */
export function normalizeLevel(formatId, levelValue) {
  const parsed = parseInt(levelValue, 10);
  if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 6) {
    return parsed;
  }
  return getDefaultLevel(formatId);
}

// Preset templates
export const presetTemplates = [
  {
    name: '混合模式 (推荐)',
    description: '自动识别多种常见格式',
    patterns: ['chineseNumSeq', 'chineseUpperNumSeq', 'pureNumFormat', 'zhangFormat',
      'huiFormat', 'buFormat', 'jiFormat', 'jieFormat', 'pianFormat', 'changFormat',
      'englishFormat', 'specialSymbol', 'numWithDecor', 'specialChapterName',
      'bodyTitle', 'circleSeparator', 'equalSeparator', 'bracketNumber',
      'chineseBracketChapter', 'specialBracketChapter', 'juanFormat', 'fanFormat',
      'numWithOptionalSep', 'chineseNumWithSep', 'titleWithBracketNum', 'titleWithNum',
      'pageBreakReading']
  },
  {
    name: '网络小说标准',
    description: '适用于大多数网文格式',
    patterns: ['zhangFormat', 'huiFormat', 'jieFormat', 'chineseNumSeq', 'pureNumFormat',
      'specialChapterName', 'bodyTitle', 'numWithOptionalSep']
  },
  {
    name: '传统出版',
    description: '适用于传统出版物',
    patterns: ['chineseNumSeq', 'chineseUpperNumSeq', 'zhangFormat', 'huiFormat', 'juanFormat',
      'chineseNumWithSep', 'titleWithBracketNum', 'titleWithNum']
  },
  {
    name: '轻小说/日轻',
    description: '适用于轻小说格式',
    patterns: ['zhangFormat', 'jieFormat', 'englishFormat', 'specialSymbol', 'fanFormat',
      'numWithOptionalSep', 'pairedSymbolTitle']
  },
  {
    name: '晋江文学城',
    description: '适用于晋江风格',
    patterns: ['zhangFormat', 'chineseNumSeq', 'specialSymbol', 'specialChapterName',
      'fanFormat', 'bodyTitle', 'pairedSymbolTitle']
  },
  {
    name: '激进模式',
    description: '包含所有规则，适配更多非常用格式（可能误匹配）',
    patterns: ['chineseNumSeq', 'chineseUpperNumSeq', 'pureNumFormat', 'zhangFormat',
      'huiFormat', 'buFormat', 'jiFormat', 'jieFormat', 'pianFormat', 'changFormat',
      'englishFormat', 'specialSymbol', 'numWithDecor', 'specialChapterName',
      'bodyTitle', 'circleSeparator', 'equalSeparator', 'bracketNumber',
      'chineseBracketChapter', 'specialBracketChapter', 'pairedSymbolTitle',
      'juanFormat', 'fanFormat', 'numWithOptionalSep', 'chineseNumWithSep',
      'titleWithBracketNum', 'titleWithNum', 'pageBreakReading',
      'topAlignedTitle', 'topAlignedChinese', 'universalRule']
  }
];

// Pre-filter options
export const preFilterOptions = {
  requireEmptyLine: {
    name: '要求前面有空行',
    description: '典型章节前都有空行分隔，提高识别准确性',
    enabled: true
  },
  skipIndented: {
    name: '跳过明显缩进行',
    description: '跳过有明显缩进的行（Tab、多个空格等），避免误识别段落内容',
    enabled: true
  },
  prefixLengthLimit: {
    name: '章节标题前缀长度限制',
    description: '0=严格匹配，5=标准容忍，10=宽松匹配',
    value: 0
  },
  titleLineCount: {
    name: '章节标题行数设置',
    description: '设置章节标题允许占用的最大行数',
    value: 1
  }
};

// Post-filter options (chapter filter rules)
export const postFilterOptions = {
  excludeDates: {
    name: '日期格式',
    description: '排除日期和年份相关标题，如 "2020/07/17"、"2023年1月"、"4000年，此时还采取公元纪年法" 等',
    enabled: true
  },
  excludePureNumbers: {
    name: '纯数字',
    description: '排除只包含数字的标题，如 "123"、"001" 等',
    enabled: false
  },
  excludeLongTitles: {
    name: '标题过长',
    description: '排除超过指定字符数的标题',
    enabled: true,
    maxTitleLength: 40
  }
};

// Custom formats storage key
export const CUSTOM_FORMATS_KEY = 'customChapterFormats';

/**
 * Serialize formats for localStorage (convert RegExp to string)
 * @param {Object} formats
 * @returns {Object}
 */
function serializeFormats(formats) {
  const serialized = {};
  for (const [key, format] of Object.entries(formats)) {
    serialized[key] = {
      ...format,
      pattern: format.pattern ? format.pattern.source : ''
    };
  }
  return serialized;
}

/**
 * Deserialize formats from localStorage (convert string to RegExp)
 * @param {Object} formats
 * @returns {Object}
 */
function deserializeFormats(formats) {
  const deserialized = {};
  for (const [key, format] of Object.entries(formats)) {
    try {
      deserialized[key] = {
        ...format,
        pattern: format.pattern ? new RegExp(format.pattern) : null
      };
    } catch (e) {
      console.warn(`Failed to deserialize pattern for ${key}:`, e);
    }
  }
  return deserialized;
}

/**
 * Load custom formats from localStorage
 * @returns {Object}
 */
export function loadCustomFormats() {
  try {
    const saved = localStorage.getItem(CUSTOM_FORMATS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return deserializeFormats(parsed);
    }
  } catch (e) {
    console.warn('Failed to load custom formats:', e);
  }
  return {};
}

/**
 * Save custom formats to localStorage
 * @param {Object} formats
 */
export function saveCustomFormats(formats) {
  try {
    const serialized = serializeFormats(formats);
    localStorage.setItem(CUSTOM_FORMATS_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('Failed to save custom formats:', e);
  }
}

/**
 * Get all formats (system + custom)
 * @returns {Object}
 */
export function getAllChapterFormats() {
  const customFormats = loadCustomFormats();
  return { ...chapterPatterns, ...customFormats };
}

// Detect chapters from text content with filters
export function detectChapters(text, selectedPatterns = null, preFilters = {}) {
  const lines = text.split('\n');
  const chapters = [];
  const patterns = selectedPatterns || Object.values(chapterPatterns).filter(p => p.enabled);

  const { requireEmptyLine = true, skipIndented = true, prefixLengthLimit = 0 } = preFilters;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Skip indented lines
    if (skipIndented && (line.startsWith('\t') || line.startsWith('  '))) {
      continue;
    }

    // Check empty line before
    if (requireEmptyLine && i > 0 && lines[i - 1].trim()) {
      // Allow if it's the first line
      if (i !== 0) {
        // Check if previous line is also a chapter (allow consecutive chapters)
        let isPrevChapter = false;
        for (const pattern of patterns) {
          if (pattern.pattern.test(trimmed)) {
            isPrevChapter = true;
            break;
          }
        }
        if (!isPrevChapter) continue;
      }
    }

    for (const pattern of patterns) {
      if (pattern.pattern.test(trimmed)) {
        // Check prefix length
        const match = trimmed.match(pattern.pattern);
        if (match) {
          const prefix = match[0];
          if (prefixLengthLimit > 0 && prefix.length > prefixLengthLimit + 20) {
            continue;
          }
        }

        chapters.push({
          title: trimmed,
          lineNumber: i + 1,
          pattern: pattern.name,
          patternKey: pattern.id || pattern.key,
          selected: true,
          level: pattern.level || 2
        });
        break;
      }
    }
  }

  return chapters;
}

// Apply post-filters
export function applyPostFilters(chapters, postFilters = {}) {
  let result = [...chapters];

  if (postFilters.deduplicate) {
    result = result.filter((ch, idx) => {
      if (idx === 0) return true;
      const prev = result[idx - 1];
      return ch.title !== prev.title;
    });
  }

  return result;
}

// Get chapter content boundaries
export function getChapterContents(text, chapters) {
  const lines = text.split('\n');
  const contents = [];

  for (let i = 0; i < chapters.length; i++) {
    const startLine = chapters[i].lineNumber;
    const endLine = i < chapters.length - 1 ? chapters[i + 1].lineNumber : lines.length + 1;

    const content = lines.slice(startLine, endLine - 1).join('\n').trim();
    contents.push({
      ...chapters[i],
      content: content,
      wordCount: content.replace(/\s/g, '').length
    });
  }

  return contents;
}

// Get preface content (content before first chapter)
export function getPrefaceContent(text, firstChapterLine) {
  const lines = text.split('\n');
  return lines.slice(0, firstChapterLine - 1).join('\n').trim();
}
