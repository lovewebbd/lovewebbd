const fs = require('fs');

let c1 = fs.readFileSync('js/auth.js', 'utf8');
c1 = c1.replace(
    /localStorage\.setItem\('userEmail', finalUser\.email\);\s*localStorage\.setItem\('userFullName', finalUser\.full_name\);\s*localStorage\.setItem\('userPhone', finalUser\.phone \|\| ""\);\s*localStorage\.setItem\('userUsername', finalUser\.username\);/,
    "localStorage.setItem('loveweb_session', JSON.stringify(finalUser));"
);
fs.writeFileSync('js/auth.js', c1);

let c2 = fs.readFileSync('js/google-signup.js', 'utf8');
c2 = c2.replace(
    /localStorage\.setItem\('userEmail', newUser\.email\);\s*localStorage\.setItem\('userFullName', newUser\.full_name\);\s*localStorage\.setItem\('userPhone', newUser\.phone \|\| ""\);\s*localStorage\.setItem\('userUsername', newUser\.username\);/,
    "localStorage.setItem('loveweb_session', JSON.stringify(newUser));"
);
fs.writeFileSync('js/google-signup.js', c2);

