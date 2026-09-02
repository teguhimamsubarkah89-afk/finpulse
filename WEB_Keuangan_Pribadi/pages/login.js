/* ═══════════════════════════════════════════════════════════
   FinPulse — Login Page (Vibrant & Centered)
   ═══════════════════════════════════════════════════════════ */

const PageLogin = {
  _loading: false,

  render() {
    return `
      <div class="login-page">
        <div class="login-ambient"></div>
        
        <!-- Floating colorful orbs -->
        <div class="animated-bg-orb" style="width:300px;height:300px;top:10%;left:5%;background:#7c3aed;"></div>
        <div class="animated-bg-orb" style="width:250px;height:250px;bottom:20%;right:10%;background:#22d3ee;animation-delay:4s;"></div>
        <div class="animated-bg-orb" style="width:200px;height:200px;top:50%;left:60%;background:#f472b6;animation-delay:8s;"></div>
        
        <div class="login-content">
          <div class="login-brand" style="text-align:center;">
            <h1 class="text-gradient-cyber" style="display:inline-block;">${I18n.t('login.title')}</h1>
            <p>${I18n.t('login.subtitle')}</p>
          </div>

          <div class="login-card" style="border:1px solid rgba(157,110,255,0.2);">
            <button class="btn btn-primary btn-lg btn-full" id="google-login-btn" onclick="PageLogin.handleGoogleLogin()" style="height:56px;font-size:var(--fs-label-caps);background:var(--gradient-primary) !important;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span id="google-btn-text">${I18n.t('login.google')}</span>
            </button>

            <div class="login-divider">
              <span>${I18n.t('login.or')}</span>
            </div>

            <button class="btn btn-secondary btn-full" style="height:56px;font-size:var(--fs-label-caps);border:1px solid rgba(34,211,238,0.2);background:rgba(34,211,238,0.05);" onclick="Components.showToast('Coming soon!', 'info')">
              <span class="material-symbols-outlined" style="color:#67e8f9;">mail</span>
              <span>${I18n.t('login.other')}</span>
            </button>
          </div>
        </div>

        <div class="login-footer">
          <p class="text-watermark text-outline">${I18n.t('watermark')}</p>
        </div>
      </div>
    `;
  },

  async handleGoogleLogin() {
    if (this._loading) return;
    this._loading = true;

    const btn = document.getElementById('google-login-btn');
    const btnText = document.getElementById('google-btn-text');
    
    if (btn) { btn.style.opacity = '0.7'; btn.style.pointerEvents = 'none'; }
    if (btnText) btnText.textContent = I18n.t('login.loading');

    try {
      await Auth.loginWithGoogle();
      Components.showSuccess(
        I18n.getLang() === 'id' ? 'Selamat datang!' : 'Welcome!',
        () => App.navigate('dashboard')
      );
    } catch (err) {
      Components.showToast('Login gagal. Coba lagi.', 'error');
      if (btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
      if (btnText) btnText.textContent = I18n.t('login.google');
    }
    this._loading = false;
  }
};
