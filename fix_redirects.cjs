const fs = require('fs');

let c1 = fs.readFileSync('js/auth.js', 'utf8');
c1 = c1.replace(/window\.location\.href = '\.\.\/dashboard\/index\.html';/g, "window.location.href = '../index.html';");
fs.writeFileSync('js/auth.js', c1);

let c2 = fs.readFileSync('js/google-signup.js', 'utf8');
c2 = c2.replace(/window\.location\.href = '\.\.\/dashboard\/index\.html';/g, "window.location.href = '../index.html';");
fs.writeFileSync('js/google-signup.js', c2);

