const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

content = content.replace("res.status(500).json({ success: false, message: 'Internal server error.' });", "res.status(500).json({ success: false, message: error.message });");

fs.writeFileSync('server.js', content);
