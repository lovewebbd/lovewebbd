import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /function init\(\) \{[\s\S]*?\}\)\(\);/m;
const fix = `function init() {
    if (document.getElementById('lovewebChatWidget')) return;
    document.body.appendChild(widget);

    const panel = document.getElementById('chatPanel');
    let isOpen = false;
    
    // Theme Sync
    window.addEventListener('loveweb-theme-changed', (e) => {
      const currentTheme = e.detail?.theme || document.documentElement.getAttribute('data-theme') || 'dark';
      widget.setAttribute('data-theme', currentTheme);
    });
    widget.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') || 'dark');
    
    document.addEventListener('click', async (e) => {
       const fab = e.target.closest('#chatFab');
       if (fab) {
          e.stopPropagation();
          isOpen = !isOpen;
          if (isOpen) {
             panel.classList.add('open');
             panel.style.visibility = 'visible';
             panel.style.opacity = '1';
             panel.style.pointerEvents = 'auto';
             panel.style.transform = 'translateY(0) scale(1)';
          } else {
             panel.classList.remove('open');
             panel.style.visibility = 'hidden';
             panel.style.opacity = '0';
             panel.style.pointerEvents = 'none';
             panel.style.transform = 'translateY(20px) scale(0.95)';
          }
          return;
       }
       
       const closeBtn = e.target.closest('#chatCloseBtn');
       if (closeBtn) {
          e.stopPropagation();
          isOpen = false;
          panel.classList.remove('open');
          panel.style.visibility = 'hidden';
          panel.style.opacity = '0';
          panel.style.pointerEvents = 'none';
          panel.style.transform = 'translateY(20px) scale(0.95)';
          return;
       }
       
       const sendBtn = e.target.closest('#aiSendBtn');
       if (sendBtn) {
          e.preventDefault();
          handleSend();
          return;
       }
       
       const voiceBtn = e.target.closest('#voiceEntryBtn');
       if (voiceBtn) {
          e.preventDefault();
          console.log('Voice entry clicked');
          isOpen = false;
          panel.classList.remove('open');
          panel.style.visibility = 'hidden';
          panel.style.opacity = '0';
          panel.style.pointerEvents = 'none';
          panel.style.transform = 'translateY(20px) scale(0.95)';
          
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
          return;
       }
       
       const endBtn = e.target.closest('#geminiEndBtn');
       if (endBtn) {
          e.preventDefault();
          stopVoice();
          return;
       }
    });
    
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
         if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
         }
      });
      input.addEventListener('input', function() {
         this.style.height = 'auto';
         this.style.height = (this.scrollHeight) + 'px';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`

code = code.replace(regex, fix);
fs.writeFileSync('js/messenger.js', code);
console.log('Fixed init successfully.');
