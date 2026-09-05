import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// I will extract the CSS part and the Widget HTML part which are mostly fine,
// and rewrite the whole JS logic part cleanly.

const cssMatch = code.match(/const style = document\.createElement\('style'\);\s+style\.innerHTML = \`([\s\S]*?)\`;/);
const cssContent = cssMatch ? cssMatch[1] : '';

const htmlMatch = code.match(/widget\.innerHTML = \`([\s\S]*?)\`;/);
const htmlContent = htmlMatch ? htmlMatch[1] : '';

const newCode = `const MESSENGER_URL = 'https://m.me/lovewebbd';

(function () {
  const style = document.createElement('style');
  style.innerHTML = \`${cssContent}\`;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.className = 'loveweb-chat-widget';
  widget.id = 'lovewebChatWidget';
  
  widget.innerHTML = \`${htmlContent}\`;

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

    // UI Switching Logic
    const voiceEntryBtn = document.getElementById('voiceEntryBtn');
    const textChatbotArea = document.getElementById('textChatbotArea');
    const voiceChatbotArea = document.getElementById('voiceChatbotArea');
    const backToTextBtn = document.getElementById('backToTextBtn');
    const textBrandingHeader = document.getElementById('textBrandingHeader');
    
    if (voiceEntryBtn && backToTextBtn) {
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
    }

    // Text Chat Logic
    const sendBtn = document.getElementById('aiSendBtn');
    const input = document.getElementById('aiChatInput');
    const msgsContainer = document.getElementById('aiChatMessages');
    
    function addMessage(text, isUser=true) {
       if (!msgsContainer) return;
       const d = document.createElement('div');
       d.className = 'msg-bubble ' + (isUser ? 'msg-user' : 'msg-ai');
       d.innerText = text;
       msgsContainer.appendChild(d);
       msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }

    async function handleSend() {
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

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
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

    // Voice Chat Logic
    const voiceBtn = document.getElementById('aiVoiceBtn');
    const miniWaves = document.getElementById('miniVoiceWaves');
    
    if (voiceBtn) {
      voiceBtn.addEventListener('click', async () => {
         if (isRecording) {
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            document.getElementById('voiceStatusText').innerText = 'ক্লিক করে কথা বলুন';
            
            if (miniWaves) miniWaves.style.display = 'none';
            
            if(mediaProcessor) mediaProcessor.disconnect();
            if(mediaSource) mediaSource.disconnect();
            if(mediaStream) mediaStream.getTracks().forEach(t => t.stop());
            if(ws) ws.close();
            playQueue.length = 0;
            
            return;
         }
         
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
               if(ws && ws.readyState === 1 && isRecording) {
                  const float32Array = e.inputBuffer.getChannelData(0);
                  ws.send(JSON.stringify({ audio: pcmToBase64(float32Array) }));
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
               voiceBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
               document.getElementById('voiceStatusText').innerText = 'শুনছি... (বন্ধ করতে আবার ক্লিক করুন)';
               if (miniWaves) miniWaves.style.display = 'block';
            };
            
            ws.onerror = () => {
               isRecording = false;
               voiceBtn.classList.remove('recording');
               if(miniWaves) miniWaves.style.display = 'none';
               alert("ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।");
            };
         } catch (err) {
            console.error(err);
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
               alert("দয়া করে মাইক্রোফোন পারমিশন Allow করুন।");
            } else {
               alert("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে।");
            }
            voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
         }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

fs.writeFileSync('js/messenger.js', newCode);
console.log('Rewrite complete!');
