const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const regex = /onclick="openDemo\('\$\\{demo\.id\\}', '\$\\{demo\.name\.replace\(\/'\/g, \\"\\'\\"\)\}'\)"/g;
html = html.replace(/<div class="demo-item" onclick="openDemo\('\$\\{demo\.id\\}', '\$\\{demo\.name\.replace\(\/'\/g, \\"\\'\\"\)\}'\)">/g, 
  `<div class="demo-item" onclick="openDemo('\${demo.id}', '\${demo.name.replace(/'/g, "&apos;")}')">`);

fs.writeFileSync('demos/index.html', html);
