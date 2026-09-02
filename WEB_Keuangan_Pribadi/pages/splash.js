/* ═══════════════════════════════════════════════════════════
   FinPulse — Splash / Onboarding Page
   ═══════════════════════════════════════════════════════════ */

const PageSplash = {
  render() {
    return `
      <div class="splash-page">
        <div class="splash-brand">
          <span class="text-display-mobile text-primary tracking-tighter">FinPulse</span>
        </div>

        <div class="splash-carousel hide-scrollbar" id="splash-carousel">
          <!-- Slide 1 -->
          <div class="splash-slide">
            <div class="splash-image">
              <div class="splash-image-glow" style="background:var(--color-primary)"></div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ToBsN8UDgbGpY6gz2OLg0A786iz5RYuQWwqAGLvktubXX4UUsjh_73v5K-NM2AqtWdfyfdlvDHGIwVC7msj7mRFOXrIurYePStjjjLy7G0r_VBw1u1rz2CBqqdVct24AiTjkunCbAjvwnIFkZomA46zU7oTjhP_T9qK_lJwWvdLxzzl4tWoQcv5psDz3mqFuA-3XDEGxotKF17fiokzYPVdeJwBkRPpQWcKWUBYoquxoK8JMHSub2Q" alt="Financial Freedom" />
            </div>
            <div class="splash-text">
              <h1>${I18n.t('splash.slide1.title')}<span class="text-secondary">${I18n.t('splash.slide1.highlight')}</span></h1>
              <p>${I18n.t('splash.slide1.desc')}</p>
            </div>
          </div>

          <!-- Slide 2 -->
          <div class="splash-slide">
            <div class="splash-image">
              <div class="splash-image-glow" style="background:var(--color-secondary)"></div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo2FFCxsIFnKMIh2USa8--n9z-okD8HKpgbQRr_NBe99aEKumKvV-ZX1YfBtaeqPNhwXKICqea0ZgF3Y2LG60dxuC97Hl_PhmgaSVXrSxfQfe-gx0vmzP0KUfKk1FPCVu3bZnwpEy1vUmwM7KOB-XxfrA24jHWbhWcZ4YKuQ4FnvWgOkYSOBWRKZAua3nydKo_bTMt2lFLLM44_NV__jTsYWkDgXENc5WoGqlupgtMKXWePoKGj3JwwA" alt="Smart Saving" />
            </div>
            <div class="splash-text">
              <h1>${I18n.t('splash.slide2.title')}<span class="text-tertiary">${I18n.t('splash.slide2.highlight')}</span></h1>
              <p>${I18n.t('splash.slide2.desc')}</p>
            </div>
          </div>

          <!-- Slide 3 -->
          <div class="splash-slide">
            <div class="splash-image">
              <div class="splash-image-glow" style="background:var(--color-primary-container)"></div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVjffRXwmhnxfm-iO9KLHTwGjQbiogiWw4BHnjxL5d_t84bgEc---OMFcmh5mNfMEvUPIDVic20xXqwzM6j2MoiBcktrrF0ZhQnLNlYyLnO3flJngfK7gj4-rvZaFGA1NA8nVOgwQFdLletEoHYjRgm95Quhm0KlGI8qerJhY8W9P7aTehtmPIoyuD2pqRne-jkh5RJlA7tGezCANgn1ifOqBfmrcrO7iSmK1vCeHKsQOoCX22YpyCwg" alt="Easy Tracking" />
            </div>
            <div class="splash-text">
              <h1>${I18n.t('splash.slide3.title')}<span class="text-primary">${I18n.t('splash.slide3.highlight')}</span></h1>
              <p>${I18n.t('splash.slide3.desc')}</p>
            </div>
          </div>
        </div>

        <div class="splash-bottom">
          <div class="splash-dots" id="splash-dots">
            <div class="splash-dot active"></div>
            <div class="splash-dot"></div>
            <div class="splash-dot"></div>
          </div>
          <button class="btn btn-primary btn-lg btn-full" onclick="PageSplash.getStarted()" style="box-shadow:var(--shadow-primary-glow);text-transform:uppercase;letter-spacing:0.08em;">
            ${I18n.t('splash.getStarted')}
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">arrow_forward</span>
          </button>
          <div class="watermark" style="padding-top:32px;">
            <p class="text-watermark text-outline">${I18n.t('watermark')}</p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const carousel = document.getElementById('splash-carousel');
    const dots = document.getElementById('splash-dots');
    if (!carousel || !dots) return;

    carousel.addEventListener('scroll', () => {
      const scrollPos = carousel.scrollLeft;
      const slideWidth = carousel.clientWidth;
      const activeIdx = Math.round(scrollPos / slideWidth);
      
      Array.from(dots.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    });
  },

  getStarted() {
    localStorage.setItem('finpulse_seen_splash', '1');
    App.navigate('login');
  }
};
