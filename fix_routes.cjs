const fs = require('fs');

// 1. Fix server.js routes to handle /route/index.html
let serverJS = fs.readFileSync('server.js', 'utf8');
serverJS = serverJS.replace(
    /app\.get\(\[`\/\$\{route\}`\, `\/\$\{route\}\/`\], \(req, res\) => \{/g,
    "app.get([`/${route}`, `/${route}/`, `/${route}/index.html`], (req, res) => {"
);
fs.writeFileSync('server.js', serverJS);

// 2. Fix js/auth.js redirects
let authJS = fs.readFileSync('js/auth.js', 'utf8');
authJS = authJS.replace(/\.\.\/index\.html/g, "/");
authJS = authJS.replace(/\.\.\/sign-in\/index\.html/g, "/sign-in");
authJS = authJS.replace(/\.\.\/sign-up-google\/index\.html/g, "/sign-up-google");
fs.writeFileSync('js/auth.js', authJS);

// 3. Fix js/google-signup.js redirects
let googleSignupJS = fs.readFileSync('js/google-signup.js', 'utf8');
googleSignupJS = googleSignupJS.replace(/\.\.\/index\.html/g, "/");
googleSignupJS = googleSignupJS.replace(/\.\.\/sign-in\/index\.html/g, "/sign-in");
fs.writeFileSync('js/google-signup.js', googleSignupJS);

// 4. Fix index.html redirects
let indexHTML = fs.readFileSync('index.html', 'utf8');
indexHTML = indexHTML.replace(/sign-in\/index\.html/g, "/sign-in");
fs.writeFileSync('index.html', indexHTML);

// 5. Fix js/official-nav.js redirects
let navJS = fs.readFileSync('js/official-nav.js', 'utf8');
navJS = navJS.replace(/sign-in\/index\.html/g, "sign-in");
fs.writeFileSync('js/official-nav.js', navJS);

