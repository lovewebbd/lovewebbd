const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  const DB_FILE = path.join(__dirname, 'database.json');
  if (!fs.existsSync(DB_FILE)) {
    console.log('No database.json found');
    return process.exit(0);
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  for (const collectionName of Object.keys(data)) {
    console.log('Seeding collection:', collectionName);
    const docs = data[collectionName];
    for (const docId of Object.keys(docs)) {
      await setDoc(doc(db, collectionName, docId), docs[docId]);
    }
  }
  console.log('Seed complete.');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
