import fs from 'fs';
let html = fs.readFileSync('help/index.html', 'utf8');

// Insert styles for the Live Voice Widget
const styleToInsert = `
    /* Live Voice Assistant */
    .ai-voice-card {
      width: 100%;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(255, 42, 109, 0.1));
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }
    
    [data-theme="light"] .ai-voice-card {
       background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(255, 42, 109, 0.05)) !important;
       border-color: rgba(168, 85, 247, 0.2) !important;
       box-shadow: 0 4px 16px rgba(168, 85, 247, 0.05) !important;
    }
    
    .ai-voice-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .ai-voice-desc {
      font-size: 0.9rem;
      color: var(--text-sub);
      max-width: 85%;
      margin: 0 auto;
    }

    .mic-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7, #ff2a6d);
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(255, 42, 109, 0.4);
      transition: all 0.3s ease;
      position: relative;
    }

    .mic-button:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 30px rgba(255, 42, 109, 0.5);
    }
    
    .mic-button.active {
      animation: pulse 1.5s infinite;
      background: #10b981;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
    }
    
    .mic-button.active:hover {
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5);
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    
    .ai-status {
      font-size: 0.85rem;
      color: #10b981;
      font-weight: 600;
      opacity: 0;
      transition: opacity 0.3s ease;
      margin-top: -5px;
    }
    .ai-status.visible { opacity: 1; }
    
    .waves {
       display: flex;
       gap: 4px;
       align-items: center;
       justify-content: center;
       height: 20px;
       opacity: 0;
       transition: opacity 0.3s ease;
    }
    .waves.visible { opacity: 1; }
    
    .wave {
       width: 4px;
       height: 100%;
       background: #10b981;
       border-radius: 4px;
       animation: waveAnim 1s ease-in-out infinite alternate;
    }
    .wave:nth-child(2) { animation-delay: 0.2s; }
    .wave:nth-child(3) { animation-delay: 0.4s; }
    .wave:nth-child(4) { animation-delay: 0.6s; }
    .wave:nth-child(5) { animation-delay: 0.8s; }
    
    @keyframes waveAnim {
       0% { height: 20%; }
       100% { height: 100%; }
    }
`;

html = html.replace('/* Contact Box */', styleToInsert + '\n    /* Contact Box */');

const widgetHTML = `
    <!-- Live AI Voice Assistant -->
    <div class="ai-voice-card">
      <div class="ai-voice-title">
        <i class="fa-solid fa-microphone-lines"></i> এআই ভয়েস অ্যাসিস্ট্যান্ট (Live)
      </div>
      <div class="ai-voice-desc">
        আমাদের ওয়েবসাইট বা সার্ভিস সম্পর্কে কোনো প্রশ্ন আছে? নিচের মাইক বাটনে ক্লিক করে সরাসরি বাংলায় কথা বলে জেনে নিন!
      </div>
      
      <button class="mic-button" id="startVoiceChatBtn" title="কথা বলা শুরু করুন">
        <i class="fa-solid fa-microphone"></i>
      </button>
      
      <div class="waves" id="audioWaves">
         <div class="wave"></div>
         <div class="wave"></div>
         <div class="wave"></div>
         <div class="wave"></div>
         <div class="wave"></div>
      </div>
      <div class="ai-status" id="aiVoiceStatus">শুনছে... কথা বলুন</div>
    </div>
`;

html = html.replace('<!-- Official Contact Box -->', widgetHTML + '\n    <!-- Official Contact Box -->');

const jsHTML = `
  <!-- Audio Context Polyfill and Helper -->
  <script>
    function pcmToBase64(float32Array) {
      const buffer = new ArrayBuffer(float32Array.length * 2);
      const view = new DataView(buffer);
      for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    
    const playQueue = [];
    let isPlaying = false;
    
    async function playAudioChunk(ctx, base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      // Assuming 24000 sample rate PCM from Gemini
      const buffer = new ArrayBuffer(bytes.length);
      const view = new DataView(buffer);
      for(let i = 0; i < bytes.length; i++) {
         view.setUint8(i, bytes[i]);
      }
      
      // We need to convert 16-bit PCM to Float32
      const numSamples = bytes.length / 2;
      const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      const pcmView = new DataView(buffer);
      for(let i=0; i < numSamples; i++) {
         const s = pcmView.getInt16(i * 2, true);
         channelData[i] = s / 0x8000;
      }
      
      playQueue.push(audioBuffer);
      if(!isPlaying) {
         playNextChunk(ctx);
      }
    }
    
    function playNextChunk(ctx) {
       if(playQueue.length === 0) {
          isPlaying = false;
          // Hide waves when done speaking
          document.getElementById('audioWaves').classList.remove('visible');
          return;
       }
       isPlaying = true;
       // Show waves while speaking
       document.getElementById('audioWaves').classList.add('visible');
       const buffer = playQueue.shift();
       const source = ctx.createBufferSource();
       source.buffer = buffer;
       source.connect(ctx.destination);
       source.onended = () => playNextChunk(ctx);
       source.start();
    }

    let ws = null;
    let inputAudioCtx = null;
    let outputAudioCtx = null;
    let mediaStream = null;
    let mediaProcessor = null;
    let mediaSource = null;
    
    let isRecording = false;
    
    async function toggleVoiceChat() {
       const btn = document.getElementById('startVoiceChatBtn');
       const status = document.getElementById('aiVoiceStatus');
       const waves = document.getElementById('audioWaves');
       
       if (isRecording) {
          // Stop
          isRecording = false;
          btn.classList.remove('active');
          btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
          status.classList.remove('visible');
          waves.classList.remove('visible');
          
          if(mediaProcessor) mediaProcessor.disconnect();
          if(mediaSource) mediaSource.disconnect();
          if(mediaStream) mediaStream.getTracks().forEach(t => t.stop());
          if(ws) ws.close();
          playQueue.length = 0;
          return;
       }
       
       // Start
       try {
          btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
          
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
             if(msg.audio && outputAudioCtx) {
                playAudioChunk(outputAudioCtx, msg.audio);
             }
             if(msg.interrupted) {
                playQueue.length = 0; // Clear queue
             }
          };
          
          ws.onopen = () => {
             isRecording = true;
             btn.classList.add('active');
             btn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
             status.classList.add('visible');
          }
          
          ws.onerror = (err) => {
             console.error("WS Error:", err);
             toggleVoiceChat(); // Auto-close on error
             alert("দুঃখিত, ভয়েস অ্যাসিস্ট্যান্ট কানেক্ট হতে সমস্যা হয়েছে।");
          };
       } catch (err) {
          console.error(err);
          btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
          alert("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে।");
       }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
       const btn = document.getElementById('startVoiceChatBtn');
       if(btn) btn.addEventListener('click', toggleVoiceChat);
    });
  </script>
`;

html = html.replace('<!-- Live Messenger Floating Widget -->', jsHTML + '\n  <!-- Live Messenger Floating Widget -->');

fs.writeFileSync('help/index.html', html);
console.log('Modified help/index.html');
