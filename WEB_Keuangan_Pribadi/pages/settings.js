/* ═══════════════════════════════════════════════════════════
   FinPulse — Settings Page (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageSettings = {
  render() {
    const settings = Store.getSettings();
    const user = Auth.getCurrentUser();
    const currencyInfo = Currency.getAvailableCurrencies().find(c => c.code === settings.currency) || { code: 'IDR', symbol: 'Rp' };
    const langLabel = settings.language === 'id' ? 'Bahasa Indonesia' : 'English (US)';
    const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return `
      <div class="page">
        ${Components.topBar('settings')}

        <main class="page-content page-content-narrow" style="padding-top:16px;padding-bottom:32px;position:relative;z-index:1;">
          <div style="margin-bottom:24px;">
            <h1 class="text-headline text-gradient-neon" style="display:inline-block;">${I18n.t('settings.title')}</h1>
            <p class="text-body-lg text-on-surface-variant" style="margin-top:8px;">${I18n.t('settings.subtitle')}</p>
          </div>

          <div class="grid" style="grid-template-columns:1fr;gap:var(--space-gutter);">
            <!-- Profile Row -->
            <div class="card card-vivid-purple card-interactive" onclick="App.navigate('profile')" style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:16px;">
                <div class="icon-container-purple" style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined">person</span>
                </div>
                <div>
                  <div class="text-body-lg font-bold">${I18n.t('settings.accountProfile')}</div>
                  <div class="text-body-sm text-on-surface-variant">${I18n.t('settings.accountProfileDesc')}</div>
                </div>
              </div>
              <span class="material-symbols-outlined" style="color:#c084fc;">chevron_right</span>
            </div>

            <!-- Currency & Language Row -->
            <div class="grid grid-2" style="gap:var(--space-gutter);">
              <div class="card card-vivid-green card-interactive" onclick="PageSettings.showCurrencyPicker()" style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span class="material-symbols-outlined" style="color:#6ee7b7;">payments</span>
                  <div>
                    <div class="text-body-lg font-bold">${I18n.t('settings.currency')}</div>
                    <div class="text-body-sm" style="color:#6ee7b7;">${currencyInfo.code} (${currencyInfo.symbol})</div>
                  </div>
                </div>
                <span class="material-symbols-outlined" style="color:#6ee7b7;">chevron_right</span>
              </div>

              <div class="card card-vivid-gold card-interactive" onclick="PageSettings.showLanguagePicker()" style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span class="material-symbols-outlined" style="color:#fde68a;">language</span>
                  <div>
                    <div class="text-body-lg font-bold">${I18n.t('settings.language')}</div>
                    <div class="text-body-sm" style="color:#fde68a;">${langLabel}</div>
                  </div>
                </div>
                <span class="material-symbols-outlined" style="color:#fde68a;">chevron_right</span>
              </div>
            </div>

            <!-- Theme & Notifications -->
            <div class="card card-vivid-cyan" style="display:flex;flex-direction:column;gap:16px;padding:24px;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span class="material-symbols-outlined" style="color:#67e8f9;">${isDark ? 'dark_mode' : 'light_mode'}</span>
                  <span class="text-body-lg font-bold">${I18n.t('settings.themeMode')}</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" ${isDark ? 'checked' : ''} onchange="PageSettings.toggleTheme(this.checked)" />
                  <div class="toggle-track"></div>
                </label>
              </div>
              <div class="divider" style="background:rgba(34,211,238,0.15);"></div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span class="material-symbols-outlined" style="color:#f9a8d4;">notifications_active</span>
                  <span class="text-body-lg font-bold">${I18n.t('settings.notifications')}</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" ${settings.notifications ? 'checked' : ''} onchange="PageSettings.toggleNotifications(this.checked)" />
                  <div class="toggle-track"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Security & Data Section -->
          <div style="margin-top:32px;">
            <h2 class="text-label text-accent-pink" style="margin-bottom:16px;">${I18n.t('settings.securityData')}</h2>
            <div class="card card-vivid-pink" style="overflow:hidden;padding:0;border-radius:var(--radius-xl);">
              <div class="settings-item" onclick="Components.showToast('Coming soon', 'info')">
                <div class="settings-item-left">
                  <div class="icon-container-red" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <span class="material-symbols-outlined" style="font-size:20px;">security</span>
                  </div>
                  <div class="settings-item-text">
                    <h4>${I18n.t('settings.security')}</h4>
                    <p>${I18n.t('settings.securityDesc')}</p>
                  </div>
                </div>
                <span class="material-symbols-outlined" style="color:#f9a8d4;">chevron_right</span>
              </div>
              <div class="divider" style="margin:0 24px;background:rgba(244,114,182,0.15);"></div>

              <div class="settings-item">
                <div class="settings-item-left">
                  <div style="width:40px;height:40px;border-radius:50%;background:rgba(36,48,77,0.5);display:flex;align-items:center;justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div class="settings-item-text">
                    <h4>${I18n.t('settings.connectedGoogle')}</h4>
                    <p>${user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <button class="btn btn-error" style="padding:4px 16px;min-height:32px;font-size:12px;" onclick="Components.showToast('Coming soon', 'info')">
                  ${I18n.t('settings.disconnect')}
                </button>
              </div>
              <div class="divider" style="margin:0 24px;background:rgba(244,114,182,0.15);"></div>

              <div class="settings-item" onclick="PageSettings.exportData()">
                <div class="settings-item-left">
                  <div class="icon-container-cyan" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <span class="material-symbols-outlined" style="font-size:20px;">download</span>
                  </div>
                  <div class="settings-item-text">
                    <h4>${I18n.t('settings.exportData')}</h4>
                    <p>${I18n.t('settings.exportDataDesc')}</p>
                  </div>
                </div>
                <span class="material-symbols-outlined" style="color:#67e8f9;">chevron_right</span>
              </div>
            </div>
          </div>

          <!-- Other Section -->
          <div style="margin-top:24px;">
            <div class="card" style="overflow:hidden;padding:0;background:rgba(17,27,51,0.5);border:1px solid rgba(61,53,86,0.3);">
              <div class="settings-item" onclick="Components.showToast('FinPulse v1.0', 'info')">
                <div class="settings-item-left">
                  <span class="material-symbols-outlined text-accent-blue">info</span>
                  <span class="text-body-lg font-bold">${I18n.t('settings.about')}</span>
                </div>
                <span class="material-symbols-outlined" style="color:#60a5fa;">chevron_right</span>
              </div>
              <div class="divider" style="margin:0 24px;background:rgba(61,53,86,0.3);"></div>
              <div class="settings-item" onclick="App.logout()">
                <div class="settings-item-left">
                  <span class="material-symbols-outlined text-error">logout</span>
                  <span class="text-body-lg font-bold text-error">${I18n.t('settings.logout')}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section-divider-gradient"></div>
          ${Components.watermark()}
        </main>
      </div>
    `;
  },

  init() {},

  toggleTheme(isDark) {
    App.setTheme(isDark ? 'dark' : 'light');
  },

  toggleNotifications(enabled) {
    Store.updateSetting('notifications', enabled);
    Components.showToast(enabled ? '🔔 Notifications ON' : '🔕 Notifications OFF', 'info');
  },

  showCurrencyPicker() {
    const currencies = Currency.getAvailableCurrencies();
    const current = Currency.getCurrentCurrency();

    Components.showModal(`
      <h3 class="text-headline" style="margin-bottom:24px;">${I18n.t('settings.currency')}</h3>
      <div style="display:flex;flex-direction:column;gap:4px;max-height:400px;overflow-y:auto;">
        ${currencies.map(c => `
          <div class="settings-item" style="border-radius:var(--radius-lg);${c.code === current ? 'background:linear-gradient(90deg,rgba(157,110,255,0.1),transparent);' : ''}" 
               onclick="PageSettings.setCurrency('${c.code}')">
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:20px;font-weight:800;color:#c084fc;width:40px;text-align:center;">${c.symbol}</span>
              <div>
                <div class="text-body-lg font-bold">${c.code}</div>
                <div class="text-body-sm text-on-surface-variant">${c.name}</div>
              </div>
            </div>
            ${c.code === current ? '<span class="material-symbols-outlined" style="color:#34d399;">check</span>' : ''}
          </div>
        `).join('')}
      </div>
    `);
  },

  setCurrency(code) {
    Store.updateSetting('currency', code);
    Components.closeModal();
    App._currentPage = null;
    App._handleRoute();
    Components.showToast(`Currency: ${code}`, 'success');
  },

  showLanguagePicker() {
    const current = I18n.getLang();
    Components.showModal(`
      <h3 class="text-headline" style="margin-bottom:24px;">${I18n.t('settings.language')}</h3>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <div class="settings-item" style="border-radius:var(--radius-lg);${current === 'id' ? 'background:linear-gradient(90deg,rgba(157,110,255,0.1),transparent);' : ''}" 
             onclick="PageSettings.setLanguage('id')">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">🇮🇩</span>
            <div>
              <div class="text-body-lg font-bold">Bahasa Indonesia</div>
              <div class="text-body-sm text-on-surface-variant">Indonesian</div>
            </div>
          </div>
          ${current === 'id' ? '<span class="material-symbols-outlined" style="color:#34d399;">check</span>' : ''}
        </div>
        <div class="settings-item" style="border-radius:var(--radius-lg);${current === 'en' ? 'background:linear-gradient(90deg,rgba(157,110,255,0.1),transparent);' : ''}" 
             onclick="PageSettings.setLanguage('en')">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">🇺🇸</span>
            <div>
              <div class="text-body-lg font-bold">English</div>
              <div class="text-body-sm text-on-surface-variant">English (US)</div>
            </div>
          </div>
          ${current === 'en' ? '<span class="material-symbols-outlined" style="color:#34d399;">check</span>' : ''}
        </div>
      </div>
    `);
  },

  async setLanguage(lang) {
    Components.closeModal();
    await I18n.setLanguage(lang);
    Components.showToast(lang === 'id' ? 'Bahasa diubah ke Indonesia' : 'Language changed to English', 'success');
  },

  exportData() {
    const csv = Store.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finpulse_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    Components.showToast(I18n.t('common.exportSuccess'), 'success');
  }
};
