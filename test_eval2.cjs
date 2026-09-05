const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
console.log("Includes backslash-dollar:", code.includes('\\${dashMemberChip}'));
