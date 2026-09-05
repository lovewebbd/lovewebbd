import fs from 'fs';

const config = {
  "projectId": "gen-lang-client-0417290366",
  "appId": "1:493419045383:web:99a5bac1b0bab4c12880a2",
  "apiKey": "AIzaSyAGQJewSfVQs_QsGNR4_BEeclm2lnEMIIo",
  "authDomain": "gen-lang-client-0417290366.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-lovewebbd-9ae59be1-9c5f-4948-84c1-e7b2483fa17c",
  "storageBucket": "gen-lang-client-0417290366.firebasestorage.app",
  "messagingSenderId": "493419045383",
  "measurementId": "",
  "oAuthClientId": "493419045383-klt8bp2s006j7g0gm2rtmis0n1djuuiu.apps.googleusercontent.com",
  "recaptchaSiteKey": ""
};

fs.writeFileSync('firebase-applet-config.json', JSON.stringify(config, null, 2));
console.log('Firebase config updated with provided values');
