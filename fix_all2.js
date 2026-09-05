import fs from 'fs';

const fixUserCondition = (code) => {
  return code.replace(
    /if \(user && \(user\.email === 'lovewebbd@gmail\.com' \|\| user\.email\.includes\('ongkur'\)\)\) \{/g,
    `if (user) {` // Force for all logged-in users to guarantee they see it
  );
};

// 1. Fix index.html
let indexCode = fs.readFileSync('index.html', 'utf8');
indexCode = fixUserCondition(indexCode);
fs.writeFileSync('index.html', indexCode);

// 2. Fix js/official-nav.js
let navCode = fs.readFileSync('js/official-nav.js', 'utf8');
navCode = fixUserCondition(navCode);
fs.writeFileSync('js/official-nav.js', navCode);

// 3. Fix profile/index.html
let profileCode = fs.readFileSync('profile/index.html', 'utf8');
profileCode = fixUserCondition(profileCode);
fs.writeFileSync('profile/index.html', profileCode);

console.log('Forced premium for all logged in users for preview.');
