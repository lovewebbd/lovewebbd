const fs = require('fs');
let c = fs.readFileSync('admin/index.html', 'utf8');

c = c.replace(
  "document.getElementById('couponForm').addEventListener('submit', async(e) => {",
  "document.addEventListener('DOMContentLoaded', () => {\n    document.getElementById('couponForm')?.addEventListener('submit', async(e) => {"
);

c = c.replace(
  "document.getElementById('paymentSettingsForm')?.addEventListener('submit', async(e) => {\n      e.preventDefault();\n      saveSettings();\n    });",
  "document.getElementById('paymentSettingsForm')?.addEventListener('submit', async(e) => {\n      e.preventDefault();\n      saveSettings();\n    });\n    });"
);

fs.writeFileSync('admin/index.html', c);
