const fs = require('fs');
let c = fs.readFileSync('js/auth.js', 'utf8');

c = c.replace(
    'console.error("Google Sign In Error:", error);',
    `console.error("Google Sign In Error:", error);
        if (error.code === 'auth/network-request-failed' || error.message.includes('network-request-failed') || error.code === 'auth/popup-closed-by-user') {
            showNotification('গুগল লগইন পপ-আপ ব্লক করা হয়েছে। দয়া করে সাইটটি "New Tab"-এ ওপেন করে আবার চেষ্টা করুন।', 'error');
            return;
        }`
);

fs.writeFileSync('js/auth.js', c);
