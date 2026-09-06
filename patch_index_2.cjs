const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

html = html.replace(/<div class="demo-item" onclick="openDemo\('\\$\\{demo\.id\\}', '\\$\\{demo\.name\.replace[^"]+"\)">/g, `<div class="demo-item" onclick="openDemo('\${demo.id}', '\${demo.name.replace(/'/g, \\\\\\'')}')">`);

fs.writeFileSync('demos/index.html', html);
console.log('Fixed');
