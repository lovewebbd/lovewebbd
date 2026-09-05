import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(/function playNextChunk\(ctx\) {/, `function playNextChunk(ctx) {
     const geminiWaveContainer = document.getElementById('geminiWaveContainer');
     const voiceTranscript = document.getElementById('voiceTranscript');`);

code = code.replace(/if\(playQueue\.length === 0\) { isPlaying = false; return; }/, `if(playQueue.length === 0) { 
        isPlaying = false; 
        if (geminiWaveContainer) {
           const bars = geminiWaveContainer.querySelectorAll('.gemini-bar');
           bars.forEach(b => b.classList.remove('listening'));
        }
        if (voiceTranscript) voiceTranscript.innerText = 'শুনছি...';
        return; 
     }`);

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed messenger animation logic');
