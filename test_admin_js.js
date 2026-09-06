    // --- Packages Logic ---
    let adminPackagesConfig = {};
    let adminSelectedPkg = null;
    
    function changeEditPackage(pkgName) {
       adminSelectedPkg = pkgName;
       renderAdminPackages();
    }

    async function loadPackages() {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        if(data.success && data.packages) {
          adminPackagesConfig = data.packages;
          renderAdminPackages();
        }
      } catch(e) {
         console.error('Error loading packages', e);
      }
    }
    
    function renderAdminPackages() {
      const container = document.getElementById('adminPackagesContainer');
      if (!container) return;
      container.innerHTML = '';
      
      const packageNames = Object.keys(adminPackagesConfig).sort((a,b) => (adminPackagesConfig[a].order || 0) - (adminPackagesConfig[b].order || 0));
      if(packageNames.length === 0) {
        container.innerHTML = '<p style="color:var(--admin-text-sub);">No packages found. Add a new package.</p>';
        return;
      }
      
      if(!adminSelectedPkg || !adminPackagesConfig[adminSelectedPkg]) {
        adminSelectedPkg = packageNames[0];
      }
      
      let optionsHtml = '';
      for(const name of packageNames) {
         optionsHtml += `<option value="${name}" ${name === adminSelectedPkg ? 'selected' : ''}>${name} Package</option>`;
      }
      
      const pkgName = adminSelectedPkg;
      const pkgData = adminPackagesConfig[pkgName];
      
      const icons = [
         {val: '', name: 'None (No Icon)'},
         {val: 'fa-solid fa-star', name: 'Star'},
         {val: 'fa-solid fa-crown', name: 'Crown'},
         {val: 'fa-solid fa-gem', name: 'Gem'},
         {val: 'fa-solid fa-rocket', name: 'Rocket'},
         {val: 'fa-solid fa-fire', name: 'Fire'},
         {val: 'fa-solid fa-bolt', name: 'Lightning'},
         {val: 'fa-solid fa-medal', name: 'Medal'},
         {val: 'fa-solid fa-heart', name: 'Heart'},
         {val: 'fa-solid fa-check-circle', name: 'Check Circle'},
         {val: 'fa-solid fa-gift', name: 'Gift'}
      ];
      let iconOptions = '';
      let hasCustom = pkgData.icon && !icons.find(i => i.val === pkgData.icon);
      if(hasCustom) {
         iconOptions += `<option value="${pkgData.icon}" selected>Custom (${pkgData.icon})</option>`;
      }
      for(const icon of icons) {
         iconOptions += `<option value="${icon.val}" ${(!hasCustom && pkgData.icon === icon.val) ? 'selected' : ''}>${icon.name}</option>`;
      }
      
      container.innerHTML = `
        <div class="settings-panel" style="position:relative; width: 100%; box-sizing: border-box;">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 20px; gap: 15px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
               <label style="display:block; font-size: 0.85rem; color: var(--admin-text-sub); margin-bottom: 5px;">Select Package to Edit</label>
               <select onchange="changeEditPackage(this.value)" style="width: 100%; padding: 10px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--admin-border); color: var(--admin-primary); font-family: inherit; font-size: 1rem; font-weight: 600;">
                  ${optionsHtml}
               </select>
            </div>
            <button type="button" class="btn-action" style="background:#6366f1; color:white; border:none; padding:10px 15px; border-radius:6px; cursor:pointer; margin-right: 10px;" onclick="openReorderModal()" title="Reorder Packages">
              <i class="fa-solid fa-sort"></i> Reorder Packages
            </button>
            <button type="button" class="btn-action btn-pay-reject" style="background:var(--admin-danger); color:white; border:none; padding:10px 15px; border-radius:6px; cursor:pointer;" onclick="deletePackage('${pkgName}')" title="Delete Package">
              <i class="fa-solid fa-trash"></i> Delete Package
            </button>
          </div>
          
          <hr style="border:none; border-top: 1px solid var(--admin-border); margin-bottom: 20px;">
          
          <form class="packageForm" data-pkg="${pkgName}">
            <div class="input-group" style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
              <div>
                <label>Bangla Name</label>
                <input type="text" class="pkgBnName" value="${pkgData.bnName || ''}" placeholder="e.g. রেগুলার">
              </div>
              <div>
                <label>Icon (FontAwesome)</label>
                <select class="pkgIcon" style="width: 100%; padding: 10px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--admin-border); color: var(--admin-text-main); font-family: inherit;">
                  ${iconOptions}
                </select>
              </div>
              <div>
                <label>Title Color</label>
                <input type="color" class="pkgHeadColor" value="${pkgData.headColor || '#ffffff'}" style="width: 100%; height: 42px; padding: 2px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--admin-border); cursor:pointer;">
              </div>
            </div>
            
            <div class="input-group" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label>Base Price (৳)</label>
                <input type="number" class="pkgBasePrice" required value="${pkgData.base || ''}">
              </div>
              <div>
                <label>Advance (৳)</label>
                <input type="number" class="pkgAdvance" required value="${pkgData.advance !== undefined ? pkgData.advance : ''}">
              </div>
            </div>
            <div class="input-group">
              <label>Original Crossed Price (৳)</label>
              <input type="number" class="pkgOriginalPrice" required value="${pkgData.original || ''}">
            </div>
            <div class="input-group">
              <label>Delivery Time (Days)</label>
              <input type="number" class="pkgDeliveryTime" required value="${pkgData.deliveryTime || 7}">
            </div>
            <div class="input-group" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label>Min Pages (Required)</label>
                <input type="number" class="pkgMinPages" required value="${pkgData.minPages || 3}">
              </div>
              <div>
                <label>Max Pages</label>
                <input type="number" class="pkgMaxPages" required value="${pkgData.maxPages || 4}">
              </div>
            </div>
            <div class="input-group" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label>Max Images Per Description</label>
                <input type="number" class="pkgMaxImages" required value="${pkgData.maxImagesPerDesc !== undefined ? pkgData.maxImagesPerDesc : 5}">
              </div>
              <div>
                <label>Max Total Images</label>
                <input type="number" class="pkgMaxTotalImages" required value="${pkgData.maxTotalImages !== undefined ? pkgData.maxTotalImages : 15}">
              </div>
            </div>
            <div class="input-group">
              <label><i class="fa-solid fa-list-check"></i> Features (One per line)</label>
              <div style="font-size: 0.8rem; color: var(--admin-text-sub); margin-bottom: 5px;">Press Enter to add a new feature.</div>
              <textarea class="pkgFeatures" rows="5" required>${(pkgData.features || []).join('\n')}</textarea>
            </div>
            <div class="input-group">
              <label><i class="fa-solid fa-circle-info"></i> Tooltip Text</label>
              <div style="font-size: 0.8rem; color: var(--admin-text-sub); margin-bottom: 5px;">Press Enter for a new line. No need to use &lt;br&gt; tags.</div>
              <textarea class="pkgTooltip" rows="4" required>${(pkgData.tooltip || '').replace(/<br\s*\/?>/gi, '\n')}</textarea>
            </div>
            <button type="submit" class="btn-admin">Save ${pkgName} Settings</button>
          </form>
        </div>
      `;
      
      // Re-attach listeners
      document.querySelectorAll('.packageForm').forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const pkgName = form.getAttribute('data-pkg');
          const payload = {
            bnName: form.querySelector('.pkgBnName').value.trim(),
            icon: form.querySelector('.pkgIcon').value.trim(),
            headColor: form.querySelector('.pkgHeadColor').value.trim(),
            base: Number(form.querySelector('.pkgBasePrice').value),
            advance: Number(form.querySelector('.pkgAdvance').value),
            order: pkgData.order || 0,
            original: Number(form.querySelector('.pkgOriginalPrice').value),
            deliveryTime: Number(form.querySelector('.pkgDeliveryTime').value),
            minPages: Number(form.querySelector('.pkgMinPages').value),
            maxPages: Number(form.querySelector('.pkgMaxPages').value),
            maxImagesPerDesc: Number(form.querySelector('.pkgMaxImages').value),
            maxTotalImages: Number(form.querySelector('.pkgMaxTotalImages').value),
            features: form.querySelector('.pkgFeatures').value.split('\n').filter(l => l.trim() !== ''),
            tooltip: form.querySelector('.pkgTooltip').value.replace(/\n/g, '<br>')
          };
          try {
            const res = await fetch('/api/admin/packages/' + encodeURIComponent(pkgName), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify(payload)
            });
            if(res.ok) showToast(pkgName + ' package updated!');
            else showToast('Error updating package');
          } catch(e) { showToast('Error updating package'); }
        });
      });
    }

    function addNewPackage() {
      document.getElementById('addPackageModal').style.display = 'flex';
      document.getElementById('newPackageNameInput').value = '';
      document.getElementById('newPackageNameInput').focus();
    }
    
    function closeAddPackageModal() {
      document.getElementById('addPackageModal').style.display = 'none';
    }
    
    function confirmAddPackage() {
      const input = document.getElementById('newPackageNameInput');
      const pkgName = input.value.trim();
      if(!pkgName) {
         showToast('Please enter a package name');
         return;
      }
      if(adminPackagesConfig[pkgName]) {
         showToast('Package already exists!');
         return;
      }
      
      const newOrder = Object.keys(adminPackagesConfig).length + 1;
      adminPackagesConfig[pkgName] = { order: newOrder, bnName: '', icon: '', headColor: '#ffffff', base: 0, advance: 0, original: 0, deliveryTime: 7, minPages: 3, maxPages: 4, features: [], tooltip: '' };
      closeAddPackageModal();
      renderAdminPackages();
      
      // Auto-save the new empty package to DB to ensure it persists immediately
      fetch('/api/admin/packages/' + encodeURIComponent(pkgName), {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
         body: JSON.stringify(adminPackagesConfig[pkgName])
      }).catch(e => console.error(e));
    }

    async function deletePackage(pkgName) {
      if(!confirm('Are you sure you want to delete the ' + pkgName + ' package?')) return;
      try {
        const token = window.adminToken || localStorage.getItem('loveweb_admin_token');
        const res = await fetch('/api/admin/packages/delete/' + encodeURIComponent(pkgName), {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if(res.ok) {
           delete adminPackagesConfig[pkgName];
           if (adminSelectedPkg === pkgName) adminSelectedPkg = null;
           renderAdminPackages();
           showToast('Package deleted');
        } else {
           showToast('Failed to delete package');
        }
      } catch(e) {
        showToast('Error deleting package');
      }
    }

    // --- Settings Logic ---
    
    async function loadCoupons() {
      try {
        const res = await fetch('/api/admin/coupons', { headers: { 'Authorization': 'Bearer ' + adminToken } });
        const data = await res.json();
        const tbody = document.getElementById('couponsBody');
        tbody.innerHTML = '';
        if(data.success) {
          data.coupons.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${c.code}</strong></td>
              <td>${c.discountPercent}%</td>
              <td>${c.expiryDate || 'No Expiry'}</td>
              <td>${c.maxUsesPerUser || 'Unlimited'}</td>
              <td><button class="btn-action btn-pay-reject" onclick="deleteCoupon('${c.code}')">Delete</button></td>
            `;
            tbody.appendChild(tr);
          });
        }
      } catch(e) {}
    }

    async function deleteCoupon(code) {
      if(!confirm('Delete coupon ' + code + '?')) return;
      try {
        const res = await fetch('/api/admin/coupons/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        if(data.success) loadCoupons();
        else showToast(data.message);
      } catch(e) {}
    }

    document.getElementById('couponForm')?.addEventListener('submit', async(e) => {
      e.preventDefault();
      const payload = {
        code: document.getElementById('cpnCode').value.trim(),
        discountPercent: document.getElementById('cpnDiscount').value,
        expiryDate: document.getElementById('cpnExpiry').value,
        maxUsesPerUser: document.getElementById('cpnMaxUses').value
      };
      try {
        const res = await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(data.success) {
          document.getElementById('couponForm').reset();
          loadCoupons();
        } else showToast(data.message);
      } catch(e) {}
    });

    document.getElementById('paymentSettingsForm')?.addEventListener('submit', async(e) => {
      e.preventDefault();
      saveSettings();
    });

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
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ bkashNumber, nagadNumber })
        });
        const data = await res.json();
        if(data.success) showToast('Settings saved');
        else showToast(data.message);
      } catch(e) { showToast('Error saving settings'); }
    }
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
      document.getElementById('view-orders').classList.add('hidden');
      document.getElementById('view-settings').classList.add('hidden');
      document.getElementById('view-packages').classList.add('hidden');
      document.getElementById('view-membership').classList.add('hidden');
      if(document.getElementById('view-demos')) document.getElementById('view-demos').classList.add('hidden');
      document.getElementById('view-coupons').classList.add('hidden');
      document.getElementById('view-security').classList.add('hidden');

      
      const tabs = ['dashboard', 'allOrders', 'pendingPayment', 'ongoingOrder', 'pendingDelivery', 'deliveredOrder', 'coupons', 'packages', 'demos', 'membership', 'settings', 'security'];
      const index = tabs.indexOf(tab);
      if(index !== -1) {
         document.querySelectorAll('.menu-item')[index].classList.add('active');
      }

      if (tab === 'dashboard') {
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Dashboard Overview';
        updateStats(allOrders);
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
      } else if (tab === 'pendingDelivery') {
        document.getElementById('view-orders').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Pending Delivery';
        currentOrdersFilter = 'pending_delivery';
        applyFilters();
      } else if (tab === 'deliveredOrder') {
        document.getElementById('view-orders').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Delivered Orders';
        currentOrdersFilter = 'delivered';
        applyFilters();
      } else if (tab === 'coupons') {
        document.getElementById('view-coupons').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Coupons';
        loadCoupons();
      } else if (tab === 'packages') {
        document.getElementById('view-packages').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Package Settings';
        loadPackages();
      
      } else if (tab === 'demos') {
        document.getElementById('view-demos').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Demo Management';
        loadDemosAdmin();
      } else if (tab === 'membership') {
        document.getElementById('view-membership').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Membership Settings';
        loadMembership();
      } else if (tab === 'settings') {
        document.getElementById('view-settings').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Payment Settings';
        loadSettings();
      } else if (tab === 'security') {
        document.getElementById('view-security').classList.remove('hidden');
        document.getElementById('pageTitle').innerText = 'Security Settings';
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
          updateStats(allOrders);
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
        let matchStatus = true;
        if (filterStatus === 'active') {
          matchStatus = !(o.status === 'ডেলিভারড' || o.status === 'Delivered' || o.status === 'অর্ডার বাতিল' || o.status === 'বাতিল' || o.advancePaymentStatus === 'পেমেন্ট বাতিল' || o.advancePaymentStatus === 'বাতিল');
        } else if (filterStatus) {
          matchStatus = (o.status === filterStatus);
        }
        
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
        } else if (currentMenuTab === 'ongoingOrder') {
           if (o.status === 'ডেলিভারড' || o.status === 'Delivered' || o.status === 'অর্ডার বাতিল' || o.status === 'বাতিল' || o.advancePaymentStatus === 'পেমেন্ট বাতিল' || o.advancePaymentStatus === 'বাতিল') matchTab = false;
        } else if (currentMenuTab === 'pendingDelivery') {
           if (o.status === 'ডেলিভারড' || o.status === 'Delivered' || o.status === 'অর্ডার বাতিল' || o.status === 'বাতিল' || o.advancePaymentStatus === 'পেমেন্ট বাতিল' || o.advancePaymentStatus === 'বাতিল') matchTab = false;
        } else if (currentMenuTab === 'deliveredOrder') {
           if (o.status !== 'ডেলিভারড' && o.status !== 'Delivered') matchTab = false;
        }

        return matchSearch && matchStatus && matchDate && matchTime && matchTab;
      });
      renderOrders(filtered);
    }
    
    // So onkeyup/change in HTML points to applyFilters instead of renderOrders
    // window.renderOrders = function() { applyFilters(); };


    
    
    function filterToday() {
      const today = new Date();
      const oDate = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
      if(document.getElementById('filterStartDate')) document.getElementById('filterStartDate').value = oDate;
      if(document.getElementById('filterEndDate')) document.getElementById('filterEndDate').value = oDate;
      applyFilters();
    }

    function updateStats(all) {
      let pendingPay = 0;
      let pendingDel = 0;
      let revenue = 0;
      let rejected = 0;
      let delivered = 0;
      let halfPay = 0;

      all.forEach(o => {
        if (o.advancePaymentStatus === 'পেন্ডিং') pendingPay++;
        
        const pkgPrice = o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349);
        const actualTotal = o.totalPrice !== undefined ? Number(o.totalPrice) : pkgPrice;
        
        if (o.advancePaymentStatus === 'কনফার্মড' || o.advancePaymentStatus === 'ভেরিফাইড' || o.advancePaymentStatus === 'Confirmed') {
          revenue += Number(o.advancePayment) || 0;
          halfPay++;
        } else if (o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত') {
          revenue += actualTotal;
        }
        
        if (o.status === 'ডেলিভারড' || o.status === 'Delivered') {
          delivered++;
        } else if (o.status === 'অর্ডার বাতিল' || o.advancePaymentStatus === 'পেমেন্ট বাতিল' || o.advancePaymentStatus === 'বাতিল') {
          rejected++;
        } else {
          pendingDel++;
        }
      });

      if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = all.length;
      if (document.getElementById('statPendingPay')) document.getElementById('statPendingPay').innerText = pendingPay;
      if (document.getElementById('statPendingDel')) document.getElementById('statPendingDel').innerText = pendingDel;
      if (document.getElementById('statRejected')) document.getElementById('statRejected').innerText = rejected;
      if (document.getElementById('statDelivered')) document.getElementById('statDelivered').innerText = delivered;
      if (document.getElementById('statHalfPay')) document.getElementById('statHalfPay').innerText = halfPay;
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
        if (payText === 'কনফার্মড' || payText === 'ভেরিফাইড' || payText === 'Confirmed' || payText === 'সম্পূর্ণ পরিশোধিত') payBadge = 'badge-success';
        if (payText === 'বাতিল' || payText === 'Rejected' || payText === 'পেমেন্ট বাতিল') payBadge = 'badge-danger';

        // Status Badge
        let statusBadge = 'badge-pending';
        let statusText = o.status || 'প্রক্রিয়াকরণ চলছে';
        if (statusText === 'ডেলিভারড' || statusText === 'Delivered' || statusText === 'অর্ডার কনফার্ম') statusBadge = 'badge-success';
        if (statusText === 'অর্ডার বাতিল' || statusText === 'বাতিল') statusBadge = 'badge-danger';

        tr.innerHTML = `
          <td style="font-family: monospace; color: var(--admin-primary);">${o.orderId || ''}</td>
          <td>
            <div style="font-weight: 600; font-size: 0.85rem;">${(()=>{
               if(!o.createdAt) return '-';
               const d = new Date(o.createdAt);
               return d.toLocaleDateString('en-GB') + ' <br><span style="color:var(--admin-text-sub)">' + d.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}) + '</span>';
            })()}</div>
          </td>
          <td>
            <div style="font-weight: 600;">${o.username || ''}</div>
            <div style="font-size: 0.75rem; color: var(--admin-text-sub); margin-bottom: 4px;">${o.userPhone || ''}</div>
            ${o.couponCode ? `<div style="font-size:0.75rem; color:#10b981; font-weight:600; margin-bottom: 4px;">Coupon: ${o.couponCode} (-${o.couponDiscountPercent || 0}%)</div>` : ''}
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
            <button class="btn-action" style="background:var(--admin-primary); padding:4px 8px; font-size:0.75rem;" onclick="viewOrderDetails('${o.id}')"><i class="fa-solid fa-file-lines"></i> Details</button>
          </td>
          <td>
            <div class="action-btn-group">
              ${payText === 'পেন্ডিং' ? `
                <button class="btn-action btn-pay-adv" onclick="updateOrder(event, '${o.id}', 'payment', 'ভেরিফাইড')">কনফার্ম অ্যাডভান্স</button>
                <button class="btn-action btn-pay-reject" onclick="updateOrder(event, '${o.id}', 'payment', 'পেমেন্ট বাতিল')">Reject</button>
              ` : ''}
              
              ${payText === 'কনফার্মড' || payText === 'ভেরিফাইড' || payText === 'Confirmed' ? `
                <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
                  <button class="btn-action btn-pay-full" onclick="updateOrder(event, '${o.id}', 'payment', 'সম্পূর্ণ পরিশোধিত')">Full Paid</button>
                  <div style="display:flex; gap:4px; width:100%;">
                    <button class="btn-action btn-pay-reject" style="flex:1;" onclick="updateOrder(event, '${o.id}', 'payment', 'পেমেন্ট বাতিল')">Reject</button>
                    <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'payment', 'পেন্ডিং')" title="Undo"><i class="fa-solid fa-rotate-left"></i></button>
                  </div>
                </div>
              ` : ''}

              ${payText === 'সম্পূর্ণ পরিশোধিত' ? `
                <button class="btn-action btn-undo" onclick="updateOrder(event, '${o.id}', 'payment', 'ভেরিফাইড')" title="Undo"><i class="fa-solid fa-rotate-left"></i> Undo</button>
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

    
    
    
    function viewOrderDetails(id) {
      const order = allOrders.find(o => o.id === id);
      if(!order) return;
      
      let content = '';
      if(order.couponCode) {
         content += `<div style="margin-bottom:15px; padding:10px; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.3); border-radius:6px;"><strong>Coupon Applied:</strong> <span style="color:#10b981;">${order.couponCode} (-${order.couponDiscountPercent}%)</span></div>`;
      }
      
      if(order.description) {
        content += `<div style="margin-bottom:15px;"><strong>General Description:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">${order.description}</div></div>`;
      }
      
      if (order.pages && Array.isArray(order.pages)) {
         order.pages.forEach((page, idx) => {
            let pageDesc = '';
            let imagesHtml = '';
            
            if (typeof page === 'string') {
                pageDesc = page;
            } else {
                pageDesc = page.description || '';
                if (page.images && page.images.length > 0) {
                    imagesHtml = '<div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">' + 
                        page.images.map(img => `<a href="${img}" target="_blank"><img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; border: 1px solid var(--admin-border);" alt="Image"></a>`).join('') +
                    '</div>';
                }
            }
            
            if(pageDesc || imagesHtml) {
               content += `<div style="margin-bottom:15px;"><strong>Page ${idx + 1} Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">${pageDesc}${imagesHtml}</div></div>`;
            }
         });
      } else {
         // Fallback for old orders
         if(order.page1Desc) {
           content += `<div style="margin-bottom:15px;"><strong>Page 1 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">${order.page1Desc}</div></div>`;
         }
         if(order.page2Desc) {
           content += `<div style="margin-bottom:15px;"><strong>Page 2 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">${order.page2Desc}</div></div>`;
         }
         if(order.page3Desc) {
           content += `<div style="margin-bottom:15px;"><strong>Page 3 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">${order.page3Desc}</div></div>`;
         }
         if(order.page4Desc) {
           content += `<div style="margin-bottom:15px;"><strong>Page 4 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">${order.page4Desc}</div></div>`;
         }
      }
      
      if(!content) {
         content = '<em>No additional details provided.</em>';
      }
      
      document.getElementById('orderDetailsContent').innerHTML = content;
      document.getElementById('orderDetailsModal').style.display = 'flex';
    }

    
    function closeOrderDetailsModal() {
      document.getElementById('orderDetailsModal').style.display = 'none';
    }

    function viewCustomerProfile(phone, name) {
      document.getElementById('cmName').innerText = name || phone;
      document.getElementById('cmPhone').innerText = phone;
      
      let totalO = 0;
      let totalR = 0;
      
      allOrders.forEach(o => {
        if (o.userPhone === phone) {
          totalO++;
          if (o.advancePaymentStatus === 'কনফার্মড' || o.advancePaymentStatus === 'ভেরিফাইড' || o.advancePaymentStatus === 'Confirmed') {
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
      if (badge) {
        if (newCount > 0) {
          badge.innerText = newCount;
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
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
          showToast('Error: ' + data.message);
        }
      } catch (err) {
        showToast('Connection error');
      } finally {
        showLoading(false);
      }
    });

    function showLoading(show) {
      document.getElementById('loadingOverlay').classList.toggle('hidden', !show);
    }
  
    let membershipTiers = [];
    
    async function loadMembership() {
      try {
         const res = await fetch('/api/membership');
         const data = await res.json();
         if(data.success && data.tiers) {
             membershipTiers = data.tiers;
             renderMembershipTiers();
         }
      } catch(e) {
         console.error(e);
      }
    }
    
    function renderMembershipTiers() {
       const container = document.getElementById('membershipTiersContainer');
       if(!container) return;
       container.innerHTML = '';
       membershipTiers.sort((a, b) => a.threshold - b.threshold).forEach((tier, index) => {
           const div = document.createElement('div');
           div.style.cssText = 'background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px solid var(--admin-border); display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));';
           div.innerHTML = `
              <div class="input-group">
                 <label>Tier Name (English)</label>
                 <input type="text" value="${tier.nameEn || tier.name || ''}" oninput="updateMembershipData(${index}, 'nameEn', this.value)">
              </div>
              <div class="input-group">
                 <label>Tier Name (Bangla)</label>
                 <input type="text" value="${tier.bnName || tier.name || ''}" oninput="updateMembershipData(${index}, 'bnName', this.value)">
              </div>
              <div class="input-group">
                 <label>Minimum Spent (৳)</label>
                 <input type="number" value="${tier.threshold}" oninput="updateMembershipData(${index}, 'threshold', this.value)">
              </div>
              <div class="input-group">
                 <label>Maximum Spent (৳) (Optional)</label>
                 <input type="number" value="${tier.maxThreshold !== null && tier.maxThreshold !== undefined ? tier.maxThreshold : ''}" oninput="updateMembershipData(${index}, 'maxThreshold', this.value)">
              </div>
              <div class="input-group">
                 <label>Discount (%)</label>
                 <input type="number" value="${tier.discount}" oninput="updateMembershipData(${index}, 'discount', this.value)">
              </div>
              
              <div class="input-group" style="grid-column: 1 / -1;">
                 <label style="margin-bottom: 8px; display: block; color: var(--admin-text-sub);">Select Icon</label>
                 <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${[
                        'fa-solid fa-crown', 'fa-solid fa-gem', 'fa-solid fa-heart', 
                        'fa-solid fa-star', 'fa-solid fa-award', 'fa-solid fa-medal', 
                        'fa-solid fa-fire', 'fa-solid fa-bolt', 'fa-solid fa-shield-halved', 
                        'fa-solid fa-trophy', 'fa-solid fa-certificate', 'fa-solid fa-ribbon',
                        'fa-solid fa-check-circle', 'fa-solid fa-leaf', 'fa-solid fa-diamond'
                    ].map(ic => `
                        <div onclick="updateMembershipData(${index}, 'icon', '${ic}')" 
                             style="width: 42px; height: 42px; display: flex; justify-content: center; align-items: center; background: ${tier.icon === ic ? 'var(--admin-primary)' : 'rgba(0,0,0,0.2)'}; border: 1px solid ${tier.icon === ic ? 'var(--admin-primary)' : 'var(--admin-border)'}; border-radius: 8px; cursor: pointer; color: ${tier.icon === ic ? '#fff' : 'var(--admin-text)'}; transition: all 0.2s;" title="${ic}">
                            <i class="${ic}" style="font-size: 1.2rem;"></i>
                        </div>
                    `).join('')}
                 </div>
              </div>
              <div class="input-group">
                 <label>Background Color</label>
                 <input type="color" value="${tier.bgColor}" oninput="updateMembershipData(${index}, 'bgColor', this.value)" style="width: 100%; height: 42px; padding: 2px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--admin-border); cursor:pointer;">
              </div>
              <div class="input-group" style="display:flex; align-items:flex-end;">
                 <button class="btn-admin" style="background:#ef4444;" onclick="removeMembershipTier(${index})"><i class="fa-solid fa-trash"></i> Remove</button>
              </div>
           `;
           container.appendChild(div);
       });
       updateMembershipPreview();
    }
    
    function updateMembershipData(index, key, value) {
        if(key === 'threshold' || key === 'maxThreshold' || key === 'discount') {
             value = (value === '' || value === null) ? null : Number(value);
        }
        membershipTiers[index][key] = value;
        updateMembershipPreview();
    }
    
    function addMembershipTier() {
        membershipTiers.push({ nameEn: 'New Member', bnName: 'নতুন মেম্বার', name: 'নতুন মেম্বার', threshold: 0, maxThreshold: null, discount: 0, icon: 'fa-solid fa-star', bgColor: '#4ade80' });
        renderMembershipTiers();
    }
    
    function removeMembershipTier(index) {
        membershipTiers.splice(index, 1);
        renderMembershipTiers();
    }
    
    // E2B for preview
    function e2b(str) {
       if(!str && str !== 0) return '';
       const bengaliDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
       return str.toString().replace(/[0-9]/g, w => bengaliDigits[w]);
    }
    
    function updateMembershipPreview() {
        const preview = document.getElementById('membershipLivePreview');
        if(!preview) return;
        preview.innerHTML = '';
        
        membershipTiers.forEach(tier => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '25px';
            wrapper.style.padding = '15px';
            wrapper.style.background = 'rgba(0,0,0,0.2)';
            wrapper.style.borderRadius = '12px';
            wrapper.style.border = '1px solid var(--admin-border)';
            
            const avatarPreview = `
                <div style="display:flex; align-items:center; gap:15px; margin-bottom: 15px;">
                    <div style="width: 78px; height: 78px; border-radius: 50%; display: flex; justify-content: center; align-items: center; position: relative; color: #fff; font-size: 2.1rem; font-weight: bold; background: linear-gradient(135deg, var(--admin-primary), #80002a); padding: 4px;">
                        <div style="position: absolute; inset: 0; border-radius: 50%; padding: 3px; background: conic-gradient(from 0deg, ${tier.bgColor}, #ffffff, ${tier.bgColor}); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; pointer-events: none;"></div>
                        <div style="width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--admin-primary), #80002a);">
                            U
                        </div>
                        <div style="position: absolute; top: -10px; right: -8px; color: ${tier.bgColor}; font-size: 1.6rem; z-index: 25; filter: drop-shadow(0 2px 4px ${tier.bgColor}66); transform: rotate(15deg);">
                            <i class="${tier.icon}"></i>
                        </div>
                        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background: ${tier.bgColor}; color: #fff; font-size: 0.65rem; padding: 2px 10px; border-radius: 12px; font-weight: bold; white-space: nowrap; z-index: 25; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            ${(tier.nameEn || tier.name || '').toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0; color: var(--admin-text); font-size: 1.1rem; font-weight: 600;">User Name</h4>
                        <span style="color: ${tier.bgColor}; background: ${tier.bgColor}22; border: 1px solid ${tier.bgColor}66; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-top: 5px;">
                            <i class="${tier.icon}"></i> ${tier.bnName || tier.name}
                        </span>
                    </div>
                </div>
            `;

            const bannerPreview = `
                <div style="padding: 12px 20px; background: linear-gradient(135deg, ${tier.bgColor}22, rgba(255,255,255,0.05)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px dashed ${tier.bgColor}66; border-radius: 12px; color: #fff; font-size: 0.84rem; text-align: center;">
                    <i class="${tier.icon}" style="color: ${tier.bgColor};"></i> <strong>অভিনন্দন!</strong> আপনি আমাদের সর্বোচ্চ <strong>${tier.bnName || tier.name}</strong> হিসেবে প্রতিটি অর্ডারে <strong>${e2b(tier.discount)}% ডিসকাউন্ট</strong> ও প্রায়োরিটি সাপোর্ট উপভোগ করছেন। (Required: ৳${e2b(tier.threshold)}${tier.maxThreshold ? ' - ৳' + e2b(tier.maxThreshold) : ''})
                </div>
            `;

            wrapper.innerHTML = avatarPreview + bannerPreview;
            preview.appendChild(wrapper);
        });
        if(membershipTiers.length === 0) {
            preview.innerHTML = '<p style="color:#888;">No membership tiers configured.</p>';
        }
    }
    
    async function saveMembershipTiers() {
        try {
            const res = await fetch('/api/admin/membership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
                body: JSON.stringify({ tiers: membershipTiers })
            });
            if(res.ok) showToast('Membership settings saved successfully!');
            else showToast('Error saving membership settings');
        } catch(e) {
            showToast('Network error while saving');
        }
    }
    let sortableInst = null;
    function openReorderModal() {
       document.getElementById('reorderModal').style.display = 'flex';
       const list = document.getElementById('reorderList');
       list.innerHTML = '';
       
       const sorted = Object.entries(adminPackagesConfig).sort((a,b) => (a[1].order || 0) - (b[1].order || 0));
       for(const [pkgName, data] of sorted) {
          const li = document.createElement('li');
          li.className = 'reorder-item';
          li.setAttribute('data-id', pkgName);
          li.innerHTML = '<i class="fa-solid fa-grip-vertical"></i> ' + pkgName;
          list.appendChild(li);
       }
       
       if(sortableInst) sortableInst.destroy();
       sortableInst = new Sortable(list, {
          animation: 150,
          ghostClass: 'dragging'
       });
    }
    
    function closeReorderModal() {
       document.getElementById('reorderModal').style.display = 'none';
    }
    
    async function saveReorder() {
       const list = document.getElementById('reorderList');
       const items = list.querySelectorAll('li');
       const orderData = {};
       items.forEach((item, index) => {
          orderData[item.getAttribute('data-id')] = index + 1;
       });
       
       try {
          const res = await fetch('/api/admin/packages/reorder', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
             body: JSON.stringify({ orderData })
          });
          if(res.ok) {
             for(const [pkg, order] of Object.entries(orderData)) {
                if(adminPackagesConfig[pkg]) adminPackagesConfig[pkg].order = order;
             }
             renderAdminPackages();
             closeReorderModal();
             showToast('Packages reordered successfully!');
          } else {
             showToast('Failed to reorder');
          }
       } catch(e) {
          showToast('Network error');
       }
    }

    let currentDemos = [];
    
    async function loadDemosAdmin() {
      showLoading(true);
      try {
        const res = await fetch('/api/admin/demos', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        if (res.status === 401 || res.status === 403) return logout();
        const data = await res.json();
        if (data.success) {
          currentDemos = data.demos || [];
          renderDemosAdmin();
        }
      } catch (err) {
        console.error(err);
      } finally {
        showLoading(false);
      }
    }
    
    function renderDemosAdmin() {
      const container = document.getElementById('demosContainer');
      container.innerHTML = '';
      if(currentDemos.length === 0) {
        container.innerHTML = '<div style="color:#888; text-align:center; padding:20px;">No demos found. Click "Add Demo" to create one.</div>';
        return;
      }
      currentDemos.forEach((demo, idx) => {
        container.innerHTML += `
                              <div class="tier-box" style="padding: 15px; border: 1px solid var(--admin-border); border-radius: 8px; background: rgba(0,0,0,0.2); display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <input type="text" class="demo-name" style="flex: 1 1 150px; min-width: 0; padding: 10px; border-radius: 6px; border: 1px solid var(--admin-border); background: var(--admin-bg); color: var(--admin-text);" value="${demo.name}" placeholder="Demo Name">
            <select class="demo-category" style="flex: 1 1 150px; min-width: 0; padding: 10px; border-radius: 6px; border: 1px solid var(--admin-border); background: var(--admin-bg); color: var(--admin-text);">
              <option value="Birthday" ${demo.category === 'Birthday' ? 'selected' : ''}>Birthday Wish</option>
              <option value="Anniversary" ${demo.category === 'Anniversary' ? 'selected' : ''}>Anniversary</option>
              <option value="Relationship" ${demo.category === 'Relationship' ? 'selected' : ''}>Relationship</option>
              <option value="Friendship" ${demo.category === 'Friendship' ? 'selected' : ''}>Friendship Wish</option>
              <option value="Others" ${!['Birthday','Anniversary','Relationship','Friendship'].includes(demo.category) ? 'selected' : ''}>Others</option>
            </select>
            <input type="url" class="demo-url" style="flex: 2 1 200px; min-width: 0; padding: 10px; border-radius: 6px; border: 1px solid var(--admin-border); background: var(--admin-bg); color: var(--admin-text);" value="${demo.url}" placeholder="URL (e.g. https://lovewebbd.com/...)">
            <input type="hidden" class="demo-id" value="${demo.id || 'demo_'+Date.now()+'_'+idx}">
            <button class="btn-admin" style="background:#3b82f6; flex: 0 0 auto;" onclick="previewDemo(this)" title="Preview"><i class="fa-solid fa-eye"></i></button>
            <button class="btn-admin" style="background:var(--admin-danger); flex: 0 0 auto;" onclick="deleteDemoRow(${idx})" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        `;
      });
    }
    
    function addDemoRow() {
      currentDemos.push({ id: 'demo_'+Date.now(), name: '', url: '' });
      renderDemosAdmin();
    }
    
        function deleteDemoRow(idx) {
      if(confirm('Are you sure you want to remove this demo?')) {
        currentDemos.splice(idx, 1);
        renderDemosAdmin();
      }
    }
    
    function previewDemo(btn) {
      const urlInput = btn.parentElement.querySelector('.demo-url');
      let url = urlInput.value.trim();
      if (!url) {
        showToast('Please enter a URL to preview.');
        return;
      }
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      document.getElementById('demoPreviewPlaceholder').style.display = 'none';
      document.getElementById('demoPreviewFrame').src = url;
    }
    
    function toggleDemoPreview(mode) {
      const container = document.getElementById('demoPreviewContainer');
      const mobileBtn = document.getElementById('previewMobileBtn');
      const pcBtn = document.getElementById('previewPcBtn');
      
      if (mode === 'mobile') {
        container.style.width = '375px';
        container.style.height = '667px';
        mobileBtn.style.background = 'var(--primary-pink)';
        pcBtn.style.background = 'transparent';
      } else {
        container.style.width = '100%';
        container.style.height = '100%';
        pcBtn.style.background = 'var(--primary-pink)';
        mobileBtn.style.background = 'transparent';
      }
    }
    
    async function saveDemos() {
      const container = document.getElementById('demosContainer');
      const boxes = container.querySelectorAll('.tier-box');
      const updatedDemos = [];
      let valid = true;
      
      boxes.forEach(box => {
        const name = box.querySelector('.demo-name').value.trim();
        const url = box.querySelector('.demo-url').value.trim();
        const category = box.querySelector('.demo-category').value;
        const id = box.querySelector('.demo-id').value;
        if(!name || !url) valid = false;
        updatedDemos.push({ id, name, url, category });
      });
      
      if(!valid) return showToast('Please fill in all demo names and URLs.');
      
      showLoading(true);
      try {
        const res = await fetch('/api/admin/demos', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + adminToken 
          },
          body: JSON.stringify({ demos: updatedDemos })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Demos saved successfully!');
          currentDemos = updatedDemos;
          renderDemosAdmin();
        } else {
          showToast('Failed to save demos: ' + data.message);
        }
      } catch (err) {
        showToast('Error saving demos.');
        console.error(err);
      } finally {
        showLoading(false);
      }
    }
</html>
