const fs = require('fs');
let c = fs.readFileSync('js/theme.js', 'utf8');

c = c.replace(
  "applyTheme(event.matches ? 'dark' : 'light', false);",
  "applyTheme(event.matches ? 'dark' : 'light', false, false);"
);

fs.writeFileSync('js/theme.js', c);
