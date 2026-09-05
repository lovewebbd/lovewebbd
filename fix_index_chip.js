import fs from 'fs';
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
  /<span class="dash-member-chip"><i class="fa-solid fa-circle-check"><\/i> ভেরিফায়েড সদস্য<\/span>/g,
  '${dashMemberChip}'
);

fs.writeFileSync('index.html', code);
console.log('Fixed dash chip');
