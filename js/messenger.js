/**
 * LoveWeb Live Messenger Floating Widget
 * Styled in LoveWeb's Cyber-Romantic Neon Theme (#ff2a6d, #b800ff, #05d9e8)
 * Compact size, transparent background, and ultra-smooth floating animation
 * Messenger Username: lovewebbd
 * Target URL: https://m.me/lovewebbd
 */

(function () {
  const MESSENGER_URL = 'https://m.me/lovewebbd';

  // Injected CSS Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .loveweb-messenger-widget {
      position: fixed;
      bottom: 22px;
      right: 22px;
      z-index: 999999;
      font-family: 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Compact & Floating Button with Transparent Background */
    .messenger-fab {
      width: 48px;
      height: 48px;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0;
      outline: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      animation: lovewebFloat 3.6s ease-in-out infinite;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Subtle Levitation / Floating Animation */
    @keyframes lovewebFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }

    .messenger-fab:hover {
      transform: scale(1.14) rotate(-3deg) translateY(-2px);
      animation-play-state: paused;
    }

    .messenger-fab:active {
      transform: scale(0.92);
    }

    /* SVG Icon & Neon Aura Glow Animation */
    .messenger-fab svg {
      width: 46px;
      height: 46px;
      display: block;
      animation: lovewebNeonPulse 3s ease-in-out infinite alternate;
      transition: filter 0.3s ease;
    }

    .messenger-fab:hover svg {
      filter: drop-shadow(0 6px 20px rgba(255, 42, 109, 0.8)) drop-shadow(0 0 14px rgba(184, 0, 255, 0.6)) drop-shadow(0 0 8px rgba(5, 217, 232, 0.5));
    }

    @keyframes lovewebNeonPulse {
      0% {
        filter: drop-shadow(0 4px 10px rgba(255, 42, 109, 0.5)) drop-shadow(0 0 8px rgba(184, 0, 255, 0.35));
      }
      100% {
        filter: drop-shadow(0 5px 16px rgba(255, 42, 109, 0.75)) drop-shadow(0 0 14px rgba(5, 217, 232, 0.5));
      }
    }

    /* Soft Animated Wave Ring */
    .messenger-pulse {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 42, 109, 0.7);
      animation: lovewebAuraRing 2.6s cubic-bezier(0.24, 0, 0.38, 1) infinite;
      pointer-events: none;
    }

    @keyframes lovewebAuraRing {
      0% {
        transform: scale(0.85);
        opacity: 0.9;
        border-color: rgba(255, 42, 109, 0.8);
      }
      50% {
        border-color: rgba(184, 0, 255, 0.6);
      }
      100% {
        transform: scale(1.35);
        opacity: 0;
        border-color: rgba(5, 217, 232, 0);
      }
    }

    /* Online Status Indicator (Compact) */
    .messenger-online-badge {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
      background: #00E676;
      border: 2px solid #0d0e15;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(0, 230, 118, 0.95);
      z-index: 2;
    }

    /* Floating Chat Popup Container matching LoveWeb Theme */
    .messenger-chat-box {
      position: absolute;
      bottom: 64px;
      right: 0;
      width: 310px;
      background: rgba(23, 25, 35, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 42, 109, 0.35);
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 42, 109, 0.25);
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px) scale(0.95);
      transform-origin: bottom right;
      transition: all 0.28s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .messenger-chat-box.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0) scale(1);
    }

    .messenger-header {
      background: linear-gradient(135deg, #FF2A6D 0%, #9900FF 60%, #05D9E8 100%);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    }

    .messenger-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .messenger-header-icon-box {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .messenger-header-icon-box svg {
      width: 26px;
      height: 26px;
    }

    .messenger-header-title {
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
    }

    .messenger-header-sub {
      font-size: 0.74rem;
      opacity: 0.95;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: #00E676;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 4px #00E676;
    }

    .messenger-close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      transition: background 0.2s;
    }

    .messenger-close-btn:hover {
      background: rgba(255, 255, 255, 0.35);
    }

    .messenger-body {
      padding: 16px 14px;
      color: #e6e6e6;
    }

    .messenger-msg {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 11px 13px;
      font-size: 0.88rem;
      line-height: 1.5;
      margin-bottom: 14px;
      color: #f1f1f1;
      text-align: left;
    }

    .messenger-cta-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px;
      border-radius: 12px;
      background: linear-gradient(135deg, #FF2A6D 0%, #9900FF 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.94rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(255, 42, 109, 0.4);
      transition: all 0.25s ease;
    }

    .messenger-cta-btn:hover {
      background: linear-gradient(135deg, #FF2A6D 0%, #05D9E8 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(255, 42, 109, 0.6);
    }

    .messenger-direct-hint {
      text-align: center;
      margin-top: 8px;
      font-size: 0.76rem;
      color: rgba(255, 255, 255, 0.6);
    }

    @media (max-width: 480px) {
      .loveweb-messenger-widget {
        bottom: 16px;
        right: 16px;
      }
      .messenger-fab {
        width: 44px;
        height: 44px;
      }
      .messenger-fab svg {
        width: 42px;
        height: 42px;
      }
      .messenger-chat-box {
        width: calc(100vw - 32px);
        right: 0;
        bottom: 58px;
      }
    }
  `;
  document.head.appendChild(style);

  // LoveWeb Theme Messenger SVG Vector
  // Bubble: LoveWeb signature gradient (#FF2A6D -> #9900FF -> #05D9E8)
  // Lightning Bolt: Crisp pure white (#FFFFFF)
  function getLoveWebMessengerSvg(size = 46) {
    return `
      <svg viewBox="0 0 994 994" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lovewebNeonThemeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF2A6D"/>
            <stop offset="55%" stop-color="#A020F0"/>
            <stop offset="100%" stop-color="#05D9E8"/>
          </linearGradient>
        </defs>
        <!-- Themed Messenger Speech Bubble -->
        <path fill="url(#lovewebNeonThemeGrad)" d="M497,0C217,0,0,205.1,0,482.1C0,627,59.4,752.2,156.1,838.7c8.1,7.3,13,17.4,13.4,28.3l2.7,88.4c0.9,28.2,30,46.5,55.8,35.2l98.6-43.5c8.4-3.7,17.7-4.4,26.5-2c45.3,12.5,93.6,19.1,143.9,19.1c280,0,497-205.1,497-482.1S777,0,497,0z"/>
        <!-- Crisp White Lightning Bolt -->
        <path fill="#FFFFFF" d="M198.6,623.1l146-231.6c23.2-36.8,73-46,107.8-19.9l116.1,87.1c10.7,8,25.3,7.9,35.9-0.1l156.8-119c20.9-15.9,48.3,9.2,34.2,31.4L649.5,602.5c-23.2,36.8-73,46-107.8,19.9l-116.1-87.1c-10.7-8-25.3-7.9-35.9,0.1L232.8,654.5C211.9,670.4,184.5,645.3,198.6,623.1z"/>
      </svg>
    `;
  }

  // Construct Widget DOM
  const widget = document.createElement('div');
  widget.className = 'loveweb-messenger-widget';
  widget.id = 'lovewebMessengerWidget';
  widget.innerHTML = `
    <!-- Floating Messenger Chat Box -->
    <div class="messenger-chat-box" id="messengerChatBox">
      <div class="messenger-header">
        <div class="messenger-header-info">
          <div class="messenger-header-icon-box">
            ${getLoveWebMessengerSvg(26)}
          </div>
          <div>
            <h4 class="messenger-header-title">LoveWeb সাপোর্ট</h4>
            <div class="messenger-header-sub">
              <span class="status-dot"></span> অনলাইন • দ্রুত উত্তর দেওয়া হয়
            </div>
          </div>
        </div>
        <button class="messenger-close-btn" id="messengerCloseBtn" title="বন্ধ করুন">✕</button>
      </div>
      <div class="messenger-body">
        <div class="messenger-msg">
          👋 আসসালামু আলাইকুম! LoveWeb-এ আপনাকে স্বাগতম। কাস্টম উইশিং সাইট তৈরি, অর্ডার কিংবা যেকোনো সহযোগিতার জন্য সরাসরি আমাদের মেসেঞ্জারে বার্তা পাঠান।
        </div>
        <a href="${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" class="messenger-cta-btn" id="messengerRedirectBtn">
          <span style="display: flex; align-items: center; width: 20px; height: 20px;">
            ${getLoveWebMessengerSvg(18)}
          </span>
          <span>মেসেঞ্জারে চ্যাট শুরু করুন</span>
        </a>
        <div class="messenger-direct-hint">
          অফিসিয়াল মেসেঞ্জার: <strong>@lovewebbd</strong>
        </div>
      </div>
    </div>

    <!-- Floating Compact Messenger Button: LoveWeb Neon Theme & Smooth Levitation -->
    <button class="messenger-fab" id="messengerFab" title="লাইভ মেসেঞ্জারে চ্যাট করুন (@lovewebbd)" aria-label="লাইভ মেসেঞ্জারে চ্যাট করুন">
      <div class="messenger-pulse"></div>
      <div class="messenger-online-badge"></div>
      ${getLoveWebMessengerSvg(46)}
    </button>
  `;

  // Attach to body when DOM is ready
  function init() {
    if (!document.getElementById('lovewebMessengerWidget')) {
      document.body.appendChild(widget);

      const fab = document.getElementById('messengerFab');
      const chatBox = document.getElementById('messengerChatBox');
      const closeBtn = document.getElementById('messengerCloseBtn');

      let isOpen = false;

      function toggleChat(e) {
        if (e) e.stopPropagation();
        isOpen = !isOpen;
        if (isOpen) {
          chatBox.classList.add('open');
        } else {
          chatBox.classList.remove('open');
        }
      }

      fab.addEventListener('click', toggleChat);
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = false;
        chatBox.classList.remove('open');
      });

      // Close when clicked outside
      document.addEventListener('click', (e) => {
        if (isOpen && !widget.contains(e.target)) {
          isOpen = false;
          chatBox.classList.remove('open');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
