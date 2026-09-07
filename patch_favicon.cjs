const fs = require('fs');
const files = ['index.html', 'admin/index.html', 'sign-in/index.html', 'place-order/index.html', 'profile/index.html', 'reset-password/index.html', 'help/index.html', 'privacy-and-rules/index.html'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Check if favicon already exists
    if (!html.includes('<link rel="icon"')) {
       let prefix = file === 'index.html' ? './' : '../';
       html = html.replace('</title>', '</title>\n  <link rel="icon" type="image/png" href="' + prefix + 'img/favicon.png">');
       fs.writeFileSync(file, html);
    }
  }
}
