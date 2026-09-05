import fs from 'fs';
try {
  eval(fs.readFileSync('server.js', 'utf8'));
  console.log('Syntax is OK');
} catch (e) {
  console.log('Syntax Error: ' + e);
}
