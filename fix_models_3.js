import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/gemini-3\.6-flash/g, 'gemini-3.8-flash');
code = code.replace(/gemini-3\.8-flash-live-preview/g, 'gemini-3.1-flash-live-preview'); // if it was affected
code = code.replace(/gemini-3\.6-flash-live-preview/g, 'gemini-3.1-flash-live-preview');

fs.writeFileSync('server.js', code);
console.log('Fixed model names to 3.8 and 3.1 live');
