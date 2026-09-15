const fs = require('fs');
let c = fs.readFileSync('js/auth.js', 'utf8');

c = c.replace(
    /const confirmPassword = confirmPasswordInput \? confirmPasswordInput\.value\.trim\(\) : '';/,
    `const confirmPasswordInput = document.getElementById('signUpConfirmPassword');
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';`
);
fs.writeFileSync('js/auth.js', c);
