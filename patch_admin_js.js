import fs from 'fs';
let html = fs.readFileSync('admin/index.html', 'utf8');

// Update showSection
const oldShowSection = `function showSection(sectionId) {
      document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
      document.querySelectorAll('.sidebar ul li a').forEach(a => a.classList.remove('active'));
      document.getElementById(sectionId + '-section').style.display = 'block';
      document.getElementById('nav-' + sectionId).classList.add('active');
    }`;
const newShowSection = `function showSection(sectionId) {
      document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
      document.querySelectorAll('.sidebar ul li a').forEach(a => a.classList.remove('active'));
      const sec = document.getElementById(sectionId + '-section');
      if(sec) sec.style.display = 'block';
      const nav = document.getElementById('nav-' + sectionId);
      if(nav) nav.classList.add('active');
      
      if(sectionId === 'coupons') loadCoupons();
      if(sectionId === 'settings') loadSettings();
    }`;
html = html.replace(oldShowSection, newShowSection);

// Update renderOrders to show coupon
const oldOrdersHtml = `html += \`
            <tr>
              <td>#\${order.id.substring(0, 8)}</td>
              <td>\${order.username}</td>
              <td>\${order.packageType}</td>
              <td>\${new Date(order.createdAt).toLocaleDateString()}</td>
              <td><span class="status-badge \${order.status === 'completed' ? 'status-completed' : (order.status === 'processing' ? 'status-processing' : 'status-pending')}">\${order.status}</span></td>
              <td>
                <button class="btn-action" onclick="viewOrder('\${order.id}')"><i class="fa-solid fa-eye"></i> View</button>
              </td>
            </tr>
          \`;`;
const newOrdersHtml = `
          let couponText = '';
          if(order.couponCode) {
            couponText = \`<br><span style="font-size:0.75rem; color:#10b981;">Coupon: \${order.couponCode} (-\${order.couponDiscountPercent}%)</span>\`;
          }
          html += \`
            <tr>
              <td>#\${order.id.substring(0, 8)}</td>
              <td>\${order.username}\${couponText}</td>
              <td>\${order.packageType}</td>
              <td>\${new Date(order.createdAt).toLocaleDateString()}</td>
              <td><span class="status-badge \${order.status === 'completed' ? 'status-completed' : (order.status === 'processing' ? 'status-processing' : 'status-pending')}">\${order.status}</span></td>
              <td>
                <button class="btn-action" onclick="viewOrder('\${order.id}')"><i class="fa-solid fa-eye"></i> View</button>
              </td>
            </tr>
          \`;`;
html = html.replace(oldOrdersHtml, newOrdersHtml);

// Add coupon logic and settings logic at the end of the script
const newLogic = `
    // --- Coupons Logic ---
    async function loadCoupons() {
      try {
        const res = await fetch('/api/admin/coupons', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        if(data.success) {
          const tbody = document.getElementById('coupons-table-body');
          if(data.coupons.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No coupons found</td></tr>';
            return;
          }
          let html = '';
          data.coupons.forEach(c => {
            html += \`<tr>
              <td><strong>\${c.code}</strong></td>
              <td>\${c.discountPercent}%</td>
              <td>\${c.maxUsesPerUser || 'Unlimited'}</td>
              <td>\${c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'No expiry'}</td>
              <td><button class="btn-action" style="background:#ef4444; border-color:#dc2626;" onclick="deleteCoupon('\${c.code}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>\`;
          });
          tbody.innerHTML = html;
        }
      } catch(e) { console.error(e); }
    }
    
    async function saveCoupon() {
      const code = document.getElementById('newCouponCode').value.trim();
      const discountPercent = document.getElementById('newCouponDiscount').value;
      const maxUsesPerUser = document.getElementById('newCouponUses').value;
      const expiryDate = document.getElementById('newCouponExpiry').value;
      if(!code || !discountPercent) return alert('Code and discount are required');
      
      try {
        const res = await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ code, discountPercent, maxUsesPerUser, expiryDate })
        });
        const data = await res.json();
        if(data.success) {
          document.getElementById('newCouponCode').value = '';
          document.getElementById('newCouponDiscount').value = '';
          loadCoupons();
        } else {
          alert(data.message);
        }
      } catch(e) { alert('Error'); }
    }
    
    async function deleteCoupon(code) {
      if(!confirm('Delete coupon ' + code + '?')) return;
      try {
        const res = await fetch('/api/admin/coupons/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ code })
        });
        if(res.ok) loadCoupons();
      } catch(e) { alert('Error'); }
    }
    
    // --- Settings Logic ---
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if(data.success && data.settings) {
          document.getElementById('settingBkash').value = data.settings.bkashNumber || '';
          document.getElementById('settingNagad').value = data.settings.nagadNumber || '';
        }
      } catch(e) { console.error(e); }
    }
    
    async function saveSettings() {
      const bkashNumber = document.getElementById('settingBkash').value.trim();
      const nagadNumber = document.getElementById('settingNagad').value.trim();
      try {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ bkashNumber, nagadNumber })
        });
        const data = await res.json();
        if(data.success) alert('Settings saved');
        else alert(data.message);
      } catch(e) { alert('Error saving settings'); }
    }
</script>
`;
html = html.replace('</script>', newLogic);

fs.writeFileSync('admin/index.html', html);
console.log('admin/index.html JS patched');
