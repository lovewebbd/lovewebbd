import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(/voiceBtn\.innerHTML = '<i class="fa-solid fa-microphone"><\/i>';/g, '');
code = code.replace(/voiceBtn\.innerHTML = '<i class="fa-solid fa-stop"><\/i>';/g, '');

const voiceStatusUpdateStop = `          voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
          document.getElementById('voiceStatusText').innerText = 'ক্লিক করে কথা বলুন';`;

const voiceStatusUpdateStart = `          voiceBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
          document.getElementById('voiceStatusText').innerText = 'শুনছি... (বন্ধ করতে আবার ক্লিক করুন)';`;

code = code.replace(/isRecording = false;\n          voiceBtn\.classList\.remove\('recording'\);/g, `isRecording = false;\n          voiceBtn.classList.remove('recording');\n${voiceStatusUpdateStop}`);

code = code.replace(/isRecording = true;\n          voiceBtn\.classList\.add\('recording'\);/g, `isRecording = true;\n          voiceBtn.classList.add('recording');\n${voiceStatusUpdateStart}`);

code = code.replace(/miniWaves\.classList\.add\('visible'\);/g, `miniWaves.style.display = 'block';`);
code = code.replace(/miniWaves\.classList\.remove\('visible'\);/g, `miniWaves.style.display = 'none';`);

fs.writeFileSync('js/messenger.js', code);
console.log('Patched voice logic');
