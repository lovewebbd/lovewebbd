const fs = require('fs');
let html = fs.readFileSync('404/index.html', 'utf8');

// 1. Remove unnecessary background shapes / external shadow from the container
html = html.replace('background: radial-gradient(circle at center, rgba(255, 42, 109, 0.05) 0%, transparent 70%);', 'background: transparent;');
// Hide or remove .bg-shape opacity to make it cleaner
html = html.replace('opacity: 0.15;', 'opacity: 0;'); 

// 2. Make 404 text visible by removing blur and heavy shadow
html = html.replace('filter: drop-shadow(0 15px 25px rgba(255, 42, 109, 0.3));', '/* drop-shadow removed for visibility */');
html = html.replace(
  /\.error-code::after \{[\s\S]*?\}/,
  '.error-code::after { display: none; }'
);

// 3. Fix button theme
html = html.replace(
  'background: linear-gradient(135deg, var(--primary-pink) 0%, var(--secondary-pink) 100%);',
  'background: var(--primary-pink);'
);
html = html.replace(
  'color: var(--text-main);',
  'color: #ffffff;'
);
// Also adjust button box-shadow to be cleaner or remove it
html = html.replace(
  'box-shadow: 0 4px 15px rgba(255, 42, 109, 0.2);',
  '/* shadow removed */'
);
html = html.replace(
  'box-shadow: 0 10px 25px rgba(255, 42, 109, 0.4);',
  'box-shadow: 0 4px 10px rgba(255, 42, 109, 0.3);'
);

fs.writeFileSync('404/index.html', html);
