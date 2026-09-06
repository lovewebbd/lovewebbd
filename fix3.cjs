const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const lines = html.split('\n');
lines[339] = "            <div class=\"demo-item\" onclick=\"openDemo('${demo.id}', '${demo.name.replace(/'/g, `&apos;`)}')\">";
fs.writeFileSync('demos/index.html', lines.join('\n'));
