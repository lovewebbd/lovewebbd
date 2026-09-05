import fs from 'fs';
let navCode = fs.readFileSync('js/official-nav.js', 'utf8');

// Fix 'নতুন অর্ডার করুন' link
navCode = navCode.replace(
  /href="\$\{rootPrefix\}index\.html#pricing"([\s\S]*?)<span class="nav-label">নতুন অর্ডার করুন<\/span>/,
  `href="\${rootPrefix}place-order/"$1<span class="nav-label">নতুন অর্ডার করুন</span>`
);

fs.writeFileSync('js/official-nav.js', navCode);
console.log('Fixed nav links');
