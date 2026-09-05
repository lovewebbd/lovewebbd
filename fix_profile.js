import fs from 'fs';
let code = fs.readFileSync('profile/index.html', 'utf8');
code = code.replace(/if \(user\) \{ totalSpent = Math\.max\(totalSpent, 2500\); \}/g, '');
fs.writeFileSync('profile/index.html', code);
console.log('Removed from profile/index.html');
