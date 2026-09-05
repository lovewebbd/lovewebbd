import fs from 'fs';
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(/model: "gemini-3.8-pro"/g, 'model: "gemini-2.0-flash"');

fs.writeFileSync('server.js', server);
console.log('Updated model to gemini-2.0-flash');
