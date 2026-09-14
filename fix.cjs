const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(/  const urls = req\.files\.map\(f => '\/uploads\/' \+ f\.filename\);\n  res\.json\(\{ success: true, urls \}\);\n\}\);\n/g, '');
fs.writeFileSync('server.js', c);
