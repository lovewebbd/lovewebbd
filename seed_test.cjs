const fs = require('fs');
const path = require('path');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
const app = initializeApp({ credential: applicationDefault() });
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  await db.collection('settings').doc('test').set({ value: 1 });
  console.log("Success");
}
test().catch(console.error);
