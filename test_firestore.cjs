const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snapshot = await getDocs(collection(db, 'orders'));
  console.log("Orders count:", snapshot.size);
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data().username, doc.data().userPhone);
  });
}
run();
