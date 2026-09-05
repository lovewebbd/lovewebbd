import fs from 'fs';
let code = fs.readFileSync('js/official-nav.js', 'utf8');

// 1. Force Premium for testing
code = code.replace(
  /let totalSpent = 0;\s*if \(Array\.isArray\(orders\)\) \{/,
  `let totalSpent = 0;
      if (Array.isArray(orders)) {`
);

code = code.replace(
  /totalSpent = orders\.reduce\(\(sum, item\) => sum \+ \(Number\(item\.price \|\| item\.amount\) \|\| 0\), 0\);\n      \}/,
  `totalSpent = orders.reduce((sum, item) => sum + (Number(item.price || item.amount) || 0), 0);
      }
      
      // Force premium for preview testing
      if (user && user.email === 'lovewebbd@gmail.com') {
        totalSpent = Math.max(totalSpent, 2500);
      }`
);

// 2. Add "Order Now" to Sidebar Menu
// Look for the "Home" link in the sidebar to insert after
const homeLinkRegex = /<a href="\$\{rootPrefix\}index\.html" class="drawer-nav-link[\s\S]*?<\/a>/;
const orderNowLink = `
          <a href="\${rootPrefix}index.html#pricing" class="drawer-nav-link \${currentPath.includes('place-order') ? 'active' : ''}">
            <div class="nav-icon-box"><i class="fa-solid fa-cart-shopping"></i></div>
            <div class="nav-text-box">
              <span class="nav-label">নতুন অর্ডার করুন</span>
              <span class="nav-sub">নতুন উইশিং ওয়েবসাইট তৈরি করুন</span>
            </div>
            <i class="fa-solid fa-chevron-right nav-arrow"></i>
          </a>`;

code = code.replace(homeLinkRegex, (match) => {
  return match + orderNowLink;
});

fs.writeFileSync('js/official-nav.js', code);
console.log('Nav patched!');
