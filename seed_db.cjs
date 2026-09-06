const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

if (fs.existsSync(path.join(__dirname, 'firebase-applet-config.json'))) {
  const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.log('firebase-applet-config.json not found');
  process.exit(1);
}

const db = admin.firestore();

async function seed() {
  const DB_FILE = path.join(__dirname, 'database.json');
  if (!fs.existsSync(DB_FILE)) {
    console.log('No database.json found');
    return;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  
  for (const collectionName of Object.keys(data)) {
    console.log('Seeding collection:', collectionName);
    const docs = data[collectionName];
    for (const docId of Object.keys(docs)) {
      await db.collection(collectionName).doc(docId).set(docs[docId]);
    }
  }
  console.log('Seed complete.');
}

seed().catch(console.error);
