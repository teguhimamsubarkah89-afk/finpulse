/* ═══════════════════════════════════════════════════════════
   FinPulse — Auth Module (Simulated Google OAuth)
   ═══════════════════════════════════════════════════════════ */

const Auth = {
  _sessionKey: 'finpulse_session',
  _inactivityTimer: null,
  _TIMEOUT_MS: 30 * 60 * 1000, // 30 min auto-logout

  isLoggedIn() {
    const session = this._getSession();
    if (!session) return false;
    if (Date.now() - session.lastActive > this._TIMEOUT_MS) {
      this.logout();
      return false;
    }
    return true;
  },

  getSession() {
    return this._getSession();
  },

  // Simulate Google Login
  async loginWithGoogle() {
    // Simulate a brief delay for realism
    await new Promise(r => setTimeout(r, 800));

    const user = {
      id: 'user_' + Date.now().toString(36),
      google_id: 'g_' + Math.random().toString(36).substr(2, 12),
      name: 'Teguh Imam S.',
      email: 'teguh.imam@gmail.com',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdafcbXgxnGh_P3WfNsifa4G-mVY9cFmAsOI0UwTv6Q75kpJeRSriS3_NR4DFTEUFtx9-RBb7aT2JazTVjaVoJXkmP0tNcFBsPo737jfneBnt1jlSDfEG844yb5UIWHnMWzFV1ssvdPeXXhRhsc2Q1_6BL6v4cmzwPXn3pB00jZcg2Mvjya9mTGvI2Qc_gZi-KeSmWnzx4JhrpqTG5KG3Nh64a0iZdxjdjgclQBB-iSQ37AVWcJQ6fWQ',
      created_at: new Date().toISOString()
    };

    // Check if user exists in store
    const existing = Store.getUser();
    if (existing) {
      user.id = existing.id;
      user.google_id = existing.google_id;
      user.created_at = existing.created_at;
    }

    Store.setUser(user);
    Store.seedDemoData();

    const session = {
      userId: user.id,
      loginAt: Date.now(),
      lastActive: Date.now()
    };
    this._setSession(session);
    this._startInactivityTimer();

    return { user, isNewUser: !existing };
  },

  logout() {
    this._clearSession();
    this._stopInactivityTimer();
    // Don't clear user data, just session
  },

  touch() {
    const session = this._getSession();
    if (session) {
      session.lastActive = Date.now();
      this._setSession(session);
    }
  },

  getCurrentUser() {
    if (!this.isLoggedIn()) return null;
    return Store.getUser();
  },

  // ── Private ──
  _getSession() {
    try {
      const data = sessionStorage.getItem(this._sessionKey);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  _setSession(session) {
    sessionStorage.setItem(this._sessionKey, JSON.stringify(session));
  },

  _clearSession() {
    sessionStorage.removeItem(this._sessionKey);
  },

  _startInactivityTimer() {
    this._stopInactivityTimer();
    // Touch on any interaction
    const touchHandler = () => this.touch();
    ['click', 'keydown', 'scroll', 'touchstart'].forEach(e => {
      document.addEventListener(e, touchHandler, { passive: true });
    });
    this._touchHandler = touchHandler;
  },

  _stopInactivityTimer() {
    if (this._touchHandler) {
      ['click', 'keydown', 'scroll', 'touchstart'].forEach(e => {
        document.removeEventListener(e, this._touchHandler);
      });
    }
  }
};
