import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(raw);
const db = getFirestore(app, raw.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, 'User_Information'));
    console.log("Success, size:", snap.size); process.exit(0);
  } catch(e) {
    console.error("DB Error:", e);
  }
}
run();
