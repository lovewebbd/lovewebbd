import fs from 'fs';

let html = fs.readFileSync('place-order/index.html', 'utf8');

// 1. Add Coupon UI below the package grid
const packageGridHTML = `<div class="package-grid">`;
const newCouponHTML = `
      <!-- Coupon Code Section -->
      <div class="order-form-group" style="margin-top:20px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 15px;">
        <label style="color: #10b981;"><i class="fa-solid fa-ticket"></i> কুপন কোড (যদি থাকে)</label>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="couponCode" placeholder="Enter Coupon Code" style="flex:1; background: var(--bg-dark); border: 1px solid rgba(255,255,255,0.1); color: var(--text-light); padding: 12px; border-radius: 8px; font-family: 'Inter', sans-serif;">
          <button type="button" onclick="applyCoupon()" style="background: #10b981; color: #fff; border: none; padding: 0 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s;"><i class="fa-solid fa-check"></i> Apply</button>
        </div>
        <div id="couponMessage" style="margin-top: 8px; font-size: 0.85rem; font-weight: 500;"></div>
      </div>
`;
html = html.replace('</div>\n      \n      <!-- Payment Section', '</div>' + newCouponHTML + '\n      \n      <!-- Payment Section');


// 2. Add Coupon JS Logic
const jsLogicPoint = `let userDiscountPercent = 0;`;
const newJsLogic = `let userDiscountPercent = 0;
    let appliedCouponCode = null;
    let couponDiscountPercent = 0;

    async function applyCoupon() {
      const code = document.getElementById('couponCode').value.trim();
      const msgDiv = document.getElementById('couponMessage');
      if(!code) {
        msgDiv.innerHTML = '<span style="color:#ef4444;">Please enter a code</span>';
        return;
      }
      
      const username = localStorage.getItem('username');
      if(!username) {
        msgDiv.innerHTML = '<span style="color:#ef4444;">Please login first</span>';
        return;
      }
      
      msgDiv.innerHTML = '<span style="color:#eab308;"><i class="fa-solid fa-spinner fa-spin"></i> Checking...</span>';
      
      try {
        const response = await fetch('/api/validate-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, username })
        });
        const data = await response.json();
        
        if(data.success) {
          appliedCouponCode = code;
          couponDiscountPercent = data.discountPercent;
          msgDiv.innerHTML = \`<span style="color:#10b981;"><i class="fa-solid fa-check-circle"></i> Coupon applied! \${couponDiscountPercent}% extra discount.</span>\`;
          updateDisplayedPrices();
        } else {
          appliedCouponCode = null;
          couponDiscountPercent = 0;
          msgDiv.innerHTML = \`<span style="color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> \${data.message}</span>\`;
          updateDisplayedPrices();
        }
      } catch(err) {
        msgDiv.innerHTML = '<span style="color:#ef4444;">Error checking coupon</span>';
      }
    }
`;
html = html.replace(jsLogicPoint, newJsLogic);

// 3. Update updateDisplayedPrices
const updatePricesLogic = `const discountAmt = Math.floor(packages[pkgName].base * (userDiscountPercent / 100));`;
const newUpdatePricesLogic = `const totalDiscountPercent = userDiscountPercent + couponDiscountPercent;
          const discountAmt = Math.floor(packages[pkgName].base * (totalDiscountPercent / 100));`;
html = html.replace(updatePricesLogic, newUpdatePricesLogic);

const finalPriceLogic = `priceDiv.innerHTML = \`<span class="pkg-cross">৳\${packages[pkgName].base}</span> <span style="color:#10b981;">৳\${finalPrice}</span> <div style="font-size:0.75rem; color:#c084fc; margin-top:2px;">(-\${userDiscountPercent}% মেম্বারশিপ ছাড়)</div>\`;`;
const newFinalPriceLogic = `
          let desc = '';
          if(userDiscountPercent > 0) desc += \`-\${userDiscountPercent}% Member \`;
          if(couponDiscountPercent > 0) desc += \`-\${couponDiscountPercent}% Coupon\`;
          
          priceDiv.innerHTML = \`<span class="pkg-cross">৳\${packages[pkgName].base}</span> <span style="color:#10b981;">৳\${finalPrice}</span> \${desc ? \`<div style="font-size:0.75rem; color:#c084fc; margin-top:2px;">(\${desc})</div>\` : ''}\`;
`;
html = html.replace(finalPriceLogic, newFinalPriceLogic);

// 4. Update the order submission to pass the couponCode
const submitLogic = `advancePaymentPhone: document.getElementById('paymentPhone').value.trim()`;
const newSubmitLogic = `advancePaymentPhone: document.getElementById('paymentPhone').value.trim(),
        couponCode: appliedCouponCode`;
html = html.replace(submitLogic, newSubmitLogic);

// 5. Update the payment numbers fetch and logos
const paymentHTML = `
        <div class="payment-instructions" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="color: var(--primary-color); margin-bottom: 10px; font-size: 1.1rem;">অ্যাডভান্স পেমেন্ট (১০০ টাকা)</h4>
          <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; line-height: 1.6; margin-bottom: 15px;">
            আপনার অর্ডারটি কনফার্ম করতে ১০০ টাকা অ্যাডভান্স পেমেন্ট করতে হবে। নিচের যেকোনো নাম্বারে Send Money করুন।
          </p>
          <div class="payment-methods" style="display: flex; gap: 15px; flex-wrap: wrap;">
            <div class="method-card bkash" style="flex: 1; min-width: 150px; background: rgba(226, 19, 110, 0.1); border: 1px solid rgba(226, 19, 110, 0.3); padding: 15px; border-radius: 10px; text-align: center;">
              <div style="font-weight: 700; color: #e2136e; font-size: 1.1rem; margin-bottom: 5px;">বিকাশ (Personal)</div>
              <div style="font-size: 1.2rem; font-weight: 800; letter-spacing: 1px;">01882894174</div>
            </div>
            <div class="method-card nagad" style="flex: 1; min-width: 150px; background: rgba(246, 148, 29, 0.1); border: 1px solid rgba(246, 148, 29, 0.3); padding: 15px; border-radius: 10px; text-align: center;">
              <div style="font-weight: 700; color: #f6941d; font-size: 1.1rem; margin-bottom: 5px;">নগদ (Personal)</div>
              <div style="font-size: 1.2rem; font-weight: 800; letter-spacing: 1px;">01882894174</div>
            </div>
          </div>
        </div>
`;

const newPaymentHTML = `
        <div class="payment-instructions" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="color: var(--primary-color); margin-bottom: 10px; font-size: 1.1rem;">অ্যাডভান্স পেমেন্ট (১০০ টাকা)</h4>
          <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; line-height: 1.6; margin-bottom: 15px;">
            আপনার অর্ডারটি কনফার্ম করতে ১০০ টাকা অ্যাডভান্স পেমেন্ট করতে হবে। নিচের যেকোনো নাম্বারে Send Money করুন।
          </p>
          <div class="payment-methods" style="display: flex; gap: 15px; flex-wrap: wrap;">
            <div class="method-card bkash" style="flex: 1; min-width: 150px; background: rgba(226, 19, 110, 0.1); border: 1px solid rgba(226, 19, 110, 0.3); padding: 15px; border-radius: 10px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px;">
              <img src="https://download.logo.wine/logo/BKash/BKash-Logo.wine.png" alt="bKash Logo" style="height: 40px; object-fit: contain;">
              <div style="font-size: 1.2rem; font-weight: 800; letter-spacing: 1px; color: #e2136e;" id="bkashNumberDisplay">Loading...</div>
            </div>
            <div class="method-card nagad" style="flex: 1; min-width: 150px; background: rgba(246, 148, 29, 0.1); border: 1px solid rgba(246, 148, 29, 0.3); padding: 15px; border-radius: 10px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px;">
              <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad Logo" style="height: 40px; object-fit: contain;">
              <div style="font-size: 1.2rem; font-weight: 800; letter-spacing: 1px; color: #f6941d;" id="nagadNumberDisplay">Loading...</div>
            </div>
          </div>
        </div>
`;

if (html.includes('<div class="method-card bkash"')) {
   const paymentStart = html.indexOf('<div class="payment-instructions"');
   const paymentEnd = html.indexOf('</div>\n        </div>', paymentStart) + 20;
   html = html.substring(0, paymentStart) + newPaymentHTML + html.substring(paymentEnd);
}

// 6. Fetch settings logic
const fetchSettingsLogic = `
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if(data.success && data.settings) {
          document.getElementById('bkashNumberDisplay').innerText = data.settings.bkashNumber || 'Not set';
          document.getElementById('nagadNumberDisplay').innerText = data.settings.nagadNumber || 'Not set';
        }
      } catch(e) {
        document.getElementById('bkashNumberDisplay').innerText = 'Error';
        document.getElementById('nagadNumberDisplay').innerText = 'Error';
      }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
      loadUserDiscount();
      loadSettings();
    });
`;
html = html.replace("document.addEventListener('DOMContentLoaded', loadUserDiscount);", fetchSettingsLogic);


fs.writeFileSync('place-order/index.html', html);
console.log('place-order/index.html patched');
