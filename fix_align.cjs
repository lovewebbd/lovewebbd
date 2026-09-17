const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');
const newCSS = `
.auth-theme-corner-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
}
.auth-theme-corner-toggle .top-bar-action-btn {
    margin-right: 0 !important; /* override inline styles */
}
`;
if (!css.includes('.auth-theme-corner-toggle {')) {
    fs.appendFileSync('css/style.css', newCSS);
}
console.log("Appended corner toggle flex box");
