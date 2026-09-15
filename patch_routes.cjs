const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

c = c.replace(
    /app\.get\('\*', \(req, res\) => \{\n  res\.status\(404\)\.sendFile\(path\.join\(__dirname, '404', 'index\.html'\)\);\n\}\);/,
    `app.get('*', (req, res) => {
  // If it's an API route that fell through, return 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API Route Not Found' });
  }
  // Otherwise, serve the 404 HTML page
  res.status(404).sendFile(path.join(__dirname, '404', 'index.html'));
});`
);
fs.writeFileSync('server.js', c);
