const fs = require('fs');
let c = fs.readFileSync('js/theme.js', 'utf8');

const oldGetTheme = `  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // ডিফল্ট ডার্ক রোমান্টিক থিম
  }`;

const newGetTheme = `  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    
    // Check system/browser preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // ডিফল্ট ডার্ক রোমান্টিক থিম
  }`;

c = c.replace(oldGetTheme, newGetTheme);

// Also add a listener so if the system theme changes AND the user hasn't explicitly set a preference, it updates automatically.
const autoSwitchCode = `  // Auto switch when system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(event.matches ? 'dark' : 'light', false);
      }
    });
  }`;

if (!c.includes('Auto switch when system theme changes')) {
  c = c.replace(
    "  const initialTheme = getPreferredTheme();",
    autoSwitchCode + "\n\n  const initialTheme = getPreferredTheme();"
  );
}

fs.writeFileSync('js/theme.js', c);
