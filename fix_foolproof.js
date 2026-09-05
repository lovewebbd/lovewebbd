import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /if \(voiceEntryBtn\) \{\s*voiceEntryBtn\.addEventListener\('click', async \(\) => \{\s*console\.log\('Voice entry clicked'\);\s*\/\/ Hide chat panel\s*if \(chatPanel\) chatPanel\.classList\.remove\('open'\);\s*isOpen = false;\s*\/\/ Show Gemini UI\s*if \(geminiVoiceContainer\) geminiVoiceContainer\.classList\.add\('active'\);\s*if \(voiceTranscript\) voiceTranscript\.innerText = "সংযোগ করা হচ্ছে\.\.\.";\s*try \{\s*ws = new WebSocket/m;

const match = code.match(regex);
console.log('Match found:', !!match);

if (match) {
    const fix = `
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('#voiceEntryBtn');
        if (!btn) return;
        
        console.log('Voice entry clicked via delegation');
        if (chatPanel) chatPanel.classList.remove('open');
        isOpen = false;
        
        if (geminiVoiceContainer) geminiVoiceContainer.classList.add('active');
        if (voiceTranscript) voiceTranscript.innerText = "সংযোগ করা হচ্ছে...";
        
        try {
            ws = new WebSocket`;
            
    code = code.replace(regex, fix);
    
    // The original code had `if (voiceEntryBtn) { voiceEntryBtn.addEventListener( ... ) }`. 
    // This has two closing braces at the end. I need to remove one closing brace.
    // Wait, the regex didn't capture the closing braces.
    // So the end of this block still has `});\n}`.
    // We replaced `if (btn) { btn.addEventListener...` with `document.addEventListener( ... if (!btn) return;`
    // So the closing braces `}); }` will now close `document.addEventListener` and the second one will be extra!
    // Let's remove the extra `}`.
    code = code.replace(/\}\n\s*\}\)\;\n\s*\}\n\s*\}\n\s*if \(document\.readyState/m, '}\n      });\n  }\n\n  if (document.readyState');
    fs.writeFileSync('js/messenger.js', code);
    console.log('Replaced successfully.');
}
