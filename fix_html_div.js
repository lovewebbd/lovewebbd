import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- Main FAB -->/m;
const fix = `        </div>
        
      </div>
    </div>

    <!-- Main FAB -->`;

code = code.replace(regex, fix);
fs.writeFileSync('js/messenger.js', code);
console.log('Fixed extra div in messenger HTML');
