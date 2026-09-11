const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, 'admin', 'index.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

if (!content.includes('order.duePaymentScreenshot')) {
    const duePaymentHtml = `
      if (order.duePaymentScreenshot) {
         content += \`<div style="margin-bottom:15px;"><strong>Due Payment Screenshot:</strong><br><div style="margin-top:5px;"><a href="#" onclick="openImageModal('\${order.duePaymentScreenshot}', event)"><img src="\${order.duePaymentScreenshot}" style="max-width: 100%; max-height: 300px; border-radius:6px; border:1px solid var(--admin-border);" alt="Due Payment Screenshot"></a></div></div>\`;
      }
`;
    content = content.replace(
        'if (order.paymentScreenshot) {',
        duePaymentHtml + '      if (order.paymentScreenshot) {'
    );
    fs.writeFileSync(adminHtmlPath, content);
    console.log('Admin HTML patched to show due payment ss in details modal.');
}
