import fs from 'fs';
let code = fs.readFileSync('js/official-nav.js', 'utf8');

// The current top bar avatar looks like this:
// <div class="top-bar-avatar ${avatarFrameClass}">${crownBadge}
//   ${isUserLoggedIn ? userInitial : '<i class="fa-solid fa-user"></i>'}
// </div>

const regex = /<div class="top-bar-avatar \$\{avatarFrameClass\}">\$\{crownBadge\}\s*\$\{isUserLoggedIn \? userInitial : '<i class="fa-solid fa-user"><\/i>'\}\s*<\/div>/g;

const newAvatarHTML = `
            <div class="top-bar-avatar-wrap \${avatarFrameClass}">
              \${crownBadge}
              <div class="top-bar-avatar">
                \${isUserLoggedIn ? userInitial : '<i class="fa-solid fa-user"></i>'}
              </div>
            </div>`;

code = code.replace(regex, newAvatarHTML.trim());
fs.writeFileSync('js/official-nav.js', code);
console.log('Fixed top nav avatar HTML.');
