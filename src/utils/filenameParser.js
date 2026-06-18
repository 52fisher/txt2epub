/**
 * Filename utilities: parse, sanitize, generate
 */

/**
 * Clean title text
 */
function cleanTitle(title) {
  if (!title) return '';
  return title
    .trim()
    .replace(/^[\s\-_【\[\(（]+/, '')
    .replace(/[\s\-_】\]\)）]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean author name
 */
function cleanAuthor(author) {
  if (!author) return '';
  return author
    .trim()
    .replace(/^[\s\-_【\[\(（]+/, '')
    .replace(/[\s\-_】\]\)）]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse filename to extract title and author
 */
const filenamePatterns = [
  { name: 'bracket-author', regex: /^《(.+?)》.*?作者\s*[：:]\s*(.+)$/i, titleIndex: 1, authorIndex: 2 },
  { name: 'chinese-author', regex: /^(.+?)作者\s*[：:]\s*(.+)$/i, titleIndex: 1, authorIndex: 2 },
  { name: 'english-by', regex: /^(.+?)\s+by\s+(.+)$/i, titleIndex: 1, authorIndex: 2 },
  { name: 'dash', regex: /^(.+?)\s*-\s*(.+)$/i, titleIndex: 1, authorIndex: 2 }
];

export function parseFilenameMetadata(filename) {
  const name = filename.replace(/\.[^.]+$/i, '');
  let title = name;
  let author = null;

  for (const pattern of filenamePatterns) {
    const match = name.match(pattern.regex);
    if (match) {
      title = match[pattern.titleIndex] || title;
      author = match[pattern.authorIndex] || author;
      break;
    }
  }

  title = cleanTitle(title);
  author = author ? cleanAuthor(author) : null;

  return { title: title || '未命名', author: author || null };
}

/**
 * Extract author from text content
 */
export function extractAuthorFromText(text) {
  const lines = text.split('\n').slice(0, 100);
  const authorPattern = /作者\s*[：:]\s*(.+)/i;

  for (const line of lines) {
    const match = line.match(authorPattern);
    if (match && match[1]) {
      const author = match[1].trim();
      if (author && author.length < 50) return author;
    }
  }
  return null;
}

// ============ Filename sanitization ============

/**
 * Standard sanitize: replace spaces with underscores, remove illegal chars
 */
export function sanitizeFilename(filename) {
  if (!filename) return '';
  return filename
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .trim();
}

/**
 * Keep spaces sanitize: remove illegal chars but keep spaces
 */
export function sanitizeFilenameKeepSpace(filename) {
  if (!filename) return '';
  return filename
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Allow full-width chars sanitize: keep 《》：
 */
export function sanitizeFilenameWithBookmarks(filename) {
  if (!filename) return '';
  return filename
    .replace(/[\/\\*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Smart sanitize based on content
 */
export function sanitizeTemplateResult(filename) {
  if (!filename) return '';
  const hasFullWidthChars = /[《》：（）【】]/.test(filename);
  if (hasFullWidthChars) {
    return sanitizeFilenameWithBookmarks(filename);
  } else if (/\s/.test(filename)) {
    return sanitizeFilenameKeepSpace(filename);
  } else {
    return sanitizeFilename(filename);
  }
}

// ============ Filename format generation ============

/**
 * Parse template string, replace placeholders
 * Supports: {书名}, {作者名}, {作者}
 */
export function parseTemplate(template, title, author) {
  if (!template) return '';
  const cleanTitle = title || '未命名';
  const cleanAuthor = author || '佚名';

  let result = template
    .replace(/\{书名\}/g, cleanTitle)
    .replace(/\{作者名\}/g, cleanAuthor)
    .replace(/\{作者\}/g, cleanAuthor);

  return sanitizeTemplateResult(result);
}

/**
 * Generate filename based on format preset
 * @param {string} format - Format key
 * @param {string} title - Book title
 * @param {string} author - Author name
 * @param {string} customTemplate - Custom template string (only used when format is 'custom')
 * @returns {string}
 */
export function generateFilename(format, title, author, customTemplate = '') {
  let cleanTitle, cleanAuthor;

  switch (format) {
    case 'title':
      cleanTitle = sanitizeFilename(title) || '未命名';
      return cleanTitle;

    case 'title_author':
      cleanTitle = sanitizeFilename(title) || '未命名';
      cleanAuthor = sanitizeFilename(author) || '佚名';
      return cleanAuthor !== '佚名' ? `${cleanTitle}_${cleanAuthor}` : cleanTitle;

    case 'author_title':
      cleanTitle = sanitizeFilename(title) || '未命名';
      cleanAuthor = sanitizeFilename(author) || '佚名';
      return cleanAuthor !== '佚名' ? `${cleanAuthor}_${cleanTitle}` : cleanTitle;

    case 'title_space_author':
      cleanTitle = sanitizeFilenameKeepSpace(title) || '未命名';
      cleanAuthor = sanitizeFilenameKeepSpace(author) || '佚名';
      return cleanAuthor !== '佚名' ? `${cleanTitle} ${cleanAuthor}` : cleanTitle;

    case 'title_bookmarks_author':
      cleanTitle = sanitizeFilenameWithBookmarks(title) || '未命名';
      cleanAuthor = sanitizeFilenameWithBookmarks(author) || '佚名';
      return cleanAuthor !== '佚名' ? `《${cleanTitle}》作者：${cleanAuthor}` : `《${cleanTitle}》`;

    case 'custom':
      if (customTemplate) {
        return parseTemplate(customTemplate, title, author);
      }
      return sanitizeFilename(title) || '未命名';

    default:
      return sanitizeFilename(title) || '未命名';
  }
}

/**
 * Filename format presets
 */
export const filenameFormatPresets = [
  { key: 'title', name: '书名' },
  { key: 'title_author', name: '书名_作者' },
  { key: 'author_title', name: '作者_书名' },
  { key: 'title_space_author', name: '书名(空格)作者' },
  { key: 'title_bookmarks_author', name: '《书名》作者：作者名' },
  { key: 'custom', name: '自定义' }
];

/**
 * Custom template quick presets
 */
export const customTemplatePresets = [
  { label: '书名_作者名', template: '{书名}_{作者名}' },
  { label: '书名 作者名', template: '{书名} {作者名}' },
  { label: '[作者名] 书名', template: '[{作者名}] {书名}' },
  { label: '书名(作者名)', template: '{书名}({作者名})' },
  { label: '作者名-书名', template: '{作者名}-{书名}' },
  { label: '《书名》作者：作者名', template: '《{书名}》作者：{作者名}' }
];

// ============ Settings persistence ============

const STORAGE_KEYS = {
  autoParseFilename: 'txt2epub_autoParseFilename',
  filenameFormat: 'txt2epub_filenameFormat',
  customFilenameTemplate: 'txt2epub_customFilenameTemplate'
};

export function saveFilenameSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.autoParseFilename, JSON.stringify(settings.autoParse));
    localStorage.setItem(STORAGE_KEYS.filenameFormat, settings.format);
    localStorage.setItem(STORAGE_KEYS.customFilenameTemplate, settings.customTemplate);
  } catch (e) {
    console.warn('Failed to save filename settings:', e);
  }
}

export function loadFilenameSettings() {
  try {
    const autoParse = localStorage.getItem(STORAGE_KEYS.autoParseFilename);
    const format = localStorage.getItem(STORAGE_KEYS.filenameFormat);
    const customTemplate = localStorage.getItem(STORAGE_KEYS.customFilenameTemplate);

    return {
      autoParse: autoParse !== null ? JSON.parse(autoParse) : true,
      format: format || 'title_author',
      customTemplate: customTemplate || '{书名}_{作者名}'
    };
  } catch (e) {
    console.warn('Failed to load filename settings:', e);
    return {
      autoParse: true,
      format: 'title_author',
      customTemplate: '{书名}_{作者名}'
    };
  }
}
