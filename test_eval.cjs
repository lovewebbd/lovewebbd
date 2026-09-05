const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
const match = code.match(/appRoot\.innerHTML = `([\s\S]*?)`;/);
if (match) {
  let template = match[1];
  console.log("Template contains ${dashMemberChip}:", template.includes('${dashMemberChip}'));
  
  let indexOf = template.indexOf('${dashMemberChip}');
  console.log("Characters before it:", template.substring(indexOf - 20, indexOf));
}
