const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, getDocs } = require('firebase/firestore');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const q = query(collection(db, 'orders'), where('username', '==', 'ongkur'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    console.log("Success", snapshot.empty);
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
