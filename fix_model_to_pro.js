import fs from 'fs';
let server = fs.readFileSync('server.js', 'utf8');

// The user got a 404 for gemini-3.8-flash-lite, meaning it doesn't exist.
// Let's switch to gemini-3.8-pro to bypass the rate limit from flash.
server = server.replace(/model: "gemini-3.8-flash-lite"/g, 'model: "gemini-3.8-pro"');

fs.writeFileSync('server.js', server);
console.log('Updated model to gemini-3.8-pro');
