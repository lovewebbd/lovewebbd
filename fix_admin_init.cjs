const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('server.js', 'utf8');

const importAdmin = `import admin from 'firebase-admin';

// Initialize Firebase Admin
let firestoreDb;
try {
  if (fs.existsSync(path.join(__dirname, 'firebase-applet-config.json'))) {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
    admin.initializeApp({
      projectId: config.projectId,
    });
    firestoreDb = admin.firestore(config.firestoreDatabaseId ? { databaseId: config.firestoreDatabaseId } : undefined);
  } else {
    admin.initializeApp();
    firestoreDb = admin.firestore();
  }
} catch (e) {
  console.error("Firebase init error:", e);
}
`;

content = content.replace(/import admin from 'firebase-admin';[\s\S]*?const firestoreDb = admin\.firestore\(\);/, importAdmin);

fs.writeFileSync('server.js', content);
console.log('Fixed admin init in server.js');

// Now also write a quick seeder
const seedDb = `const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
admin.initializeApp({ projectId: config.projectId });
const db = admin.firestore(config.firestoreDatabaseId ? { databaseId: config.firestoreDatabaseId } : undefined);

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
fs.writeFileSync('seed_db2.cjs', seedDb);

