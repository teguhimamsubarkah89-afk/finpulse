/* ═══════════════════════════════════════════════════════════
   FinPulse — SPA Router & App Lifecycle
   ═══════════════════════════════════════════════════════════ */

const App = {
  _currentPage: null,
  _pageParams: {},
  _appEl: null,

  async init() {
    this._appEl = document.getElementById('app');
    
    // Init i18n
    await I18n.init();
    
    // Apply theme
    this._applyTheme();
    
    // Listen for language changes
    I18n.onChange(() => this._rerender());
    
    // Handle hash routing
    window.addEventListener('hashchange', () => this._handleRoute());
    
    // Initial route
    this._handleRoute();
  },

  navigate(page, params = {}) {
    this._pageParams = params;
    window.location.hash = '#' + page;
  },

  getParams() {
    return this._pageParams;
  },

  _handleRoute() {
    const hash = window.location.hash.slice(1) || '';
    
    // Auth check
    if (!Auth.isLoggedIn()) {
      const hasSeenSplash = localStorage.getItem('finpulse_seen_splash');
      if (!hasSeenSplash && hash !== 'login') {
        this._renderPage('splash');
        return;
      }
      this._renderPage('login');
      return;
    }

    const validPages = ['dashboard', 'transactions', 'add', 'reports', 'budgets', 'settings', 'profile'];
    const page = validPages.includes(hash) ? hash : 'dashboard';
    this._renderPage(page);
  },

  async _renderPage(page) {
    if (this._currentPage === page && page !== 'add') return;
    
    // Fade out current
    if (this._appEl.children.length > 0) {
      this._appEl.style.opacity = '0';
      this._appEl.style.transform = 'translateY(-8px)';
      await new Promise(r => setTimeout(r, 100));
    }

    this._currentPage = page;
    
    const pages = {
      splash: PageSplash,
      login: PageLogin,
      dashboard: PageDashboard,
      transactions: PageTransactions,
      add: PageAddTransaction,
      reports: PageReports,
      budgets: PageBudgets,
      settings: PageSettings,
      profile: PageProfile,
    };

    const PageModule = pages[page];
    if (!PageModule) {
      this._appEl.innerHTML = '<div class="page"><p>Page not found</p></div>';
      return;
    }

    // Render page
    this._appEl.innerHTML = PageModule.render();
    
    // Add bottom nav and body class for authenticated pages
    const authPages = ['dashboard', 'transactions', 'add', 'reports', 'budgets', 'settings', 'profile'];
    if (authPages.includes(page)) {
      document.body.classList.add('has-bottom-nav');
      // Append bottom nav
      const navHtml = Components.bottomNav(page);
      this._appEl.insertAdjacentHTML('beforeend', navHtml);
    } else {
      document.body.classList.remove('has-bottom-nav');
    }

    // Fade in
    requestAnimationFrame(() => {
      this._appEl.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      this._appEl.style.opacity = '1';
      this._appEl.style.transform = 'translateY(0)';
    });

    // Init page
    if (PageModule.init) {
      setTimeout(() => PageModule.init(), 50);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  },

  _rerender() {
    this._currentPage = null; // Force re-render
    this._handleRoute();
  },

  _applyTheme() {
    const settings = Store.getSettings();
    let theme = settings.theme || 'dark';
    
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
  },

  setTheme(theme) {
    Store.updateSetting('theme', theme);
    this._applyTheme();
  },

  logout() {
    Components.confirm(I18n.t('settings.logoutConfirm'), () => {
      Auth.logout();
      this.navigate('login');
    });
  }
};

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => App.init());
