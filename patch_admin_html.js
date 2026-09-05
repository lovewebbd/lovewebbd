import fs from 'fs';

let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add sidebar links
const oldSidebar = `<li><a href="#" onclick="showSection('overview')" id="nav-overview"><i class="fa-solid fa-chart-pie"></i> Overview</a></li>
        <li><a href="#" onclick="showSection('orders')" id="nav-orders"><i class="fa-solid fa-cart-shopping"></i> Orders</a></li>
        <li><a href="#" onclick="logoutAdmin()"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>`;
const newSidebar = `<li><a href="#" onclick="showSection('overview')" id="nav-overview"><i class="fa-solid fa-chart-pie"></i> Overview</a></li>
        <li><a href="#" onclick="showSection('orders')" id="nav-orders"><i class="fa-solid fa-cart-shopping"></i> Orders</a></li>
        <li><a href="#" onclick="showSection('coupons')" id="nav-coupons"><i class="fa-solid fa-ticket"></i> Coupons</a></li>
        <li><a href="#" onclick="showSection('settings')" id="nav-settings"><i class="fa-solid fa-gear"></i> Settings</a></li>
        <li><a href="#" onclick="logoutAdmin()"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>`;
html = html.replace(oldSidebar, newSidebar);


// 2. Add sections to main content
const newSections = `
      <!-- Coupons Section -->
      <section id="coupons-section" class="admin-section" style="display: none;">
        <h2><i class="fa-solid fa-ticket"></i> Manage Coupons</h2>
        <div class="admin-card" style="margin-bottom: 20px;">
          <h3>Add New Coupon</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end;">
            <div style="flex: 1; min-width: 150px;">
              <label>Coupon Code</label>
              <input type="text" id="newCouponCode" placeholder="e.g. LOVE10" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: var(--bg-dark); color: white;">
            </div>
            <div style="flex: 1; min-width: 100px;">
              <label>Discount (%)</label>
              <input type="number" id="newCouponDiscount" placeholder="10" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: var(--bg-dark); color: white;">
            </div>
            <div style="flex: 1; min-width: 100px;">
              <label>Max Uses Per User</label>
              <input type="number" id="newCouponUses" placeholder="1" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: var(--bg-dark); color: white;">
            </div>
            <div style="flex: 1; min-width: 150px;">
              <label>Expiry Date</label>
              <input type="date" id="newCouponExpiry" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: var(--bg-dark); color: white;">
            </div>
            <button onclick="saveCoupon()" class="btn-action" style="padding: 10px 20px; height: 42px;"><i class="fa-solid fa-plus"></i> Add Coupon</button>
          </div>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Max Uses</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="coupons-table-body">
              <tr><td colspan="5" style="text-align:center;">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- Settings Section -->
      <section id="settings-section" class="admin-section" style="display: none;">
        <h2><i class="fa-solid fa-gear"></i> General Settings</h2>
        <div class="admin-card">
          <h3>Payment Numbers</h3>
          <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px; max-width: 400px;">
            <div>
              <label>bKash Number</label>
              <input type="text" id="settingBkash" placeholder="01XXXXXXXXX" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: var(--bg-dark); color: white; margin-top: 5px;">
            </div>
            <div>
              <label>Nagad Number</label>
              <input type="text" id="settingNagad" placeholder="01XXXXXXXXX" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: var(--bg-dark); color: white; margin-top: 5px;">
            </div>
            <button onclick="saveSettings()" class="btn-action" style="align-self: flex-start; padding: 10px 20px;"><i class="fa-solid fa-save"></i> Save Settings</button>
          </div>
        </div>
      </section>
`;
html = html.replace('<!-- Users Section (Future) -->', newSections + '\n      <!-- Users Section (Future) -->');

fs.writeFileSync('admin/index.html', html);
console.log('admin/index.html HTML patched');
