/* ═══════════════════════════════════════════════════════════
   FinPulse — Dashboard Page (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageDashboard = {
  render() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const balance = Store.getTotalBalance();
    const monthIncome = Store.getMonthlyIncome(y, m);
    const monthExpense = Store.getMonthlyExpense(y, m);
    const netMonth = monthIncome - monthExpense;
    const recentTxs = Store.getRecentTransactions(5);

    return `
      <div class="page">
        ${Components.topBar('dashboard')}

        <!-- Floating Background Orbs -->
        <div class="animated-bg-orb" style="width:400px;height:400px;top:10%;left:-10%;background:#7c3aed;"></div>
        <div class="animated-bg-orb" style="width:300px;height:300px;top:60%;right:-5%;background:#22d3ee;animation-delay:4s;"></div>
        <div class="animated-bg-orb" style="width:250px;height:250px;bottom:10%;left:30%;background:#f472b6;animation-delay:8s;"></div>

        <main class="page-content" style="padding-bottom:32px;position:relative;z-index:1;">
          <!-- Hero Balance Card -->
          <section class="card card-hero-gradient card-rounded-3xl" style="padding:32px;margin-top:16px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
              <span class="material-symbols-outlined text-accent-cyan" style="font-size:20px;">account_balance_wallet</span>
              <h2 class="text-label text-on-surface-variant">${I18n.t('dashboard.totalBalance')}</h2>
            </div>
            <div class="balance-amount text-gradient-neon" id="balance-amount" style="font-size:42px;line-height:1.1;font-weight:900;letter-spacing:-0.04em;">${Currency.format(0)}</div>
            <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
              <div class="badge badge-gradient-green">
                <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;">arrow_downward</span>
                +${Currency.format(monthIncome)}
              </div>
              <div class="badge badge-gradient-purple">
                <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;">arrow_upward</span>
                -${Currency.format(monthExpense)}
              </div>
              <div class="badge ${netMonth >= 0 ? 'badge-gradient-cyan' : 'badge-gradient-gold'}">
                <span class="material-symbols-outlined" style="font-size:14px;">${netMonth >= 0 ? 'trending_up' : 'trending_down'}</span>
                ${netMonth >= 0 ? '+' : ''}${Currency.format(Math.abs(netMonth))}
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="grid grid-4" style="margin-top:24px;">
            <button class="card card-vivid-purple card-interactive" onclick="App.navigate('add')" style="text-align:center;padding:16px 8px;">
              <span class="material-symbols-outlined" style="color:#c084fc;font-size:28px;margin-bottom:4px;">add_circle</span>
              <span class="text-body-sm text-on-surface-variant">${I18n.t('nav.add')}</span>
            </button>
            <button class="card card-vivid-cyan card-interactive" onclick="App.navigate('transactions')" style="text-align:center;padding:16px 8px;">
              <span class="material-symbols-outlined" style="color:#67e8f9;font-size:28px;margin-bottom:4px;">receipt_long</span>
              <span class="text-body-sm text-on-surface-variant">${I18n.t('nav.history')}</span>
            </button>
            <button class="card card-vivid-gold card-interactive" onclick="App.navigate('budgets')" style="text-align:center;padding:16px 8px;">
              <span class="material-symbols-outlined" style="color:#fde68a;font-size:28px;margin-bottom:4px;">savings</span>
              <span class="text-body-sm text-on-surface-variant">${I18n.t('nav.budgets')}</span>
            </button>
            <button class="card card-vivid-pink card-interactive" onclick="App.navigate('reports')" style="text-align:center;padding:16px 8px;">
              <span class="material-symbols-outlined" style="color:#f9a8d4;font-size:28px;margin-bottom:4px;">bar_chart</span>
              <span class="text-body-sm text-on-surface-variant">${I18n.t('nav.reports')}</span>
            </button>
          </section>

          <!-- Cash Flow Pulse -->
          <section class="card card-vivid-purple" style="padding:24px;margin-top:24px;border-radius:var(--radius-2xl);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <div>
                <h3 class="text-headline text-on-surface">${I18n.t('dashboard.cashFlow')}</h3>
                <span class="text-body-sm text-accent-cyan">${now.toLocaleDateString(I18n.getLang() === 'id' ? 'id-ID' : 'en-US', {month:'long', year:'numeric'})}</span>
              </div>
              <div class="badge badge-gradient-purple">
                <span class="material-symbols-outlined" style="font-size:14px;">show_chart</span>
                PULSE
              </div>
            </div>
            <div id="dashboard-chart" style="height:180px;"></div>
          </section>

          <!-- Recent Activity -->
          <section style="margin-top:32px;">
            ${Components.sectionHeader(
              I18n.t('dashboard.recentActivity'),
              I18n.t('dashboard.viewAll'),
              "App.navigate('transactions')"
            )}
            <div class="stagger-children" style="display:flex;flex-direction:column;gap:10px;" id="recent-transactions">
              ${recentTxs.length > 0 
                ? recentTxs.map(tx => Components.transactionItem(tx)).join('')
                : Components.emptyState(
                    'receipt_long',
                    I18n.t('tx.noTransactions'),
                    I18n.t('tx.noTransactionsDesc'),
                    I18n.t('dashboard.addTransaction'),
                    "App.navigate('add')"
                  )
              }
            </div>
          </section>

          <div class="section-divider-gradient"></div>
          ${Components.watermark()}
        </main>

        <button class="fab hide-desktop" onclick="App.navigate('add')" aria-label="${I18n.t('dashboard.addTransaction')}">
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>
    `;
  },

  init() {
    const balanceEl = document.getElementById('balance-amount');
    if (balanceEl) {
      const balance = Store.getTotalBalance();
      const sym = Currency.getSymbol(Currency.getCurrentCurrency());
      Charts.countUp(balanceEl, Math.abs(balance), 1200, sym, '');
      setTimeout(() => {
        balanceEl.textContent = Currency.format(balance);
      }, 1300);
    }

    const chartEl = document.getElementById('dashboard-chart');
    if (chartEl) {
      const now = new Date();
      const weeklyData = Store.getWeeklyExpenses(now.getFullYear(), now.getMonth());
      const data = weeklyData.some(v => v > 0) ? weeklyData : [30, 60, 40, 80];
      Charts.createPulseChart(chartEl, data);
    }
  }
};
