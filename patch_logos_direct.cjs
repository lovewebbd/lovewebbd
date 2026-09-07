const fs = require('fs');
let html = fs.readFileSync('place-order/index.html', 'utf8');

html = html.replace(
  '<img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/BKash_logo.svg" alt="bKash" style="height: 24px;">',
  '<img src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg" alt="bKash" style="height: 28px;">'
);

html = html.replace(
  '<img src="https://upload.wikimedia.org/wikipedia/commons/7/77/Nagad_Logo_2019.svg" alt="Nagad" style="height: 24px;">',
  '<img src="https://www.logo.wine/a/logo/Nagad/Nagad-Vertical-Logo.wine.svg" alt="Nagad" style="height: 32px;">'
);

fs.writeFileSync('place-order/index.html', html);
