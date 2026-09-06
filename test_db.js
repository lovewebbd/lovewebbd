import fs from 'fs';
const DB_FILE = 'database.json';
function getDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
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

async function run() {
  const docRef = { collName: 'settings', docId: 'packages' };
  const docSnap = await getDoc(docRef);
  let pkgs = docSnap.data();
  delete pkgs['Special'];
  await setDoc(docRef, pkgs);
  console.log('done');
}
run();
