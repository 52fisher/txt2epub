export const coverColorThemes = [
  { key: 'dark', name: '经典黑白', primary: '#2c3e50', secondary: '#ecf0f1' },
  { key: 'blue', name: '深蓝专业', primary: '#3498db', secondary: '#ffffff' },
  { key: 'orange', name: '暖橙活力', primary: '#e67e22', secondary: '#ffffff' },
  { key: 'green', name: '森林绿', primary: '#27ae60', secondary: '#ffffff' },
  { key: 'purple', name: '紫罗兰优雅', primary: '#9b59b6', secondary: '#ffffff' },
  { key: 'brown', name: '咖啡棕', primary: '#8b4513', secondary: '#f5deb3' },
  { key: 'teal', name: '海洋蓝', primary: '#1abc9c', secondary: '#ffffff' },
  { key: 'pink', name: '樱花粉', primary: '#e91e63', secondary: '#ffffff' },
  { key: 'elegant', name: '淡雅米白', primary: '#4a5568', secondary: '#faf5f5' }
];

export const coverRatioPresets = {
  standard: { width: 600, height: 900 },
  square: { width: 600, height: 600 },
  golden: { width: 600, height: 970 },
  widescreen: { width: 960, height: 540 },
  tall: { width: 540, height: 960 },
  a4: { width: 600, height: 849 },
  kindle_classic: { width: 600, height: 800 },
  kindle_oasis: { width: 1264, height: 1680 },
  kindle_scribe: { width: 1264, height: 1680 }
};

function wrapText(ctx, text, maxWidth) {
  const chars = text.split('');
  const lines = [];
  let currentLine = '';
  for (const char of chars) {
    const testLine = currentLine + char;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [text];
}

function adjustColor(hex, amount) {
  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);
  let r = Math.min(255, Math.max(0, (num >> 16) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function drawMinimalCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = theme.primary;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = theme.secondary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.08, 48));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  const lines = wrapText(ctx, title, w * 0.7);
  const lineHeight = titleSize * 1.4;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => { ctx.fillText(line, w / 2, startY + i * lineHeight); });
  if (author) {
    ctx.font = `${titleSize * 0.5}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(author, w / 2, h * 0.7);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = theme.secondary;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.55);
  ctx.lineTo(w * 0.7, h * 0.55);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawGradientCover(ctx, w, h, theme, title, author) {
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, theme.primary);
  gradient.addColorStop(1, adjustColor(theme.primary, -40));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = theme.secondary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.08, 48));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  const lines = wrapText(ctx, title, w * 0.7);
  const lineHeight = titleSize * 1.4;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => { ctx.fillText(line, w / 2, startY + i * lineHeight); });
  if (author) {
    ctx.font = `${titleSize * 0.5}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(author, w / 2, h * 0.7);
    ctx.globalAlpha = 1;
  }
}

function drawBorderCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = theme.secondary;
  ctx.fillRect(0, 0, w, h);
  const margin = w * 0.08;
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 3;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 8, margin + 8, w - margin * 2 - 16, h - margin * 2 - 16);
  ctx.fillStyle = theme.primary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.07, 44));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  const lines = wrapText(ctx, title, w * 0.6);
  const lineHeight = titleSize * 1.4;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => { ctx.fillText(line, w / 2, startY + i * lineHeight); });
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(author, w / 2, h * 0.7);
    ctx.globalAlpha = 1;
  }
}

function drawInkCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = theme.secondary;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = theme.primary;
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 5; i++) {
    const cx = w * (0.2 + Math.random() * 0.6);
    const cy = h * (0.2 + Math.random() * 0.6);
    const r = Math.max(30, w * 0.15 * Math.random());
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.primary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.08, 48));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", serif`;
  const lines = wrapText(ctx, title, w * 0.65);
  const lineHeight = titleSize * 1.5;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => { ctx.fillText(line, w / 2, startY + i * lineHeight); });
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(author, w / 2, h * 0.72);
    ctx.globalAlpha = 1;
  }
}

function drawFloralCover(ctx, w, h, theme, title, author) {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, theme.secondary);
  gradient.addColorStop(1, adjustColor(theme.secondary, -15));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = theme.primary;
  for (let i = 0; i < 8; i++) {
    const cx = w * Math.random();
    const cy = h * Math.random();
    const r = 20 + Math.random() * 40;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.primary;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, 0, w, h * 0.03);
  ctx.fillRect(0, h * 0.97, w, h * 0.03);
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.primary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.07, 44));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  const lines = wrapText(ctx, title, w * 0.65);
  const lineHeight = titleSize * 1.4;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => { ctx.fillText(line, w / 2, startY + i * lineHeight); });
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(author, w / 2, h * 0.7);
    ctx.globalAlpha = 1;
  }
}

function drawNeonCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);
  const glowColor = theme.primary;
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 3; i++) {
    const cx = w * (0.3 + i * 0.2);
    const cy = h * 0.3;
    const r = w * 0.25;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, glowColor);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  const m = 20;
  ctx.strokeRect(m, m, w - m * 2, h - m * 2);
  ctx.globalAlpha = 0.15;
  ctx.strokeRect(m + 6, m + 6, w - m * 2 - 12, h - m * 2 - 12);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.08, 48));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  ctx.shadowColor = theme.primary;
  ctx.shadowBlur = 20;
  ctx.fillStyle = theme.primary;
  const lines = wrapText(ctx, title, w * 0.7);
  const lineHeight = titleSize * 1.5;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight));
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#ffffff';
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight));
  ctx.shadowBlur = 0;
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 10;
    ctx.fillStyle = theme.secondary;
    ctx.globalAlpha = 0.8;
    ctx.fillText(author, w / 2, h * 0.72);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

function drawVintageCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = Math.random() > 0.5 ? '#8b7355' : '#d4c5a9';
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
  const edgeGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
  edgeGrad.addColorStop(0, 'transparent');
  edgeGrad.addColorStop(1, 'rgba(139,115,85,0.15)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, w, h);
  const m1 = w * 0.06;
  const m2 = m1 + 10;
  ctx.strokeStyle = '#8b7355';
  ctx.lineWidth = 2;
  ctx.strokeRect(m1, m1, w - m1 * 2, h - m1 * 2);
  ctx.lineWidth = 1;
  ctx.strokeRect(m2, m2, w - m2 * 2, h - m2 * 2);
  const ornSize = 15;
  ctx.lineWidth = 2;
  [[m1, m1], [w - m1, m1], [m1, h - m1], [w - m1, h - m1]].forEach(([cx, cy]) => {
    const dx = cx < w / 2 ? 1 : -1;
    const dy = cy < h / 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * ornSize);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * ornSize, cy);
    ctx.stroke();
  });
  ctx.fillStyle = '#4a3728';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.07, 42));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", serif`;
  const lines = wrapText(ctx, title, w * 0.6);
  const lineHeight = titleSize * 1.5;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight));
  ctx.strokeStyle = '#8b7355';
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  const divY = h * 0.55;
  ctx.beginPath();
  ctx.moveTo(w * 0.25, divY);
  ctx.lineTo(w * 0.4, divY);
  ctx.moveTo(w * 0.45, divY);
  ctx.lineTo(w * 0.55, divY);
  ctx.moveTo(w * 0.6, divY);
  ctx.lineTo(w * 0.75, divY);
  ctx.stroke();
  ctx.globalAlpha = 1;
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(author, w / 2, h * 0.68);
    ctx.globalAlpha = 1;
  }
}

function drawGeometricCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = theme.secondary;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = theme.primary;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.8);
  ctx.lineTo(w * 0.5, h * 0.1);
  ctx.lineTo(w * 0.9, h * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.75, h * 0.3, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.35);
  ctx.lineTo(w * 0.35, h * 0.15);
  ctx.lineTo(w * 0.4, h * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = theme.primary;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9);
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.primary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.07, 44));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  const lines = wrapText(ctx, title, w * 0.65);
  const lineHeight = titleSize * 1.4;
  const startY = h * 0.42 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight));
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(author, w / 2, h * 0.68);
    ctx.globalAlpha = 1;
  }
}

function drawStarfieldCover(ctx, w, h, theme, title, author) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0b0d2e');
  grad.addColorStop(0.5, '#1a1a4e');
  grad.addColorStop(1, '#0d1117');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.5;
    const alpha = 0.3 + Math.random() * 0.7;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.06;
  const nebGrad = ctx.createRadialGradient(w * 0.6, h * 0.35, 0, w * 0.6, h * 0.35, w * 0.4);
  nebGrad.addColorStop(0, theme.primary);
  nebGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = nebGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.08, 48));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  ctx.shadowColor = theme.primary;
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#ffffff';
  const lines = wrapText(ctx, title, w * 0.7);
  const lineHeight = titleSize * 1.5;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight));
  ctx.shadowBlur = 0;
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = theme.secondary;
    ctx.fillText(author, w / 2, h * 0.72);
    ctx.globalAlpha = 1;
  }
}

function drawBambooCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = '#f7f3e9';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#5a7247';
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 4; i++) {
    const x = w * (0.78 + i * 0.06);
    ctx.lineWidth = 3 - i * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, h * 0.05);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, h * 0.95);
    ctx.stroke();
    for (let j = 0; j < 6; j++) {
      const ny = h * (0.1 + j * 0.15);
      ctx.beginPath();
      ctx.moveTo(x - 4, ny);
      ctx.lineTo(x + 4, ny);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#5a7247';
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 12; i++) {
    const lx = w * (0.72 + Math.random() * 0.25);
    const ly = h * (0.05 + Math.random() * 0.5);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate((Math.random() - 0.5) * 0.8);
    ctx.beginPath();
    ctx.ellipse(0, 0, 3, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#5a7247';
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.2);
  ctx.lineTo(w * 0.15, h * 0.8);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#3d4a2e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.07, 42));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", serif`;
  const lines = wrapText(ctx, title, w * 0.55);
  const lineHeight = titleSize * 1.5;
  const startY = h * 0.4 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, w * 0.45, startY + i * lineHeight));
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(author, w * 0.45, h * 0.7);
    ctx.globalAlpha = 1;
  }
}

function drawWaveCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = theme.secondary;
  ctx.fillRect(0, 0, w, h);
  const waveColors = [adjustColor(theme.primary, 40), adjustColor(theme.primary, 20), theme.primary, adjustColor(theme.primary, -20)];
  for (let layer = 0; layer < 4; layer++) {
    ctx.fillStyle = waveColors[layer];
    ctx.globalAlpha = 0.08 + layer * 0.03;
    ctx.beginPath();
    const baseY = h * (0.55 + layer * 0.1);
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 2) {
      const y = baseY + Math.sin((x / w) * Math.PI * (2 + layer * 0.5) + layer) * (15 + layer * 5);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.primary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = Math.max(16, Math.min(w * 0.07, 44));
  ctx.font = `bold ${titleSize}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
  const lines = wrapText(ctx, title, w * 0.65);
  const lineHeight = titleSize * 1.4;
  const startY = h * 0.32 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight));
  if (author) {
    ctx.font = `${titleSize * 0.45}px "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(author, w / 2, h * 0.48);
    ctx.globalAlpha = 1;
  }
}

function drawTypewriterCover(ctx, w, h, theme, title, author) {
  ctx.fillStyle = '#faf8f0';
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = '#999';
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#cc4444';
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(w * 0.12, 0);
  ctx.lineTo(w * 0.12, h);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#c0d0e0';
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 0.5;
  const lineSpacing = 28;
  for (let y = h * 0.15; y < h * 0.85; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(w * 0.15, y);
    ctx.lineTo(w * 0.88, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const titleSize = Math.max(16, Math.min(w * 0.06, 36));
  ctx.font = `bold ${titleSize}px "Courier New", "Noto Sans CJK SC", monospace`;
  const lines = wrapText(ctx, title, w * 0.7);
  const startX = w * 0.15;
  const startY = h * 0.35;
  lines.forEach((line, i) => ctx.fillText(line, startX, startY + i * lineSpacing));
  if (author) {
    ctx.font = `${titleSize * 0.6}px "Courier New", "Noto Sans CJK SC", monospace`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(`— ${author}`, startX, startY + lines.length * lineSpacing + 20);
    ctx.globalAlpha = 1;
  }
  ctx.font = `${Math.max(10, titleSize * 0.35)}px "Courier New", monospace`;
  ctx.globalAlpha = 0.3;
  ctx.textAlign = 'right';
  ctx.fillText('MANUSCRIPT', w * 0.88, h * 0.08);
  ctx.globalAlpha = 1;
}

export function generateCoverImage({ width, height, template, colorTheme, title, author }) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const theme = coverColorThemes.find(t => t.key === colorTheme) || coverColorThemes[0];
    const drawFunctions = {
      minimal: drawMinimalCover, gradient: drawGradientCover, border: drawBorderCover,
      ink: drawInkCover, floral: drawFloralCover, neon: drawNeonCover,
      vintage: drawVintageCover, geometric: drawGeometricCover, starfield: drawStarfieldCover,
      bamboo: drawBambooCover, wave: drawWaveCover, typewriter: drawTypewriterCover
    };
    const drawFn = drawFunctions[template] || drawMinimalCover;
    drawFn(ctx, width, height, theme, title || '未命名', author || '');
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Failed to generate cover')); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayReader = new FileReader();
        arrayReader.onload = (e2) => {
          resolve({ dataUrl: e.target.result, arrayBuffer: e2.target.result });
        };
        arrayReader.readAsArrayBuffer(blob);
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.95);
  });
}
