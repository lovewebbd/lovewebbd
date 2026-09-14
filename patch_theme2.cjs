const fs = require('fs');
let c = fs.readFileSync('js/theme.js', 'utf8');

c = c.replace(
  "function applyTheme(theme, notify = false) {\n    document.documentElement.setAttribute('data-theme', theme);\n    localStorage.setItem(THEME_KEY, theme);",
  "function applyTheme(theme, notify = false, save = true) {\n    document.documentElement.setAttribute('data-theme', theme);\n    if (save) localStorage.setItem(THEME_KEY, theme);"
);

c = c.replace(
  "const initialTheme = getPreferredTheme();\n  applyTheme(initialTheme, false);",
  "const initialTheme = getPreferredTheme();\n  // Don't save on initial load if it was not already saved\n  applyTheme(initialTheme, false, !!localStorage.getItem(THEME_KEY));"
);

c = c.replace(
  "applyTheme(getPreferredTheme(), false);",
  "applyTheme(getPreferredTheme(), false, !!localStorage.getItem(THEME_KEY));"
);

fs.writeFileSync('js/theme.js', c);
