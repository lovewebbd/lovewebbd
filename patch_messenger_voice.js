import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// 1. Update CSS
const cssReplacement = `    .ai-branding-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 0 16px 0;
      color: #fff;
    }
    .ai-branding-icon-large {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF2A6D, #A020F0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin-bottom: 6px;
      box-shadow: 0 4px 12px rgba(255, 42, 109, 0.3);
    }
    .ai-branding-text {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .ai-area-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: rgba(0,0,0,0.1);
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
    }
    .ai-area-icon-small {
      color: #A020F0;
      font-size: 1rem;
    }
    
    [data-theme="light"] .ai-branding-header { color: #191e2b; }
    [data-theme="light"] .ai-area-header { background: #f8f9fa; border-bottom-color: #eaeaea; color: #191e2b; }
    [data-theme="light"] .voice-entry-btn { background: #fdfdfd !important; border-color: #eaeaea !important; }
    [data-theme="light"] .voice-entry-btn .messenger-text { color: #191e2b !important; }
    [data-theme="light"] .ai-voice-area { background: #fdfdfd !important; border-color: #eaeaea !important; }
    [data-theme="light"] .voice-status { color: #191e2b !important; }
`;

code = code.replace(/    \.ai-branding-header \{[\s\S]*?\[data-theme="light"\] \.ai-area-header \{ [^\}]+\}/, cssReplacement);

// 2. Update HTML Structure
const oldHtml = `        <!-- Messenger Link -->
        <a href="\${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" class="messenger-contact-card">
          <div class="messenger-icon"><i class="fa-brands fa-facebook-messenger"></i></div>
          <div class="messenger-text">
            <h5>মেসেঞ্জারে যোগাযোগ করুন</h5>
            <p>সরাসরি আমাদের টিমের সাথে কথা বলুন</p>
          </div>
        </a>

        <div class="divider">অথবা</div>

        <!-- AI Branding Header -->
        <div class="ai-branding-header">
          <div class="ai-branding-icon-large"><i class="fa-solid fa-robot"></i></div>
          <div class="ai-branding-text">এআই সহায়তা</div>
        </div>

        <!-- AI Chatbot -->
        <div class="ai-chatbot-area">
          <div class="ai-area-header">
             <i class="fa-solid fa-wand-magic-sparkles ai-area-icon-small"></i>
             LoveWeb এআই অ্যাসিস্ট্যান্ট
          </div>

          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="msg-bubble msg-ai">
              হ্যালো! আমি LoveWeb এর এআই অ্যাসিস্ট্যান্ট। আমি আপনার নতুন অর্ডার প্লেস করা থেকে শুরু করে অর্ডারের বর্তমান অবস্থা (Status) চেক করাসহ যেকোনো বিষয়ে সাহায্য করতে পারি। কীভাবে সাহায্য করতে পারি?
            </div>
          </div>
          
          <div class="ai-chat-input-area">
            <textarea class="ai-chat-input" id="aiChatInput" rows="1" placeholder="আপনার মেসেজ লিখুন..."></textarea>
            
            <div style="position: relative;">
               <div class="voice-waves-mini" id="miniVoiceWaves">
                 <div class="wave"></div><div class="wave"></div><div class="wave"></div>
               </div>
               <button class="ai-voice-btn" id="aiVoiceBtn" title="ভয়েস চ্যাট">
                 <i class="fa-solid fa-microphone"></i>
               </button>
            </div>
            
            <button class="ai-send-btn" id="aiSendBtn" title="পাঠান">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>`;

const newHtml = `        <!-- Messenger Link -->
        <a href="\${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" class="messenger-contact-card">
          <div class="messenger-icon"><i class="fa-brands fa-facebook-messenger"></i></div>
          <div class="messenger-text">
            <h5>মেসেঞ্জারে যোগাযোগ করুন</h5>
            <p>সরাসরি আমাদের টিমের সাথে কথা বলুন</p>
          </div>
        </a>
        
        <!-- Voice Entry Card -->
        <button id="voiceEntryBtn" class="messenger-contact-card voice-entry-btn" style="margin-top: -6px; background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.05); text-align: left; width: 100%; border-radius: 12px; cursor: pointer; padding: 14px;">
          <div class="messenger-icon" style="background: linear-gradient(135deg, #FF2A6D, #A020F0);"><i class="fa-solid fa-microphone"></i></div>
          <div class="messenger-text" style="color: #fff;">
            <h5 style="color: inherit;">ভয়েসের সাহায্যে চ্যাট করুন</h5>
            <p style="color: inherit;">সরাসরি কথা বলে সাহায্য নিন</p>
          </div>
        </button>

        <div class="divider">অথবা</div>

        <!-- AI Branding Header -->
        <div class="ai-branding-header" id="textBrandingHeader">
          <div class="ai-branding-icon-large">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff"/>
            </svg>
          </div>
          <div class="ai-branding-text">LoveWeb</div>
        </div>

        <!-- AI Text Chatbot -->
        <div class="ai-chatbot-area" id="textChatbotArea">
          <div class="ai-area-header">
             <i class="fa-solid fa-wand-magic-sparkles ai-area-icon-small"></i>
             LoveWeb এআই অ্যাসিস্ট্যান্ট
          </div>

          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="msg-bubble msg-ai">
              হ্যালো! আমি LoveWeb এর এআই অ্যাসিস্ট্যান্ট। আমি আপনার নতুন অর্ডার প্লেস করা থেকে শুরু করে অর্ডারের বর্তমান অবস্থা (Status) চেক করাসহ যেকোনো বিষয়ে সাহায্য করতে পারি। কীভাবে সাহায্য করতে পারি?
            </div>
          </div>
          
          <div class="ai-chat-input-area">
            <textarea class="ai-chat-input" id="aiChatInput" rows="1" placeholder="আপনার মেসেজ লিখুন..."></textarea>
            
            <button class="ai-send-btn" id="aiSendBtn" title="পাঠান">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <!-- AI Voice Chatbot (Hidden by default) -->
        <div class="ai-voice-area" id="voiceChatbotArea" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 250px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; position: relative;">
          <button class="back-to-text-btn" id="backToTextBtn" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; opacity: 0.6;"><i class="fa-solid fa-xmark"></i></button>
          <div class="ai-branding-icon-large" style="margin-bottom: 10px;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff"/>
            </svg>
          </div>
          <div class="ai-branding-text" style="margin-bottom: 20px;">LoveWeb Voice</div>
          
          <div style="position: relative; display: flex; justify-content: center; align-items: center;">
            <div class="voice-waves-mini" id="miniVoiceWaves" style="position: absolute; display: none;">
               <div class="wave" style="width: 80px; height: 80px;"></div>
               <div class="wave" style="width: 80px; height: 80px; animation-delay: 0.5s;"></div>
               <div class="wave" style="width: 80px; height: 80px; animation-delay: 1s;"></div>
            </div>
            <button class="ai-voice-btn" id="aiVoiceBtn" title="ভয়েস চ্যাট" style="position: relative; width: 60px; height: 60px; font-size: 1.5rem; background: #FF2A6D; color: #fff; border: none; border-radius: 50%; box-shadow: 0 4px 15px rgba(255,42,109,0.4); cursor: pointer; z-index: 2; transition: transform 0.2s;">
              <i class="fa-solid fa-microphone"></i>
            </button>
          </div>
          <div class="voice-status" id="voiceStatusText" style="margin-top: 25px; font-size: 0.85rem; opacity: 0.8; color: #fff;">ক্লিক করে কথা বলুন</div>
        </div>`;

code = code.replace(oldHtml, newHtml);

// 3. Add JS logic for toggling
const logicToAdd = `
  const voiceEntryBtn = document.getElementById('voiceEntryBtn');
  const textChatbotArea = document.getElementById('textChatbotArea');
  const voiceChatbotArea = document.getElementById('voiceChatbotArea');
  const backToTextBtn = document.getElementById('backToTextBtn');
  const textBrandingHeader = document.getElementById('textBrandingHeader');
  
  voiceEntryBtn.addEventListener('click', () => {
     textChatbotArea.style.display = 'none';
     textBrandingHeader.style.display = 'none';
     voiceEntryBtn.style.display = 'none';
     voiceChatbotArea.style.display = 'flex';
  });
  
  backToTextBtn.addEventListener('click', () => {
     voiceChatbotArea.style.display = 'none';
     textChatbotArea.style.display = 'flex';
     textBrandingHeader.style.display = 'flex';
     voiceEntryBtn.style.display = 'flex';
  });
`;

code = code.replace("const sendBtn = document.getElementById('aiSendBtn');", logicToAdd + "\n  const sendBtn = document.getElementById('aiSendBtn');");

// Let's also update the "miniVoiceWaves" styles since we made them absolute to the button in voice area.
// Wait, miniVoiceWaves animation:
const voiceWavesCss = `
    .voice-waves-mini .wave {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: rgba(255, 42, 109, 0.4);
      animation: pulseMini 1.5s infinite;
      opacity: 0;
    }
    @keyframes pulseMini {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
`;
code = code.replace(/    \.voice-waves-mini \{[\s\S]*?\}[\s\S]*?\}\n/m, voiceWavesCss);

fs.writeFileSync('js/messenger.js', code);
console.log('Patched layout');
