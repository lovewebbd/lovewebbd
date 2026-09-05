import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');
code = code.replace(
  /const btn = document\.createElement\('button'\);/,
  `const sessionCheckStr = localStorage.getItem('loveweb_session');
    let isHide = false;
    if(sessionCheckStr) {
      try { isHide = JSON.parse(sessionCheckStr).email === 'lovewebbd@gmail.com'; } catch(e){}
    }
    if (window.location.pathname.includes('/admin/')) isHide = true;
    const btn = document.createElement('button');
    if(isHide) return;`
);
fs.writeFileSync('js/messenger.js', code);
