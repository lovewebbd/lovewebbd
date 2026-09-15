const fs = require('fs');
let c = fs.readFileSync('js/auth.js', 'utf8');

c = c.replace(
    /if \(data\.success && data\.config\) \{/,
    `if (data.success && data.config && data.config.apiKey) {`
);

fs.writeFileSync('js/auth.js', c);
