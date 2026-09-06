const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

content = content.replace(
  "import { getFirestore, collection, doc, addDoc as addDocFb, getDoc as getDocFb, setDoc as setDocFb, updateDoc as updateDocFb, deleteDoc as deleteDocFb, query as queryFb, where as whereFb, orderBy as orderByFb, getDocs as getDocsFb } from 'firebase/firestore';",
  "import { getFirestore, collection, doc as docFb, addDoc as addDocFb, getDoc as getDocFb, setDoc as setDocFb, updateDoc as updateDocFb, deleteDoc as deleteDocFb, query as queryFb, where as whereFb, orderBy as orderByFb, getDocs as getDocsFb } from 'firebase/firestore';"
);

content = content.replace(
  "// Helper to return docRef object for wrappers\nfunction mockDocRef(db, collName, docId) { return { collName, docId }; }",
  "// Helper to return docRef object for wrappers\nfunction doc(db, collName, docId) { return { collName, docId }; }"
);

fs.writeFileSync('server.js', content);
console.log('Patched');
