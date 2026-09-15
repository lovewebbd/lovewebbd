const fs = require('fs');
let c = fs.readFileSync('js/auth.js', 'utf8');

const importStatement1 = 'import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";\n';
const importStatement2 = 'import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";\n';

c = c.replace(importStatement1, '');
c = c.replace(importStatement2, '');

c = importStatement1 + importStatement2 + '\n' + c;

fs.writeFileSync('js/auth.js', c);
