const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

// Coupons table patch
html = html.replace('              <tbody id="couponsBody"></tbody>', '              <tbody id="couponsBody">\n                <!-- Rows -->\n              </tbody>');

html = html.replace('              <td><strong>${c.code}</strong></td>', '              <td data-label="Code"><strong>${c.code}</strong></td>');
html = html.replace('              <td>${c.discountPercent}%</td>', '              <td data-label="Discount">${c.discountPercent}%</td>');
html = html.replace('              <td>${c.expiryDate || \\\'No Expiry\\\'}</td>', '              <td data-label="Expiry">${c.expiryDate || \\\'No Expiry\\\'}</td>');
html = html.replace('              <td>${c.maxUsesPerUser || \\\'Unlimited\\\'}</td>', '              <td data-label="Max Uses">${c.maxUsesPerUser || \\\'Unlimited\\\'}</td>');
html = html.replace('              <td><button class="btn-action btn-pay-reject" onclick="deleteCoupon(\\\'${c.code}\\\')">Delete</button></td>', '              <td data-label="Action"><button class="btn-action btn-pay-reject" onclick="deleteCoupon(\\\'${c.code}\\\')">Delete</button></td>');

fs.writeFileSync('admin/index.html', html);
