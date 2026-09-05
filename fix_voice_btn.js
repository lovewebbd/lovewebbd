import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// The issue is that voiceEntryBtn is declared twice.
// Looking at line 780... let's replace "const voiceEntryBtn =" with just checking or removing it if it's already declared.

code = code.replace(/const voiceEntryBtn = document\.getElementById\('voiceEntryBtn'\);\n\s*const geminiVoiceContainer = document\.getElementById\('geminiVoiceContainer'\);/, `const geminiVoiceContainer = document.getElementById('geminiVoiceContainer');`);

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed syntax error in messenger.js');
