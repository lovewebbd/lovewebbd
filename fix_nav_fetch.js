import fs from 'fs';
let navCode = fs.readFileSync('js/official-nav.js', 'utf8');

const updateNavDomJs = `
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
`;

navCode = navCode.replace(
  /\/\/\s*বডিতে স্পেসিং ক্লাস যোগ করা যাতে ফ্লোটিং বারের নিচে কার্ড না ঢেকে যায়/,
  match => updateNavDomJs + '\n\n    ' + match
);

fs.writeFileSync('js/official-nav.js', navCode);
console.log('Fixed fetch logic in nav.');
