import JSZip from 'jszip';

// Generate a unique ID
function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Escape XML special characters
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert text content to HTML paragraphs
function textToHtml(text, style) {
  const lines = text.split('\n');
  let html = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (!style.removeEmptyLines) {
        html += '<p>&nbsp;</p>\n';
      }
      continue;
    }
    html += `<p>${escapeXml(trimmed)}</p>\n`;
  }
  
  return html;
}

// Generate CSS from style settings
function generateCSS(style) {
  const {
    paragraphIndent = 2,
    titleSize = 1.4,
    chapterTopMargin = 1,
    chapterBottomMargin = 1,
    pageMargin = 0,
    lineHeight = 1.3,
    paragraphSpacing = 0.5,
    textAlign = 'justify',
    titleAlign = 'center',
    titleBold = true,
    nightMode = false,
    titleUnderline = false,
    tocSpacing = 0.2,
    removeEmptyLines = false,
    chapterNav = false,
    kindleFontFollow = 'keep-current',
    chapterContinuous = false,
    chapterTitleLine = false
  } = style;

  const bgColor = nightMode ? '#1a1a1a' : '#ffffff';
  const textColor = nightMode ? '#e0e0e0' : '#333333';
  const linkColor = nightMode ? '#4a9eff' : '#0066cc';

  let fontFamilyCSS = '';
  if (kindleFontFollow === 'complete-follow') {
    fontFamilyCSS = 'font-family: serif;';
  } else if (kindleFontFollow === 'title-follow-body') {
    fontFamilyCSS = 'font-family: "Noto Serif CJK SC", "Source Han Serif SC", serif;';
  } else {
    fontFamilyCSS = 'font-family: "Noto Serif CJK SC", "Source Han Serif SC", "WenQuanYi Micro Hei", serif;';
  }

  return `@charset "UTF-8";

body {
  margin: ${pageMargin}em;
  padding: 0;
  ${fontFamilyCSS}
  font-size: 1em;
  line-height: ${lineHeight};
  color: ${textColor};
  background-color: ${bgColor};
  text-align: ${textAlign};
}

p {
  text-indent: ${paragraphIndent}em;
  margin: 0 0 ${paragraphSpacing}em 0;
}

h1, h2, h3, h4, h5, h6 {
  text-align: ${titleAlign};
  margin: ${chapterTopMargin}em 0 ${chapterBottomMargin}em 0;
  ${chapterContinuous ? '' : 'page-break-before: always;'}
  ${titleBold ? 'font-weight: bold;' : ''}
  ${titleUnderline ? 'border-bottom: 1px solid currentColor; padding-bottom: 0.3em;' : ''}
  ${chapterTitleLine ? 'border-bottom: 1px solid #ccc; padding-bottom: 0.5em;' : ''}
}

h1 {
  font-size: ${titleSize * 1.3}em;
}

h2 {
  font-size: ${titleSize}em;
}

h3 {
  font-size: ${titleSize * 0.9}em;
}

h4 {
  font-size: ${titleSize * 0.85}em;
}

h5 {
  font-size: ${titleSize * 0.8}em;
}

h6 {
  font-size: ${titleSize * 0.75}em;
}

h1:first-child, h2:first-child {
  page-break-before: auto;
}

toc {
  margin: 1em 0;
}

toc a {
  color: ${linkColor};
  text-decoration: none;
  display: block;
  margin: ${tocSpacing}em 0;
}

toc a:hover {
  text-decoration: underline;
}

.nav {
  text-align: center;
  margin: 1em 0;
  font-size: 0.9em;
}

.nav a {
  color: ${linkColor};
  text-decoration: none;
  margin: 0 0.5em;
}

${style.customCSS || ''}
`;
}

// Generate mimetype
function generateMimetype() {
  return 'application/epub+zip';
}

// Generate container.xml
function generateContainer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

// Generate content.opf
function generateContentOpf(metadata, chapters, hasToc, coverImage, hasPreface, prefaceTitle) {
  const { title, author, language = 'zh-CN', description = '' } = metadata;
  const bookId = generateId();
  const date = new Date().toISOString().split('T')[0];
  
  let manifest = '';
  let spine = '';
  
  // CSS
  manifest += '    <item id="style" href="style.css" media-type="text/css"/>\n';
  
  // Cover
  if (coverImage) {
    manifest += '    <item id="cover" href="cover.html" media-type="application/xhtml+xml"/>\n';
    manifest += '    <item id="cover-image" href="cover.jpg" media-type="image/jpeg"/>\n';
    spine += '    <itemref idref="cover"/>\n';
  }
  
  // Preface
  if (hasPreface && prefaceTitle) {
    manifest += '    <item id="preface" href="preface.html" media-type="application/xhtml+xml"/>\n';
    spine += '    <itemref idref="preface"/>\n';
  }
  
  // TOC
  if (hasToc) {
    manifest += '    <item id="toc" href="toc.html" media-type="application/xhtml+xml"/>\n';
    spine += '    <itemref idref="toc"/>\n';
  }
  
  // Chapters
  chapters.forEach((chapter, index) => {
    const id = `chapter-${index}`;
    manifest += `    <item id="${id}" href="${id}.html" media-type="application/xhtml+xml"/>\n`;
    spine += `    <itemref idref="${id}"/>\n`;
  });
  
  let metaDescription = '';
  if (description) {
    metaDescription = `    <dc:description>${escapeXml(description)}</dc:description>\n`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${bookId}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator>${escapeXml(author || 'Unknown')}</dc:creator>
    <dc:language>${language}</dc:language>
    <dc:date>${date}</dc:date>
${metaDescription}    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z/, 'Z')}</meta>
  </metadata>
  <manifest>
${manifest}  </manifest>
  <spine>
${spine}  </spine>
</package>`;
}

// Generate TOC HTML
function generateTocHtml(chapters, metadata, prefaceTitle) {
  let tocItems = '';
  
  if (prefaceTitle) {
    tocItems += `    <a href="preface.html">${escapeXml(prefaceTitle)}</a>\n`;
  }
  
  chapters.forEach((chapter, index) => {
    const displayTitle = chapter.displayTitle || chapter.title;
    tocItems += `    <a href="chapter-${index}.html">${escapeXml(displayTitle)}</a>\n`;
  });
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <title>目录 - ${escapeXml(metadata.title)}</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
  <h1>目录</h1>
  <toc>
${tocItems}  </toc>
</body>
</html>`;
}

// Generate cover HTML
function generateCoverHtml(metadata, coverImage) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <title>封面 - ${escapeXml(metadata.title)}</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
  <style>
    body { margin: 0; padding: 0; text-align: center; }
    .cover { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; }
    .cover-title { font-size: 2em; font-weight: bold; margin-bottom: 1em; }
    .cover-author { font-size: 1.2em; color: #666; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="cover">
    ${coverImage ? '<img src="cover.jpg" alt="封面"/>' : ''}
    <div class="cover-title">${escapeXml(metadata.title)}</div>
    <div class="cover-author">${escapeXml(metadata.author || '')}</div>
  </div>
</body>
</html>`;
}

// Generate preface HTML
function generatePrefaceHtml(prefaceContent, metadata, style) {
  const content = textToHtml(prefaceContent, style);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(metadata.prefaceTitle || '前言')} - ${escapeXml(metadata.title)}</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
  <h2>${escapeXml(metadata.prefaceTitle || '前言')}</h2>
  ${content}
</body>
</html>`;
}

// Generate chapter HTML with dynamic heading level
function generateChapterHtml(chapter, index, total, metadata, style) {
  const prevLink = index > 0 ? `<a href="chapter-${index - 1}.html">上一章</a>` : '';
  const nextLink = index < total - 1 ? `<a href="chapter-${index + 1}.html">下一章</a>` : '';
  const tocLink = `<a href="toc.html">目录</a>`;
  
  let nav = '';
  if (style.chapterNav) {
    nav = `
  <div class="nav">
    ${prevLink} ${tocLink} ${nextLink}
  </div>`;
  }
  
  const content = textToHtml(chapter.content, style);
  const displayTitle = chapter.displayTitle || chapter.title;
  const level = chapter.level || 2;
  const headingTag = `h${level}`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(displayTitle)} - ${escapeXml(metadata.title)}</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
${nav}
  <${headingTag}>${escapeXml(displayTitle)}</${headingTag}>
  ${content}
${nav}
</body>
</html>`;
}

// Main EPUB generation function
export async function generateEpub(options) {
  const {
    metadata,
    chapters,
    style = {},
    coverImage = null,
    generateToc = true,
    prefaceContent = '',
    prefaceTitle = ''
  } = options;
  
  const hasPreface = prefaceContent && prefaceTitle;
  
  const zip = new JSZip();
  
  // mimetype must be first and uncompressed
  zip.file('mimetype', generateMimetype(), { compression: 'STORE' });
  
  // META-INF/container.xml
  zip.folder('META-INF').file('container.xml', generateContainer());
  
  // OEBPS folder
  const oebps = zip.folder('OEBPS');
  
  // CSS
  oebps.file('style.css', generateCSS(style));
  
  // Cover
  if (coverImage) {
    oebps.file('cover.html', generateCoverHtml(metadata, true));
    oebps.file('cover.jpg', coverImage);
  }
  
  // Preface
  if (hasPreface) {
    oebps.file('preface.html', generatePrefaceHtml(prefaceContent, metadata, style));
  }
  
  // TOC
  if (generateToc && chapters.length > 0) {
    oebps.file('toc.html', generateTocHtml(chapters, metadata, hasPreface ? prefaceTitle : ''));
  }
  
  // Chapters
  chapters.forEach((chapter, index) => {
    oebps.file(`chapter-${index}.html`, generateChapterHtml(chapter, index, chapters.length, metadata, style));
  });
  
  // content.opf
  oebps.file('content.opf', generateContentOpf(metadata, chapters, generateToc, coverImage, hasPreface, prefaceTitle));
  
  // Generate zip
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

// Download blob as file
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
