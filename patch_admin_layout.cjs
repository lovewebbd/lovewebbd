const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Sidebar menu update
const oldSidebar = `<div class="menu-item active" onclick="switchTab('dashboard')">
          <i class="fa-solid fa-chart-line"></i> <span>Dashboard (All)</span>
        </div>
        <div class="menu-item" onclick="switchTab('pendingPayment')">`;
const newSidebar = `<div class="menu-item active" onclick="switchTab('dashboard')">
          <i class="fa-solid fa-chart-line"></i> <span>Dashboard</span>
        </div>
        <div class="menu-item" onclick="switchTab('allOrders')">
          <i class="fa-solid fa-list-ul"></i> <span>All Orders</span>
        </div>
        <div class="menu-item" onclick="switchTab('pendingPayment')">`;
html = html.replace(oldSidebar, newSidebar);


// 2. Stats grid update
const oldStatsGrid = `<div class="stats-grid">
          
          <div class="stat-card">
            <div class="stat-title">Total Orders</div>
            <div class="stat-value" id="statTotal">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Pending Payments</div>
            <div class="stat-value" style="color: var(--admin-warning);" id="statPendingPay">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Pending Deliveries</div>
            <div class="stat-value" style="color: var(--admin-primary);" id="statPendingDel">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Rejected Orders</div>
            <div class="stat-value" style="color: var(--admin-danger);" id="statRejected">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Revenue</div>
            <div class="stat-value" style="color: var(--admin-success);" id="statRevenue">৳ 0</div>
          </div>
        </div>`;
const newStatsGrid = `<div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Total Revenue</div>
            <div class="stat-value" style="color: var(--admin-success);" id="statRevenue">৳ 0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Pending Orders</div>
            <div class="stat-value" style="color: var(--admin-primary);" id="statPendingDel">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Orders</div>
            <div class="stat-value" id="statTotal">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Pending Payments</div>
            <div class="stat-value" style="color: var(--admin-danger);" id="statPendingPay">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Delivered Orders</div>
            <div class="stat-value" style="color: var(--admin-success);" id="statDelivered">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Half Payments</div>
            <div class="stat-value" style="color: var(--admin-warning);" id="statHalfPay">0</div>
          </div>
        </div>`;
html = html.replace(oldStatsGrid, newStatsGrid);


// 3. Move orders-section to new view-orders
const oldSectionHTML = `        <div class="orders-section">
          <div class="orders-header">`;
const newSectionHTML = `      </div>

      <!-- Orders View -->
      <div id="view-orders" class="hidden">
        <div class="orders-section">
          <div class="orders-header">`;
html = html.replace(oldSectionHTML, newSectionHTML);


// 4. Update JavaScript currentMenuTab logic
const oldHiddenLogic = `document.getElementById('view-dashboard').classList.add('hidden');
      document.getElementById('view-settings').classList.add('hidden');
      document.getElementById('view-packages').classList.add('hidden');
      document.getElementById('view-coupons').classList.add('hidden');
      document.getElementById('view-security').classList.add('hidden');`;
const newHiddenLogic = `document.getElementById('view-dashboard').classList.add('hidden');
      document.getElementById('view-orders').classList.add('hidden');
      document.getElementById('view-settings').classList.add('hidden');
      document.getElementById('view-packages').classList.add('hidden');
      document.getElementById('view-coupons').classList.add('hidden');
      document.getElementById('view-security').classList.add('hidden');`;
html = html.replace(oldHiddenLogic, newHiddenLogic);

const oldTabLogic = `if (tab === 'dashboard' || tab === 'pendingPayment' || tab === 'ongoingOrder') {
        const itemIdx = tab === 'dashboard' ? 0 : (tab === 'pendingPayment' ? 1 : 2);
        document.querySelectorAll('.menu-item')[itemIdx].classList.add('active');
        document.getElementById('view-dashboard').classList.remove('hidden');
        
        let title = 'Dashboard Overview';
        if (tab === 'pendingPayment') title = 'Pending Payments';
        if (tab === 'ongoingOrder') title = 'Ongoing Orders';
        document.getElementById('pageTitle').innerText = title;
        
        updateStats(allOrders);
          applyFilters();
      } else if (tab === 'packages') {`;

const newTabLogic = `if (tab === 'dashboard') {
        document.querySelectorAll('.menu-item')[0].classList.add('active');
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Dashboard Overview';
        updateStats(allOrders);
      } else if (tab === 'allOrders' || tab === 'pendingPayment' || tab === 'ongoingOrder') {
        const itemIdx = tab === 'allOrders' ? 1 : (tab === 'pendingPayment' ? 2 : 3);
        document.querySelectorAll('.menu-item')[itemIdx].classList.add('active');
        document.getElementById('view-orders').classList.remove('hidden');
        
        let title = 'All Orders';
        if (tab === 'pendingPayment') title = 'Pending Payments';
        if (tab === 'ongoingOrder') title = 'Ongoing Orders';
        document.getElementById('pageTitle').innerText = title;
        
        applyFilters();
      } else if (tab === 'packages') {`;

html = html.replace(oldTabLogic, newTabLogic);

// 5. Update Javascript filter
const filterOld = `if (currentMenuTab === 'pendingPayment') {
           if (o.advancePaymentStatus !== 'পেন্ডিং') matchTab = false;
        } else if (currentMenuTab === 'ongoingOrder') {`;
const filterNew = `if (currentMenuTab === 'pendingPayment') {
           if (o.advancePaymentStatus !== 'পেন্ডিং') matchTab = false;
        } else if (currentMenuTab === 'ongoingOrder') {`;
// no change needed for filterTab, except allOrders has no restriction so it naturally defaults to true.

// 6. Update updateStats
const statsFuncOld = `    function updateStats(all) {
      let pendingPay = 0;
      let pendingDel = 0;
      let revenue = 0;
      let rejected = 0;
      all.forEach(o => {
        if (o.advancePaymentStatus === 'পেন্ডিং') pendingPay++;
        
        const pkgPrice = o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349);
        const actualTotal = o.totalPrice !== undefined ? Number(o.totalPrice) : pkgPrice;
        
        if (o.advancePaymentStatus === 'কনফার্মড' || o.advancePaymentStatus === 'Confirmed') {
          revenue += Number(o.advancePayment) || 0;
        } else if (o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত') {
          revenue += actualTotal;
        }
        
        if (o.status === 'অর্ডার বাতিল' || o.advancePaymentStatus === 'পেমেন্ট বাতিল' || o.advancePaymentStatus === 'বাতিল') {
          rejected++;
        } else if (o.status !== 'ডেলিভারড' && o.status !== 'Delivered') {
          pendingDel++;
        }
      });
      if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = all.length;
      if (document.getElementById('statPendingPay')) document.getElementById('statPendingPay').innerText = pendingPay;
      if (document.getElementById('statPendingDel')) document.getElementById('statPendingDel').innerText = pendingDel;
      if (document.getElementById('statRejected')) document.getElementById('statRejected').innerText = rejected;
      if (document.getElementById('statRevenue')) document.getElementById('statRevenue').innerText = '৳ ' + revenue;
      updateNotifications(all);
    }`;

const statsFuncNew = `    function updateStats(all) {
      let pendingPay = 0;
      let pendingDel = 0;
      let revenue = 0;
      let delivered = 0;
      let halfPay = 0;
      all.forEach(o => {
        if (o.advancePaymentStatus === 'পেন্ডিং') pendingPay++;
        
        const pkgPrice = o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349);
        const actualTotal = o.totalPrice !== undefined ? Number(o.totalPrice) : pkgPrice;
        
        if (o.advancePaymentStatus === 'কনফার্মড' || o.advancePaymentStatus === 'Confirmed') {
          revenue += Number(o.advancePayment) || 0;
          halfPay++; // Consider Confirmed as half payment or advance payment made
        } else if (o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত') {
          revenue += actualTotal;
        }
        
        if (o.status === 'ডেলিভারড' || o.status === 'Delivered') {
          delivered++;
        } else if (o.status !== 'অর্ডার বাতিল' && o.advancePaymentStatus !== 'পেমেন্ট বাতিল' && o.advancePaymentStatus !== 'বাতিল') {
          pendingDel++;
        }
      });
      if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = all.length;
      if (document.getElementById('statPendingPay')) document.getElementById('statPendingPay').innerText = pendingPay;
      if (document.getElementById('statPendingDel')) document.getElementById('statPendingDel').innerText = pendingDel;
      if (document.getElementById('statDelivered')) document.getElementById('statDelivered').innerText = delivered;
      if (document.getElementById('statHalfPay')) document.getElementById('statHalfPay').innerText = halfPay;
      if (document.getElementById('statRevenue')) document.getElementById('statRevenue').innerText = '৳ ' + revenue;
      updateNotifications(all);
    }`;
html = html.replace(statsFuncOld, statsFuncNew);

// Fix menu-item indexes since we added 'allOrders' at index 1
// packages is now index 5, settings is 6, security is 7, coupons is 4
const oldIndexLogic = `} else if (tab === 'packages') {
        document.querySelectorAll('.menu-item')[4].classList.add('active');
        document.getElementById('view-packages').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Package Settings';
        loadPackages();
      } else if (tab === 'settings') {
        document.querySelectorAll('.menu-item')[5].classList.add('active');
        document.getElementById('view-settings').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Payment Settings';
        loadSettings();
      } else if (tab === 'security') {
        document.querySelectorAll('.menu-item')[6].classList.add('active');
        document.getElementById('view-security').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Security';
      } else if (tab === 'coupons') {
        document.querySelectorAll('.menu-item')[3].classList.add('active');`;

const newIndexLogic = `} else if (tab === 'packages') {
        document.querySelectorAll('.menu-item')[5].classList.add('active');
        document.getElementById('view-packages').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Package Settings';
        loadPackages();
      } else if (tab === 'settings') {
        document.querySelectorAll('.menu-item')[6].classList.add('active');
        document.getElementById('view-settings').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Payment Settings';
        loadSettings();
      } else if (tab === 'security') {
        document.querySelectorAll('.menu-item')[7].classList.add('active');
        document.getElementById('view-security').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Security';
      } else if (tab === 'coupons') {
        document.querySelectorAll('.menu-item')[4].classList.add('active');`;
html = html.replace(oldIndexLogic, newIndexLogic);

fs.writeFileSync('admin/index.html', html);
console.log('Updated dashboard layout');
