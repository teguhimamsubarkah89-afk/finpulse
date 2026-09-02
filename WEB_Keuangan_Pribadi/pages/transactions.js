/* ═══════════════════════════════════════════════════════════
   FinPulse — Transactions Page (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageTransactions = {
  _filter: 'all',
  _searchQuery: '',

  render() {
    return `
      <div class="page">
        ${Components.topBar('transactions')}

        <main class="page-content" style="position:relative;z-index:1;">
          <!-- Header -->
          <section style="margin-top:32px;margin-bottom:24px;">
            <h1 class="text-display-lg text-gradient-neon" style="display:inline-block;">${I18n.t('tx.title')}</h1>
            <p class="text-body-sm text-on-surface-variant" style="margin-top:8px;max-width:480px;">${I18n.t('tx.subtitle')}</p>
          </section>

          <!-- Search & Filters -->
          <section style="position:sticky;top:72px;z-index:10;background:linear-gradient(180deg,rgba(7,13,30,0.95),rgba(7,13,30,0.85));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:16px 0;margin:0 calc(-1 * var(--space-container));padding-left:var(--space-container);padding-right:var(--space-container);">
            <div class="input-wrapper" style="margin-bottom:12px;">
              <span class="material-symbols-outlined input-icon" style="color:#67e8f9;">search</span>
              <input type="text" class="input-field input-with-icon" 
                     placeholder="${I18n.t('tx.search')}" 
                     id="tx-search"
                     style="border:1px solid rgba(34,211,238,0.15);background:rgba(17,27,51,0.8);"
                     oninput="PageTransactions.onSearch(this.value)" />
            </div>
            <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;" class="hide-scrollbar">
              <button class="chip ${this._filter === 'all' ? 'active' : ''}" onclick="PageTransactions.setFilter('all')">
                <span class="material-symbols-outlined" style="font-size:16px;">filter_list</span>
                ${I18n.t('tx.all')}
              </button>
              <button class="chip ${this._filter === 'expense' ? 'active' : ''}" onclick="PageTransactions.setFilter('expense')" style="${this._filter === 'expense' ? 'background:linear-gradient(135deg,rgba(244,114,182,0.2),rgba(236,72,153,0.1));border-color:#f472b6;' : ''}">
                <span class="material-symbols-outlined" style="font-size:16px;${this._filter === 'expense' ? 'color:#f472b6;' : ''}">arrow_upward</span>
                ${I18n.t('tx.expense')}
              </button>
              <button class="chip ${this._filter === 'income' ? 'active' : ''}" onclick="PageTransactions.setFilter('income')" style="${this._filter === 'income' ? 'background:linear-gradient(135deg,rgba(52,211,153,0.2),rgba(5,150,105,0.1));border-color:#34d399;' : ''}">
                <span class="material-symbols-outlined" style="font-size:16px;${this._filter === 'income' ? 'color:#34d399;' : ''}">arrow_downward</span>
                ${I18n.t('tx.income')}
              </button>
            </div>
          </section>

          <!-- Transaction List -->
          <section id="tx-list" style="margin-top:16px;">
            ${this._renderList()}
          </section>

          <div class="section-divider-gradient"></div>
          ${Components.watermark()}
        </main>
      </div>
    `;
  },

  _renderList() {
    let txs = Store.getTransactions();
    
    if (this._filter !== 'all') {
      txs = txs.filter(t => t.type === this._filter);
    }

    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      const cats = Store.getCategories();
      txs = txs.filter(t => {
        const cat = cats.find(c => c.id === t.category_id);
        const catName = cat ? (cat.name_id + ' ' + cat.name_en).toLowerCase() : '';
        return (t.note || '').toLowerCase().includes(q) || catName.includes(q);
      });
    }

    if (txs.length === 0) {
      return Components.emptyState(
        'receipt_long',
        I18n.t('tx.noTransactions'),
        I18n.t('tx.noTransactionsDesc'),
        I18n.t('dashboard.addTransaction'),
        "App.navigate('add')"
      );
    }

    const groups = Store.groupTransactionsByDate(txs);
    
    return groups.map(group => `
      <div style="margin-bottom:24px;">
        <div class="date-group-header" style="background:linear-gradient(90deg,rgba(7,13,30,0.95),rgba(7,13,30,0.8));backdrop-filter:blur(8px);">${Components.formatDate(group.date)}</div>
        <div class="stagger-children" style="display:flex;flex-direction:column;gap:8px;">
          ${group.transactions.map(tx => Components.transactionItem(tx)).join('')}
        </div>
      </div>
    `).join('');
  },

  init() {},

  onSearch(query) {
    this._searchQuery = query;
    const list = document.getElementById('tx-list');
    if (list) list.innerHTML = this._renderList();
  },

  setFilter(filter) {
    this._filter = filter;
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = this.render() + Components.bottomNav('transactions');
    }
  }
};
