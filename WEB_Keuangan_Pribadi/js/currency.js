/* ═══════════════════════════════════════════════════════════
   FinPulse — Currency Formatting & Conversion
   ═══════════════════════════════════════════════════════════ */

const Currency = {
  // Static exchange rates (relative to USD)
  _rates: {
    USD: 1,
    IDR: 15500,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    SGD: 1.35,
    MYR: 4.72,
    THB: 35.8,
    KRW: 1330,
    AUD: 1.55,
    CNY: 7.28,
  },

  _symbols: {
    USD: '$', IDR: 'Rp', EUR: '€', GBP: '£', JPY: '¥',
    SGD: 'S$', MYR: 'RM', THB: '฿', KRW: '₩', AUD: 'A$', CNY: '¥',
  },

  _names: {
    USD: 'US Dollar', IDR: 'Rupiah Indonesia', EUR: 'Euro',
    GBP: 'British Pound', JPY: 'Japanese Yen', SGD: 'Singapore Dollar',
    MYR: 'Malaysian Ringgit', THB: 'Thai Baht', KRW: 'Korean Won',
    AUD: 'Australian Dollar', CNY: 'Chinese Yuan',
  },

  getAvailableCurrencies() {
    return Object.entries(this._names).map(([code, name]) => ({
      code, name, symbol: this._symbols[code]
    }));
  },

  getCurrentCurrency() {
    return Store.getSettings().currency || 'IDR';
  },

  getSymbol(code) {
    return this._symbols[code] || code;
  },

  format(amount, currencyCode = null) {
    const code = currencyCode || this.getCurrentCurrency();
    const symbol = this._symbols[code] || code;
    
    // Convert from IDR base to target currency
    const converted = this.convert(amount, 'IDR', code);
    
    // Format based on currency
    if (code === 'IDR') {
      return symbol + this._formatNumber(Math.round(converted));
    } else if (code === 'JPY' || code === 'KRW') {
      return symbol + this._formatNumber(Math.round(converted));
    } else {
      return symbol + this._formatDecimal(converted);
    }
  },

  formatCompact(amount, currencyCode = null) {
    const code = currencyCode || this.getCurrentCurrency();
    const symbol = this._symbols[code] || code;
    const converted = this.convert(amount, 'IDR', code);
    
    const abs = Math.abs(converted);
    if (abs >= 1e9) return symbol + (converted / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return symbol + (converted / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return symbol + (converted / 1e3).toFixed(1) + 'K';
    return this.format(amount, code);
  },

  convert(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    const fromRate = this._rates[fromCurrency] || 1;
    const toRate = this._rates[toCurrency] || 1;
    return (amount / fromRate) * toRate;
  },

  _formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },

  _formatDecimal(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Format for display with +/- sign
  formatSigned(amount, type, currencyCode = null) {
    const formatted = this.format(Math.abs(amount), currencyCode);
    return type === 'income' ? '+' + formatted : '-' + formatted;
  }
};
