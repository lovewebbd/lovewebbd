const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
const match = code.match(/appRoot\.innerHTML = `([\s\S]*?)`;/);
if (match) {
  let template = match[1];
  console.log("Found template!");
  // Check if there is literal ${dashMemberChip}
  if (template.includes('${dashMemberChip}')) {
    console.log("Template contains literal ${dashMemberChip}");
  }
} else {
  console.log("No match");
}
