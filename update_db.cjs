const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('server.js', 'utf8');

const importAdmin = `import admin from 'firebase-admin';

// Initialize Firebase Admin
if (fs.existsSync(path.join(__dirname, 'firebase-applet-config.json'))) {
  const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.warn("firebase-applet-config.json not found, using default application credentials.");
  admin.initializeApp();
}
const firestoreDb = admin.firestore();
`;

// Insert after imports
content = content.replace("import multer from 'multer';", "import multer from 'multer';\n" + importAdmin);

const mockDbCode = `// Mock Firebase Firestore using local JSON
const DB_FILE = path.join(__dirname, 'database.json');
function getDB() {
  if (!fs.existsSync(DB_FILE)) return { orders: {}, settings: {}, coupons: {} };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = true; // Bypass !db checks

function collection(db, name) { return name; }
function doc(db, collName, docId) { return { collName, docId }; }
async function addDoc(collName, data) {
  const d = getDB();
  if (!d[collName]) d[collName] = {};
  const id = Date.now().toString();
  d[collName][id] = data;
  saveDB(d);
  return { id };
}
async function getDoc(docRef) {
  const d = getDB();
  const coll = d[docRef.collName] || {};
  const data = coll[docRef.docId];
  return { exists: () => !!data, data: () => data, id: docRef.docId };
}
async function setDoc(docRef, data, options) {
  const d = getDB();
  if (!d[docRef.collName]) d[docRef.collName] = {};
  if (options && options.merge) {
    d[docRef.collName][docRef.docId] = { ...d[docRef.collName][docRef.docId], ...data };
  } else {
    d[docRef.collName][docRef.docId] = data;
  }
  saveDB(d);
}
async function updateDoc(docRef, data) {
  await setDoc(docRef, data, { merge: true });
}
async function deleteDoc(docRef) {
  const d = getDB();
  if (d[docRef.collName] && d[docRef.collName][docRef.docId]) {
    delete d[docRef.collName][docRef.docId];
    saveDB(d);
  }
}
function query(collName, ...args) {
  return { collName, args };
}
function where(field, op, value) {
  return { type: 'where', field, op, value };
}
function orderBy(field, dir) {
  return { type: 'orderBy', field, dir };
}
async function getDocs(q) {
  const d = getDB();
  let collName = typeof q === 'string' ? q : q.collName;
  let items = Object.entries(d[collName] || {}).map(([id, data]) => ({ id, ...data }));
  
  if (typeof q !== 'string' && q.args) {
    for (const arg of q.args) {
      if (arg.type === 'where') {
        items = items.filter(i => {
           if (arg.op === '==') return i[arg.field] === arg.value;
           return true;
        });
      }
      if (arg.type === 'orderBy') {
        items.sort((a, b) => {
          if (a[arg.field] < b[arg.field]) return arg.dir === 'desc' ? 1 : -1;
          if (a[arg.field] > b[arg.field]) return arg.dir === 'desc' ? -1 : 1;
          return 0;
        });
      }
    }
  }
  
  return {
    forEach: (cb) => {
      items.forEach(i => cb({ id: i.id, data: () => i, exists: true }));
    },
    empty: items.length === 0,
    docs: items.map(i => ({ id: i.id, data: () => i }))
  };
}`;

const replacementDbCode = `// Firebase Admin Firestore SDK wrapping matching the mock signature
let db = true;

function collection(db, name) { return firestoreDb.collection(name); }
function doc(db, collName, docId) { return firestoreDb.collection(collName).doc(docId); }
async function addDoc(collName, data) {
  const ref = await firestoreDb.collection(collName).add(data);
  return { id: ref.id };
}
async function getDoc(docRef) {
  const snapshot = await docRef.get();
  return { exists: () => snapshot.exists, data: () => snapshot.data(), id: snapshot.id };
}
async function setDoc(docRef, data, options) {
  await docRef.set(data, options);
}
async function updateDoc(docRef, data) {
  await docRef.update(data);
}
async function deleteDoc(docRef) {
  await docRef.delete();
}
function query(collName, ...args) {
  let q = firestoreDb.collection(collName);
  for (const arg of args) {
    if (arg.type === 'where') q = q.where(arg.field, arg.op, arg.value);
    if (arg.type === 'orderBy') q = q.orderBy(arg.field, arg.dir);
  }
  return q;
}
function where(field, op, value) {
  return { type: 'where', field, op, value };
}
function orderBy(field, dir) {
  return { type: 'orderBy', field, dir };
}
async function getDocs(q) {
  const qRef = typeof q === 'string' ? firestoreDb.collection(q) : q;
  const snapshot = await qRef.get();
  
  return {
    forEach: (cb) => {
      snapshot.forEach(doc => cb({ id: doc.id, data: () => doc.data(), exists: true }));
    },
    empty: snapshot.empty,
    docs: snapshot.docs.map(doc => ({ id: doc.id, data: () => doc.data() }))
  };
}`;

if (content.includes('function getDB() {')) {
  content = content.replace(mockDbCode, replacementDbCode);
  fs.writeFileSync('server.js', content);
  console.log('Replaced DB wrapper.');
} else {
  console.log('Could not find DB mock code.');
}
