const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const lines = html.split('\n');
lines[358] = "    function openDemo(id) {";
lines[359] = "      const demo = allDemos.find(d => d.id === id);";
lines[360] = "      document.getElementById('demoModalTitle').innerText = demo ? demo.name : 'Demo View';";

fs.writeFileSync('demos/index.html', lines.join('\n'));
