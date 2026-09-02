/* ═══════════════════════════════════════════════════════════
   FinPulse — Budgets & Goals (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageBudgets = {
  render() {
    const goals = Store.getGoals();
    const budgets = Store.getBudgets();
    const cats = Store.getCategories();
    const lang = I18n.getLang();
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    const goalCardStyles = [
      { card: 'card-vivid-purple', iconBg: 'icon-container-purple', accent: '#c084fc', glow: 'glow-purple' },
      { card: 'card-vivid-green', iconBg: 'icon-container-green', accent: '#6ee7b7', glow: 'glow-green' },
      { card: 'card-vivid-gold', iconBg: 'icon-container-gold', accent: '#fde68a', glow: 'glow-gold' },
      { card: 'card-vivid-cyan', iconBg: 'icon-container-cyan', accent: '#67e8f9', glow: 'glow-cyan' },
      { card: 'card-vivid-pink', iconBg: 'icon-container-pink', accent: '#f9a8d4', glow: 'glow-pink' },
    ];

    const budgetColors = ['#9d6eff', '#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#fb923c'];

    return `
      <div class="page">
        ${Components.topBar('budgets')}

        <div class="animated-bg-orb" style="width:350px;height:350px;top:15%;left:-10%;background:#fbbf24;"></div>
        <div class="animated-bg-orb" style="width:280px;height:280px;bottom:10%;right:-5%;background:#7c3aed;animation-delay:5s;"></div>

        <main class="page-content" style="padding-top:8px;padding-bottom:32px;position:relative;z-index:1;">
          <section style="margin-bottom:32px;">
            <h1 class="text-display-lg text-gradient" style="display:inline-block;">${I18n.t('budget.title')}</h1>
            <p class="text-body-lg text-on-surface-variant" style="margin-top:8px;">${I18n.t('budget.subtitle')}</p>
          </section>

          <!-- Goals Cards -->
          <section class="grid md\\:grid-3" style="margin-bottom:40px;">
            ${goals.map((goal, idx) => {
              const pct = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
              const goalName = lang === 'id' ? goal.name_id : goal.name_en;
              const style = goalCardStyles[idx % goalCardStyles.length];
              
              let status, statusBadge;
              if (pct >= 90) { status = I18n.t('budget.safe'); statusBadge = 'badge-gradient-green'; }
              else if (pct >= 40) { status = I18n.t('budget.onTrack'); statusBadge = 'badge-gradient-cyan'; }
              else { status = I18n.t('budget.lagging'); statusBadge = 'badge-gradient-gold'; }
              
              const deadline = new Date(goal.deadline);
              const monthsLeft = Math.max(0, Math.round((deadline - now) / (30 * 24 * 60 * 60 * 1000)));
              let timeLabel = monthsLeft > 0 ? I18n.t('budget.monthsLeft', {n: monthsLeft}) : I18n.t('budget.almostThere');
              if (pct < 40) timeLabel = I18n.t('budget.needsAttention');

              return `
                <div class="card ${style.card} card-interactive" style="position:relative;overflow:hidden;">
                  <div style="position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;background:${style.accent};opacity:0.06;"></div>
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
                    <div class="${style.iconBg}" style="padding:12px;border-radius:var(--radius-lg);">
                      <span class="material-symbols-outlined">${goal.icon}</span>
                    </div>
                    <span class="badge ${statusBadge}">${status}</span>
                  </div>
                  <h3 class="text-headline" style="margin-bottom:4px;">${goalName}</h3>
                  <p class="text-body-sm text-on-surface-variant" style="margin-bottom:16px;">
                    <span style="color:${style.accent};font-weight:700;">${Currency.format(goal.saved)}</span> / ${Currency.format(goal.target)}
                  </p>
                  <div class="progress-bar" style="margin-bottom:8px;">
                    <div class="progress-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${style.accent}80,${style.accent});"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;">
                    <span class="text-label" style="color:${style.accent};">${pct}%</span>
                    <span class="text-label text-outline">${timeLabel}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </section>

          <!-- Monthly Budgets -->
          <section>
            <h2 class="text-headline" style="margin-bottom:24px;">${I18n.t('budget.monthlyBudgets')}</h2>
            <div class="grid grid-2 lg\\:grid-4">
              ${budgets.map((budget, idx) => {
                const cat = cats.find(c => c.id === budget.category_id) || { icon: 'more_horiz', color: 'primary' };
                const catName = lang === 'id' ? cat.name_id : cat.name_en;
                const spent = Store.getBudgetSpent(budget.category_id, y, m);
                const pct = Math.min(Math.round((spent / budget.limit) * 100), 100);
                const isOver = spent > budget.limit;
                const ringColor = budgetColors[idx % budgetColors.length];

                return `
                  <div class="card card-interactive" style="background:linear-gradient(135deg,${ringColor}18,${ringColor}08,var(--color-surface-container));border:1px solid ${ringColor}30;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;">
                    ${Charts.createProgressRing(pct, { size: 96, stroke: 8, color: isOver ? 'var(--color-error)' : ringColor, icon: cat.icon })}
                    <h4 class="text-body-lg" style="margin-top:16px;margin-bottom:4px;">${catName}</h4>
                    <p class="text-body-sm" style="color:${isOver ? 'var(--color-error)' : ringColor}">
                      ${isOver ? I18n.t('budget.overBudget') : Currency.format(spent) + ' / ' + Currency.format(budget.limit)}
                    </p>
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          <div class="section-divider-gradient"></div>
          ${Components.watermark()}
        </main>
      </div>
    `;
  },

  init() {}
};
