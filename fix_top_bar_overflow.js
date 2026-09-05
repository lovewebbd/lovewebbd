import fs from 'fs';
let code = fs.readFileSync('css/style.css', 'utf8');

code += `\n
.official-top-bar, .top-bar-right {
  overflow: visible !important;
}
`;

fs.writeFileSync('css/style.css', code);
console.log('Fixed top bar overflow.');
