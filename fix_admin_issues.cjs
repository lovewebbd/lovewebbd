const fs = require('fs');
let code = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add Membership to Sidebar
const sidebarRegex = /<div class="menu-item" onclick="switchTab\('packages'\)">\s*<i class="fa-solid fa-box"><\/i> <span>Packages<\/span>\s*<\/div>/;
const sidebarReplace = `<div class="menu-item" onclick="switchTab('packages')">
          <i class="fa-solid fa-box"></i> <span>Packages</span>
        </div>
        <div class="menu-item" onclick="switchTab('membership')">
          <i class="fa-solid fa-crown"></i> <span>Membership</span>
        </div>`;
code = code.replace(sidebarRegex, sidebarReplace);

// 2. Fix switchTab logic for adding active class
const switchTabRegex = /if \(tab === 'dashboard'\) \{[\s\S]*?document\.getElementById\('view-settings'\)\.classList\.remove\('hidden'\);\s*document\.getElementById\('pageTitle'\)\.innerText = 'Payment Settings';\s*loadSettings\(\);\s*\}/;

const switchTabReplace = `const tabs = ['dashboard', 'allOrders', 'pendingPayment', 'ongoingOrder', 'coupons', 'packages', 'membership', 'settings', 'security'];
      const index = tabs.indexOf(tab);
      if(index !== -1) {
         document.querySelectorAll('.menu-item')[index].classList.add('active');
      }

      if (tab === 'dashboard') {
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Dashboard Overview';
        loadDashboardStats();
      } else if (tab === 'allOrders') {
        document.getElementById('view-orders').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'All Orders';
        currentOrdersFilter = 'all';
        applyFilters();
      } else if (tab === 'pendingPayment') {
        document.getElementById('view-orders').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Pending Payment';
        currentOrdersFilter = 'pending_payment';
        applyFilters();
      } else if (tab === 'ongoingOrder') {
        document.getElementById('view-orders').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Ongoing Orders';
        currentOrdersFilter = 'ongoing';
        applyFilters();
      } else if (tab === 'packages') {
        document.getElementById('view-packages').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Package Settings';
        loadPackages();
      } else if (tab === 'membership') {
        document.getElementById('view-membership').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Membership Settings';
        loadMembership();
      } else if (tab === 'settings') {
        document.getElementById('view-settings').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Payment Settings';
        loadSettings();`;
        
// I need to be careful with replace so I'll just write a custom replacer script.
