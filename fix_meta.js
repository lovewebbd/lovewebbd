import fs from 'fs';
let json = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
if (!json.requestFramePermissions.includes('microphone')) {
    json.requestFramePermissions.push('microphone');
}
fs.writeFileSync('metadata.json', JSON.stringify(json, null, 2));
console.log('Added microphone to metadata.json');
