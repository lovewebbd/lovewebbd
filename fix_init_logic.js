import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// The DOM nodes need to be queried AFTER widget is appended.
// They are appended at line ~529: document.body.appendChild(widget);

// To ensure no errors, we will just double check the event listeners.
code = code.replace(/const voiceEntryBtn = document\.getElementById\('voiceEntryBtn'\);/g, `
  const voiceEntryBtn = document.getElementById('voiceEntryBtn');
  const textChatbotArea = document.getElementById('textChatbotArea');
  const voiceChatbotArea = document.getElementById('voiceChatbotArea');
  const backToTextBtn = document.getElementById('backToTextBtn');
  const textBrandingHeader = document.getElementById('textBrandingHeader');
  const sendBtn = document.getElementById('aiSendBtn');
  const input = document.getElementById('aiChatInput');
  const msgsContainer = document.getElementById('aiChatMessages');
  const voiceBtn = document.getElementById('aiVoiceBtn');
  const miniWaves = document.getElementById('miniVoiceWaves');

  if (voiceEntryBtn) {
    voiceEntryBtn.addEventListener('click', () => {
       textChatbotArea.style.display = 'none';
       textBrandingHeader.style.display = 'none';
       voiceEntryBtn.style.display = 'none';
       voiceChatbotArea.style.display = 'flex';
    });
  }
  
  if (backToTextBtn) {
    backToTextBtn.addEventListener('click', () => {
       voiceChatbotArea.style.display = 'none';
       textChatbotArea.style.display = 'flex';
       textBrandingHeader.style.display = 'flex';
       voiceEntryBtn.style.display = 'flex';
    });
  }
`);

// Clean up the duplicated declarations in the file to prevent errors.
code = code.replace(/const textChatbotArea = document\.getElementById\('textChatbotArea'\);\n/g, '');
code = code.replace(/const voiceChatbotArea = document\.getElementById\('voiceChatbotArea'\);\n/g, '');
code = code.replace(/const backToTextBtn = document\.getElementById\('backToTextBtn'\);\n/g, '');
code = code.replace(/const textBrandingHeader = document\.getElementById\('textBrandingHeader'\);\n/g, '');

code = code.replace(/voiceEntryBtn\.addEventListener\('click', \(\) => \{\n[\s\S]*?\}\);\n/g, '');
code = code.replace(/backToTextBtn\.addEventListener\('click', \(\) => \{\n[\s\S]*?\}\);\n/g, '');

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed init logic');
