import fs from 'fs';
let code = fs.readFileSync('css/style.css', 'utf8');

// Fix top bar wrap
code = code.replace(
  /\.top-bar-avatar-wrap \{[\s\S]*?\}/,
  `.top-bar-avatar-wrap { position: relative; }`
);
code = code.replace(
  /\.top-bar-avatar-wrap\.premium-frame,\n\.top-bar-avatar-wrap\.elite-frame \{/,
  `.top-bar-avatar-wrap.premium-frame,\n.top-bar-avatar-wrap.elite-frame {\n  border-width: 2px;\n  margin-top: 6px;\n  margin-bottom: 8px;\n  margin-right: 4px;\n  padding: 2px;\n`
);

fs.writeFileSync('css/style.css', code);
console.log('Fixed margins.');
