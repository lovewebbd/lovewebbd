const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const target = `onclick="openDemo('${demo.id}', '${demo.name.replace(/'/g, \\"\\'\\")}')"`; // Actually, let's just use indexOf and substring to avoid regex pain.

const line = `<div class="demo-item" onclick="openDemo('\\$\\{demo.id\\}', '\\$\\{demo.name.replace(/'/g, \\"\\'")\\}')">`;
// Wait, in JS the string is: <div class="demo-item" onclick="openDemo('${demo.id}', '${demo.name.replace(/'/g, \"\'")}')">
html = html.replace(`<div class="demo-item" onclick="openDemo('\\$\\{demo.id\\}', '\\$\\{demo.name.replace(/'/g, \\"\\'\\")\\}')">`, 
  `<div class="demo-item" onclick="openDemo('\\$\\{demo.id\\}', '\\$\\{demo.name.replace(/'/g, \\"&apos;\\")\\}')">`);
fs.writeFileSync('demos/index.html', html);
