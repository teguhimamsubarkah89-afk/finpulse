/* ═══════════════════════════════════════════════════════════
   FinPulse — Add / Edit Transaction (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageAddTransaction = {
  _type: 'expense',
  _selectedCategory: null,
  _editId: null,

  render() {
    const params = App.getParams();
    this._editId = params.editId || null;
    let editTx = null;

    if (this._editId) {
      editTx = Store.getTransactions().find(t => t.id === this._editId);
      if (editTx) {
        this._type = editTx.type;
        this._selectedCategory = editTx.category_id;
      }
    } else {
      this._type = 'expense';
      this._selectedCategory = null;
    }

    const cats = Store.getCategories().filter(c => c.type === this._type);
    const lang = I18n.getLang();
    const today = new Date().toISOString().split('T')[0];

    // Category color map for vivid icons
    const catColorMap = {
      primary: { bg: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(157,110,255,0.15))', color: '#c084fc' },
      secondary: { bg: 'linear-gradient(135deg,rgba(5,150,105,0.3),rgba(52,211,153,0.15))', color: '#6ee7b7' },
      tertiary: { bg: 'linear-gradient(135deg,rgba(217,119,6,0.3),rgba(251,191,36,0.15))', color: '#fde68a' },
      error: { bg: 'linear-gradient(135deg,rgba(185,28,28,0.3),rgba(252,165,165,0.15))', color: '#fca5a5' },
      outline: { bg: 'linear-gradient(135deg,rgba(6,182,212,0.3),rgba(34,211,238,0.15))', color: '#67e8f9' },
    };

    return `
      <div class="page">
        ${Components.topBar('add')}

        <main class="page-content page-content-narrow" style="padding-top:24px;padding-bottom:120px;position:relative;z-index:1;">
          <h1 class="text-display-lg text-gradient" style="display:inline-block;margin-bottom:32px;">
            ${editTx ? I18n.t('addTx.editTitle') : I18n.t('addTx.title')}
          </h1>

          <!-- Type Toggle -->
          <div class="type-toggle" style="margin-bottom:32px;display:flex;gap:4px;padding:4px;border-radius:var(--radius-xl);">
            <button class="type-toggle-option expense ${this._type === 'expense' ? 'active' : ''}" 
                    onclick="PageAddTransaction.setType('expense')"
                    style="flex:1;padding:12px;border-radius:var(--radius-lg);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;transition:all 0.2s;${this._type === 'expense' ? 'color:white;' : 'background:transparent;color:var(--color-on-surface-variant);'}">
              <span class="material-symbols-outlined" style="font-size:20px;">arrow_upward</span>
              ${I18n.t('tx.expense')}
            </button>
            <button class="type-toggle-option income ${this._type === 'income' ? 'active' : ''}" 
                    onclick="PageAddTransaction.setType('income')"
                    style="flex:1;padding:12px;border-radius:var(--radius-lg);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;transition:all 0.2s;${this._type === 'income' ? 'color:white;' : 'background:transparent;color:var(--color-on-surface-variant);'}">
              <span class="material-symbols-outlined" style="font-size:20px;">arrow_downward</span>
              ${I18n.t('tx.income')}
            </button>
          </div>

          <!-- Amount -->
          <div style="margin-bottom:24px;">
            <label class="text-label text-accent-cyan" style="display:block;margin-bottom:8px;">${I18n.t('addTx.amount')}</label>
            <div style="position:relative;">
              <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:24px;font-weight:800;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                ${Currency.getSymbol(Currency.getCurrentCurrency())}
              </span>
              <input type="number" id="tx-amount" class="input-field" 
                     style="padding-left:56px;font-size:28px;font-weight:800;height:64px;letter-spacing:-0.02em;border:1px solid rgba(157,110,255,0.2);background:rgba(17,27,51,0.8);"
                     placeholder="${I18n.t('addTx.amountPlaceholder')}" 
                     value="${editTx ? editTx.amount : ''}"
                     inputmode="numeric" />
            </div>
          </div>

          <!-- Category -->
          <div style="margin-bottom:24px;">
            <label class="text-label text-accent-pink" style="display:block;margin-bottom:12px;">${I18n.t('addTx.category')}</label>
            <div class="category-grid" id="category-grid">
              ${cats.map(cat => {
                const colorSet = catColorMap[cat.color] || catColorMap.primary;
                return `
                <div class="category-item ${this._selectedCategory === cat.id ? 'selected' : ''}" 
                     onclick="PageAddTransaction.selectCategory('${cat.id}')"
                     style="border:1px solid ${this._selectedCategory === cat.id ? colorSet.color + '50' : 'rgba(61,53,86,0.3)'};">
                  <div class="category-icon" style="background:${colorSet.bg};color:${colorSet.color};width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;">
                    <span class="material-symbols-outlined">${cat.icon}</span>
                  </div>
                  <span class="category-label">${lang === 'id' ? cat.name_id : cat.name_en}</span>
                </div>
              `}).join('')}
            </div>
          </div>

          <!-- Date -->
          <div style="margin-bottom:24px;">
            <label class="text-label text-accent-lime" style="display:block;margin-bottom:8px;">${I18n.t('addTx.date')}</label>
            <input type="date" id="tx-date" class="input-field" value="${editTx ? editTx.date : today}" 
                   style="color-scheme:dark;border:1px solid rgba(163,230,53,0.15);background:rgba(17,27,51,0.8);" />
          </div>

          <!-- Note -->
          <div style="margin-bottom:32px;">
            <label class="text-label text-accent-orange" style="display:block;margin-bottom:8px;">${I18n.t('addTx.note')}</label>
            <input type="text" id="tx-note" class="input-field" 
                   placeholder="${I18n.t('addTx.notePlaceholder')}" 
                   value="${editTx ? (editTx.note || '') : ''}"
                   style="border:1px solid rgba(251,146,60,0.15);background:rgba(17,27,51,0.8);" />
          </div>

          <!-- Actions -->
          <div style="display:flex;flex-direction:column;gap:12px;">
            <button class="btn btn-primary btn-lg btn-full" onclick="PageAddTransaction.save()">
              ${editTx ? I18n.t('addTx.update') : I18n.t('addTx.save')}
            </button>
            ${editTx ? `
              <button class="btn btn-full" onclick="PageAddTransaction.deleteTx()" style="background:linear-gradient(135deg,rgba(185,28,28,0.2),rgba(252,165,165,0.05));border:1px solid rgba(252,165,165,0.2);color:#fca5a5;height:48px;">
                <span class="material-symbols-outlined">delete</span>
                ${I18n.t('addTx.delete')}
              </button>
            ` : ''}
          </div>
        </main>
      </div>
    `;
  },

  init() {},

  setType(type) {
    this._type = type;
    this._selectedCategory = null;
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = this.render() + Components.bottomNav('add');
    }
  },

  selectCategory(catId) {
    this._selectedCategory = catId;
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('selected'));
    event.currentTarget.closest('.category-item').classList.add('selected');
  },

  save() {
    const amount = parseFloat(document.getElementById('tx-amount')?.value);
    const date = document.getElementById('tx-date')?.value;
    const note = document.getElementById('tx-note')?.value || '';

    if (!amount || amount <= 0) {
      Components.showToast(I18n.getLang() === 'id' ? 'Masukkan nominal!' : 'Enter an amount!', 'error');
      return;
    }
    if (!this._selectedCategory) {
      Components.showToast(I18n.getLang() === 'id' ? 'Pilih kategori!' : 'Select a category!', 'error');
      return;
    }
    if (!date) {
      Components.showToast(I18n.getLang() === 'id' ? 'Pilih tanggal!' : 'Select a date!', 'error');
      return;
    }

    if (this._editId) {
      Store.updateTransaction(this._editId, {
        type: this._type,
        amount,
        category_id: this._selectedCategory,
        date,
        note
      });
      Components.showSuccess(I18n.t('addTx.updated'), () => App.navigate('transactions'));
    } else {
      Store.addTransaction({
        type: this._type,
        amount,
        category_id: this._selectedCategory,
        date,
        note
      });
      Components.showSuccess(I18n.t('addTx.success'), () => App.navigate('dashboard'));
    }
  },

  deleteTx() {
    Components.confirm(
      I18n.getLang() === 'id' ? 'Hapus transaksi ini?' : 'Delete this transaction?',
      () => {
        Store.deleteTransaction(this._editId);
        Components.showToast(I18n.t('addTx.deleted'), 'success');
        App.navigate('transactions');
      }
    );
  }
};
