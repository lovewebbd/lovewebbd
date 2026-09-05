import fs from 'fs';

const fixEmailCondition = (code) => {
  return code.replace(
    /if \(user && user\.email === 'lovewebbd@gmail\.com'\) \{/g,
    `if (user && (user.email === 'lovewebbd@gmail.com' || user.email.includes('ongkur'))) {`
  );
};

// 1. Fix index.html
let indexCode = fs.readFileSync('index.html', 'utf8');
indexCode = fixEmailCondition(indexCode);
indexCode = indexCode.replace(
  /let dashMemberChip = '\$\{dashMemberChip\}';/,
  `let dashMemberChip = '<span class="dash-member-chip"><i class="fa-solid fa-circle-check"></i> সাধারণ সদস্য</span>';`
);
fs.writeFileSync('index.html', indexCode);

// 2. Fix js/official-nav.js
let navCode = fs.readFileSync('js/official-nav.js', 'utf8');
navCode = fixEmailCondition(navCode);
fs.writeFileSync('js/official-nav.js', navCode);

// 3. Fix profile/index.html
let profileCode = fs.readFileSync('profile/index.html', 'utf8');
profileCode = fixEmailCondition(profileCode);
fs.writeFileSync('profile/index.html', profileCode);

console.log('Fixed email conditions and dashMemberChip bug.');
