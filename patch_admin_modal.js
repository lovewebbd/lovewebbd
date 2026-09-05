import fs from 'fs';
let html = fs.readFileSync('admin/index.html', 'utf8');

const oldModalHtml = `const html = \`
      <div style="margin-bottom:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px;">
        <h3 style="margin-bottom:10px; color:var(--primary-color);">Order #\${order.id}</h3>
        <p><strong>User:</strong> \${order.username}</p>
        <p><strong>Contact:</strong> \${order.contactPhone}</p>`;

const newModalHtml = `const html = \`
      <div style="margin-bottom:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px;">
        <h3 style="margin-bottom:10px; color:var(--primary-color);">Order #\${order.id}</h3>
        <p><strong>User:</strong> \${order.username}</p>
        <p><strong>Contact:</strong> \${order.contactPhone}</p>
        \${order.couponCode ? \`<p><strong>Coupon Applied:</strong> <span style="color:#10b981;">\${order.couponCode} (-\${order.couponDiscountPercent}%)</span></p>\` : ''}`;

if (html.includes(oldModalHtml)) {
  html = html.replace(oldModalHtml, newModalHtml);
  fs.writeFileSync('admin/index.html', html);
  console.log('Admin modal patched');
} else {
  console.log('Modal patch mismatch');
}
