import fs from 'fs';

// 1. Help Page
let help = fs.readFileSync('help/index.html', 'utf8');
const couponFaq = `
      <div class="faq-item">
        <h3><i class="fa-solid fa-ticket"></i> কুপন কোড কোথায় পাবো এবং কিভাবে ব্যবহার করবো?</h3>
        <p>আমাদের অফিসিয়াল <a href="#" style="color:#10b981; text-decoration:underline;">ফেসবুক পেজে</a> নিয়মিত বিভিন্ন কুপন কোড দেওয়া হয়। অর্ডার করার সময় প্যাকেজ সিলেকশনের নিচে কুপন কোড বসানোর অপশন পাবেন। সেখানে কোডটি দিয়ে Apply করলে আপনার নির্দিষ্ট ডিসকাউন্ট অর্ডারে যুক্ত হয়ে যাবে।</p>
      </div>
`;
if (!help.includes('কুপন কোড কোথায়')) {
  help = help.replace('<div class="faq-item">', couponFaq + '\n      <div class="faq-item">');
  fs.writeFileSync('help/index.html', help);
  console.log('help/index.html patched');
}

// 2. Privacy & Rules Page
let privacy = fs.readFileSync('privacy-and-rules/index.html', 'utf8');
const couponRule = `
        <div class="rule-card">
          <div class="rule-icon"><i class="fa-solid fa-ticket"></i></div>
          <div class="rule-content">
            <h3>কুপন ও ডিসকাউন্ট পলিসি</h3>
            <p>আমাদের অফিসিয়াল ফেসবুক পেজ থেকে পাওয়া কুপন কোডগুলো দিয়ে অর্ডারে স্পেশাল ডিসকাউন্ট উপভোগ করতে পারবেন। প্রতিটি কুপনের নির্দিষ্ট মেয়াদ এবং ব্যবহারের লিমিট রয়েছে। অর্ডার সম্পন্ন হলে ডিসকাউন্টের পরিমাণ আপনার মোট খরচের সাথে যুক্ত হবে এবং অ্যাডমিন প্যানেলে সংরক্ষিত থাকবে।</p>
          </div>
        </div>
`;
if (!privacy.includes('কুপন ও ডিসকাউন্ট পলিসি')) {
  privacy = privacy.replace('<div class="rule-card">', couponRule + '\n        <div class="rule-card">');
  fs.writeFileSync('privacy-and-rules/index.html', privacy);
  console.log('privacy-and-rules/index.html patched');
}
