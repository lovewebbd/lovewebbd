const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');
const scripts = html.split('<script>');
const lastScript = scripts[scripts.length - 1].split('</script>')[0];
fs.writeFileSync('test.js', lastScript);
