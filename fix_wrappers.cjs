const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// The block to remove starts from "// Firebase Client Firestore SDK wrapping" down to "function doc(db, collName, docId) { return { collName, docId }; }"
const regex = /\/\/ Firebase Client Firestore SDK wrapping matching the mock signature[\s\S]*?function doc\(db, collName, docId\) \{ return \{ collName, docId \}; \}\n/g;

content = content.replace(regex, "const db = firestoreDb;\n");

// We also need to fix the imports, we renamed them to `docFb` etc.
content = content.replace(/doc as docFb, /g, 'doc, ');
content = content.replace(/addDoc as addDocFb, /g, 'addDoc, ');
content = content.replace(/getDoc as getDocFb, /g, 'getDoc, ');
content = content.replace(/setDoc as setDocFb, /g, 'setDoc, ');
content = content.replace(/updateDoc as updateDocFb, /g, 'updateDoc, ');
content = content.replace(/deleteDoc as deleteDocFb, /g, 'deleteDoc, ');
content = content.replace(/query as queryFb, /g, 'query, ');
content = content.replace(/where as whereFb, /g, 'where, ');
content = content.replace(/orderBy as orderByFb, /g, 'orderBy, ');
content = content.replace(/getDocs as getDocsFb /g, 'getDocs ');

fs.writeFileSync('server.js', content);
