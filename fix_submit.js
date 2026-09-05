import fs from 'fs';
let html = fs.readFileSync('place-order/index.html', 'utf8');

// There's a duplicate check block from old code in submitOrderForm
html = html.replace(`      if(!pkg) {
        showToast('অনুগ্রহ করে ওয়েবসাইট প্যাকেজ নির্বাচন করুন।', 'error');
        return;
      }
      if(!page1Desc || !contactPhone || !advancePaymentPhone) {
        showToast('অনুগ্রহ করে ফর্মের সকল তথ্য সঠিকভাবে পূরণ করুন।', 'error');
        return;
      }`, '');

fs.writeFileSync('place-order/index.html', html);
