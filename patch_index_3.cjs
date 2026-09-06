const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const targetStr = `onclick="openDemo('\\$\\{demo.id\\}', '\\$\\{demo.name.replace(/'/g, \\\\\\'')\\}')"`;
const replacement = `onclick="openDemo('\${demo.id}', '\${demo.name.replace(/'/g, \\"\\'")}')"`;

html = html.replace(targetStr, replacement);
fs.writeFileSync('demos/index.html', html);
console.log('Done');
