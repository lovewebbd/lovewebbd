import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(/const voiceEntryBtn = document\.getElementById\('voiceEntryBtn'\);/, `const voiceEntryBtn = document.getElementById('voiceEntryBtn');\n    console.log('voiceEntryBtn found:', !!voiceEntryBtn);`);

fs.writeFileSync('js/messenger.js', code);
console.log('Added debug logs');
