import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// I will extract the CSS part and the HTML part and rewrite the voice UI.

const cssMatch = code.match(/const style = document\.createElement\('style'\);\s+style\.innerHTML = \`([\s\S]*?)\`;/);
let cssContent = cssMatch ? cssMatch[1] : '';

// Remove old voice CSS
cssContent = cssContent.replace(/\.ai-voice-area[\s\S]*?}/g, '');
cssContent += `
    /* Gemini-style Voice UI */
    .gemini-voice-container {
      position: fixed;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 600px;
      background: rgba(20, 24, 34, 0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 42, 109, 0.3);
      border-radius: 32px;
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      z-index: 9999999;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 42, 109, 0.2);
    }
    .gemini-voice-container.active {
      bottom: 40px;
      opacity: 1;
    }
    .voice-transcript {
      color: #fff;
      font-size: 1.1rem;
      text-align: center;
      min-height: 28px;
      width: 100%;
      opacity: 0.9;
    }
    .gemini-wave-container {
      position: relative;
      width: 120px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .gemini-bar {
      width: 6px;
      height: 10px;
      background: linear-gradient(180deg, #FF2A6D, #A020F0);
      border-radius: 4px;
      transition: height 0.1s ease;
    }
    .gemini-bar.listening {
      animation: equalize 1s infinite alternate;
    }
    .gemini-bar:nth-child(1) { animation-delay: 0.0s; }
    .gemini-bar:nth-child(2) { animation-delay: 0.2s; }
    .gemini-bar:nth-child(3) { animation-delay: 0.4s; }
    .gemini-bar:nth-child(4) { animation-delay: 0.1s; }
    .gemini-bar:nth-child(5) { animation-delay: 0.3s; }
    
    @keyframes equalize {
      0% { height: 10px; }
      100% { height: 50px; }
    }
    
    .voice-controls {
      display: flex;
      gap: 16px;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
    
    .gemini-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      cursor: pointer;
      color: #fff;
      transition: all 0.2s;
    }
    .gemini-end-btn {
      background: rgba(255, 42, 109, 0.2);
      border: 1px solid rgba(255, 42, 109, 0.5);
    }
    .gemini-end-btn:hover { background: #FF2A6D; }
    
    .gemini-mic-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    [data-theme="light"] .gemini-voice-container {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 42, 109, 0.3);
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    [data-theme="light"] .voice-transcript { color: #191e2b; }
    [data-theme="light"] .gemini-mic-btn { background: rgba(0,0,0,0.05); color: #191e2b; border-color: rgba(0,0,0,0.1); }
`;

const htmlMatch = code.match(/widget\.innerHTML = \`([\s\S]*?)\`;/);
let htmlContent = htmlMatch ? htmlMatch[1] : '';

// Remove the old voiceChatbotArea from htmlContent
htmlContent = htmlContent.replace(/<!-- AI Voice Chatbot \(Hidden by default\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '      </div>\n    </div>');

// Add the new Gemini Voice UI outside of chatPanel
htmlContent += `
    <div class="gemini-voice-container" id="geminiVoiceContainer">
       <div class="voice-transcript" id="voiceTranscript">শুনছি...</div>
       <div class="gemini-wave-container" id="geminiWaveContainer">
          <div class="gemini-bar"></div>
          <div class="gemini-bar"></div>
          <div class="gemini-bar"></div>
          <div class="gemini-bar"></div>
          <div class="gemini-bar"></div>
       </div>
       <div class="voice-controls">
          <button class="gemini-btn gemini-end-btn" id="geminiEndBtn" title="বন্ধ করুন"><i class="fa-solid fa-phone-slash"></i></button>
       </div>
    </div>
`;

// Replace CSS and HTML in the file
code = code.replace(/style\.innerHTML = \`([\s\S]*?)\`;/, `style.innerHTML = \`${cssContent}\`;`);
code = code.replace(/widget\.innerHTML = \`([\s\S]*?)\`;/, `widget.innerHTML = \`${htmlContent}\`;`);

fs.writeFileSync('js/messenger.js', code);
console.log('Voice UI HTML and CSS updated');
