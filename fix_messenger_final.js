import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// 1. We will replace the entire style block with a cleaner version.
const styleRegex = /const style = document\.createElement\('style'\);\s*style\.innerHTML = `[\s\S]*?`;/m;

const newStyle = `const style = document.createElement('style');
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
      -webkit-tap-highlight-color: transparent;
      outline: none;
    }
    
    .chat-fab:active {
      transform: scale(0.9);
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
      pointer-events: none;
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
      
      /* Hidden State */
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      transform-origin: bottom right;
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
    }

    .chat-panel.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
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
      padding: 4px;
    }
    .chat-close-btn:hover, .chat-close-btn:active { opacity: 1; }

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
      cursor: pointer;
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

    .messenger-text { color: #fff; text-align: left; }
    .messenger-text h5 { margin: 0; font-size: 0.95rem; font-weight: 600; color: inherit; }
    .messenger-text p { margin: 4px 0 0 0; font-size: 0.75rem; opacity: 0.8; color: inherit; }

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

    .ai-branding-header {
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

    .ai-send-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 42, 109, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .ai-send-btn:hover, .ai-send-btn:active { background: #FF2A6D; }

    /* Light Theme Settings */
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
    [data-theme="light"] .ai-chatbot-area { background: #fdfdfd; border-color: #eaeaea; }
    [data-theme="light"] .msg-ai { background: #fff0f5; color: #333; border-color: rgba(255,42,109,0.1); }
    [data-theme="light"] .msg-user { background: #f3e8ff; color: #333; border-color: rgba(160,32,240,0.1); }
    [data-theme="light"] .ai-chat-input-area { background: #f8f9fa; border-top-color: #eaeaea; }
    [data-theme="light"] .ai-chat-input { color: #333; }
    [data-theme="light"] .ai-chat-input::placeholder { color: #999; }

    @media (max-width: 480px) {
      .chat-panel { width: calc(100vw - 32px); right: -8px; bottom: 70px; }
    }
  
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
      pointer-events: none;
      visibility: hidden;
      transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 42, 109, 0.2);
    }
    .gemini-voice-container.active {
      bottom: 40px;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
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
    
    [data-theme="light"] .gemini-voice-container {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 42, 109, 0.3);
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    [data-theme="light"] .voice-transcript { color: #191e2b; }
  \`;`;

code = code.replace(styleRegex, newStyle);


// 2. Replace init function
const initRegex = /function init\(\) \{[\s\S]*?\}\)\(\);/m;

const newInit = `function init() {
    if (document.getElementById('lovewebChatWidget')) return;
    document.body.appendChild(widget);

    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatCloseBtn');
    const voiceBtn = document.getElementById('voiceEntryBtn');
    const sendBtn = document.getElementById('aiSendBtn');
    const inputField = document.getElementById('aiChatInput');
    const endVoiceBtn = document.getElementById('geminiEndBtn');

    // Theme Sync
    window.addEventListener('loveweb-theme-changed', (e) => {
      const currentTheme = e.detail?.theme || document.documentElement.getAttribute('data-theme') || 'dark';
      widget.setAttribute('data-theme', currentTheme);
    });
    widget.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') || 'dark');
    
    // Toggle Panel Event - using direct addEventListener for better mobile support
    if (fab) {
        fab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = panel.classList.contains('open');
            if (isOpen) {
                panel.classList.remove('open');
            } else {
                panel.classList.add('open');
            }
        });
        
        // Add touchstart for mobile responsiveness just in case
        fab.addEventListener('touchstart', (e) => {
            // Prevent duplicate firing if touchstart works
            e.stopPropagation();
        }, {passive: true});
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            panel.classList.remove('open');
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('open') && !widget.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSend();
        });
    }

    if (inputField) {
      inputField.addEventListener('keydown', (e) => {
         if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
         }
      });
      inputField.addEventListener('input', function() {
         this.style.height = 'auto';
         this.style.height = (this.scrollHeight) + 'px';
      });
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close the panel
            panel.classList.remove('open');
            
            const geminiVoiceContainer = document.getElementById('geminiVoiceContainer');
            const voiceTranscript = document.getElementById('voiceTranscript');
            
            if (geminiVoiceContainer) geminiVoiceContainer.classList.add('active');
            if (voiceTranscript) voiceTranscript.innerText = "সংযোগ করা হচ্ছে...";
            
            try {
                ws = new WebSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/live');
                inputAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                outputAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
                
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
                mediaSource = inputAudioCtx.createMediaStreamSource(mediaStream);
                mediaProcessor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
                
                mediaSource.connect(mediaProcessor);
                mediaProcessor.connect(inputAudioCtx.destination);
                
                mediaProcessor.onaudioprocess = (audioEvent) => {
                   if(ws && ws.readyState === 1 && isRecording) {
                      const float32Array = audioEvent.inputBuffer.getChannelData(0);
                      ws.send(JSON.stringify({ audio: pcmToBase64(float32Array) }));
                   }
                };
                
                ws.onmessage = (event) => {
                   const msg = JSON.parse(event.data);
                   if(msg.audio && outputAudioCtx) {
                      playAudioChunk(outputAudioCtx, msg.audio);
                      const bars = document.querySelectorAll('.gemini-bar');
                      bars.forEach(b => b.classList.add('listening'));
                      if (voiceTranscript) voiceTranscript.innerText = "এআই বলছে...";
                   }
                   if (msg.error) {
                      if (voiceTranscript) voiceTranscript.innerText = "Error: " + msg.error;
                      setTimeout(() => stopVoice(), 4000);
                   }
                   if (msg.client_command) {
                      if (msg.client_command.action === 'navigate') {
                         window.location.href = msg.client_command.url;
                      }
                      if (msg.client_command.action === 'select_package') {
                         const pkg = msg.client_command.value;
                         if (window.location.pathname.includes('place-order')) {
                            const cards = document.querySelectorAll('.package-card');
                            cards.forEach(card => {
                                if (card.innerHTML.includes(pkg) && typeof selectPackage === 'function') {
                                    selectPackage(card, pkg);
                                    if (voiceTranscript) voiceTranscript.innerText = pkg + " প্যাকেজ সিলেক্ট করা হয়েছে";
                                }
                            });
                         } else {
                            window.location.href = '/place-order/?package=' + pkg;
                         }
                      }
                   }
                   if(msg.interrupted) {
                      playQueue.length = 0;
                   }
                };
                
                ws.onopen = () => {
                   isRecording = true;
                   if (voiceTranscript) voiceTranscript.innerText = "শুনছি...";
                   const bars = document.querySelectorAll('.gemini-bar');
                   bars.forEach(b => b.classList.add('listening'));
                };
                
                ws.onerror = () => {
                   if (voiceTranscript) voiceTranscript.innerText = "ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।";
                   setTimeout(() => stopVoice(), 4000);
                };
                ws.onclose = () => {
                   if (isRecording) {
                      if (voiceTranscript) voiceTranscript.innerText = "সংযোগ বিচ্ছিন্ন হয়েছে।";
                      setTimeout(() => stopVoice(), 3000);
                   }
                };
            } catch (err) {
                console.error(err);
                stopVoice();
                if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                   alert("দয়া করে মাইক্রোফোন পারমিশন Allow করুন।");
                } else {
                   alert("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে।");
                }
            }
        });
    }

    if (endVoiceBtn) {
        endVoiceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopVoice();
        });
    }
    
    function addMessage(text, isUser=true) {
       const msgsContainer = document.getElementById('aiChatMessages');
       if (!msgsContainer) return;
       const d = document.createElement('div');
       d.className = 'msg-bubble ' + (isUser ? 'msg-user' : 'msg-ai');
       d.innerText = text;
       msgsContainer.appendChild(d);
       msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }
    
    async function handleSend() {
       const input = document.getElementById('aiChatInput');
       const msgsContainer = document.getElementById('aiChatMessages');
       if (!input) return;
       const text = input.value.trim();
       if(!text) return;
       input.value = '';
       input.style.height = 'auto';
       
       addMessage(text, true);
       
       const typingId = 'typing-' + Date.now();
       const typingDiv = document.createElement('div');
       typingDiv.id = typingId;
       typingDiv.className = 'msg-bubble msg-ai';
       typingDiv.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i>';
       if(msgsContainer) {
         msgsContainer.appendChild(typingDiv);
         msgsContainer.scrollTop = msgsContainer.scrollHeight;
       }
       
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
    
    function stopVoice() {
        isRecording = false;
        const geminiVoiceContainer = document.getElementById('geminiVoiceContainer');
        if (geminiVoiceContainer) geminiVoiceContainer.classList.remove('active');
        
        const bars = document.querySelectorAll('.gemini-bar');
        bars.forEach(b => b.classList.remove('listening'));
        
        if(mediaProcessor) mediaProcessor.disconnect();
        if(mediaSource) mediaSource.disconnect();
        if(mediaStream) mediaStream.getTracks().forEach(t => t.stop());
        if(ws) ws.close();
        playQueue.length = 0;
        
        addMessage("[ভয়েস সেশন বন্ধ করা হয়েছে]", false);
    }
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;

code = code.replace(initRegex, newInit);
fs.writeFileSync('js/messenger.js', code);
console.log('Fixed completely.');
