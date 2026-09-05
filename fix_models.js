import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/gemini-3\.1-flash-lite/g, 'gemini-2.5-flash');
code = code.replace(/gemini-3\.1-flash-live-preview/g, 'gemini-2.0-flash-exp');
code = code.replace(/gemini-3\.1-flash/g, 'gemini-2.5-flash');

fs.writeFileSync('server.js', code);
console.log('Fixed model names');
