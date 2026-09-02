/* ═══════════════════════════════════════════════════════════
   FinPulse — Profile Page (Vibrant Edition)
   ═══════════════════════════════════════════════════════════ */

const PageProfile = {
  render() {
    const user = Auth.getCurrentUser() || {};
    const totalBalance = Store.getTotalBalance();
    const goals = Store.getGoals();
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => (g.saved / g.target) < 1).length;

    return `
      <div class="page">
        ${Components.topBar('profile')}

        <div class="animated-bg-orb" style="width:300px;height:300px;top:5%;left:20%;background:#7c3aed;"></div>
        <div class="animated-bg-orb" style="width:200px;height:200px;bottom:30%;right:10%;background:#f472b6;animation-delay:5s;"></div>

        <main class="page-content page-content-narrow" style="padding-bottom:32px;position:relative;z-index:1;">
          <!-- Profile Header -->
          <section style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:32px 0;position:relative;">
            <div class="avatar avatar-lg glow-purple" style="margin-bottom:24px;border-color:#9d6eff;">
              <img src="${user.avatar_url || ''}" alt="Profile" onerror="this.style.background='var(--color-surface-container-high)'" />
            </div>
            <h2 class="text-headline" style="margin-bottom:8px;">${user.name || 'User'}</h2>
            <p class="text-body-sm text-on-surface-variant" style="margin-bottom:24px;">${user.email || ''}</p>
            <button class="btn btn-primary" onclick="Components.showToast('Coming soon!', 'info')">
              <span class="material-symbols-outlined">edit</span>
              ${I18n.t('profile.editProfile')}
            </button>
          </section>

          <!-- Activity Summary -->
          <section class="grid grid-2" style="margin-bottom:32px;">
            <div class="card card-vivid-purple card-interactive" style="position:relative;overflow:hidden;min-height:140px;">
              <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:#c084fc;opacity:0.08;"></div>
              <h3 class="text-label text-accent-cyan" style="margin-bottom:8px;">${I18n.t('profile.totalTracked')}</h3>
              <div class="text-display-mobile" style="color:#c084fc;" id="profile-balance">${Currency.format(Math.abs(totalBalance))}</div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:16px;">
                <span class="badge badge-gradient-green">
                  <span class="material-symbols-outlined" style="font-size:14px;">trending_up</span>
                  +12%
                </span>
              </div>
            </div>

            <div class="card card-vivid-green card-interactive" style="position:relative;overflow:hidden;min-height:140px;">
              <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:#6ee7b7;opacity:0.08;"></div>
              <h3 class="text-label text-accent-pink" style="margin-bottom:8px;">${I18n.t('profile.activeGoals')}</h3>
              <div class="text-display-mobile" style="color:#6ee7b7;">
                ${activeGoals} <span class="text-headline text-on-surface-variant">/ ${totalGoals}</span>
              </div>
              <div style="margin-top:16px;">
                <div class="progress-bar">
                  <div class="progress-bar-fill secondary" style="width:${totalGoals > 0 ? Math.round(((totalGoals - activeGoals) / totalGoals) * 100) : 0}%"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Links -->
          <section style="display:flex;flex-direction:column;gap:12px;">
            <a href="#" class="card card-vivid-cyan card-interactive" onclick="event.preventDefault(); Components.showToast('Coming soon!', 'info')" style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:16px;">
                <div class="icon-container-cyan" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined" style="font-size:20px;">security</span>
                </div>
                <span class="text-body-lg">${I18n.t('profile.securityPrivacy')}</span>
              </div>
              <span class="material-symbols-outlined" style="color:#67e8f9;">chevron_right</span>
            </a>

            <a href="#" class="card card-vivid-gold card-interactive" onclick="event.preventDefault(); Components.showToast('Coming soon!', 'info')" style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:16px;">
                <div class="icon-container-gold" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined" style="font-size:20px;">credit_card</span>
                </div>
                <span class="text-body-lg">${I18n.t('profile.linkedAccounts')}</span>
              </div>
              <span class="material-symbols-outlined" style="color:#fde68a;">chevron_right</span>
            </a>

            <button class="card card-interactive" onclick="App.logout()" 
                    style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;border:1px solid rgba(252,165,165,0.2);background:linear-gradient(135deg,rgba(185,28,28,0.1),transparent);width:100%;text-align:left;">
              <div style="display:flex;align-items:center;gap:16px;">
                <div class="icon-container-red" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                  <span class="material-symbols-outlined" style="font-size:20px;">logout</span>
                </div>
                <span class="text-body-lg text-error">${I18n.t('profile.logOut')}</span>
              </div>
            </button>
          </section>

          <div class="section-divider-gradient"></div>
          ${Components.watermark()}
        </main>
      </div>
    `;
  },

  init() {}
};
