import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(/opacity: 0;\s*pointer-events: none;/m, 'opacity: 0;\n      pointer-events: none;\n      visibility: hidden;');
code = code.replace(/opacity: 1;\s*pointer-events: auto;/m, 'opacity: 1 !important;\n      pointer-events: auto !important;\n      visibility: visible !important;');

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed chat-panel CSS');
