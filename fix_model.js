import fs from 'fs';
let server = fs.readFileSync('server.js', 'utf8');

// The user wants to use gemini-3.8-flash-lite instead of gemini-3.8-flash to avoid rate limits
server = server.replace(/model: "gemini-3.8-flash"/g, 'model: "gemini-3.8-flash-lite"');

fs.writeFileSync('server.js', server);
console.log('Updated model to gemini-3.8-flash-lite');
