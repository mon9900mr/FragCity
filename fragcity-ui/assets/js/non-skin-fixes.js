(() => {
  'use strict';
  // Non-skin pages only. Kept separate from app.js because that file also
  // powers the skin catalogue; this script must never be loaded by skins.html.
  const path = location.pathname.toLowerCase();
  if (path.endsWith('/skins.html') || path.endsWith('/skin.html')) return;

  // Persian is the sole UI language on non-skin pages; preserve RTL even if an
  // older browser preference previously stored English. The skin page is excluded.
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  try { localStorage.setItem('fragcity-language', 'fa'); } catch (_) {}
  const languageButton = document.querySelector('.language-toggle');
  if (languageButton) languageButton.remove();
  const languageStyle = document.createElement('style');
  languageStyle.textContent = '.topbar, .topbar nav, footer { direction:rtl } .topbar nav { margin-inline:auto } footer .fc-powered-by { direction:ltr; white-space:nowrap } #fc-non-skin-notice { direction:rtl }';
  document.head.appendChild(languageStyle);

  const backendBase = () => String(
    window.FRAGCITY_BACKEND_URL ||
    document.querySelector('meta[name="fragcity-backend-url"]')?.content ||
    ''
  ).trim();

  function notice(message) {
    let node = document.getElementById('fc-non-skin-notice');
    if (!node) {
      node = document.createElement('div');
      node.id = 'fc-non-skin-notice';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      Object.assign(node.style, {
        position: 'fixed', zIndex: '99999', left: '50%', bottom: '24px',
        transform: 'translateX(-50%)', width: 'min(560px, calc(100vw - 32px))',
        padding: '14px 18px', border: '1px solid #e5484d', borderRadius: '10px',
        background: '#171719', color: '#fff', boxShadow: '0 12px 40px #0008',
        font: '14px/1.5 system-ui, sans-serif', textAlign: 'start'
      });
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.hidden = false;
  }

  // Capture before app.js handlers so the non-skin pages get a correct,
  // non-skin-specific message and never navigate to PHP source on static hosts.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-backend-href]');
    if (!link) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const target = link.getAttribute('data-backend-href') || '';
    const base = backendBase();
    if (!base) {
      notice('این بخش به بک‌اند PHP نیاز دارد. آدرس واقعی سایت PHP را در FRAGCITY_BACKEND_URL تنظیم کن؛ پیش‌نمایش استاتیک نمی‌تواند PHP را اجرا کند.');
      return;
    }

    try {
      const baseUrl = new URL(base, location.href);
      if (!/^https?:$/.test(baseUrl.protocol)) throw new Error('protocol');
      const cleanTarget = target.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
      const destination = new URL(cleanTarget, baseUrl.href.endsWith('/') ? baseUrl.href : baseUrl.href + '/');
      if (destination.origin !== baseUrl.origin) throw new Error('origin');
      location.assign(destination.href);
    } catch (_) {
      notice('آدرس بک‌اند معتبر نیست. مقدار FRAGCITY_BACKEND_URL را بررسی کن.');
    }
  }, true);

  const form = document.querySelector('#support-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const base = backendBase();
      if (!base) {
        notice('تیکت ثبت نشد؛ این فرم فقط پیش‌نمایش است. برای ثبت واقعی، بک‌اند PHP و مسیر پشتیبانی باید در دسترس باشند.');
        return;
      }
      try {
        const url = new URL('index.php?page=support', base.endsWith('/') ? base : base + '/');
        if (!/^https?:$/.test(url.protocol)) throw new Error('protocol');
        location.assign(url.href);
      } catch (_) {
        notice('آدرس بک‌اند معتبر نیست. مقدار FRAGCITY_BACKEND_URL را بررسی کن.');
      }
    }, true);
  }
})();