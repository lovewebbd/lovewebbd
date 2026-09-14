const fs = require('fs');
let c = fs.readFileSync('admin/index.html', 'utf8');
c = c.replace(
  "document.getElementById('couponForm')?.addEventListener('submit', async(e) => {",
  "document.getElementById('couponForm').addEventListener('submit', async(e) => {"
);
fs.writeFileSync('admin/index.html', c);
