// LoveWeb Global Theme Manager (Dark & Romantic Light Theme)
(function () {
  const THEME_KEY = 'loveweb_theme';

  // সার্বজনীন ডায়নামিক নোটিফিকেশন বার হেল্পার
  window.showNotification = window.showNotification || function (msg, type = 'error') {
    let toast = document.getElementById('notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'notification';
      toast.className = 'notification-toast';
      document.body.appendChild(toast);
    }
    let msgEl = document.getElementById('notifMessage') || document.getElementById('notif-message') || toast.querySelector('span');
    if (!msgEl) {
      msgEl = document.createElement('span');
      msgEl.id = 'notifMessage';
      toast.appendChild(msgEl);
    }
    msgEl.innerText = msg;
    toast.className = `notification-toast show ${type}`;

    if (window._lovewebNotifTimer) clearTimeout(window._lovewebNotifTimer);
    window._lovewebNotifTimer = setTimeout(() => {
      if (toast) toast.classList.remove('show');
    }, 3200);
  };

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // ডিফল্ট ডার্ক রোমান্টিক থিম
  }

  function applyTheme(theme, notify = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // সব থিম টগল বাটনের আইকন ও টেক্সট আপডেট
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('data-current-theme', theme);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
      const text = btn.querySelector('.theme-text');
      if (text) {
        text.innerText = theme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড';
      }
    });

    window.dispatchEvent(new CustomEvent('loveweb-theme-changed', { detail: { theme } }));

    if (notify && typeof window.showNotification === 'function') {
      window.showNotification(
        theme === 'light' ? '☀️ রোমান্টিক লাইট থিম সক্রিয় করা হয়েছে' : '🌙 ডার্ক প্রিমিয়াম থিম সক্রিয় করা হয়েছে',
        'success'
      );
    }
  }

  // স্ক্রিপ্ট লোড হওয়ার সাথে সাথে থিম সেট করা (যাতে কোনো ফ্লিকার না হয়)
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme, false);

  window.toggleLoveWebTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
    return next;
  };

  window.getLoveWebTheme = function () {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  };

  window.setLoveWebTheme = function (theme) {
    if (theme === 'light' || theme === 'dark') {
      applyTheme(theme, true);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme(), false);
  });
})();
