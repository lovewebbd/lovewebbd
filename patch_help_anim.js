import fs from 'fs';
let html = fs.readFileSync('help/index.html', 'utf8');

// Update the keyframes for pulse to be more prominent
html = html.replace(/@keyframes pulse {[\s\S]*?}/, `@keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { box-shadow: 0 0 0 25px rgba(16, 185, 129, 0); transform: scale(1); }
    }`);

fs.writeFileSync('help/index.html', html);
console.log('Updated help animation');
