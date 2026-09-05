// LoveWeb Official Top Floating Bar & Left Side Sliding Navigation Drawer
(function () {
  function getSessionUser() {
    try {
      const raw = localStorage.getItem('loveweb_session');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // Detect path depth for relative links
  const currentPath = window.location.pathname || '';
  let rootPrefix = './';
  if (
    currentPath.includes('/reset-password/') ||
    currentPath.includes('/sign-in/') ||
    currentPath.includes('/order-details/') ||
    currentPath.includes('/profile/') ||
    currentPath.includes('/settings/') ||
    currentPath.includes('/help/') ||
    currentPath.includes('/privacy-and-rules/')
  ) {
    rootPrefix = '../';
  }

  function initOfficialNavigation() {
    // Check if already injected
    if (document.getElementById('officialTopBar')) return;

    const user = getSessionUser();
    const userName = user ? (user.name || user.full_name || 'ইউজার') : 'অতিথি ইউজার';
    const userInitial = userName.trim().charAt(0).toUpperCase();
    const userEmail = user ? (user.email || user.phone || 'লাভওয়েব সদস্য') : 'অ্যাকাউন্টে সাইন-ইন করুন';
    const isUserLoggedIn = !!user;

    // মেম্বারশিপ লেভেল নির্ধারণ (ব্যয়কৃত টাকার ওপর ভিত্তি করে)
    let membershipBadgeText = 'অতিথি ভিজিটর';
    let membershipBadgeIcon = 'fa-circle-info';
    let membershipBadgeColorClass = '';
    let avatarFrameClass = '';
    let crownBadge = '';

    if (isUserLoggedIn) {
      let orders = [];
      try {
        const rawOrders = localStorage.getItem('loveweb_orders_' + (user.username || '')) || localStorage.getItem('loveweb_orders');
        if (rawOrders) orders = JSON.parse(rawOrders);
      } catch (e) {}

      let totalSpent = 0;
      if (Array.isArray(orders)) {
        totalSpent = orders.reduce((sum, item) => sum + (Number(item.price || item.amount) || 0), 0);
      }

      
      if (totalSpent >= 2000) {
        avatarFrameClass = 'premium-frame';
        crownBadge = '<div class="premium-crown"><i class="fa-solid fa-crown"></i></div><div class="premium-tag">PREMIUM</div>';
        membershipBadgeText = 'প্রিমিয়াম মেম্বার (৮% ছাড়)';
        membershipBadgeIcon = 'fa-crown';
        membershipBadgeColorClass = 'style="color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.15);"';
      } else if (totalSpent >= 1000) {
        avatarFrameClass = 'elite-frame';
        crownBadge = '<div class="elite-crown"><i class="fa-solid fa-gem"></i></div><div class="elite-tag">ELITE</div>';
        membershipBadgeText = 'এলিট মেম্বার (৪% ছাড়)';
        membershipBadgeIcon = 'fa-gem';
        membershipBadgeColorClass = 'style="color: #c084fc; border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.15);"';
      } else {
        membershipBadgeText = 'সাধারণ সদস্য';
        membershipBadgeIcon = 'fa-circle-check';
      }

    }

    const currentTheme = (typeof window.getLoveWebTheme === 'function') 
      ? window.getLoveWebTheme() 
      : (localStorage.getItem('loveweb_theme') || 'dark');
    const themeIcon = currentTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    const themeText = currentTheme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড';

    // ১. টপ ফ্লোটিং বার HTML
    const topBarHtml = `
      <header class="official-top-bar" id="officialTopBar">
        <div class="top-bar-left">
          <button class="top-bar-menu-btn" id="btnOpenSideDrawer" type="button" aria-label="মেন্যু খুলুন" title="অফিশিয়াল মেন্যু স্লাইড করুন">
            <span class="top-bar-hamburger-line"></span>
            <span class="top-bar-hamburger-line"></span>
            <span class="top-bar-hamburger-line"></span>
          </button>
          <a href="${rootPrefix}index.html" class="top-bar-brand" title="LoveWeb BD হোমপেজে যান">
            <img src="${rootPrefix}img/logo.png" alt="LoveWeb Logo" class="top-bar-logo" onerror="this.style.display='none'">
            <div class="top-bar-title-wrap">
              <div class="top-bar-title-row">
                <span class="top-bar-title font-loveweb">LoveWeb</span>
                <span class="top-bar-badge-bd">BD</span>
              </div>
              <span class="top-bar-sub-official">Official</span>
            </div>
          </a>
        </div>

        <div class="top-bar-right">
          <!-- থিম চেঞ্জার বাটন (লাইট / ডার্ক) -->
          <button class="top-bar-action-btn theme-toggle-btn" id="topBarThemeToggle" type="button" title="থিম পরিবর্তন করুন (লাইট / ডার্ক)">
            <i class="${themeIcon}"></i>
            <span class="theme-text-pill theme-text">${themeText}</span>
          </button>

          <!-- ব্যবহারকারী প্রোফাইল পিল -->
          <a href="${isUserLoggedIn ? rootPrefix + 'profile/index.html' : rootPrefix + 'sign-in/index.html'}" class="top-bar-user-pill" id="topBarUserPill" title="${isUserLoggedIn ? 'প্রোফাইল দেখুন' : 'সাইন-ইন করুন'}">
            <div class="top-bar-avatar-wrap ${avatarFrameClass}">
              ${crownBadge}
              <div class="top-bar-avatar">
                ${isUserLoggedIn ? userInitial : '<i class="fa-solid fa-user"></i>'}
              </div>
            </div>
            <span class="top-bar-user-name">${userName}</span>
          </a>
        </div>
      </header>
    `;

    // ২. লেফট সাইড স্লাইডবার (Side Drawer) & Backdrop HTML
    const sideDrawerHtml = `
      <div class="side-drawer-backdrop" id="sideDrawerBackdrop"></div>

      <aside class="official-side-drawer" id="officialSideDrawer" aria-label="অফিশিয়াল সাইড মেন্যু">
        <!-- স্লাইড ড্রয়ার হেডার -->
        <div class="drawer-header">
          <div class="drawer-brand">
            <img src="${rootPrefix}img/logo.png" alt="LoveWeb Logo" class="drawer-logo" onerror="this.style.display='none'">
            <div class="drawer-brand-text">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="drawer-title font-loveweb">LoveWeb</span>
                <span class="top-bar-badge-bd">BD</span>
              </div>
              <span class="drawer-subtitle">অফিশিয়াল প্ল্যাটফর্ম</span>
            </div>
          </div>
          <button class="drawer-close-btn" id="btnCloseSideDrawer" type="button" aria-label="মেনু বন্ধ করুন" title="বন্ধ করুন">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- ইউজার ইনফো কার্ড -->
        <div class="drawer-user-card">
          <div class="drawer-avatar-wrap ${avatarFrameClass}">${crownBadge}
            <div class="drawer-avatar">${isUserLoggedIn ? userInitial : '<i class="fa-solid fa-user"></i>'}</div>
            <span class="drawer-status-dot ${isUserLoggedIn ? 'online' : 'guest'}"></span>
          </div>
          <div class="drawer-user-info">
            <h4 class="drawer-user-name">${userName}</h4>
            <p class="drawer-user-email">${userEmail}</p>
            <div class="drawer-user-badge" ${membershipBadgeColorClass}>
              <i class="fa-solid ${membershipBadgeIcon}"></i>
              <span>${membershipBadgeText}</span>
            </div>
          </div>
        </div>

        <!-- থিম মোড পরিবর্তন সেকশন (স্লাইডিং চেকবক্স সুইচ) -->
        <div class="drawer-theme-box" id="drawerThemeBox">
          <div class="drawer-theme-label">
            <i class="fa-solid fa-circle-half-stroke" id="drawerThemeIcon"></i>
            <div class="drawer-theme-text-col">
              <span class="drawer-theme-title">থিম মোড</span>
              <span class="drawer-theme-sub" id="drawerThemeStatusText">${currentTheme === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড'}</span>
            </div>
          </div>
          <label class="theme-switch-slider-wrap" for="drawerThemeSwitch" title="ক্লিক করে থিম পরিবর্তন করুন">
            <input type="checkbox" id="drawerThemeSwitch" class="theme-switch-input" ${currentTheme === 'dark' ? 'checked' : ''} aria-label="থিম পরিবর্তন">
            <span class="theme-switch-track">
              <span class="theme-track-icon track-sun"><i class="fa-solid fa-sun"></i></span>
              <span class="theme-track-icon track-moon"><i class="fa-solid fa-moon"></i></span>
              <span class="theme-switch-thumb">
                <i class="fa-solid ${currentTheme === 'dark' ? 'fa-moon' : 'fa-sun'}" id="drawerThumbIcon"></i>
              </span>
            </span>
          </label>
        </div>

        <!-- নেভিগেশন লিংকসমূহ -->
        <nav class="drawer-nav">
          <div class="drawer-nav-section-title">প্রধান মেন্যু</div>

          <a href="${rootPrefix}index.html" class="drawer-nav-link ${currentPath === '/' || currentPath.endsWith('index.html') && !currentPath.includes('/') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-house"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">হোম</span>
              <span class="nav-sub">হোম ও প্রধান সেবা</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>
          <a href="${rootPrefix}place-order/" class="drawer-nav-link ${currentPath.includes('place-order') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-cart-shopping"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">নতুন অর্ডার করুন</span>
              <span class="nav-sub">নতুন উইশিং ওয়েবসাইট তৈরি করুন</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>

          <a href="${rootPrefix}order-details" class="drawer-nav-link ${currentPath.includes('order-details') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-gift"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">অর্ডার বিস্তারিত</span>
              <span class="nav-sub">উইশিং অর্ডারের স্ট্যাটাস ও হিস্ট্রি</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>

          <a href="${rootPrefix}profile/index.html" class="drawer-nav-link ${currentPath.includes('profile') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-user-circle"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">ব্যবহারকারী প্রোফাইল</span>
              <span class="nav-sub">ব্যক্তিগত তথ্য ও নিরাপত্তা</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>

          <a href="${rootPrefix}settings/index.html" class="drawer-nav-link ${currentPath.includes('settings') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-gear"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">অ্যাকাউন্ট সেটিংস</span>
              <span class="nav-sub">পাসওয়ার্ড ও ইমেইল পরিবর্তন</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>

          <div class="drawer-nav-section-title" style="margin-top: 14px;">সহায়তা ও তথ্য</div>

          <a href="javascript:void(0)" class="drawer-nav-link" id="drawerLiveSupportBtn">
            <div class="nav-icon-box" style="background: rgba(0, 132, 255, 0.15); color: #0084ff;"><i class="fa-brands fa-facebook-messenger"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">লাইভ চ্যাট সাপোর্ট</span>
              <span class="nav-sub">মেসেঞ্জারে সরাসরি যোগাযোগ</span>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square nav-arrow"></i>
          </a>

          <a href="${rootPrefix}help/index.html" class="drawer-nav-link ${currentPath.includes('help') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-circle-question"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">সাহায্য কেন্দ্র (FAQ)</span>
              <span class="nav-sub">ব্যবহারবিধি ও সাধারণ প্রশ্নোত্তর</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>

          <a href="${rootPrefix}privacy-and-rules/index.html" class="drawer-nav-link ${currentPath.includes('privacy-and-rules') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">গোপনীয়তা ও নিয়মাবলী</span>
              <span class="nav-sub">পলিসি ও সিকিউরিটি গাইডলাইন</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>
        </nav>

        <!-- স্লাইড ড্রয়ার ফুটার -->
        <div class="drawer-footer">
          ${isUserLoggedIn ? `
            <button class="drawer-logout-btn" id="drawerLogoutBtn" type="button">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>লগআউট করুন</span>
            </button>
          ` : `
            <a href="${rootPrefix}sign-in/index.html" class="drawer-login-btn">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <span>লগইন / সাইন আপ</span>
            </a>
          `}
          <div class="drawer-copyright">
            LoveWeb Platform v2.4 • Official Portal
          </div>
        </div>
      </aside>

      <!-- ইন-অ্যাপ লগআউট কনফার্মেশন মোডাল -->
      <div class="loveweb-logout-modal-backdrop" id="lovewebLogoutModalBackdrop" style="display: none;">
        <div class="loveweb-logout-modal-box">
          <div class="loveweb-logout-icon-wrap">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
          <h3 class="loveweb-logout-title">অ্যাকাউন্ট থেকে লগআউট</h3>
          <p class="loveweb-logout-desc">আপনি কি নিশ্চিত যে আপনার LoveWeb অ্যাকাউন্ট থেকে লগআউট করতে চান?</p>
          <div class="loveweb-logout-btn-row">
            <button type="button" class="loveweb-modal-cancel-btn" id="lovewebCancelLogoutBtn">বাতিল</button>
            <button type="button" class="loveweb-modal-confirm-btn" id="lovewebConfirmLogoutBtn">
              <i class="fa-solid fa-right-from-bracket"></i> হ্যাঁ, লগআউট করুন
            </button>
          </div>
        </div>
      </div>
    `;

    // DOM এ যুক্ত করা
    const container = document.createElement('div');
    container.innerHTML = topBarHtml + sideDrawerHtml;
    document.body.prepend(container);

    
    // Async update total spent from DB
    if (isUserLoggedIn) {
      fetch('/api/orders/' + (user.username || user.phone))
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.orders)) {
            let dbSpent = 0;
            data.orders.filter(o => o.status === 'ডেলিভারড' || o.status === 'Delivered' || o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত')
                       .forEach(o => dbSpent += (Number(o.totalPrice) || 0));
            
            if (dbSpent >= 1000) {
              let badge = '';
              let frameClass = '';
              let mBadgeHtml = '';
              
              if (dbSpent >= 2000) {
                frameClass = 'premium-frame';
                badge = '<div class="premium-crown"><i class="fa-solid fa-crown"></i></div><div class="premium-tag">PREMIUM</div>';
                mBadgeHtml = '<div class="drawer-user-badge" style="color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.15);"><i class="fa-solid fa-crown"></i><span>প্রিমিয়াম মেম্বার (৮% ছাড়)</span></div>';
              } else {
                frameClass = 'elite-frame';
                badge = '<div class="elite-crown"><i class="fa-solid fa-gem"></i></div><div class="elite-tag">ELITE</div>';
                mBadgeHtml = '<div class="drawer-user-badge" style="color: #c084fc; border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.15);"><i class="fa-solid fa-gem"></i><span>এলিট মেম্বার (৪% ছাড়)</span></div>';
              }
              
              // Update Top Bar DOM safely
              const topBarAvatarWrap = document.querySelector('.top-bar-avatar-wrap');
              if (topBarAvatarWrap) {
                topBarAvatarWrap.className = 'top-bar-avatar-wrap ' + frameClass;
                topBarAvatarWrap.innerHTML = badge + '<div class="top-bar-avatar">' + (userInitial || '<i class="fa-solid fa-user"></i>') + '</div>';
              }
              
              // Update Drawer DOM safely
              const drawerAvatarWrap = document.querySelector('.drawer-avatar-wrap');
              if (drawerAvatarWrap) {
                drawerAvatarWrap.className = 'drawer-avatar-wrap ' + frameClass;
                drawerAvatarWrap.innerHTML = badge + '<div class="drawer-avatar">' + (userInitial || '<i class="fa-solid fa-user"></i>') + '</div><span class="drawer-status-dot online"></span>';
              }
              
              const drawerUserBadge = document.querySelector('.drawer-user-badge');
              if (drawerUserBadge) {
                 drawerUserBadge.outerHTML = mBadgeHtml;
              }
            }
          }
        }).catch(e => console.log('Error fetching nav orders', e));
    }


    // বডিতে স্পেসিং ক্লাস যোগ করা যাতে ফ্লোটিং বারের নিচে কার্ড না ঢেকে যায়
    document.body.classList.add('has-official-top-bar');

    // ইভেন্ট লিসেনার সেটআপ
    setupNavigationEvents();
  }

  function setupNavigationEvents() {
    const btnOpen = document.getElementById('btnOpenSideDrawer');
    const btnClose = document.getElementById('btnCloseSideDrawer');
    const backdrop = document.getElementById('sideDrawerBackdrop');
    const drawer = document.getElementById('officialSideDrawer');
    const topBarThemeToggle = document.getElementById('topBarThemeToggle');
    const drawerThemeSwitch = document.getElementById('drawerThemeSwitch');
    const drawerThemeStatusText = document.getElementById('drawerThemeStatusText');
    const drawerThumbIcon = document.getElementById('drawerThumbIcon');
    const drawerLogoutBtn = document.getElementById('drawerLogoutBtn');
    const drawerLiveSupportBtn = document.getElementById('drawerLiveSupportBtn');

    function openDrawer() {
      if (drawer) drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      if (btnOpen) btnOpen.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      if (btnOpen) btnOpen.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    if (btnOpen) btnOpen.addEventListener('click', openDrawer);
    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Escape চেপে ড্রয়ার বন্ধ করা
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // স্লাইডিং চেকবক্স সুইচ পরিবর্তন হ্যান্ডলার (বামে বা ডানে স্লাইড হবে)
    if (drawerThemeSwitch) {
      drawerThemeSwitch.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        if (typeof window.setLoveWebTheme === 'function') {
          window.setLoveWebTheme(newTheme);
        }
        updateDrawerThemeSwitch(newTheme);
      });
    }

    // টপ বার থিম টগল বাটন ক্লিক হ্যান্ডলার
    if (topBarThemeToggle) {
      topBarThemeToggle.addEventListener('click', () => {
        if (typeof window.toggleLoveWebTheme === 'function') {
          const newTheme = window.toggleLoveWebTheme();
          updateDrawerThemeSwitch(newTheme);
        }
      });
    }

    function updateDrawerThemeSwitch(theme) {
      if (drawerThemeSwitch) {
        drawerThemeSwitch.checked = (theme === 'dark');
      }
      if (drawerThemeStatusText) {
        drawerThemeStatusText.innerText = (theme === 'dark') ? 'ডার্ক মোড' : 'লাইট মোড';
      }
      if (drawerThumbIcon) {
        drawerThumbIcon.className = `fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`;
      }
    }

    // লাইভ চ্যাট সাপোর্ট বাটন
    if (drawerLiveSupportBtn) {
      drawerLiveSupportBtn.addEventListener('click', () => {
        closeDrawer();
        const messengerWidget = document.getElementById('messengerWidget') || document.querySelector('.messenger-float-btn');
        if (messengerWidget) {
          messengerWidget.click();
        } else {
          window.open('https://m.me/lovewebbd', '_blank');
        }
      });
    }

    // ইন-অ্যাপ মোডাল ভিত্তিক নিশ্চিত লগআউট হ্যান্ডলার
    const logoutModal = document.getElementById('lovewebLogoutModalBackdrop');
    const cancelLogoutBtn = document.getElementById('lovewebCancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('lovewebConfirmLogoutBtn');

    function openLogoutModal() {
      closeDrawer();
      if (logoutModal) {
        logoutModal.style.display = 'flex';
      } else {
        performDirectLogout();
      }
    }

    function closeLogoutModal() {
      if (logoutModal) {
        logoutModal.style.display = 'none';
      }
    }

    function performDirectLogout() {
      localStorage.removeItem('loveweb_session');
      localStorage.removeItem('user_token');
      sessionStorage.clear();
      // ফ্রন্টএন্ডে স্মুথ নোটিফিকেশন প্রদান যদি ফাংশন থাকে
      if (typeof showNotification === 'function') {
        showNotification('সফলভাবে লগআউট করা হয়েছে।', 'success');
      }
      setTimeout(() => {
        window.location.href = `${rootPrefix}sign-in/index.html`;
      }, 150);
    }

    // গ্লোবাল এক্সেস প্রদান
    window.lovewebOpenLogoutModal = openLogoutModal;
    window.lovewebLogout = openLogoutModal;
    window.lovewebDirectLogout = performDirectLogout;

    if (drawerLogoutBtn) {
      drawerLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openLogoutModal();
      });
    }

    if (cancelLogoutBtn) {
      cancelLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeLogoutModal();
      });
    }

    if (confirmLogoutBtn) {
      confirmLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        confirmLogoutBtn.disabled = true;
        confirmLogoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> লগআউট হচ্ছে...';
        performDirectLogout();
      });
    }

    if (logoutModal) {
      logoutModal.addEventListener('click', (e) => {
        if (e.target === logoutModal) {
          closeLogoutModal();
        }
      });
    }

    // থিম চেঞ্জ ইভেন্ট পর্যবেক্ষণ
    window.addEventListener('loveweb-theme-changed', (e) => {
      const theme = e.detail ? e.detail.theme : 'dark';
      updateDrawerThemeSwitch(theme);
    });

    // লগইন থাকলে 'সাইন-ইন পেজে ফিরে যান' এর স্থলে 'মূল পেজে ফিরে যান' সিঙ্ক করা
    function syncPageAuthReturnLinks() {
      if (currentPath.includes('/sign-in/')) return;

      const user = getSessionUser();
      const isUserLoggedIn = !!user;

      const helpBtn = document.getElementById('helpReturnBtn');
      const policyBtn = document.getElementById('policyReturnBtn');
      const resetBtn = document.getElementById('resetBackLink') || document.getElementById('newPasswordBackLink') || document.getElementById('verificationBackLink');
      const footerAuthHelp = document.getElementById('helpFooterAuthLink');
      const footerAuthPolicy = document.getElementById('policyFooterAuthLink');
      const brandLogoLinkHelp = document.getElementById('helpBrandLogoLink');
      const brandLogoLinkPolicy = document.getElementById('policyBrandLogoLink');
      const brandLogoLinkReset = document.getElementById('resetBrandLogoLink');

      if (isUserLoggedIn) {
        if (helpBtn) {
          helpBtn.href = `${rootPrefix}index.html`;
          helpBtn.innerHTML = '<i class="fa-solid fa-house"></i> মূল পেজে ফিরে যান';
        }
        if (policyBtn) {
          policyBtn.href = `${rootPrefix}index.html`;
          policyBtn.innerHTML = '<i class="fa-solid fa-house"></i> মূল পেজে ফিরে যান';
        }
        if (resetBtn) {
          resetBtn.href = `${rootPrefix}index.html`;
          resetBtn.innerHTML = '<i class="fa-solid fa-house"></i> মূল পেজে ফিরে যান';
        }
        if (footerAuthHelp) {
          footerAuthHelp.href = `${rootPrefix}index.html`;
          footerAuthHelp.innerHTML = '<i class="fa-solid fa-house"></i> মূল পেজ';
        }
        if (footerAuthPolicy) {
          footerAuthPolicy.href = `${rootPrefix}index.html`;
          footerAuthPolicy.innerHTML = '<i class="fa-solid fa-house"></i> মূল পেজ';
        }
        if (brandLogoLinkHelp) brandLogoLinkHelp.href = `${rootPrefix}index.html`;
        if (brandLogoLinkPolicy) brandLogoLinkPolicy.href = `${rootPrefix}index.html`;
        if (brandLogoLinkReset) brandLogoLinkReset.href = `${rootPrefix}index.html`;

        // অন্যান্য যেকোনো লিঙ্ক যেখানে সাইন-ইন পেজে যাওয়ার কথা বলা হয়েছে
        document.querySelectorAll('a').forEach(a => {
          const text = (a.textContent || '').trim();
          if (text.includes('সাইন-ইন পেজে ফিরে যান') || text.includes('সাইন-ইন পেজে যান')) {
            a.href = `${rootPrefix}index.html`;
            a.innerHTML = '<i class="fa-solid fa-house"></i> মূল পেজে ফিরে যান';
          }
        });
      } else {
        if (helpBtn) {
          helpBtn.href = `${rootPrefix}sign-in/index.html`;
          helpBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> সাইন-ইন পেজে ফিরে যান';
        }
        if (policyBtn) {
          policyBtn.href = `${rootPrefix}sign-in/index.html`;
          policyBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> সাইন-ইন পেজে ফিরে যান';
        }
        if (resetBtn) {
          resetBtn.href = `${rootPrefix}sign-in/index.html`;
          resetBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> সাইন-ইন পেজে ফিরে যান';
        }
        if (footerAuthHelp) {
          footerAuthHelp.href = `${rootPrefix}sign-in/index.html`;
          footerAuthHelp.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> সাইন ইন';
        }
        if (footerAuthPolicy) {
          footerAuthPolicy.href = `${rootPrefix}sign-in/index.html`;
          footerAuthPolicy.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> সাইন ইন';
        }
      }
    }

    syncPageAuthReturnLinks();
  }

  // DOM প্রস্তুত হলে ইনিশিয়ালাইজ করুন
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOfficialNavigation);
  } else {
    initOfficialNavigation();
  }
})();
