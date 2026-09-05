import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /catch \(err\) \{[\s\S]*?alert\("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে\."\);\s*\}\s*\}/m;
const fix = `catch (err) {
            console.error('Voice setup error:', err);
            if (voiceTranscript) {
               if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                  voiceTranscript.innerText = "দয়া করে মাইক্রোফোন পারমিশন Allow করুন।";
               } else {
                  voiceTranscript.innerText = "মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে।: " + err.message;
               }
            }
            setTimeout(() => stopVoice(), 4000);
         }`;
code = code.replace(regex, fix);
fs.writeFileSync('js/messenger.js', code);
console.log('Fixed catch block');
