import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace('model: "gemini-3.8-flash",', 'model: "gemini-3.1-flash-lite",');

fs.writeFileSync('server.js', code);
console.log('Model updated to gemini-3.1-flash-lite');
