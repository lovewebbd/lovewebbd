const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.html') && !filePath.includes('node_modules')) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && !filePath.includes('node_modules')) {
            walkSync(filePath, callback);
        }
    });
}

const faviconTag = `<link rel="icon" type="image/png" sizes="32x32" href="/img/logo.png">\n  <link rel="apple-touch-icon" href="/img/logo.png">`;

walkSync('.', function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, remove old favicon tags
    content = content.replace(/<link rel="icon"[^>]+>\n?/g, '');
    content = content.replace(/<link rel="shortcut icon"[^>]+>\n?/g, '');
    content = content.replace(/<link rel="apple-touch-icon"[^>]+>\n?/g, '');
    
    // Insert new favicon tags right after <head> or <meta charset="UTF-8">
    if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${faviconTag}\n</head>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated favicon in ${filePath}`);
    }
});

