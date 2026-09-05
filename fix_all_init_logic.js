import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

// I'll rewrite the entire `// Chat Logic` to `// Voice API Utils` block
const startIndex = code.indexOf('// Chat Logic');
const endIndex = code.indexOf('// Voice API Utils');
if (startIndex !== -1 && endIndex !== -1) {
  const newLogic = `// Chat Logic
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
       
       try {
          const res = await fetch('/api/chat', {
             method: 'POST',
             headers: {'Content-Type':'application/json'},
             body: JSON.stringify({ message: text, history: chatHistory })
          });
          const data = await res.json();
          if(data.success) {
             addMessage(data.text, false);
             chatHistory.push({ role: 'user', text });
             chatHistory.push({ role: 'model', text: data.text });
          } else {
             addMessage("দুঃখিত, কোনো একটি সমস্যা হয়েছে।", false);
          }
       } catch (err) {
          console.error(err);
          addMessage("সার্ভারে কানেক্ট করা যাচ্ছে না।", false);
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
            // Stop
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            document.getElementById('voiceStatusText').innerText = 'ক্লিক করে কথা বলুন';
            if (miniWaves) miniWaves.style.display = 'none';
            
            if (mediaProcessor) { mediaProcessor.disconnect(); mediaProcessor = null; }
            if (mediaSource) { mediaSource.disconnect(); mediaSource = null; }
            if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
            if (ws) { ws.close(); ws = null; }
            return;
         }
         
         // Start
         try {
            voiceBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            
            ws = new WebSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/live');
            inputAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            outputAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            
            ws.onmessage = async (event) => {
               const msg = JSON.parse(event.data);
               if (msg.audio) {
                  const binary = atob(msg.audio);
                  const bytes = new Uint8Array(binary.length);
                  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                  
                  const audioBuffer = await outputAudioCtx.decodeAudioData(bytes.buffer);
                  playQueue.push(audioBuffer);
                  if(!isPlaying) playNextChunk(outputAudioCtx);
               }
               if (msg.interrupted) {
                  playQueue.length = 0;
               }
            };

            ws.onopen = () => {
               isRecording = true;
               voiceBtn.classList.add('recording');
               voiceBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
               document.getElementById('voiceStatusText').innerText = 'শুনছি... (বন্ধ করতে আবার ক্লিক করুন)';
               if (miniWaves) miniWaves.style.display = 'block';
               addMessage("[ভয়েস চ্যাট শুরু হয়েছে। কথা বলুন...]", false);
            };

            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
            mediaSource = inputAudioCtx.createMediaStreamSource(mediaStream);
            mediaProcessor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
            
            mediaSource.connect(mediaProcessor);
            mediaProcessor.connect(inputAudioCtx.destination);
            
            mediaProcessor.onaudioprocess = (e) => {
               if (ws && ws.readyState === WebSocket.OPEN && isRecording) {
                  const float32Array = e.inputBuffer.getChannelData(0);
                  ws.send(JSON.stringify({ audio: pcmToBase64(float32Array) }));
               }
            };
            
         } catch (err) {
            console.error('Voice chat error:', err);
            addMessage("[মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে]", false);
            voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
         }
      });
    }

    `;
  code = code.substring(0, startIndex) + newLogic + code.substring(endIndex);
  fs.writeFileSync('js/messenger.js', code);
  console.log('Fixed entire init logic block cleanly');
} else {
  console.log("Could not find boundaries");
}
