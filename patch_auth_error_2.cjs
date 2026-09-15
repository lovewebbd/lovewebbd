const fs = require('fs');
let c = fs.readFileSync('js/auth.js', 'utf8');

c = c.replace(
    /showNotification\('গুগল লগইন ব্যর্থ হয়েছে।', 'error'\);/g,
    `showNotification('গুগল লগইন ব্যর্থ হয়েছে: ' + (error.message || 'Unknown Error'), 'error');`
);

fs.writeFileSync('js/auth.js', c);
