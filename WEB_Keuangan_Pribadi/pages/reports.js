/* ═══════════════════════════════════════════════════════════
   FinPulse — Reports & Analytics (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageReports = {
  render() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const totalSpend = Store.getMonthlyExpense(y, m);
    const totalIncome = Store.getMonthlyIncome(y, m);
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalSpend) / totalIncome) * 100) : 0;
    const catTotals = Store.getCategoryTotals(y, m);
    const lang = I18n.getLang();

    const pm = m === 0 ? 11 : m - 1;
    const py = m === 0 ? y - 1 : y;
    const prevSpend = Store.getMonthlyExpense(py, pm);
    const prevIncome = Store.getMonthlyIncome(py, pm);
    const spendChange = prevSpend > 0 ? Math.round(((totalSpend - prevSpend) / prevSpend) * 100) : 0;
    const incomeChange = prevIncome > 0 ? Math.round(((totalIncome - prevIncome) / prevIncome) * 100) : 0;

    const totalCatSum = catTotals.reduce((s, c) => s + c.total, 0) || 1;
    const donutSegments = catTotals.slice(0, 4).map(c => ({
      label: lang === 'id' ? c.name_id : c.name_en,
      value: c.total,
      color: `var(--color-${c.color})`
    }));

    // Use different vibrant colors for donut
    const donutColors = ['#9d6eff', '#22d3ee', '#f472b6', '#fbbf24', '#34d399'];

    return `
      <div class="page">
        ${Components.topBar('reports')}

        <div class="animated-bg-orb" style="width:350px;height:350px;top:5%;right:-5%;background:#22d3ee;"></div>
        <div class="animated-bg-orb" style="width:300px;height:300px;bottom:20%;left:-10%;background:#f472b6;animation-delay:6s;"></div>

        <main class="page-content" style="padding-bottom:32px;position:relative;z-index:1;">
          <header style="padding-top:24px;margin-bottom:32px;">
            <h1 class="text-display-lg text-gradient-cyber" style="display:inline-block;">${I18n.t('report.title')}</h1>
            <p class="text-body-lg text-on-surface-variant" style="margin-top:8px;">${I18n.t('report.subtitle')}</p>
          </header>

          <!-- Summary Cards - Each unique vibrant color -->
          <section class="grid md\\:grid-3" style="margin-bottom:32px;">
            <!-- Total Spend - Purple/Pink -->
            <div class="card card-vivid-purple card-interactive" style="min-height:160px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
                <span class="text-label text-on-surface-variant">${I18n.t('report.totalSpend')}</span>
                <div class="icon-container-purple" style="width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:20px;">payments</span>
                </div>
              </div>
              <h2 class="text-display-mobile" style="color:#c084fc;">${Currency.format(totalSpend)}</h2>
              <div style="margin-top:16px;display:flex;align-items:center;gap:8px;">
                <span class="badge ${spendChange <= 0 ? 'badge-gradient-green' : 'badge-gradient-gold'}">
                  <span class="material-symbols-outlined" style="font-size:14px;">${spendChange <= 0 ? 'arrow_downward' : 'arrow_upward'}</span>
                  ${Math.abs(spendChange)}%
                </span>
                <span class="text-body-sm text-on-surface-variant">${I18n.t('report.vsLastMonth')}</span>
              </div>
            </div>

            <!-- Income - Green/Cyan -->
            <div class="card card-vivid-green card-interactive" style="min-height:160px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
                <span class="text-label text-on-surface-variant">${I18n.t('report.income')}</span>
                <div class="icon-container-green" style="width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:20px;">account_balance_wallet</span>
                </div>
              </div>
              <h2 class="text-display-mobile" style="color:#6ee7b7;">${Currency.format(totalIncome)}</h2>
              <div style="margin-top:16px;display:flex;align-items:center;gap:8px;">
                <span class="badge ${incomeChange >= 0 ? 'badge-gradient-green' : 'badge-gradient-gold'}">
                  <span class="material-symbols-outlined" style="font-size:14px;">${incomeChange >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>
                  ${Math.abs(incomeChange)}%
                </span>
                <span class="text-body-sm text-on-surface-variant">${I18n.t('report.vsLastMonth')}</span>
              </div>
            </div>

            <!-- Savings Rate - Gold/Cyan -->
            <div class="card card-vivid-cyan card-interactive" style="min-height:160px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
                <span class="text-label text-on-surface-variant">${I18n.t('report.savingsRate')}</span>
                <div class="icon-container-gold" style="width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:20px;">savings</span>
                </div>
              </div>
              <h2 class="text-display-mobile" style="color:#67e8f9;">${Math.max(0, savingsRate)}%</h2>
              <div style="margin-top:16px;">
                <div class="progress-bar">
                  <div class="progress-bar-fill gradient" style="width:${Math.max(0, savingsRate)}%"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Charts Bento Grid -->
          <section class="grid md\\:grid-3" style="gap:var(--space-gutter);">
            <!-- Expense Pulse Chart -->
            <div class="card card-vivid-purple md\\:col-span-2" style="height:400px;display:flex;flex-direction:column;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                <div>
                  <h3 class="text-headline text-on-surface">${I18n.t('report.expensePulse')}</h3>
                  <span class="text-body-sm text-accent-pink">✦ Live Pulse</span>
                </div>
                <select class="select-field" style="width:auto;height:40px;padding:0 32px 0 12px;font-size:12px;background-color:rgba(124,58,237,0.15);border:1px solid rgba(157,110,255,0.2);border-radius:12px;">
                  <option>${I18n.t('report.thisMonth')}</option>
                  <option>${I18n.t('report.lastMonth')}</option>
                  <option>${I18n.t('report.thisYear')}</option>
                </select>
              </div>
              <div id="report-pulse-chart" style="flex:1;position:relative;"></div>
              <div style="display:flex;justify-content:space-between;margin-top:8px;">
                <span class="text-watermark text-accent-cyan" style="opacity:0.6;">W1</span>
                <span class="text-watermark text-accent-pink" style="opacity:0.6;">W2</span>
                <span class="text-watermark text-accent-cyan" style="opacity:0.6;">W3</span>
                <span class="text-watermark text-accent-pink" style="opacity:0.6;">W4</span>
              </div>
            </div>

            <!-- Category Donut -->
            <div class="card card-vivid-pink" style="height:400px;display:flex;flex-direction:column;">
              <h3 class="text-headline text-on-surface" style="margin-bottom:24px;">${I18n.t('report.categories')}</h3>
              <div style="flex:1;display:flex;align-items:center;justify-content:center;" id="report-donut"></div>
              <div style="margin-top:24px;display:flex;flex-direction:column;gap:12px;">
                ${catTotals.slice(0, 3).map((c, i) => {
                  const pct = Math.round((c.total / totalCatSum) * 100);
                  const dotColors = ['#9d6eff', '#22d3ee', '#f472b6'];
                  return `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:12px;height:12px;border-radius:50%;background:${dotColors[i] || dotColors[0]};box-shadow:0 0 8px ${dotColors[i] || dotColors[0]}50;"></div>
                        <span class="text-body-sm text-on-surface">${lang === 'id' ? c.name_id : c.name_en}</span>
                      </div>
                      <span class="text-body-sm" style="color:${dotColors[i] || dotColors[0]};">${pct}%</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </section>

          <div class="section-divider-gradient"></div>
          ${Components.watermark()}
        </main>
      </div>
    `;
  },

  init() {
    const pulseEl = document.getElementById('report-pulse-chart');
    if (pulseEl) {
      const now = new Date();
      const weeklyData = Store.getWeeklyExpenses(now.getFullYear(), now.getMonth());
      const data = weeklyData.some(v => v > 0) ? weeklyData : [45, 30, 60, 25];
      Charts.createPulseChart(pulseEl, data);
    }

    const donutEl = document.getElementById('report-donut');
    if (donutEl) {
      const now = new Date();
      const lang = I18n.getLang();
      const catTotals = Store.getCategoryTotals(now.getFullYear(), now.getMonth());
      const vibrantColors = ['#9d6eff', '#22d3ee', '#f472b6', '#fbbf24', '#34d399'];
      const segments = catTotals.slice(0, 5).map((c, i) => ({
        label: lang === 'id' ? c.name_id : c.name_en,
        value: c.total || 1,
        color: vibrantColors[i] || vibrantColors[0]
      }));
      if (segments.length === 0) {
        segments.push({ label: '-', value: 1, color: 'rgba(36,48,77,0.5)' });
      }
      Charts.createDonutChart(donutEl, segments);
    }
  }
};
