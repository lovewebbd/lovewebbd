const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/const GMAIL_APP_PASSWORD = \(process.env.GMAIL_APP_PASSWORD \|\| '[^']+'\).replace\(\/\\s\+\/g, ''\);/, 
                    "const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || 'jvwnyzuqfjdhhfjl').replace(/\\s+/g, '');");
fs.writeFileSync('server.js', code);
