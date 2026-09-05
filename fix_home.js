import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/app\.get\('\/', \(req, res\) => \{\n\s*res\.status\(404\)\.sendFile\(path\.join\(__dirname, '404', 'index\.html'\)\);\n\}\);/, `app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});`);

fs.writeFileSync('server.js', code);
console.log('Fixed root route');
