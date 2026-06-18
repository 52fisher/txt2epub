// 主题切换逻辑
import { ref } from 'vue'

// 是否为暗色模式，从 localStorage 读取，默认为暗色
const isDarkMode = ref(localStorage.getItem('txt2epub_theme') !== 'light')

/**
 * 切换主题（暗色/亮色）
 */
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  applyTheme()
}

/**
 * 应用主题：在 documentElement 上添加/移除 'light' class，并持久化到 localStorage
 */
function applyTheme() {
  if (isDarkMode.value) {
    document.documentElement.classList.remove('light')
    localStorage.setItem('txt2epub_theme', 'dark')
  } else {
    document.documentElement.classList.add('light')
    localStorage.setItem('txt2epub_theme', 'light')
  }
}

// 初始化时立即应用主题
applyTheme()

export function useTheme() {
  return {
    isDarkMode,
    toggleTheme,
    applyTheme
  }
}
