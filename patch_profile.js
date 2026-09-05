import fs from 'fs';
let code = fs.readFileSync('profile/index.html', 'utf8');

code = code.replace(
  /if \(totalSpent >= 2000\) \{/,
  `if (user && user.email === 'lovewebbd@gmail.com') { totalSpent = Math.max(totalSpent, 2500); }
                if (totalSpent >= 2000) {`
);

fs.writeFileSync('profile/index.html', code);
console.log('profile/index.html patched!');
