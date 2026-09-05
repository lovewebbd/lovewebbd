import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/gemini-2\.5-flash/g, 'gemini-3.6-flash');
code = code.replace(/gemini-2\.0-flash-exp/g, 'gemini-3.6-flash-live-preview');

fs.writeFileSync('server.js', code);
console.log('Fixed model names to 3.6');
