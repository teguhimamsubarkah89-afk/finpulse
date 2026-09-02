/* ═══════════════════════════════════════════════════════════
   FinPulse — SVG Charts
   ═══════════════════════════════════════════════════════════ */

const Charts = {
  // ── Pulse Line Chart (Cash Flow) ──
  createPulseChart(container, data = [], options = {}) {
    const width = options.width || 400;
    const height = options.height || 150;
    const padding = 10;
    
    if (!data.length) {
      data = [30, 45, 25, 60, 40, 70, 55, 80, 45, 65, 50, 75];
    }

    const maxVal = Math.max(...data) || 1;
    const points = data.map((val, i) => ({
      x: padding + (i / (data.length - 1)) * (width - 2 * padding),
      y: height - padding - ((val / maxVal) * (height - 2 * padding))
    }));

    // Create smooth bezier path
    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
      path += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }

    // Fill path
    const fillPath = path + ` L${points[points.length-1].x},${height} L${points[0].x},${height} Z`;

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="chart-svg" style="width:100%;height:100%">
        <defs>
          <linearGradient id="pulseGrad${Date.now()}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--color-primary-container)" stop-opacity="0.2"/>
            <stop offset="50%" stop-color="var(--color-primary)" stop-opacity="1"/>
            <stop offset="100%" stop-color="var(--color-secondary)" stop-opacity="1"/>
          </linearGradient>
          <linearGradient id="pulseFill${Date.now()}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--color-primary-container)" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="var(--color-surface-container)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${fillPath}" fill="url(#pulseFill${Date.now()})" />
        <path d="${path}" fill="none" stroke="url(#pulseGrad${Date.now()})" stroke-width="3" stroke-linecap="round" class="pulse-path" />
        ${points.filter((_, i) => i % 3 === 1 || i === points.length - 1).map(p => 
          `<circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--color-primary)" opacity="0.8"/>`
        ).join('')}
      </svg>
    `;
    
    if (container) container.innerHTML = svg;
    return svg;
  },

  // ── Donut Chart ──
  createDonutChart(container, segments = [], options = {}) {
    const size = options.size || 192;
    
    if (!segments.length) {
      segments = [
        { label: 'Food', value: 45, color: 'var(--color-primary)' },
        { label: 'Transport', value: 30, color: 'var(--color-secondary)' },
        { label: 'Shopping', value: 15, color: 'var(--color-tertiary-container)' },
        { label: 'Other', value: 10, color: 'var(--color-error)' },
      ];
    }

    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let cumPercent = 0;
    const gradientStops = segments.map(seg => {
      const start = cumPercent;
      cumPercent += (seg.value / total) * 100;
      return `${seg.color} ${start}% ${cumPercent}%`;
    }).join(', ');

    const topCategory = segments[0]?.label || '-';

    const html = `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        <div style="width:100%;height:100%;border-radius:50%;background:conic-gradient(from 0deg, ${gradientStops});-webkit-mask-image:radial-gradient(circle,transparent 55%,black 56%);mask-image:radial-gradient(circle,transparent 55%,black 56%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span class="text-label text-on-surface-variant">${options.centerLabel || I18n.t('report.top')}</span>
          <span class="text-headline text-primary">${topCategory}</span>
        </div>
      </div>
    `;

    if (container) container.innerHTML = html;
    return html;
  },

  // ── Progress Ring ──
  createProgressRing(percent, options = {}) {
    const size = options.size || 96;
    const stroke = options.stroke || 8;
    const color = options.color || 'var(--color-primary)';
    const icon = options.icon || '';
    const r = (size - stroke) / 2 - 4;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percent / 100) * circumference;

    return `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <svg viewBox="0 0 ${size} ${size}" style="width:100%;height:100%;">
          <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="transparent" 
                  stroke="var(--color-surface-container-high)" stroke-width="${stroke}"/>
          <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="transparent"
                  stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  style="transform:rotate(-90deg);transform-origin:50% 50%;transition:stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1);"/>
        </svg>
        ${icon ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
          <span class="material-symbols-outlined" style="color:${color};font-size:24px;">${icon}</span>
        </div>` : ''}
      </div>
    `;
  },

  // ── Bar Chart (Simple) ──
  createBarChart(container, data = [], options = {}) {
    const labels = data.map(d => d.label);
    const values = data.map(d => d.value);
    const maxVal = Math.max(...values) || 1;
    const barColor = options.color || 'var(--color-primary)';

    const html = `
      <div style="display:flex;align-items:flex-end;gap:8px;height:${options.height || 120}px;width:100%;">
        ${values.map((val, i) => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;">
            <div style="flex:1;width:100%;display:flex;align-items:flex-end;">
              <div style="width:100%;height:${(val/maxVal)*100}%;background:${barColor};border-radius:6px 6px 0 0;min-height:4px;transition:height 0.5s cubic-bezier(0.16,1,0.3,1);opacity:${0.4 + (val/maxVal)*0.6}"></div>
            </div>
            <span class="text-watermark text-on-surface-variant">${labels[i]}</span>
          </div>
        `).join('')}
      </div>
    `;

    if (container) container.innerHTML = html;
    return html;
  },

  // ── Animated Count Up ──
  countUp(element, target, duration = 1200, prefix = '', suffix = '') {
    const start = 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      element.textContent = prefix + Currency._formatNumber(current) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
};
