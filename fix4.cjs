const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const lines = html.split('\n');
// Fix the onclick handler
lines[339] = "            <div class=\"demo-item\" onclick=\"openDemo('${demo.id}')\">";

fs.writeFileSync('demos/index.html', lines.join('\n'));
