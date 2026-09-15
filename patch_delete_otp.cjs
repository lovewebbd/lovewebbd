const fs = require('fs');
let code = fs.readFileSync('settings/index.html', 'utf8');

// 1. Add variable for cooldown
if (!code.includes('let lastDeleteOtpSentTime = 0;')) {
    code = code.replace(
        'let deleteOtpTimerInterval = null;',
        'let deleteOtpTimerInterval = null;\n    let lastDeleteOtpSentTime = 0;'
    );
}

// 2. Modify sendDeleteAccountOtp function
const targetFuncStart = 'async function sendDeleteAccountOtp() {';
const targetLogicOld = `      const targetEmail = currentUser.email.toLowerCase().trim();
      showNotification('নিরাপত্তা কোড তৈরি ও ইমেইল করা হচ্ছে...', 'success');

      const now = Date.now();
      const expiresAt = new Date(now + 10 * 60 * 1000).toISOString();
      deleteOtpExpiryTimestamp = now + 10 * 60 * 1000;

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Password_Resets টেবিলে ডিলিট ওটিপি সেভ করা
      const { error: dbError } = await firebaseDB
        .from('Password_Resets')
        .insert([{ email: targetEmail, otp_code: generatedOtp, expires_at: expiresAt }]);`;

const targetLogicNew = `      const targetEmail = currentUser.email.toLowerCase().trim();
      
      const now = Date.now();
      
      // ৫ মিনিটের কুলডাউন চেক
      if (now - lastDeleteOtpSentTime < 5 * 60 * 1000) {
        const remainingSecs = Math.ceil((5 * 60 * 1000 - (now - lastDeleteOtpSentTime)) / 1000);
        const mins = Math.floor(remainingSecs / 60);
        const secs = remainingSecs % 60;
        return showNotification(\`অনুগ্রহ করে পুনরায় কোড পাঠানোর জন্য \${mins} মিনিট \${secs} সেকেন্ড অপেক্ষা করুন।\`, 'error');
      }
      
      showNotification('নিরাপত্তা কোড প্রসেস করা হচ্ছে...', 'success');
      lastDeleteOtpSentTime = now;

      // ডাটাবেজ থেকে আগের কোড চেক করা (১০ মিনিটের ভেতর আছে কিনা)
      const { data: existingOtpData } = await firebaseDB
          .from('Password_Resets')
          .select('*')
          .eq('email', targetEmail)
          .order('expires_at', { ascending: false })
          .limit(1);

      let generatedOtp = null;
      let expiresAt;
      
      if (existingOtpData && existingOtpData.length > 0) {
         const latest = existingOtpData[0];
         if (new Date() < new Date(latest.expires_at)) {
             // 10 মিনিটের ভেতর থাকলে আগের কোডটাই ব্যবহার করা হবে
             generatedOtp = latest.otp_code;
             // আগের এক্সপায়ারি টাইমটাই রাখবো (বা নতুন করে ১০ মিনিট সেট করা যায়, আমি নতুন করে ১০ মিনিট দিচ্ছি)
         }
      }
      
      if (!generatedOtp) {
          // ১০ মিনিট পার হয়ে গেলে নতুন কোড
          generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      }
      
      expiresAt = new Date(now + 10 * 60 * 1000).toISOString();
      deleteOtpExpiryTimestamp = now + 10 * 60 * 1000;

      // Password_Resets টেবিলে ডিলিট ওটিপি সেভ করা
      const { error: dbError } = await firebaseDB
        .from('Password_Resets')
        .insert([{ email: targetEmail, otp_code: generatedOtp, expires_at: expiresAt }]);`;

if (code.includes(targetLogicOld)) {
    code = code.replace(targetLogicOld, targetLogicNew);
    fs.writeFileSync('settings/index.html', code);
    console.log("Patched successfully!");
} else {
    console.log("Could not find the target logic to patch.");
}
