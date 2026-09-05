import fs from 'fs';
let code = fs.readFileSync('js/official-nav.js', 'utf8');

const badgeLogicRegex = /if \(totalSpent >= 2000\) \{[\s\S]*?\} else if \(totalSpent >= 1000\) \{[\s\S]*?\} else \{[\s\S]*?\}/m;

const newLogic = `
      if (totalSpent >= 2000) {
        membershipBadgeText = 'প্রিমিয়াম মেম্বার (৮% ছাড়)';
        membershipBadgeIcon = 'fa-crown';
        membershipBadgeColorClass = 'style="color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.15);"';
      } else if (totalSpent >= 1000) {
        membershipBadgeText = 'এলিট মেম্বার (৪% ছাড়)';
        membershipBadgeIcon = 'fa-gem';
        membershipBadgeColorClass = 'style="color: #c084fc; border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.15);"';
      } else {
        membershipBadgeText = 'সাধারণ সদস্য';
        membershipBadgeIcon = 'fa-circle-check';
      }
`;
code = code.replace(badgeLogicRegex, newLogic);


// Add a frame variable
const varRegex = /let membershipBadgeColorClass = '';/g;
code = code.replace(varRegex, "let membershipBadgeColorClass = '';\n    let avatarFrameClass = '';\n    let crownBadge = '';");

const ifLogicRegex = /if \(totalSpent >= 2000\) \{/g;
code = code.replace(ifLogicRegex, "if (totalSpent >= 2000) {\n        avatarFrameClass = 'premium-frame';\n        crownBadge = '<div class=\"premium-crown\"><i class=\"fa-solid fa-crown\"></i></div><div class=\"premium-tag\">PREMIUM</div>';");

const ifLogicRegex2 = /\} else if \(totalSpent >= 1000\) \{/g;
code = code.replace(ifLogicRegex2, "} else if (totalSpent >= 1000) {\n        avatarFrameClass = 'elite-frame';\n        crownBadge = '<div class=\"elite-crown\"><i class=\"fa-solid fa-gem\"></i></div><div class=\"elite-tag\">ELITE</div>';");

// Replace top bar avatar
const topBarRegex = /<div class="top-bar-avatar">/g;
code = code.replace(topBarRegex, '<div class="top-bar-avatar ${avatarFrameClass}">${crownBadge}');

// Replace drawer avatar
const drawerAvatarRegex = /<div class="drawer-avatar-wrap">/g;
code = code.replace(drawerAvatarRegex, '<div class="drawer-avatar-wrap ${avatarFrameClass}">${crownBadge}');


fs.writeFileSync('js/official-nav.js', code);
console.log('Fixed nav frames.');
