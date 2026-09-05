import fs from 'fs';
let html = fs.readFileSync('admin/index.html', 'utf8');

const target1 = `<div style="font-size: 0.75rem; color: var(--admin-text-sub); margin-bottom: 4px;">\${o.userPhone || ''}</div>`;
const replace1 = `<div style="font-size: 0.75rem; color: var(--admin-text-sub); margin-bottom: 4px;">\${o.userPhone || ''}</div>
            \${o.couponCode ? \`<div style="font-size:0.75rem; color:#10b981; font-weight:600; margin-bottom: 4px;">Coupon: \${o.couponCode} (-\${o.couponDiscountPercent || 0}%)</div>\` : ''}`;
html = html.replace(target1, replace1);

const target2 = `let content = '';`;
const replace2 = `let content = '';
      if(order.couponCode) {
         content += \`<div style="margin-bottom:15px; padding:10px; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.3); border-radius:6px;"><strong>Coupon Applied:</strong> <span style="color:#10b981;">\${order.couponCode} (-\${order.couponDiscountPercent}%)</span></div>\`;
      }`;
html = html.replace(target2, replace2);

fs.writeFileSync('admin/index.html', html);
console.log('Admin table and modal patched');
