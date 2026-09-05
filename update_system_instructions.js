import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
  /- Memberships: Elite Member \(spent 500\+ tk, gets 2% discount\), Premium Member \(spent 1000\+ tk, gets 4% discount\)\./g,
  "- Memberships: Elite Member (spent 1000+ tk, gets 4% discount), Premium Member (spent 2000+ tk, gets 8% discount)."
);

fs.writeFileSync('server.js', code);
console.log('Instructions updated.');
