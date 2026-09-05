import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(/voiceBtn\.innerHTML = '<i class="fa-solid fa-microphone-slash"><\/i>';/g, `voiceBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
             document.getElementById('voiceStatusText').innerText = 'শুনছি... (বন্ধ করতে আবার ক্লিক করুন)';`);

fs.writeFileSync('js/messenger.js', code);
console.log('Patched voice logic 2');
