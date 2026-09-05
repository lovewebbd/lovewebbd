import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');
if (code.includes('id="voiceEntryBtn"')) {
    console.log("voiceEntryBtn is in HTML now");
} else {
    console.log("Still missing!");
}
