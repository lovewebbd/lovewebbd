import fs from 'fs';
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(/model: "gemini-2.0-flash"/g, 'model: "gemini-3.6-flash"');

fs.writeFileSync('server.js', server);
console.log('Updated model to gemini-3.6-flash');
