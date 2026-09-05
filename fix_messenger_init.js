import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /\/\/ Chat Logic[\s\S]*?\}\)[\s\S]*?\(\);/m;

const newBlock = `// Chat Logic
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
       
       // Show typing indicator
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
      // Auto resize textarea
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
            // Stop
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
               voiceBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
               document.getElementById('voiceStatusText').innerText = 'শুনছি... (বন্ধ করতে আবার ক্লিক করুন)';
               if (miniWaves) miniWaves.style.display = 'block';
               addMessage("[ভয়েস চ্যাট শুরু হয়েছে। কথা বলুন...]", false);
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

code = code.replace(regex, newBlock);
fs.writeFileSync('js/messenger.js', code);
console.log("Fixed the messenger code.");
