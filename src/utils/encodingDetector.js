// Encoding detection using jschardet
import jschardet from 'jschardet';

/**
 * Detect file encoding using jschardet
 * @param {ArrayBuffer} buffer - File buffer
 * @returns {Object} { encoding, confidence }
 */
export function detectEncoding(buffer) {
  // Convert ArrayBuffer to string for jschardet
  const uint8Array = new Uint8Array(buffer);
  let binaryString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }

  const result = jschardet.detect(binaryString);

  if (!result || !result.encoding) {
    return { encoding: 'UTF-8', confidence: 0 };
  }

  return {
    encoding: normalizeEncoding(result.encoding),
    confidence: result.confidence || 0
  };
}

/**
 * Normalize encoding names
 * @param {string} encoding 
 * @returns {string}
 */
export function normalizeEncoding(encoding) {
  if (!encoding) return 'UTF-8';
  const upper = encoding.toUpperCase();

  // Map common aliases
  const encodingMap = {
    'GB2312': 'GBK',
    'GB-2312': 'GBK',
    'GB_2312': 'GBK',
    'BIG5': 'Big5',
    'BIG-5': 'Big5',
    'SHIFT_JIS': 'Shift_JIS',
    'SHIFT-JIS': 'Shift_JIS',
    'EUC_KR': 'EUC-KR',
    'EUC-KR': 'EUC-KR',
    'ISO-8859-1': 'ISO-8859-1',
    'WINDOWS-1252': 'Windows-1252',
    'WIN-1252': 'Windows-1252',
    'ASCII': 'UTF-8',
    'UTF8': 'UTF-8'
  };

  return encodingMap[upper] || upper;
}

/**
 * Read file as text with specified encoding
 * @param {File} file 
 * @param {string} encoding 
 * @returns {Promise<string>}
 */
export function readFileAsText(file, encoding) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file, encoding);
  });
}

/**
 * Read file as ArrayBuffer
 * @param {File} file 
 * @returns {Promise<ArrayBuffer>}
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
}
