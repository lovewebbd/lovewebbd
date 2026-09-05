
    let adminToken = localStorage.getItem('loveweb_admin_token');
    let allOrders = [];

    window.onload = () => {
      if (adminToken) {
        showDashboard();
      } else {
        document.getElementById('loginScreen').style.display = 'flex';
      }
    };

    // Login
    document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('adminUser').value;
      const p = document.getElementById('adminPass').value;
      const btn = document.getElementById('loginBtn');
      const errorDiv = document.getElementById('loginError');
      
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking...';
      btn.disabled = true;
      errorDiv.innerText = '';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        
        if (data.success) {
          adminToken = data.token;
          localStorage.setItem('loveweb_admin_token', adminToken);
          showDashboard();
        } else {
          errorDiv.innerText = data.message || 'Invalid credentials';
        }
      } catch (err) {
        errorDiv.innerText = 'Connection error';
      } finally {
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        btn.disabled = false;
      }
    });

    // Change Password
    document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const np = document.getElementById('newPass').value;
      const msg = document.getElementById('passMsg');
      msg.innerText = 'Updating...';
      msg.style.color = 'var(--admin-text-sub)';

      try {
        const res = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + adminToken
          },
          body: JSON.stringify({ newPassword: np })
        });
        const data = await res.json();
        if (data.success) {
          msg.innerText = 'Password updated successfully!';
          msg.style.color = 'var(--admin-success)';
          document.getElementById('newPass').value = '';
        } else {
          msg.innerText = data.message;
          msg.style.color = 'var(--admin-danger)';
        }
      } catch(err) {
        msg.innerText = 'Error connecting to server.';
        msg.style.color = 'var(--admin-danger)';
      }
    });

    function logout() {
      localStorage.removeItem('loveweb_admin_token');
      location.reload();
    }

    function showDashboard() {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboardScreen').style.display = 'flex';
      loadOrders();
    }

    
    function toggleSidebar() {
      document.querySelector('.sidebar').classList.toggle('open');
      document.querySelector('.sidebar-overlay').classList.toggle('open');
    }

    let currentMenuTab = 'dashboard';
    
    function switchTab(tab) {
      currentMenuTab = tab;
      document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
      document.getElementById('view-dashboard').classList.add('hidden');
      document.getElementById('view-settings').classList.add('hidden');

      if (tab === 'dashboard' || tab === 'pendingPayment' || tab === 'processingOrder') {
        const itemIdx = tab === 'dashboard' ? 0 : (tab === 'pendingPayment' ? 1 : 2);
        document.querySelectorAll('.menu-item')[itemIdx].classList.add('active');
        document.getElementById('view-dashboard').classList.remove('hidden');
        
        let title = 'Dashboard Overview';
        if (tab === 'pendingPayment') title = 'Pending Payments';
        if (tab === 'processingOrder') title = 'Processing Orders';
        document.getElementById('pageTitle').innerText = title;
        
        updateStats(allOrders);
          applyFilters();
      } else if (tab === 'settings') {
        document.querySelectorAll('.menu-item')[3].classList.add('active');
        document.getElementById('view-settings').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'System Settings';
      }
    }

    async function loadOrders() {
      showLoading(true);
      try {
        const res = await fetch('/api/admin/orders', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }
        const data = await res.json();
        if (data.success) {
          allOrders = data.orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          if (window.renderRevenueChart) {
            window.renderRevenueChart(allOrders);
          }
          applyFilters();
        }
      } catch (err) {
        console.error(err);
      } finally {
        showLoading(false);
      }
    }

    function applyFilters() {
      if (!allOrders) return;
      const searchTerm = (document.getElementById('searchOrders') ? document.getElementById('searchOrders').value.toLowerCase() : '');
      const filterStartDate = (document.getElementById('filterStartDate') ? document.getElementById('filterStartDate').value : '');
      const filterEndDate = (document.getElementById('filterEndDate') ? document.getElementById('filterEndDate').value : '');
      const filterTime = (document.getElementById('filterTime') ? document.getElementById('filterTime').value : '');
      const filterStatus = (document.getElementById('filterStatus') ? document.getElementById('filterStatus').value : '');
      
      const filtered = allOrders.filter(o => {
        const searchTarget = String(o.orderId || '').toLowerCase() + ' ' + 
                             String(o.userPhone || '').toLowerCase() + ' ' + 
                             String(o.username || '').toLowerCase();
        const matchSearch = searchTarget.includes(searchTerm);
        const matchStatus = filterStatus ? (o.status === filterStatus) : true;
        
        let matchDate = true;
        let matchTime = true;
        if (o.createdAt) {
           const d = new Date(o.createdAt);
           // YYYY-MM-DD
           const oDate = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
           // HH:MM (24 hr format)
           const oTime = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
           
           if (filterStartDate && oDate < filterStartDate) matchDate = false;
           if (filterEndDate && oDate > filterEndDate) matchDate = false;
           
           if (filterTime) {
             if (oTime !== filterTime) matchTime = false;
           }
        } else if (filterStartDate || filterEndDate || filterTime) {
           matchDate = false;
        }

        let matchTab = true;
        if (currentMenuTab === 'pendingPayment') {
           if (o.advancePaymentStatus !== 'পেন্ডিং') matchTab = false;
        } else if (currentMenuTab === 'processingOrder') {
           if (o.status !== 'প্রক্রিয়াকরণ চলছে' || o.advancePaymentStatus === 'পেন্ডিং') matchTab = false;
        }

        return matchSearch && matchStatus && matchDate && matchTime && matchTab;
      });
      renderOrders(filtered);
    }
    
    // So onkeyup/change in HTML points to applyFilters instead of renderOrders
    window.renderOrders = function() { applyFilters(); };


    
    function updateStats(all) {
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
    }

    function renderOrders(orders) {
      const tbody = document.getElementById('ordersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      
      orders.forEach(o => {
        // Row HTML
        const tr = document.createElement('tr');
        
        // Payment Badge
        let payBadge = 'badge-pending';
        let payText = o.advancePaymentStatus || 'পেন্ডিং';
        if (payText === 'কনফার্মড' || payText === 'Confirmed' || payText === 'সম্পূর্ণ পরিশোধিত') payBadge = 'badge-success';
        if (payText === 'বাতিল' || payText === 'Rejected' || payText === 'পেমেন্ট বাতিল') payBadge = 'badge-danger';

        // Status Badge
        let statusBadge = 'badge-pending';
        let statusText = o.status || 'প্রক্রিয়াকরণ চলছে';
        if (statusText === 'ডেলিভারড' || statusText === 'Delivered') statusBadge = 'badge-success';
        if (statusText === 'অর্ডার বাতিল' || statusText === 'বাতিল') statusBadge = 'badge-danger';

        tr.innerHTML = `
          <td style="font-family: monospace; color: var(--admin-primary);">${o.orderId || ''}</td>
          <td>
            <div style="font-weight: 600;">${o.username || ''}</div>
            <div style="font-size: 0.75rem; color: var(--admin-text-sub); margin-bottom: 4px;">${o.userPhone || ''}</div>
            <button class="btn-action" style="background:var(--admin-primary); padding:2px 6px; font-size:0.7rem;" onclick="viewCustomerProfile('${o.userPhone || ''}', '${o.username || ''}')">View Profile</button>
          </td>
          <td>
            <div style="font-weight: 600;">${o.package || ''}</div>
            <div style="font-size:0.75rem; color:var(--admin-text-sub); margin-top:2px;">
              ${(()=>{
          const pPrice = o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349);
          const tPrice = o.totalPrice !== undefined ? Number(o.totalPrice) : pPrice;
          const aPrice = Number(o.advancePayment) || 0;
          const dPrice = o.duePayment !== undefined ? Number(o.duePayment) : (tPrice - aPrice);
          const fDue = (payText === 'সম্পূর্ণ পরিশোধিত') ? 0 : dPrice;
          return `Total: ৳${tPrice} ${o.discountPercent ? '<span style="color:#c084fc;font-size:0.7rem;">(-'+o.discountPercent+'%)</span>' : ''} | Adv: ৳${aPrice} | Due: <span style="color:#f43f5e; font-weight:600;">৳${fDue}</span>`;
        })()}
            </div>
          </td>
          <td><span class="badge ${payBadge}">${payText}</span></td>
          <td><span class="badge ${statusBadge}">${statusText}</span></td>
          <td>
            <div class="action-btn-group">
              ${payText === 'পেন্ডিং' ? `
                <button class="btn-action btn-pay-adv" onclick="updateOrder(event, '${o.id}', 'payment', 'কনফার্মড')">Confirm Adv.</button>
                <button class="btn-action btn-pay-reject" onclick="updateOrder(event, '${o.id}', 'payment', 'পেমেন্ট বাতিল')">Reject</button>
              ` : ''}
              
              ${payText === 'কনফার্মড' || payText === 'Confirmed' ? `
                <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
                  <button class="btn-action btn-pay-full" onclick="updateOrder(event, '${o.id}', 'payment', 'সম্পূর্ণ পরিশোধিত')">Full Paid</button>
                  <div style="display:flex; gap:4px; width:100%;">
                    <button class="btn-action btn-pay-reject" style="flex:1;" onclick="updateOrder(event, '${o.id}', 'payment', 'পেমেন্ট বাতিল')">Reject</button>
                    <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'payment', 'পেন্ডিং')" title="Undo"><i class="fa-solid fa-rotate-left"></i></button>
                  </div>
                </div>
              ` : ''}

              ${payText === 'সম্পূর্ণ পরিশোধিত' ? `
                <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'payment', 'কনফার্মড')" title="Undo"><i class="fa-solid fa-rotate-left"></i> Undo</button>
              ` : ''}

              ${payText === 'পেমেন্ট বাতিল' || payText === 'বাতিল' || payText === 'Rejected' ? `
                <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'payment', 'পেন্ডিং')" title="Undo"><i class="fa-solid fa-rotate-left"></i> Undo</button>
              ` : ''}
            </div>
          </td>
          <td>
            <div class="action-btn-group">
              ${statusText === 'প্রক্রিয়াকরণ চলছে' || statusText === 'Processing' ? `
                <button class="btn-action btn-stat-cancel" onclick="updateOrder(event, '${o.id}', 'status', 'অর্ডার বাতিল')">Cancel</button>
              ` : ''}

              ${statusText === 'অর্ডার বাতিল' || statusText === 'বাতিল' ? `
                <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'status', 'প্রক্রিয়াকরণ চলছে')" title="Undo"><i class="fa-solid fa-rotate-left"></i> Undo Cancel</button>
              ` : ''}

              ${statusText === 'ডেলিভারড' || statusText === 'Delivered' ? `
                <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'status', 'প্রক্রিয়াকরণ চলছে')" title="Undo"><i class="fa-solid fa-rotate-left"></i> Undo Delivery</button>
              ` : ''}
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    let pendingAction = null;

    
    function viewCustomerProfile(phone, name) {
      document.getElementById('cmName').innerText = name || phone;
      document.getElementById('cmPhone').innerText = phone;
      
      let totalO = 0;
      let totalR = 0;
      
      allOrders.forEach(o => {
        if (o.userPhone === phone) {
          totalO++;
          if (o.advancePaymentStatus === 'কনফার্মড' || o.advancePaymentStatus === 'Confirmed') {
            totalR += Number(o.advancePayment) || 0;
          } else if (o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত') {
            const pkgPrice = o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349);
            const actualTotal = o.totalPrice !== undefined ? Number(o.totalPrice) : pkgPrice;
            totalR += actualTotal;
          }
        }
      });
      
      document.getElementById('cmTotalOrders').innerText = totalO;
      document.getElementById('cmLifetimeRevenue').innerText = '৳ ' + totalR;
      
      document.getElementById('customerModal').style.display = 'flex';
    }

    function closeCustomerModal() {
      document.getElementById('customerModal').style.display = 'none';
    }

    function updateNotifications(orders) {
      // Find new orders in last 24h that are pending
      const now = new Date();
      let newCount = 0;
      orders.forEach(o => {
        if (o.advancePaymentStatus === 'পেন্ডিং') {
           const oDate = new Date(o.createdAt);
           const diffHours = (now - oDate) / (1000 * 60 * 60);
           if (diffHours < 24) {
             newCount++;
           }
        }
      });
      const badge = document.getElementById('notifBadge');
      if (newCount > 0) {
        badge.innerText = newCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }

    function updateOrder(event, id, type, val) {
      if (!val) return;
      pendingAction = { id, type, val };
      document.getElementById('confirmModal').style.display = 'flex';
    }

    function closeConfirmModal() {
      document.getElementById('confirmModal').style.display = 'none';
      pendingAction = null;
    }

    document.getElementById('btnConfirmAction').addEventListener('click', async () => {
      if (!pendingAction) return;
      document.getElementById('confirmModal').style.display = 'none';
      
      const { id, type, val } = pendingAction;
      pendingAction = null;

      showLoading(true);
      try {
        const endpoint = type === 'payment' ? '/api/admin/orders/payment' : '/api/admin/orders/status';
        const payload = { id, value: val };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + adminToken
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          loadOrders(); 
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        alert('Connection error');
      } finally {
        showLoading(false);
      }
    });

    function showLoading(show) {
      document.getElementById('loadingOverlay').classList.toggle('hidden', !show);
    }
  