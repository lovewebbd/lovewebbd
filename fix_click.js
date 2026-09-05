import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /voiceEntryBtn\.addEventListener\('click', async \(\) => \{[\s\S]*?ws = new WebSocket/m;
const fix = `voiceEntryBtn.addEventListener('click', async () => {
         console.log('Voice entry clicked');
         // Hide chat panel
         if (chatPanel) chatPanel.classList.remove('open');
         isOpen = false;
         
         // Show Gemini UI
         if (geminiVoiceContainer) geminiVoiceContainer.classList.add('active');
         if (voiceTranscript) voiceTranscript.innerText = "সংযোগ করা হচ্ছে...";
         
         try {
            ws = new WebSocket`;

code = code.replace(regex, fix);
fs.writeFileSync('js/messenger.js', code);
console.log('Fixed click listener');
