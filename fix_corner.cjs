const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');
css = css.replace('display: flex;\n    align-items: center;\n    justify-content: center;\n}', 'display: inline-flex;\n    align-items: center;\n    justify-content: center;\n}');
fs.writeFileSync('css/style.css', css);

let signinCode = fs.readFileSync('sign-in/index.html', 'utf8');
signinCode = signinCode.replace('<button type="button" class="top-bar-action-btn lang-toggle-btn"  title="ভাষা পরিবর্তন করুন"', '<button type="button" class="top-bar-action-btn lang-toggle-btn" onclick="window.toggleAppLanguage()" title="ভাষা পরিবর্তন করুন"');
fs.writeFileSync('sign-in/index.html', signinCode);
console.log("Fixed display issue and restored onclick to sign-in page");
