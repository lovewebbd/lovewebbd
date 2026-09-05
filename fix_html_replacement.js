import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const oldRegex = /<!-- Messenger Link -->[\s\S]*?<!-- Main FAB -->/;

const newHtml = `<!-- Messenger Link -->
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
            <h5 style="color: inherit; margin: 0; font-size: 0.95rem; font-weight: 600;">ভয়েসের সাহায্যে চ্যাট করুন</h5>
            <p style="color: inherit; margin: 4px 0 0 0; font-size: 0.75rem; opacity: 0.8;">সরাসরি কথা বলে সাহায্য নিন</p>
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
        <div class="ai-voice-area" id="voiceChatbotArea" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 350px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; position: relative;">
          <button class="back-to-text-btn" id="backToTextBtn" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; opacity: 0.6;"><i class="fa-solid fa-xmark"></i></button>
          <div class="ai-branding-icon-large" style="margin-bottom: 10px;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff"/>
            </svg>
          </div>
          <div class="ai-branding-text" style="margin-bottom: 20px;">LoveWeb Voice</div>
          
          <div style="position: relative; display: flex; justify-content: center; align-items: center; margin-top: 20px;">
            <div class="voice-waves-mini" id="miniVoiceWaves" style="position: absolute; display: none;">
               <div class="wave" style="width: 100px; height: 100px;"></div>
               <div class="wave" style="width: 100px; height: 100px; animation-delay: 0.5s;"></div>
               <div class="wave" style="width: 100px; height: 100px; animation-delay: 1s;"></div>
            </div>
            <button class="ai-voice-btn" id="aiVoiceBtn" title="ভয়েস চ্যাট" style="position: relative; width: 60px; height: 60px; font-size: 1.5rem; background: #FF2A6D; color: #fff; border: none; border-radius: 50%; box-shadow: 0 4px 15px rgba(255,42,109,0.4); cursor: pointer; z-index: 2; transition: transform 0.2s;">
              <i class="fa-solid fa-microphone"></i>
            </button>
          </div>
          <div class="voice-status" id="voiceStatusText" style="margin-top: 35px; font-size: 0.85rem; opacity: 0.8; color: #fff;">ক্লিক করে কথা বলুন</div>
        </div>
      </div>
    </div>

    <!-- Main FAB -->`;

code = code.replace(oldRegex, newHtml);

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed HTML replacement');
