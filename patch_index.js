import fs from 'fs';
let code = fs.readFileSync('index.html', 'utf8');

// The block to replace:
/*
          const user = JSON.parse(sessionRaw);
          const userName = user.full_name || user.username || 'ইউজার';
          const userInitial = userName.charAt(0).toUpperCase();

          appRoot.innerHTML = `
*/

const replaceRegex = /const user = JSON\.parse\(sessionRaw\);\s*const userName = user\.full_name \|\| user\.username \|\| 'ইউজার';\s*const userInitial = userName\.charAt\(0\)\.toUpperCase\(\);\s*appRoot\.innerHTML = `/;

const newBlock = `const user = JSON.parse(sessionRaw);
          const userName = user.full_name || user.username || 'ইউজার';
          const userInitial = userName.charAt(0).toUpperCase();

          // Calculate spending for dashboard avatar
          let orders = [];
          try {
            const rawOrders = localStorage.getItem('loveweb_orders_' + (user.username || '')) || localStorage.getItem('loveweb_orders');
            if (rawOrders) orders = JSON.parse(rawOrders);
          } catch (e) {}

          let totalSpent = 0;
          if (Array.isArray(orders)) {
            totalSpent = orders.reduce((sum, item) => sum + (Number(item.price || item.amount) || 0), 0);
          }
          if (user && user.email === 'lovewebbd@gmail.com') {
            totalSpent = Math.max(totalSpent, 2500);
          }

          let avatarFrameClass = '';
          let crownBadge = '';
          let dashMemberChip = '<span class="dash-member-chip"><i class="fa-solid fa-circle-check"></i> ভেরিফায়েড সদস্য</span>';

          if (totalSpent >= 2000) {
            avatarFrameClass = 'premium-frame';
            crownBadge = '<div class="premium-crown"><i class="fa-solid fa-crown"></i></div><div class="premium-tag">PREMIUM</div>';
            dashMemberChip = '<span class="dash-member-chip premium" style="color: #fbbf24; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4);"><i class="fa-solid fa-crown"></i> প্রিমিয়াম মেম্বার</span>';
          } else if (totalSpent >= 1000) {
            avatarFrameClass = 'elite-frame';
            crownBadge = '<div class="elite-crown"><i class="fa-solid fa-gem"></i></div><div class="elite-tag">ELITE</div>';
            dashMemberChip = '<span class="dash-member-chip elite" style="color: #c084fc; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4);"><i class="fa-solid fa-gem"></i> এলিট মেম্বার</span>';
          }

          appRoot.innerHTML = \``;

code = code.replace(replaceRegex, newBlock);

// Now replace dash-avatar-circle logic
code = code.replace(
  /<div class="dash-avatar-circle">\$\{userInitial\}<\/div>\s*<div class="dash-meta-info">/,
  `<div class="profile-avatar-wrap \${avatarFrameClass}" style="margin: 0; padding: 4px;">\${crownBadge}<div class="dash-avatar-circle" style="margin: 0;">\${userInitial}</div></div>
                  <div class="dash-meta-info">`
);

code = code.replace(
  /<span class="dash-member-chip"><i class="fa-solid fa-circle-check"><\/i> ভেরিফায়েড সদস্য<\/span>/,
  `\${dashMemberChip}`
);

fs.writeFileSync('index.html', code);
console.log('index.html patched!');
