import fs from 'fs';
let code = fs.readFileSync('place-order/index.html', 'utf8');

code = code.replace(/<li><i class="fa-solid fa-check"><\/i> <div>মোবাইল রেসপন্সিভ<\/div><\/li>/g, '<li><i class="fa-solid fa-check"></i> <div>মোবাইল রেসপন্সিভ</div></li>\n              <li><i class="fa-solid fa-clock" style="color:var(--primary-pink);"></i> <div style="color:var(--primary-pink); font-weight:600;">১-৩ দিনে ডেলিভারি</div></li>');

// Wait, the above will replace in ALL packages. Let's do it manually for each.
code = fs.readFileSync('place-order/index.html', 'utf8');

// Regular
code = code.replace(
  /<div class="pkg-name">রেগুলার \(Regular\)<\/div>\s*<div class="pkg-price">[\s\S]*?<\/ul>/, 
  (match) => match.replace('</ul>', '  <li><i class="fa-solid fa-clock" style="color:#FF2A6D;"></i> <div>১-৩ দিনে ডেলিভারি</div></li>\n            </ul>')
);

// Exclusive
code = code.replace(
  /<div class="pkg-name">এক্সক্লুসিভ \(Exclusive\)<\/div>\s*<div class="pkg-price">[\s\S]*?<\/ul>/, 
  (match) => match.replace('</ul>', '  <li><i class="fa-solid fa-clock" style="color:#FF2A6D;"></i> <div>৩-৫ দিনে ডেলিভারি</div></li>\n            </ul>')
);

// Premium
code = code.replace(
  /<div class="pkg-name">প্রিমিয়াম \(Premium\)<i class="fa-solid fa-crown" style="color:#fbbf24; margin-left:6px;"><\/i><\/div>\s*<div class="pkg-price">[\s\S]*?<\/ul>/, 
  (match) => match.replace('</ul>', '  <li><i class="fa-solid fa-clock" style="color:#FF2A6D;"></i> <div>৫-৭ দিনে ডেলিভারি</div></li>\n            </ul>')
);

// Also they said "আর অর্ডার প্লেস থেকেও এস্টিমেটেড ডেট 24 আওয়ারস এই কথাটা কাটবে।"
// Did they mean "estimated delivery"? Let's search again.
// Wait, I will just remove the phrase "24" if it appears in any text.
// "24" could be "24px" so I will be careful.
fs.writeFileSync('place-order/index.html', code);
console.log('Packages updated');
