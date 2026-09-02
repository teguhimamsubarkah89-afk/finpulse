/* ═══════════════════════════════════════════════════════════
   FinPulse — Reusable UI Components
   ═══════════════════════════════════════════════════════════ */

const Components = {

  // ══════════════════════════════════════════
  // TOP APP BAR
  // ══════════════════════════════════════════
  topBar(activePage = 'dashboard') {
    const user = Auth.getCurrentUser();
    const avatarUrl = user?.avatar_url || '';

    const navItems = [
      { id: 'dashboard',     label: 'nav.home',     icon: 'home' },
      { id: 'transactions',  label: 'nav.history',  icon: 'receipt_long' },
      { id: 'add',           label: 'nav.add',      icon: 'add' },
      { id: 'reports',       label: 'nav.reports',  icon: 'leaderboard' },
      { id: 'settings',      label: 'nav.settings', icon: 'settings' },
    ];

    return `
      <header class="top-bar">
        <div class="top-bar-brand text-gradient-cyber" onclick="App.navigate('dashboard')">FinPulse</div>
        <nav class="top-bar-nav">
          ${navItems.map(item => `
            <a href="#" class="${activePage === item.id ? 'active' : ''}" 
               onclick="event.preventDefault(); App.navigate('${item.id}')">
              <span class="material-symbols-outlined" style="font-variation-settings:'FILL' ${activePage === item.id ? '1' : '0'};">${item.icon}</span>
              ${I18n.t(item.label)}
            </a>
          `).join('')}
        </nav>
        <div class="top-bar-actions">
          <button class="icon-btn" aria-label="notifications" onclick="Components.showToast('${I18n.t('settings.notifications')}', 'info')">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <div class="avatar" onclick="App.navigate('profile')" style="cursor:pointer;">
            <img src="${avatarUrl}" alt="Avatar" onerror="this.style.background='var(--color-surface-container-high)'" />
          </div>
        </div>
      </header>
    `;
  },

  // ══════════════════════════════════════════
  // BOTTOM NAVIGATION BAR
  // ══════════════════════════════════════════
  bottomNav(activePage = 'dashboard') {
    const items = [
      { id: 'dashboard',     label: 'nav.home',     icon: 'home' },
      { id: 'transactions',  label: 'nav.history',  icon: 'receipt_long' },
      { id: 'add',           label: 'nav.add',      icon: 'add',    isFab: true },
      { id: 'reports',       label: 'nav.reports',  icon: 'leaderboard' },
      { id: 'settings',      label: 'nav.settings', icon: 'settings' },
    ];

    return `
      <nav class="bottom-nav" id="bottom-nav">
        ${items.map(item => {
          if (item.isFab) {
            return `
              <button class="bottom-nav-item fab-center ${activePage === item.id ? 'active' : ''}" 
                      onclick="App.navigate('${item.id}')">
                <div class="fab-icon" style="background:var(--gradient-primary);box-shadow:0 4px 20px rgba(124,58,237,0.4);">
                  <span class="material-symbols-outlined">${item.icon}</span>
                </div>
                <span class="nav-label">${I18n.t(item.label)}</span>
              </button>
            `;
          }
          return `
            <button class="bottom-nav-item ${activePage === item.id ? 'active' : ''}" 
                    onclick="App.navigate('${item.id}')">
              <span class="material-symbols-outlined">${item.icon}</span>
              <span class="nav-label">${I18n.t(item.label)}</span>
            </button>
          `;
        }).join('')}
      </nav>
    `;
  },

  // ══════════════════════════════════════════
  // TRANSACTION ITEM
  // ══════════════════════════════════════════
  transactionItem(tx) {
    const cats = Store.getCategories();
    const cat = cats.find(c => c.id === tx.category_id) || { icon: 'more_horiz', color: 'outline' };
    const lang = I18n.getLang();
    const catName = lang === 'id' ? cat.name_id : cat.name_en;
    const isIncome = tx.type === 'income';
    
    const colorMap = {
      primary: 'var(--color-primary-container)',
      secondary: 'var(--color-secondary-container)',
      tertiary: 'var(--color-tertiary-container)',
      error: 'var(--color-error)',
      outline: 'var(--color-outline)',
    };
    const bgMap = {
      primary: 'rgba(160,120,255,0.2)',
      secondary: 'rgba(0,165,114,0.2)',
      tertiary: 'rgba(206,167,0,0.2)',
      error: 'rgba(147,0,10,0.2)',
      outline: 'rgba(149,142,160,0.2)',
    };

    const iconColor = isIncome ? colorMap.secondary : (colorMap[cat.color] || colorMap.primary);
    const iconBg = isIncome ? bgMap.secondary : (bgMap[cat.color] || bgMap.primary);

    const dateObj = new Date(tx.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateStr;
    if (tx.date === today.toISOString().split('T')[0]) {
      dateStr = I18n.t('dashboard.today');
    } else if (tx.date === yesterday.toISOString().split('T')[0]) {
      dateStr = I18n.t('dashboard.yesterday');
    } else {
      dateStr = dateObj.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' });
    }

    return `
      <div class="transaction-item" onclick="App.navigate('add', {editId: '${tx.id}'})">
        <div class="transaction-left">
          <div class="transaction-icon" style="background:${iconBg};color:${iconColor}">
            <span class="material-symbols-outlined">${isIncome ? 'arrow_downward' : cat.icon}</span>
          </div>
          <div class="transaction-info">
            <h4>${tx.note || catName}</h4>
            <p>${catName}</p>
          </div>
        </div>
        <div class="transaction-amount">
          <div class="amount ${isIncome ? 'income' : ''}">${Currency.formatSigned(tx.amount, tx.type)}</div>
          <div class="date text-body-sm text-outline">${dateStr}</div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════
  // WATERMARK
  // ══════════════════════════════════════════
  watermark() {
    return `
      <footer class="watermark">
        <p>${I18n.t('watermark')}</p>
      </footer>
    `;
  },

  // ══════════════════════════════════════════
  // SECTION HEADER
  // ══════════════════════════════════════════
  sectionHeader(title, actionLabel = '', actionFn = '') {
    return `
      <div class="section-header">
        <h3>${title}</h3>
        ${actionLabel ? `<button onclick="${actionFn}" class="text-body-sm text-primary">${actionLabel}</button>` : ''}
      </div>
    `;
  },

  // ══════════════════════════════════════════
  // EMPTY STATE
  // ══════════════════════════════════════════
  emptyState(icon, title, description, actionLabel = '', actionFn = '') {
    return `
      <div class="empty-state">
        <span class="material-symbols-outlined">${icon}</span>
        <h3>${title}</h3>
        <p>${description}</p>
        ${actionLabel ? `<button class="btn btn-primary" onclick="${actionFn}">${actionLabel}</button>` : ''}
      </div>
    `;
  },

  // ══════════════════════════════════════════
  // SKELETON LOADING
  // ══════════════════════════════════════════
  skeleton(type = 'card', count = 3) {
    const templates = {
      card: `<div class="skeleton skeleton-card"></div>`,
      transaction: `
        <div style="display:flex;align-items:center;gap:16px;padding:16px;">
          <div class="skeleton skeleton-circle" style="width:48px;height:48px;flex-shrink:0"></div>
          <div style="flex:1">
            <div class="skeleton skeleton-text" style="width:60%"></div>
            <div class="skeleton skeleton-text" style="width:40%;height:12px"></div>
          </div>
          <div class="skeleton" style="width:80px;height:20px"></div>
        </div>
      `,
      text: `<div class="skeleton skeleton-text"></div>`,
    };

    return Array(count).fill(templates[type] || templates.card).join('');
  },

  // ══════════════════════════════════════════
  // TOAST NOTIFICATION
  // ══════════════════════════════════════════
  showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="material-symbols-outlined">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ══════════════════════════════════════════
  // MODAL
  // ══════════════════════════════════════════
  showModal(content, options = {}) {
    // Remove existing
    this.closeModal();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'modal-backdrop';
    backdrop.onclick = () => { if (!options.persistent) this.closeModal(); };

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal';
    modal.innerHTML = `
      <div class="modal-handle"></div>
      ${content}
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
      modal.classList.add('active');
    });
  },

  closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('modal');
    if (backdrop) {
      backdrop.classList.remove('active');
      setTimeout(() => backdrop.remove(), 300);
    }
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  },

  // ══════════════════════════════════════════
  // CONFIRM DIALOG
  // ══════════════════════════════════════════
  confirm(message, onConfirm) {
    this.showModal(`
      <p class="text-body-lg" style="margin-bottom:24px;">${message}</p>
      <div style="display:flex;gap:12px;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="Components.closeModal()">${I18n.t('common.cancel')}</button>
        <button class="btn btn-primary" id="confirm-btn">${I18n.t('common.confirm')}</button>
      </div>
    `, { persistent: true });

    setTimeout(() => {
      document.getElementById('confirm-btn')?.addEventListener('click', () => {
        this.closeModal();
        onConfirm();
      });
    }, 50);
  },

  // ══════════════════════════════════════════
  // SUCCESS ANIMATION
  // ══════════════════════════════════════════
  showSuccess(message, callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100;background:var(--color-background);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:fadeIn 0.3s ease-out;';
    overlay.innerHTML = `
      <div class="confirm-check">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" class="check-circle"/>
          <path d="M24 40 L35 51 L56 30" class="check-mark"/>
        </svg>
      </div>
      <p class="text-headline text-secondary" style="margin-top:16px;">${message}</p>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
      setTimeout(() => {
        overlay.remove();
        if (callback) callback();
      }, 300);
    }, 1500);
  },

  // ══════════════════════════════════════════
  // DATE FORMATTING HELPERS
  // ══════════════════════════════════════════
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const lang = I18n.getLang();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return I18n.t('dashboard.today');
    if (dateStr === yesterdayStr) return I18n.t('dashboard.yesterday');
    
    return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    }).toUpperCase();
  },

  formatDateLong(dateStr) {
    const date = new Date(dateStr);
    const lang = I18n.getLang();
    return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
};
