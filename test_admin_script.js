    // --- Packages Logic ---
    let adminPackagesConfig = {};
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
      
      for(const [pkgName, pkgData] of Object.entries(adminPackagesConfig)) {
        container.innerHTML += `
          <div class="settings-panel" style="position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <h2 style="color:var(--admin-primary); margin:0;">${pkgName} Package</h2>
              <button type="button" class="btn-action btn-pay-reject" style="background:var(--admin-danger); color:white; border:none; padding:8px; border-radius:6px; cursor:pointer;" onclick="deletePackage('${pkgName}')" title="Delete Package">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <form class="packageForm" data-pkg="${pkgName}">
              <div class="input-group">
                <label>Base Price (৳)</label>
                <input type="number" class="pkgBasePrice" required value="${pkgData.base || ''}">
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
              <button type="submit" class="btn-admin">Save ${pkgName}</button>
            </form>
          </div>
        `;
      }
      
      // Re-attach listeners
      document.querySelectorAll('.packageForm').forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const pkgName = form.getAttribute('data-pkg');
          const payload = {
            base: Number(form.querySelector('.pkgBasePrice').value),
            original: Number(form.querySelector('.pkgOriginalPrice').value),
            deliveryTime: Number(form.querySelector('.pkgDeliveryTime').value),
            minPages: Number(form.querySelector('.pkgMinPages').value),
            maxPages: Number(form.querySelector('.pkgMaxPages').value),
            features: form.querySelector('.pkgFeatures').value.split('\n').filter(l => l.trim() !== ''),
            tooltip: form.querySelector('.pkgTooltip').value.replace(/\n/g, '<br>')
          };
          try {
            const res = await fetch('/api/admin/packages/' + pkgName, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify(payload)
            });
            if(res.ok) alert(pkgName + ' package updated!');
            else alert('Error updating package');
          } catch(e) { alert('Error updating package'); }
        });
      });
    }

    async function addNewPackage() {
      const pkgName = prompt("Enter new package name (e.g. 'Standard'):");
      if(!pkgName || !pkgName.trim()) return;
      const name = pkgName.trim();
      if(adminPackagesConfig[name]) return alert('Package already exists!');
      
      adminPackagesConfig[name] = { base: 0, original: 0, deliveryTime: 7, minPages: 3, maxPages: 4, features: [], tooltip: '' };
      renderAdminPackages();
    }

    async function deletePackage(pkgName) {
      if(!confirm('Are you sure you want to delete the ' + pkgName + ' package?')) return;
      try {
        const res = await fetch('/api/admin/packages/delete/' + pkgName, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        if(res.ok) {
           delete adminPackagesConfig[pkgName];
           renderAdminPackages();
           alert('Package deleted');
        } else {
           alert('Failed to delete package');
        }
      } catch(e) {
        alert('Error deleting package');
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
        else alert(data.message);
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
        } else alert(data.message);
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
        if(data.success) alert('Settings saved');
        else alert(data.message);
      } catch(e) { alert('Error saving settings'); }
    }
