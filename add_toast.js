import fs from 'fs';
let html = fs.readFileSync('place-order/index.html', 'utf8');

const cssToAdd = `
    /* Dynamic Order Notifications */
    .order-toast-container {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .order-toast {
      background: var(--admin-card);
      border: 1px solid var(--primary-pink);
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 10px 25px rgba(255, 42, 109, 0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateX(-120%);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    .order-toast.show {
      transform: translateX(0);
      opacity: 1;
    }
    .toast-icon {
      background: rgba(255, 42, 109, 0.1);
      color: var(--primary-pink);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .toast-content {
      display: flex;
      flex-direction: column;
    }
    .toast-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 2px;
    }
    .toast-time {
      font-size: 0.75rem;
      color: var(--text-sub);
    }
`;

const jsToAdd = `
    // Dynamic Notifications Logic
    const names = ['করিম', 'রহিম', 'সাদিয়া', 'রাফি', 'জিসান', 'নুসরাত', 'আরিফ', 'তানভীর', 'শাওন', 'মুমতাহিনা'];
    const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'কুমিল্লা', 'গাজীপুর'];
    const packages = ['Regular', 'Exclusive', 'Premium'];
    const times = ['২ মিনিট আগে', '৫ মিনিট আগে', '১২ মিনিট আগে', '১ ঘণ্টা আগে', 'কিছুক্ষণ আগে'];

    function createOrderToast() {
      const name = names[Math.floor(Math.random() * names.length)];
      const district = districts[Math.floor(Math.random() * districts.length)];
      const pkg = packages[Math.floor(Math.random() * packages.length)];
      const time = times[Math.floor(Math.random() * times.length)];

      const container = document.getElementById('orderToastContainer');
      const toast = document.createElement('div');
      toast.className = 'order-toast';
      
      toast.innerHTML = \`
        <div class="toast-icon">
          <i class="fa-solid fa-cart-arrow-down"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">\${name} (\${district}) একটি \${pkg} প্যাকেজ অর্ডার করেছেন!</div>
          <div class="toast-time">\${time}</div>
        </div>
      \`;
      
      container.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);
      
      // Remove after some time
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    }

    function startDynamicNotifications() {
      // First toast after 3 seconds
      setTimeout(() => {
        createOrderToast();
        // Subsequent toasts random between 15-30 seconds
        setInterval(() => {
          createOrderToast();
        }, Math.floor(Math.random() * 15000) + 15000);
      }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
      // Existing auth logic
      const sessionRaw = localStorage.getItem('loveweb_session');
      if (sessionRaw) {
        try {
          const user = JSON.parse(sessionRaw);
          if(user.phone) {
            document.getElementById('orderContactPhone').value = user.phone;
          }
        } catch(e) {}
      }
      
      // Start dynamic notifications
      startDynamicNotifications();
    });
`;

html = html.replace('/* Custom Scrollbar */', cssToAdd + '\n    /* Custom Scrollbar */');

const toastContainerHTML = `
  <div class="order-toast-container" id="orderToastContainer"></div>
`;
html = html.replace('</body>', toastContainerHTML + '\n</body>');

html = html.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);/, jsToAdd);

fs.writeFileSync('place-order/index.html', html);
console.log('place-order/index.html updated with dynamic notifications.');
