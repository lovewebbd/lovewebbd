import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

const regex = /catch \(err\) \{\s*console\.error\("Error setting up live api:", err\);\s*\}/m;
const fix = `catch (err) {
    console.error("Error setting up live api:", err);
    if (clientWs.readyState === 1) {
       clientWs.send(JSON.stringify({ error: "AI Server Error: " + err.message }));
       clientWs.close();
    }
  }`;
code = code.replace(regex, fix);
fs.writeFileSync('server.js', code);
console.log('Fixed server WS error handling');
