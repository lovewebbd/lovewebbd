import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(/fab\.addEventListener\('click', \(e\) => \{/g, `fab.addEventListener('click', (e) => {\n      console.log('FAB clicked! panel:', !!panel, 'isOpen:', isOpen);`);

fs.writeFileSync('js/messenger.js', code);
