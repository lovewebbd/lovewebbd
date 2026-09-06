const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('server.js', 'utf8');

const importClient = `import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc as addDocFb, getDoc as getDocFb, setDoc as setDocFb, updateDoc as updateDocFb, deleteDoc as deleteDocFb, query as queryFb, where as whereFb, orderBy as orderByFb, getDocs as getDocsFb } from 'firebase/firestore';

// Initialize Firebase Client SDK
let firestoreDb;
try {
  if (fs.existsSync(path.join(__dirname, 'firebase-applet-config.json'))) {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
    const app = initializeApp(config);
    firestoreDb = getFirestore(app, config.firestoreDatabaseId);
  }
} catch (e) {
  console.error("Firebase init error:", e);
}
`;

// Remove the old firebase-admin imports block
content = content.replace(/import \{ initializeApp \} from 'firebase-admin\/app';[\s\S]*?\} catch \(e\) \{\n  console\.error\("Firebase init error:", e\);\n}\n/, importClient);

const replacementDbCode = `// Firebase Client Firestore SDK wrapping matching the mock signature
let db = true;

// Redefine wrappers to match exactly how server.js calls them
async function addDoc(collName, data) {
  const ref = await addDocFb(collection(firestoreDb, collName), data);
  return { id: ref.id };
}
async function getDoc(docRefObj) {
  const ref = doc(firestoreDb, docRefObj.collName, docRefObj.docId);
  const snapshot = await getDocFb(ref);
  return { exists: () => snapshot.exists(), data: () => snapshot.data(), id: snapshot.id };
}
async function setDoc(docRefObj, data, options) {
  const ref = doc(firestoreDb, docRefObj.collName, docRefObj.docId);
  await setDocFb(ref, data, options);
}
async function updateDoc(docRefObj, data) {
  const ref = doc(firestoreDb, docRefObj.collName, docRefObj.docId);
  await updateDocFb(ref, data);
}
async function deleteDoc(docRefObj) {
  const ref = doc(firestoreDb, docRefObj.collName, docRefObj.docId);
  await deleteDocFb(ref);
}
function query(collName, ...args) {
  return { collName, args };
}
function where(field, op, value) {
  return whereFb(field, op, value);
}
function orderBy(field, dir) {
  return orderByFb(field, dir);
}
async function getDocs(qObj) {
  let qRef;
  if (typeof qObj === 'string') {
    qRef = collection(firestoreDb, qObj);
  } else {
    qRef = queryFb(collection(firestoreDb, qObj.collName), ...qObj.args);
  }
  const snapshot = await getDocsFb(qRef);
  
  return {
    forEach: (cb) => {
      snapshot.forEach(docSnap => cb({ id: docSnap.id, data: () => docSnap.data(), exists: true }));
    },
    empty: snapshot.empty,
    docs: snapshot.docs.map(docSnap => ({ id: docSnap.id, data: () => docSnap.data() }))
  };
}
// Helper to return docRef object for wrappers
function mockDocRef(db, collName, docId) { return { collName, docId }; }
`;

// Replace the old admin SDK wrapper block
content = content.replace(/\/\/ Firebase Admin Firestore SDK wrapping matching the mock signature[\s\S]*?empty: snapshot\.empty,\n    docs: snapshot\.docs\.map\(doc => \(\{ id: doc\.id, data: \(\) => doc\.data\(\) \}\)\)\n  \};\n\}/, replacementDbCode);
// Need to replace the doc wrapper correctly since server.js calls doc(db, 'orders', id)
content = content.replace(/function doc\(db, collName, docId\) \{ return firestoreDb\.collection\(collName\)\.doc\(docId\); \}/, '');

// Since there is a stray doc definition we need to remove it if it exists or use mockDocRef. Let's just do a global replace for "function doc(db, collName, docId)"
content = content.replace(/function doc\(db, collName, docId\) \{[^\}]+\}/g, 'function doc(db, collName, docId) { return { collName, docId }; }');


fs.writeFileSync('server.js', content);
console.log('Fixed client SDK wrapper in server.js');
