import fs from 'fs';
let code = fs.readFileSync('profile/index.html', 'utf8');

const regexPremium = /if\s*\(totalSpent\s*>=\s*2000\)\s*\{/g;
code = code.replace(regexPremium, "const avatarWrap = document.querySelector('.profile-avatar-wrap');\n                if (totalSpent >= 2000) {\n                  if(avatarWrap) avatarWrap.classList.add('premium-frame');");

const regexElite = /else\s*if\s*\(totalSpent\s*>=\s*1000\)\s*\{/g;
code = code.replace(regexElite, "else if (totalSpent >= 1000) {\n                  if(avatarWrap) avatarWrap.classList.add('elite-frame');");

fs.writeFileSync('profile/index.html', code);
console.log('Fixed profile avatar frames.');
