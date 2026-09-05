import fs from 'fs';

const removeOverride = (filePath) => {
  let code = fs.readFileSync(filePath, 'utf8');
  // Regex to match the if block we injected
  const overrideRegex = /\s*\/\/\s*Force premium for preview testing\s*if\s*\(user\)\s*\{\s*totalSpent\s*=\s*Math\.max\(totalSpent,\s*2500\);\s*\}/g;
  const overrideRegex2 = /\s*if\s*\(user\)\s*\{\s*totalSpent\s*=\s*Math\.max\(totalSpent,\s*2500\);\s*\}/g;
  
  code = code.replace(overrideRegex, '');
  code = code.replace(overrideRegex2, '');
  fs.writeFileSync(filePath, code);
};

removeOverride('index.html');
removeOverride('js/official-nav.js');
removeOverride('profile/index.html');
console.log('Removed spend overrides!');
