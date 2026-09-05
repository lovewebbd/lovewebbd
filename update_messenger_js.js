import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /\/\/ Voice Chat Logic[\s\S]*?\}\n  \}\n\n  if/m;

const newVoiceLogic = `// Voice Chat Logic
    const voiceEntryBtn = document.getElementById('voiceEntryBtn');
    const geminiVoiceContainer = document.getElementById('geminiVoiceContainer');
    const geminiEndBtn = document.getElementById('geminiEndBtn');
    const geminiWaveContainer = document.getElementById('geminiWaveContainer');
    const voiceTranscript = document.getElementById('voiceTranscript');
    const chatPanel = document.getElementById('chatPanel');
    
    function stopVoice() {
        isRecording = false;
        geminiVoiceContainer.classList.remove('active');
        
        // Remove wave animation
        const bars = geminiWaveContainer.querySelectorAll('.gemini-bar');
        bars.forEach(b => b.classList.remove('listening'));
        
        if(mediaProcessor) mediaProcessor.disconnect();
        if(mediaSource) mediaSource.disconnect();
        if(mediaStream) mediaStream.getTracks().forEach(t => t.stop());
        if(ws) ws.close();
        playQueue.length = 0;
        
        addMessage("[ভয়েস সেশন বন্ধ করা হয়েছে]", false);
    }
    
    if (geminiEndBtn) {
       geminiEndBtn.addEventListener('click', stopVoice);
    }

    if (voiceEntryBtn) {
      voiceEntryBtn.addEventListener('click', async () => {
         // Hide chat panel
         chatPanel.classList.remove('open');
         isOpen = false;
         
         // Show Gemini UI
         geminiVoiceContainer.classList.add('active');
         voiceTranscript.innerText = "সংযোগ করা হচ্ছে...";
         
         try {
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
               if(msg.audio && outputAudioCtx) {
                  playAudioChunk(outputAudioCtx, msg.audio);
                  // AI is speaking
                  const bars = geminiWaveContainer.querySelectorAll('.gemini-bar');
                  bars.forEach(b => b.classList.add('listening'));
                  voiceTranscript.innerText = "এআই বলছে...";
               }
               if (msg.client_command) {
                  // Execute client command
                  if (msg.client_command.action === 'navigate') {
                     window.location.href = msg.client_command.url;
                  }
                  if (msg.client_command.action === 'select_package') {
                     const pkg = msg.client_command.value;
                     if (window.location.pathname.includes('place-order')) {
                        const pkgSelect = document.getElementById('package');
                        if (pkgSelect) {
                           pkgSelect.value = pkg;
                           pkgSelect.dispatchEvent(new Event('change'));
                           voiceTranscript.innerText = pkg + " প্যাকেজ সিলেক্ট করা হয়েছে";
                        }
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
               voiceTranscript.innerText = "শুনছি...";
               const bars = geminiWaveContainer.querySelectorAll('.gemini-bar');
               bars.forEach(b => b.classList.add('listening'));
            };
            
            ws.onerror = () => {
               stopVoice();
               alert("ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।");
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
  }

  if`;

code = code.replace(regex, newVoiceLogic);
fs.writeFileSync('js/messenger.js', code);
console.log('Voice logic updated');
