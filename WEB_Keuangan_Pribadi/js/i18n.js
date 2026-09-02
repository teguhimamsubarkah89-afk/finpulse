/* ═══════════════════════════════════════════════════════════
   FinPulse — Internationalization (i18n)
   Supports: Indonesian (id), English (en)
   ═══════════════════════════════════════════════════════════ */

const I18n = {
  _currentLang: 'id',
  _translations: {},
  _listeners: [],

  async init() {
    const settings = Store.getSettings();
    this._currentLang = settings.language || 'id';
    await this._loadLanguage(this._currentLang);
  },

  async _loadLanguage(lang) {
    // Inline translations to avoid fetch issues with file:// protocol
    this._translations = lang === 'id' ? this._getID() : this._getEN();
  },

  t(key, params = {}) {
    let text = this._translations[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  },

  async setLanguage(lang) {
    this._currentLang = lang;
    Store.updateSetting('language', lang);
    await this._loadLanguage(lang);
    this._listeners.forEach(fn => fn(lang));
  },

  getLang() {
    return this._currentLang;
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  // ═══════════════════════════════════════
  // INDONESIAN TRANSLATIONS
  // ═══════════════════════════════════════
  _getID() {
    return {
      // Navigation
      'nav.home': 'Beranda',
      'nav.history': 'Riwayat',
      'nav.add': 'Tambah',
      'nav.reports': 'Laporan',
      'nav.settings': 'Pengaturan',
      'nav.budgets': 'Anggaran',
      'nav.profile': 'Profil',

      // Login
      'login.title': 'FinPulse',
      'login.subtitle': 'Kelola Keuanganmu.',
      'login.google': 'Masuk dengan Google',
      'login.other': 'Metode login lainnya',
      'login.or': 'atau',
      'login.loading': 'Memproses...',

      // Splash / Onboarding
      'splash.slide1.title': 'Uangmu, ',
      'splash.slide1.highlight': 'Aturanmu',
      'splash.slide1.desc': 'Bebaskan diri dari perbankan lama. Rasakan kebebasan finansial sejati dengan alat yang dibuat untuk gaya hidupmu.',
      'splash.slide2.title': 'Menabung Tanpa ',
      'splash.slide2.highlight': 'Pikir',
      'splash.slide2.desc': 'Otomatiskan tabunganmu. Lihat kekayaanmu tumbuh dengan mudah lewat target tabungan yang cerdas.',
      'splash.slide3.title': 'Tahu Ke Mana ',
      'splash.slide3.highlight': 'Perginya',
      'splash.slide3.desc': 'Lihat persis bagaimana kamu membelanjakan uang secara real-time. Insight yang jelas dan mudah dipahami.',
      'splash.getStarted': 'Mulai Sekarang',

      // Dashboard
      'dashboard.totalBalance': 'Total Saldo',
      'dashboard.cashFlow': 'Arus Kas',
      'dashboard.recentActivity': 'Aktivitas Terbaru',
      'dashboard.viewAll': 'Lihat Semua',
      'dashboard.today': 'Hari Ini',
      'dashboard.yesterday': 'Kemarin',
      'dashboard.addTransaction': 'Tambah Transaksi',

      // Transactions
      'tx.title': 'Transaksi',
      'tx.subtitle': 'Lihat, cari, dan filter riwayat keuangan lengkapmu.',
      'tx.search': 'Cari merchant, kategori...',
      'tx.dateRange': 'Rentang Tanggal',
      'tx.category': 'Kategori',
      'tx.allAccounts': 'Semua Akun',
      'tx.loadMore': 'Muat Lebih Banyak',
      'tx.noTransactions': 'Belum Ada Transaksi',
      'tx.noTransactionsDesc': 'Yuk catat transaksi pertamamu!',
      'tx.income': 'Pemasukan',
      'tx.expense': 'Pengeluaran',
      'tx.all': 'Semua',

      // Add Transaction
      'addTx.title': 'Tambah Transaksi',
      'addTx.editTitle': 'Edit Transaksi',
      'addTx.amount': 'Nominal',
      'addTx.amountPlaceholder': '0',
      'addTx.type': 'Jenis',
      'addTx.category': 'Kategori',
      'addTx.date': 'Tanggal',
      'addTx.note': 'Catatan',
      'addTx.notePlaceholder': 'Tulis catatan...',
      'addTx.save': 'Simpan Transaksi',
      'addTx.update': 'Perbarui Transaksi',
      'addTx.success': 'Transaksi berhasil disimpan!',
      'addTx.updated': 'Transaksi berhasil diperbarui!',
      'addTx.deleted': 'Transaksi dihapus.',
      'addTx.delete': 'Hapus',

      // Budgets & Goals
      'budget.title': 'Anggaran & Target',
      'budget.subtitle': 'Pantau pengeluaran dan raih targetmu.',
      'budget.monthlyBudgets': 'Anggaran Bulanan',
      'budget.onTrack': 'SESUAI',
      'budget.safe': 'AMAN',
      'budget.lagging': 'TERTINGGAL',
      'budget.overBudget': 'Melebihi anggaran!',
      'budget.left': 'tersisa',
      'budget.almostThere': 'Hampir tercapai',
      'budget.needsAttention': 'Perlu perhatian',
      'budget.monthsLeft': '{n} bulan lagi',
      'budget.addGoal': 'Tambah Target',

      // Reports
      'report.title': 'Laporan Keuangan',
      'report.subtitle': 'Pergerakan uangmu bulan ini.',
      'report.totalSpend': 'TOTAL PENGELUARAN',
      'report.income': 'PEMASUKAN',
      'report.savingsRate': 'RASIO TABUNGAN',
      'report.vsLastMonth': 'vs bulan lalu',
      'report.expensePulse': 'Grafik Pengeluaran',
      'report.categories': 'Kategori',
      'report.top': 'TERATAS',
      'report.thisMonth': 'Bulan Ini',
      'report.lastMonth': 'Bulan Lalu',
      'report.thisYear': 'Tahun Ini',

      // Settings
      'settings.title': 'Pengaturan',
      'settings.subtitle': 'Kelola preferensi akun dan keamanan.',
      'settings.accountProfile': 'Profil Akun',
      'settings.accountProfileDesc': 'Perbarui detail pribadimu',
      'settings.currency': 'Mata Uang',
      'settings.language': 'Bahasa',
      'settings.themeMode': 'Mode Tema',
      'settings.notifications': 'Notifikasi',
      'settings.securityData': 'Keamanan & Data',
      'settings.security': 'Keamanan',
      'settings.securityDesc': 'Kata Sandi, 2FA, Perangkat',
      'settings.connectedGoogle': 'Akun Google Terhubung',
      'settings.disconnect': 'Putuskan',
      'settings.exportData': 'Ekspor Data',
      'settings.exportDataDesc': 'Unduh riwayat akunmu',
      'settings.about': 'Tentang',
      'settings.logout': 'Keluar',
      'settings.logoutConfirm': 'Yakin ingin keluar?',
      'settings.deleteAccount': 'Hapus Akun',
      'settings.deleteAccountDesc': 'Ini akan menghapus semua datamu secara permanen.',
      'settings.dark': 'Gelap',
      'settings.light': 'Terang',
      'settings.system': 'Sistem',

      // Profile
      'profile.editProfile': 'Edit Profil',
      'profile.totalTracked': 'TOTAL TERCATAT',
      'profile.activeGoals': 'TARGET AKTIF',
      'profile.thisMonth': '+{n}% bulan ini',
      'profile.securityPrivacy': 'Keamanan & Privasi',
      'profile.linkedAccounts': 'Akun Terhubung',
      'profile.logOut': 'Keluar',

      // Common
      'common.cancel': 'Batal',
      'common.confirm': 'Konfirmasi',
      'common.save': 'Simpan',
      'common.delete': 'Hapus',
      'common.edit': 'Edit',
      'common.close': 'Tutup',
      'common.back': 'Kembali',
      'common.yes': 'Ya',
      'common.no': 'Tidak',
      'common.loading': 'Memuat...',
      'common.noData': 'Tidak ada data',
      'common.exportSuccess': 'Data berhasil diekspor!',

      // Watermark
      'watermark': 'Didesain oleh Teguh Imam Subarkah',
    };
  },

  // ═══════════════════════════════════════
  // ENGLISH TRANSLATIONS
  // ═══════════════════════════════════════
  _getEN() {
    return {
      // Navigation
      'nav.home': 'Home',
      'nav.history': 'History',
      'nav.add': 'Add',
      'nav.reports': 'Reports',
      'nav.settings': 'Settings',
      'nav.budgets': 'Budgets',
      'nav.profile': 'Profile',

      // Login
      'login.title': 'FinPulse',
      'login.subtitle': 'Empower Your Finances.',
      'login.google': 'Continue with Google',
      'login.other': 'Other login methods',
      'login.or': 'or',
      'login.loading': 'Processing...',

      // Splash / Onboarding
      'splash.slide1.title': 'Your Money, ',
      'splash.slide1.highlight': 'Your Rules',
      'splash.slide1.desc': 'Break free from old banking. Experience true financial freedom with tools built for your lifestyle.',
      'splash.slide2.title': 'Save Without ',
      'splash.slide2.highlight': 'Thinking',
      'splash.slide2.desc': 'Automate your stash. Watch your wealth grow effortlessly with smart, intuitive saving goals.',
      'splash.slide3.title': 'Know Where It ',
      'splash.slide3.highlight': 'Goes',
      'splash.slide3.desc': 'See exactly how you spend in real-time. High-contrast insights that make tracking a breeze.',
      'splash.getStarted': 'Get Started',

      // Dashboard
      'dashboard.totalBalance': 'Total Balance',
      'dashboard.cashFlow': 'Cash Flow',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.viewAll': 'View All',
      'dashboard.today': 'Today',
      'dashboard.yesterday': 'Yesterday',
      'dashboard.addTransaction': 'Add Transaction',

      // Transactions
      'tx.title': 'Transactions',
      'tx.subtitle': 'View, search, and filter your complete financial history.',
      'tx.search': 'Search merchants, categories...',
      'tx.dateRange': 'Date Range',
      'tx.category': 'Category',
      'tx.allAccounts': 'All Accounts',
      'tx.loadMore': 'Load More',
      'tx.noTransactions': 'No Transactions Yet',
      'tx.noTransactionsDesc': 'Start by recording your first transaction!',
      'tx.income': 'Income',
      'tx.expense': 'Expense',
      'tx.all': 'All',

      // Add Transaction
      'addTx.title': 'Add Transaction',
      'addTx.editTitle': 'Edit Transaction',
      'addTx.amount': 'Amount',
      'addTx.amountPlaceholder': '0',
      'addTx.type': 'Type',
      'addTx.category': 'Category',
      'addTx.date': 'Date',
      'addTx.note': 'Note',
      'addTx.notePlaceholder': 'Write a note...',
      'addTx.save': 'Save Transaction',
      'addTx.update': 'Update Transaction',
      'addTx.success': 'Transaction saved successfully!',
      'addTx.updated': 'Transaction updated successfully!',
      'addTx.deleted': 'Transaction deleted.',
      'addTx.delete': 'Delete',

      // Budgets & Goals
      'budget.title': 'Budget & Goals',
      'budget.subtitle': 'Track your spending and smash your targets.',
      'budget.monthlyBudgets': 'Monthly Budgets',
      'budget.onTrack': 'ON TRACK',
      'budget.safe': 'SAFE',
      'budget.lagging': 'LAGGING',
      'budget.overBudget': 'Over budget!',
      'budget.left': 'left',
      'budget.almostThere': 'Almost there',
      'budget.needsAttention': 'Needs attention',
      'budget.monthsLeft': '{n} months left',
      'budget.addGoal': 'Add Goal',

      // Reports
      'report.title': 'Financial Pulse',
      'report.subtitle': 'Your money movement this month.',
      'report.totalSpend': 'TOTAL SPEND',
      'report.income': 'INCOME',
      'report.savingsRate': 'SAVINGS RATE',
      'report.vsLastMonth': 'vs last month',
      'report.expensePulse': 'Expense Pulse',
      'report.categories': 'Categories',
      'report.top': 'TOP',
      'report.thisMonth': 'This Month',
      'report.lastMonth': 'Last Month',
      'report.thisYear': 'This Year',

      // Settings
      'settings.title': 'Settings',
      'settings.subtitle': 'Manage your account preferences and security.',
      'settings.accountProfile': 'Account Profile',
      'settings.accountProfileDesc': 'Update your personal details',
      'settings.currency': 'Currency',
      'settings.language': 'Language',
      'settings.themeMode': 'Theme Mode',
      'settings.notifications': 'Notifications',
      'settings.securityData': 'Security & Data',
      'settings.security': 'Security',
      'settings.securityDesc': 'Password, 2FA, Devices',
      'settings.connectedGoogle': 'Connected Google Account',
      'settings.disconnect': 'Disconnect',
      'settings.exportData': 'Export Data',
      'settings.exportDataDesc': 'Download your account history',
      'settings.about': 'About',
      'settings.logout': 'Logout',
      'settings.logoutConfirm': 'Are you sure you want to logout?',
      'settings.deleteAccount': 'Delete Account',
      'settings.deleteAccountDesc': 'This will permanently delete all your data.',
      'settings.dark': 'Dark',
      'settings.light': 'Light',
      'settings.system': 'System',

      // Profile
      'profile.editProfile': 'Edit Profile',
      'profile.totalTracked': 'TOTAL TRACKED',
      'profile.activeGoals': 'ACTIVE GOALS',
      'profile.thisMonth': '+{n}% this month',
      'profile.securityPrivacy': 'Security & Privacy',
      'profile.linkedAccounts': 'Linked Accounts',
      'profile.logOut': 'Log Out',

      // Common
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.close': 'Close',
      'common.back': 'Back',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.loading': 'Loading...',
      'common.noData': 'No data',
      'common.exportSuccess': 'Data exported successfully!',

      // Watermark
      'watermark': 'Designed by Teguh Imam Subarkah',
    };
  }
};
