import fs from 'fs';
const code = `
const MESSENGER_URL = 'https://m.me/lovewebbd';

(function () {
  const style = document.createElement('style');
  style.innerHTML = \`
    .loveweb-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
    }

    .chat-fab {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF2A6D 0%, #A020F0 100%);
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(255, 42, 109, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
    }
    
    .chat-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 14px 30px rgba(255, 42, 109, 0.6);
    }
    
    .chat-fab-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #FF2A6D;
      z-index: -1;
      animation: chatPulse 2s infinite;
    }
    
    @keyframes chatPulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    .chat-panel {
      position: absolute;
      bottom: 76px;
      right: 0;
      width: 360px;
      background: rgba(18, 20, 30, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 42, 109, 0.3);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform: translateY(20px) scale(0.95) !important;
      transform-origin: bottom right;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .chat-panel.open {
      transform: translateY(0) scale(1) !important;
      opacity: 1;
      pointer-events: auto;
    }

    .chat-header {
      padding: 16px 20px;
      background: rgba(255, 42, 109, 0.1);
      border-bottom: 1px solid rgba(255, 42, 109, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-header-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-close-btn {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .chat-close-btn:hover { opacity: 1; }

    .chat-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 450px;
      overflow-y: auto;
    }

    /* Messenger Section */
    .messenger-contact-card {
      background: linear-gradient(135deg, rgba(0, 106, 255, 0.1), rgba(0, 106, 255, 0.02));
      border: 1px solid rgba(0, 106, 255, 0.3);
      border-radius: 12px;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .messenger-contact-card:hover {
      background: rgba(0, 106, 255, 0.15);
      transform: translateY(-2px);
    }

    .messenger-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #006AFF;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .messenger-text {
      color: #fff;
    }
    .messenger-text h5 { margin: 0; font-size: 0.95rem; font-weight: 600; }
    .messenger-text p { margin: 4px 0 0 0; font-size: 0.75rem; opacity: 0.8; }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.8rem;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .divider:not(:empty)::before { margin-right: .5em; }
    .divider:not(:empty)::after { margin-left: .5em; }

    /* AI Chatbot Section */
    .ai-chatbot-area {
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      height: 250px;
      position: relative;
    }

    .ai-chat-messages {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    /* Scrollbar styling */
    .ai-chat-messages::-webkit-scrollbar { width: 4px; }
    .ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,42,109,0.3); border-radius: 4px; }

    .msg-bubble {
      max-width: 85%;
      padding: 10px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .msg-ai {
      background: rgba(255, 42, 109, 0.1);
      border: 1px solid rgba(255, 42, 109, 0.2);
      color: #fff;
      align-self: flex-start;
      border-bottom-left-radius: 2px;
    }
    .msg-user {
      background: rgba(160, 32, 240, 0.2);
      border: 1px solid rgba(160, 32, 240, 0.3);
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 2px;
    }

    .ai-chat-input-area {
      display: flex;
      padding: 8px;
      border-top: 1px solid rgba(255,255,255,0.05);
      gap: 6px;
      align-items: flex-end;
      background: rgba(0,0,0,0.3);
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    .ai-chat-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #fff;
      padding: 8px 10px;
      font-size: 0.85rem;
      resize: none;
      outline: none;
      font-family: inherit;
      max-height: 80px;
    }
    .ai-chat-input::placeholder { color: rgba(255,255,255,0.4); }

    .ai-send-btn, .ai-voice-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    
    .ai-send-btn {
      background: rgba(255, 42, 109, 0.8);
      color: white;
    }
    .ai-send-btn:hover { background: #FF2A6D; }

    /* Voice Bot Corner Animation */
    .ai-voice-btn {
      background: linear-gradient(135deg, #A020F0, #05D9E8);
      color: white;
      box-shadow: 0 0 10px rgba(5, 217, 232, 0.4);
      position: relative;
    }
    .ai-voice-btn:hover {
      transform: scale(1.1);
    }
    .ai-voice-btn.recording {
      background: #10b981;
      animation: micPulse 1.5s infinite;
    }
    
    @keyframes micPulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); transform: scale(1); }
    }

    .voice-waves-mini {
      position: absolute;
      top: -25px;
      right: 0;
      display: flex;
      gap: 2px;
      height: 15px;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .voice-waves-mini.visible { opacity: 1; }
    .voice-waves-mini .wave {
      width: 3px;
      height: 100%;
      background: #10b981;
      border-radius: 2px;
      animation: waveAnimMini 1s ease-in-out infinite alternate;
    }
    .voice-waves-mini .wave:nth-child(2) { animation-delay: 0.2s; }
    .voice-waves-mini .wave:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes waveAnimMini {
       0% { height: 20%; }
       100% { height: 100%; }
    }

    /* Light Theme */
    [data-theme="light"] .chat-panel {
      background: rgba(255,255,255,0.98);
      border-color: rgba(255,42,109,0.3);
      box-shadow: 0 16px 45px rgba(255, 42, 109, 0.16);
    }
    [data-theme="light"] .chat-header {
      background: rgba(255, 42, 109, 0.05);
    }
    [data-theme="light"] .chat-header-title { color: #191e2b; }
    [data-theme="light"] .chat-close-btn { color: #191e2b; }
    [data-theme="light"] .divider { color: #888; }
    [data-theme="light"] .divider::before, [data-theme="light"] .divider::after { border-color: #ddd; }
    [data-theme="light"] .messenger-contact-card {
      background: #f0f7ff;
      border-color: rgba(0,106,255,0.2);
    }
    [data-theme="light"] .messenger-text { color: #191e2b; }
    [data-theme="light"] .ai-chatbot-area {
      background: #fdfdfd;
      border-color: #eaeaea;
    }
    [data-theme="light"] .msg-ai {
      background: #fff0f5;
      color: #333;
      border-color: rgba(255,42,109,0.1);
    }
    [data-theme="light"] .msg-user {
      background: #f3e8ff;
      color: #333;
      border-color: rgba(160,32,240,0.1);
    }
    [data-theme="light"] .ai-chat-input-area { background: #f8f9fa; border-top-color: #eaeaea; }
    [data-theme="light"] .ai-chat-input { color: #333; }
    [data-theme="light"] .ai-chat-input::placeholder { color: #999; }

    @media (max-width: 480px) {
      .chat-panel { width: calc(100vw - 32px); right: -8px; bottom: 70px; }
    }
  \`;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.className = 'loveweb-chat-widget';
  widget.id = 'lovewebChatWidget';
  
  widget.innerHTML = \`
    <div class="chat-panel" id="chatPanel">
      <div class="chat-header">
        <h4 class="chat-header-title"><i class="fa-solid fa-headset"></i> সাপোর্ট ও চ্যাট</h4>
        <button class="chat-close-btn" id="chatCloseBtn">✕</button>
      </div>
      
      <div class="chat-body">
        <!-- Messenger Link -->
        <a href="\${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" class="messenger-contact-card">
          <div class="messenger-icon"><i class="fa-brands fa-facebook-messenger"></i></div>
          <div class="messenger-text">
            <h5>মেসেঞ্জারে যোগাযোগ করুন</h5>
            <p>সরাসরি আমাদের টিমের সাথে কথা বলুন</p>
          </div>
        </a>

        <div class="divider">অথবা</div>

        <!-- AI Chatbot -->
        <div class="ai-chatbot-area">
          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="msg-bubble msg-ai">
              হ্যালো! আমি LoveWeb এর এআই অ্যাসিস্ট্যান্ট। কীভাবে আপনাকে সাহায্য করতে পারি?
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
        </div>
      </div>
    </div>

    <!-- Main FAB -->
    <button class="chat-fab" id="chatFab">
      <div class="chat-fab-pulse"></div>
      <i class="fa-solid fa-comments"></i>
    </button>
  \`;

  let chatHistory = [];
  
  // Voice API Utils
  let ws = null;
  let inputAudioCtx = null;
  let outputAudioCtx = null;
  let mediaStream = null;
  let mediaProcessor = null;
  let mediaSource = null;
  let isRecording = false;
  const playQueue = [];
  let isPlaying = false;
  
  function pcmToBase64(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
    return btoa(binary);
  }
  
  function playNextChunk(ctx) {
     if(playQueue.length === 0) { isPlaying = false; return; }
     isPlaying = true;
     const buffer = playQueue.shift();
     const source = ctx.createBufferSource();
     source.buffer = buffer;
     source.connect(ctx.destination);
     source.onended = () => playNextChunk(ctx);
     source.start();
  }
  
  async function playAudioChunk(ctx, base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const numSamples = bytes.length / 2;
    const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
    const channelData = audioBuffer.getChannelData(0);
    const pcmView = new DataView(new Uint8Array(bytes).buffer);
    for(let i=0; i < numSamples; i++) {
       const s = pcmView.getInt16(i * 2, true);
       channelData[i] = s / 0x8000;
    }
    playQueue.push(audioBuffer);
    if(!isPlaying) playNextChunk(ctx);
  }

  function init() {
    if (document.getElementById('lovewebChatWidget')) return;
    document.body.appendChild(widget);

    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatCloseBtn');
    let isOpen = false;

    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      if(isOpen) panel.classList.add('open');
      else panel.classList.remove('open');
    });

    closeBtn.addEventListener('click', () => {
      isOpen = false;
      panel.classList.remove('open');
    });

    // Theme Sync
    window.addEventListener('loveweb-theme-changed', (e) => {
      const currentTheme = e.detail?.theme || document.documentElement.getAttribute('data-theme') || 'dark';
      widget.setAttribute('data-theme', currentTheme);
    });
    widget.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') || 'dark');

    // Chat Logic
    const sendBtn = document.getElementById('aiSendBtn');
    const input = document.getElementById('aiChatInput');
    const msgsContainer = document.getElementById('aiChatMessages');
    
    function addMessage(text, isUser=true) {
       const d = document.createElement('div');
       d.className = 'msg-bubble ' + (isUser ? 'msg-user' : 'msg-ai');
       d.innerText = text;
       msgsContainer.appendChild(d);
       msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }

    async function handleSend() {
       const text = input.value.trim();
       if(!text) return;
       input.value = '';
       input.style.height = 'auto';
       
       addMessage(text, true);
       
       // Show typing indicator
       const typingId = 'typing-' + Date.now();
       const typingDiv = document.createElement('div');
       typingDiv.id = typingId;
       typingDiv.className = 'msg-bubble msg-ai';
       typingDiv.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i>';
       msgsContainer.appendChild(typingDiv);
       msgsContainer.scrollTop = msgsContainer.scrollHeight;

       try {
          const res = await fetch('/api/chat', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ message: text, history: chatHistory })
          });
          const data = await res.json();
          document.getElementById(typingId)?.remove();
          
          if(data.success) {
             addMessage(data.text, false);
             chatHistory.push({ role: 'user', text });
             chatHistory.push({ role: 'model', text: data.text });
          } else {
             addMessage("দুঃখিত, কোনো একটি সমস্যা হয়েছে।", false);
          }
       } catch(err) {
          document.getElementById(typingId)?.remove();
          addMessage("নেটওয়ার্ক সমস্যা।", false);
       }
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
       if(e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
       }
    });

    // Auto resize textarea
    input.addEventListener('input', function() {
       this.style.height = 'auto';
       this.style.height = (this.scrollHeight) + 'px';
    });

    // Voice Chat Logic
    const voiceBtn = document.getElementById('aiVoiceBtn');
    const miniWaves = document.getElementById('miniVoiceWaves');
    
    voiceBtn.addEventListener('click', async () => {
       if (isRecording) {
          // Stop
          isRecording = false;
          voiceBtn.classList.remove('recording');
          voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
          miniWaves.classList.remove('visible');
          
          if(mediaProcessor) mediaProcessor.disconnect();
          if(mediaSource) mediaSource.disconnect();
          if(mediaStream) mediaStream.getTracks().forEach(t => t.stop());
          if(ws) ws.close();
          playQueue.length = 0;
          
          addMessage("[ভয়েস সেশন বন্ধ করা হয়েছে]", false);
          return;
       }
       
       // Start
       try {
          voiceBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
          
          ws = new WebSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/live');
          inputAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
          outputAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
          
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
          mediaSource = inputAudioCtx.createMediaStreamSource(mediaStream);
          mediaProcessor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
          
          mediaSource.connect(mediaProcessor);
          mediaProcessor.connect(inputAudioCtx.destination);
          
          mediaProcessor.onaudioprocess = (e) => {
             if(ws && ws.readyState === 1) {
                const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
                ws.send(JSON.stringify({ audio: base64 }));
             }
          };
          
          ws.onmessage = (event) => {
             const msg = JSON.parse(event.data);
             if(msg.audio && outputAudioCtx) playAudioChunk(outputAudioCtx, msg.audio);
             if(msg.interrupted) playQueue.length = 0;
          };
          
          ws.onopen = () => {
             isRecording = true;
             voiceBtn.classList.add('recording');
             voiceBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
             miniWaves.classList.add('visible');
             addMessage("[ভয়েস চ্যাট শুরু হয়েছে। কথা বলুন...]", false);
          };
          
          ws.onerror = () => {
             isRecording = false;
             voiceBtn.classList.remove('recording');
             voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
             miniWaves.classList.remove('visible');
             alert("ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।");
          };
       } catch (err) {
          console.error(err);
          voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
          if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
             alert("দয়া করে মাইক্রোফোন পারমিশন Allow করুন।");
          } else {
             alert("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে।");
          }
       }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
fs.writeFileSync('js/messenger.js', code);
console.log('Updated messenger.js with full chat widget');
