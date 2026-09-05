import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /if \(msg\.client_command\) \{/m;
const fix = `if (msg.error) {
                  voiceTranscript.innerText = "Error: " + msg.error;
                  setTimeout(() => stopVoice(), 4000);
               }
               if (msg.client_command) {`;
code = code.replace(regex, fix);

const regex2 = /ws\.onerror = \(\) => \{[\s\S]*?alert\("ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে\."\);\s*\};/m;
const fix2 = `ws.onerror = () => {
               if (voiceTranscript) voiceTranscript.innerText = "ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।";
               setTimeout(() => stopVoice(), 4000);
            };`;
code = code.replace(regex2, fix2);

const regex3 = /ws\.onclose = \(\) => \{/m;
if (!code.match(regex3)) {
  const regex4 = /ws\.onerror = \(\) => \{[\s\S]*?\};/m;
  const fix4 = `ws.onerror = () => {
               if (voiceTranscript) voiceTranscript.innerText = "ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।";
               setTimeout(() => stopVoice(), 4000);
            };
            ws.onclose = () => {
               // Only stop if we were actively recording
               if (isRecording) {
                  if (voiceTranscript) voiceTranscript.innerText = "সংযোগ বিচ্ছিন্ন হয়েছে।";
                  setTimeout(() => stopVoice(), 3000);
               }
            };`;
  code = code.replace(regex4, fix4);
}

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed client WS error handling');
