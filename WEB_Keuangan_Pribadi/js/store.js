/* ═══════════════════════════════════════════════════════════
   FinPulse — Data Store (localStorage Abstraction)
   ═══════════════════════════════════════════════════════════ */

const Store = {
  _prefix: 'finpulse_',

  // ── Generic CRUD ──
  _get(key) {
    try {
      const data = localStorage.getItem(this._prefix + key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  _set(key, value) {
    localStorage.setItem(this._prefix + key, JSON.stringify(value));
  },

  _remove(key) {
    localStorage.removeItem(this._prefix + key);
  },

  // ══════════════════════════════════════════
  // USER
  // ══════════════════════════════════════════
  getUser() {
    return this._get('user');
  },

  setUser(user) {
    this._set('user', user);
  },

  clearUser() {
    this._remove('user');
  },

  // ══════════════════════════════════════════
  // SETTINGS
  // ══════════════════════════════════════════
  getSettings() {
    return this._get('settings') || {
      currency: 'IDR',
      language: 'id',
      theme: 'dark',
      notifications: true
    };
  },

  setSettings(settings) {
    this._set('settings', settings);
  },

  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this.setSettings(settings);
  },

  // ══════════════════════════════════════════
  // TRANSACTIONS
  // ══════════════════════════════════════════
  getTransactions() {
    return this._get('transactions') || [];
  },

  addTransaction(tx) {
    const txs = this.getTransactions();
    tx.id = this._generateId();
    tx.created_at = new Date().toISOString();
    txs.unshift(tx);
    this._set('transactions', txs);
    return tx;
  },

  updateTransaction(id, updates) {
    const txs = this.getTransactions();
    const idx = txs.findIndex(t => t.id === id);
    if (idx !== -1) {
      txs[idx] = { ...txs[idx], ...updates };
      this._set('transactions', txs);
      return txs[idx];
    }
    return null;
  },

  deleteTransaction(id) {
    const txs = this.getTransactions().filter(t => t.id !== id);
    this._set('transactions', txs);
  },

  getTransactionsByDateRange(start, end) {
    return this.getTransactions().filter(t => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
  },

  getTransactionsByType(type) {
    return this.getTransactions().filter(t => t.type === type);
  },

  getTransactionsByCategory(categoryId) {
    return this.getTransactions().filter(t => t.category_id === categoryId);
  },

  // ══════════════════════════════════════════
  // CATEGORIES
  // ══════════════════════════════════════════
  getCategories() {
    return this._get('categories') || this._defaultCategories();
  },

  addCategory(cat) {
    const cats = this.getCategories();
    cat.id = this._generateId();
    cats.push(cat);
    this._set('categories', cats);
    return cat;
  },

  _defaultCategories() {
    const cats = [
      { id: 'cat_food',     name_id: 'Makanan & Minuman', name_en: 'Food & Dining',     icon: 'restaurant',      type: 'expense', color: 'primary' },
      { id: 'cat_transport', name_id: 'Transportasi',      name_en: 'Transportation',    icon: 'directions_car',  type: 'expense', color: 'tertiary' },
      { id: 'cat_shopping', name_id: 'Belanja',            name_en: 'Shopping',          icon: 'shopping_bag',    type: 'expense', color: 'secondary' },
      { id: 'cat_entertain', name_id: 'Hiburan',           name_en: 'Entertainment',     icon: 'movie',           type: 'expense', color: 'primary' },
      { id: 'cat_bills',    name_id: 'Tagihan',            name_en: 'Bills & Utilities', icon: 'receipt_long',    type: 'expense', color: 'error' },
      { id: 'cat_health',   name_id: 'Kesehatan',          name_en: 'Health',            icon: 'health_and_safety', type: 'expense', color: 'secondary' },
      { id: 'cat_education', name_id: 'Pendidikan',        name_en: 'Education',         icon: 'school',          type: 'expense', color: 'tertiary' },
      { id: 'cat_subs',     name_id: 'Langganan',          name_en: 'Subscriptions',     icon: 'subscriptions',   type: 'expense', color: 'error' },
      { id: 'cat_salary',   name_id: 'Gaji',               name_en: 'Salary',            icon: 'payments',        type: 'income',  color: 'secondary' },
      { id: 'cat_freelance', name_id: 'Freelance',         name_en: 'Freelance',         icon: 'work',            type: 'income',  color: 'secondary' },
      { id: 'cat_invest',   name_id: 'Investasi',          name_en: 'Investment',        icon: 'trending_up',     type: 'income',  color: 'tertiary' },
      { id: 'cat_gift',     name_id: 'Hadiah',             name_en: 'Gift',              icon: 'redeem',          type: 'income',  color: 'primary' },
      { id: 'cat_other_exp', name_id: 'Lainnya',           name_en: 'Other',             icon: 'more_horiz',      type: 'expense', color: 'outline' },
      { id: 'cat_other_inc', name_id: 'Lainnya',           name_en: 'Other',             icon: 'more_horiz',      type: 'income',  color: 'outline' },
    ];
    this._set('categories', cats);
    return cats;
  },

  // ══════════════════════════════════════════
  // BUDGETS
  // ══════════════════════════════════════════
  getBudgets() {
    return this._get('budgets') || [];
  },

  addBudget(budget) {
    const budgets = this.getBudgets();
    budget.id = this._generateId();
    budgets.push(budget);
    this._set('budgets', budgets);
    return budget;
  },

  updateBudget(id, updates) {
    const budgets = this.getBudgets();
    const idx = budgets.findIndex(b => b.id === id);
    if (idx !== -1) {
      budgets[idx] = { ...budgets[idx], ...updates };
      this._set('budgets', budgets);
    }
  },

  deleteBudget(id) {
    const budgets = this.getBudgets().filter(b => b.id !== id);
    this._set('budgets', budgets);
  },

  // ══════════════════════════════════════════
  // GOALS (Savings Targets)
  // ══════════════════════════════════════════
  getGoals() {
    return this._get('goals') || [];
  },

  addGoal(goal) {
    const goals = this.getGoals();
    goal.id = this._generateId();
    goals.push(goal);
    this._set('goals', goals);
    return goal;
  },

  updateGoal(id, updates) {
    const goals = this.getGoals();
    const idx = goals.findIndex(g => g.id === id);
    if (idx !== -1) {
      goals[idx] = { ...goals[idx], ...updates };
      this._set('goals', goals);
    }
  },

  // ══════════════════════════════════════════
  // ACCOUNTS (Wallets)
  // ══════════════════════════════════════════
  getAccounts() {
    return this._get('accounts') || [];
  },

  addAccount(account) {
    const accounts = this.getAccounts();
    account.id = this._generateId();
    accounts.push(account);
    this._set('accounts', accounts);
    return account;
  },

  // ══════════════════════════════════════════
  // COMPUTED DATA
  // ══════════════════════════════════════════
  getTotalBalance() {
    const txs = this.getTransactions();
    return txs.reduce((sum, tx) => {
      return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
    }, 0);
  },

  getMonthlyIncome(year, month) {
    return this.getTransactions()
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.type === 'income' && d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  getMonthlyExpense(year, month) {
    return this.getTransactions()
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.type === 'expense' && d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  getRecentTransactions(limit = 5) {
    return this.getTransactions().slice(0, limit);
  },

  getCategoryTotals(year, month) {
    const txs = this.getTransactions().filter(tx => {
      const d = new Date(tx.date);
      return tx.type === 'expense' && d.getFullYear() === year && d.getMonth() === month;
    });
    const cats = this.getCategories();
    const totals = {};
    txs.forEach(tx => {
      if (!totals[tx.category_id]) totals[tx.category_id] = 0;
      totals[tx.category_id] += tx.amount;
    });
    return Object.entries(totals)
      .map(([catId, amount]) => {
        const cat = cats.find(c => c.id === catId) || { name_en: 'Other', icon: 'more_horiz', color: 'outline' };
        return { ...cat, total: amount };
      })
      .sort((a, b) => b.total - a.total);
  },

  getBudgetSpent(budgetCategoryId, year, month) {
    return this.getTransactions()
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.category_id === budgetCategoryId && 
               tx.type === 'expense' && 
               d.getFullYear() === year && 
               d.getMonth() === month;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  getWeeklyExpenses(year, month) {
    const txs = this.getTransactions().filter(tx => {
      const d = new Date(tx.date);
      return tx.type === 'expense' && d.getFullYear() === year && d.getMonth() === month;
    });
    const weeks = [0, 0, 0, 0];
    txs.forEach(tx => {
      const day = new Date(tx.date).getDate();
      const week = Math.min(Math.floor((day - 1) / 7), 3);
      weeks[week] += tx.amount;
    });
    return weeks;
  },

  // Group transactions by date
  groupTransactionsByDate(transactions) {
    const groups = {};
    transactions.forEach(tx => {
      const dateKey = tx.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, txs]) => ({ date, transactions: txs }));
  },

  // ══════════════════════════════════════════
  // SEED DATA
  // ══════════════════════════════════════════
  seedDemoData() {
    if (this.getTransactions().length > 0) return;

    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();

    const demoTransactions = [
      { type: 'expense', amount: 45000,   category_id: 'cat_food',      date: this._dateStr(y, m, today.getDate()),     note: 'Neon Cafe & Roastery' },
      { type: 'income',  amount: 8500000, category_id: 'cat_salary',    date: this._dateStr(y, m, today.getDate() - 1), note: 'Gaji Bulanan' },
      { type: 'expense', amount: 25000,   category_id: 'cat_transport', date: this._dateStr(y, m, today.getDate() - 1), note: 'GrabCar ke kantor' },
      { type: 'expense', amount: 159000,  category_id: 'cat_subs',      date: this._dateStr(y, m, today.getDate() - 2), note: 'StreamFlix Premium' },
      { type: 'expense', amount: 350000,  category_id: 'cat_shopping',  date: this._dateStr(y, m, today.getDate() - 3), note: 'Uniqlo - Kemeja baru' },
      { type: 'income',  amount: 2500000, category_id: 'cat_freelance', date: this._dateStr(y, m, today.getDate() - 4), note: 'Proyek web design' },
      { type: 'expense', amount: 85000,   category_id: 'cat_food',      date: this._dateStr(y, m, today.getDate() - 4), note: 'Sushi Tei dinner' },
      { type: 'expense', amount: 120000,  category_id: 'cat_entertain', date: this._dateStr(y, m, today.getDate() - 5), note: 'Cinema XXI - tiket 2' },
      { type: 'expense', amount: 200000,  category_id: 'cat_health',    date: this._dateStr(y, m, today.getDate() - 6), note: 'Apotek - vitamin' },
      { type: 'expense', amount: 55000,   category_id: 'cat_food',      date: this._dateStr(y, m, today.getDate() - 7), note: 'Kopi Kenangan' },
      { type: 'income',  amount: 500000,  category_id: 'cat_gift',      date: this._dateStr(y, m, today.getDate() - 8), note: 'Cashback promo' },
      { type: 'expense', amount: 750000,  category_id: 'cat_bills',     date: this._dateStr(y, m, today.getDate() - 9), note: 'PLN & WiFi' },
      { type: 'expense', amount: 35000,   category_id: 'cat_transport', date: this._dateStr(y, m, today.getDate() - 10), note: 'Gojek' },
      { type: 'expense', amount: 180000,  category_id: 'cat_food',      date: this._dateStr(y, m, today.getDate() - 12), note: 'Restoran Padang' },
      { type: 'income',  amount: 1200000, category_id: 'cat_freelance', date: this._dateStr(y, m, today.getDate() - 14), note: 'Logo design project' },
    ];

    demoTransactions.forEach(tx => this.addTransaction(tx));

    // Demo Goals
    const demoGoals = [
      { name_id: 'Trip Tokyo',     name_en: 'Tokyo Trip',      icon: 'flight_takeoff',     target: 25000000, saved: 16000000, deadline: this._dateStr(y + 1, 2, 1), color: 'primary' },
      { name_id: 'Dana Darurat',   name_en: 'Emergency Fund',  icon: 'health_and_safety',  target: 50000000, saved: 47500000, deadline: this._dateStr(y + 1, 0, 1), color: 'secondary' },
      { name_id: 'Laptop Baru',    name_en: 'New Setup',       icon: 'laptop_mac',         target: 15000000, saved: 2700000,  deadline: this._dateStr(y, m + 6, 1), color: 'tertiary' },
    ];
    demoGoals.forEach(g => this.addGoal(g));

    // Demo Budgets
    const demoBudgets = [
      { category_id: 'cat_food',      limit: 2000000, month: m, year: y },
      { category_id: 'cat_shopping',  limit: 1500000, month: m, year: y },
      { category_id: 'cat_transport', limit: 1000000, month: m, year: y },
      { category_id: 'cat_subs',      limit: 300000,  month: m, year: y },
    ];
    demoBudgets.forEach(b => this.addBudget(b));

    // Demo Accounts
    const demoAccounts = [
      { name: 'Cash',      type: 'cash',     icon: 'account_balance_wallet' },
      { name: 'BCA',       type: 'bank',     icon: 'account_balance' },
      { name: 'GoPay',     type: 'e-wallet', icon: 'smartphone' },
    ];
    demoAccounts.forEach(a => this.addAccount(a));
  },

  // ══════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════
  _generateId() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  },

  _dateStr(y, m, d) {
    // Clamp day values
    const date = new Date(y, m, d);
    return date.toISOString().split('T')[0];
  },

  // Export data as CSV
  exportCSV() {
    const txs = this.getTransactions();
    const cats = this.getCategories();
    const lang = this.getSettings().language || 'id';
    const header = 'Date,Type,Category,Amount,Note\n';
    const rows = txs.map(tx => {
      const cat = cats.find(c => c.id === tx.category_id);
      const catName = cat ? (lang === 'id' ? cat.name_id : cat.name_en) : 'Other';
      return `${tx.date},${tx.type},${catName},${tx.amount},"${(tx.note || '').replace(/"/g, '""')}"`;
    }).join('\n');
    return header + rows;
  },

  // Clear all data
  clearAllData() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this._prefix));
    keys.forEach(k => localStorage.removeItem(k));
  }
};
