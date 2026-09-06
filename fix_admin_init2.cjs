const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('server.js', 'utf8');

const importAdmin = `import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let firestoreDb;
try {
  if (fs.existsSync(path.join(__dirname, 'firebase-applet-config.json'))) {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
    const app = initializeApp({
      projectId: config.projectId,
    });
    firestoreDb = getFirestore(app, config.firestoreDatabaseId ? config.firestoreDatabaseId : undefined);
  } else {
    const app = initializeApp();
    firestoreDb = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase init error:", e);
}
`;

content = content.replace(/import admin from 'firebase-admin';[\s\S]*?\} catch \(e\) \{\n  console\.error\("Firebase init error:", e\);\n}\n/, importAdmin);

fs.writeFileSync('server.js', content);
console.log('Fixed admin init in server.js');

const seedDb = `const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
const app = initializeApp({ projectId: config.projectId });
const db = getFirestore(app, config.firestoreDatabaseId ? config.firestoreDatabaseId : undefined);

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
`;
fs.writeFileSync('seed_db3.cjs', seedDb);

