const fs = require('fs');

// Place Order Page
let html = fs.readFileSync('place-order/index.html', 'utf8');

// Replace Bkash Logo
html = html.replace(
  '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BKash_Logo.svg/1200px-BKash_Logo.svg.png" alt="bKash" class="method-logo">',
  '<img src="../img/bkash-logo.svg" alt="bKash" class="method-logo">'
);

// Replace Nagad Logo 
html = html.replace(
  '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png" alt="Nagad" class="method-logo">',
  '<img src="../img/nagad-logo.svg" alt="Nagad" class="method-logo">'
);

fs.writeFileSync('place-order/index.html', html);
