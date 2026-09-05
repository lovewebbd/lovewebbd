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

// --- 1. Global Auth Guard (Redirects unauthenticated users to login) ---
(function() {
    const publicPaths = ['/sign-in', '/reset-password', '/privacy-and-rules', '/help', '/404'];
    let currentPath = window.location.pathname.toLowerCase();
    
    // Normalize root path and index.html
    if (currentPath === '/' || currentPath === '/index.html') {
        // We know server.js redirects '/' to 'sign-in' internally using express res.sendFile
        // But if someone hits /index.html directly (which is home in our static config)
        // Wait, server.js says: app.get(['/home', '/dashboard'], ... index.html);
        // and app.get('/', ... sign-in/index.html)
        // If currentPath is '/', they are on sign-in page essentially.
        // If they are on '/index.html', they are on home page!
    }

    let isPublic = false;
    for (const path of publicPaths) {
        if (currentPath.includes(path)) {
            isPublic = true;
            break;
        }
    }

    if (currentPath === '/' || currentPath === '/sign-in') {
        isPublic = true;
    }

    if (!isPublic) {
        const session = localStorage.getItem('loveweb_session');
        if (!session) {
            window.location.replace('/sign-in/index.html');
        }
    }
})();

// --- 2. Global Encryption & Decryption System ---
window.LoveWebCrypto = {
    secretKey: "loveweb_secure_secret_key_2026",
    
    encrypt: function(text) {
        if (!text) return text;
        let result = "";
        for (let i = 0; i < text.length; i++) {
            // XOR encryption with secret key
            result += String.fromCharCode(text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length));
        }
        // Base64 encode for safe database storage
        return btoa(unescape(encodeURIComponent(result)));
    },
    
    decrypt: function(encryptedBase64) {
        if (!encryptedBase64) return encryptedBase64;
        try {
            let text = decodeURIComponent(escape(atob(encryptedBase64)));
            let result = "";
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length));
            }
            return result;
        } catch(e) {
            // Fallback for plain text passwords if decryption fails
            return encryptedBase64;
        }
    }
};
