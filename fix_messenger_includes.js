import fs from 'fs';
import path from 'path';

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else if (f.endsWith('.html')) {
      let html = fs.readFileSync(dirPath, 'utf8');
      if (!html.includes('messenger.js')) {
        let relativePath = path.relative(path.dirname(dirPath), '.');
        if (relativePath !== '') relativePath += '/';
        const script = `\n  <!-- Live Messenger Floating Widget -->\n  <script src="${relativePath}js/messenger.js"></script>\n</body>`;
        html = html.replace('</body>', script);
        fs.writeFileSync(dirPath, html);
        console.log('Added to', dirPath);
      }
    }
  });
}

walkDir('.');
