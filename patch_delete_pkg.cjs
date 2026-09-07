const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
  "import { getFirestore, collection, doc, addDoc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs } from 'firebase/firestore';",
  "import { getFirestore, collection, doc, addDoc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs, deleteField } from 'firebase/firestore';"
);

server = server.replace(
  /app\.post\('\/api\/admin\/packages\/delete\/:pkg'[\s\S]*?res\.status\(500\)\.json\(\{ success: false, message: error\.message \}\);\s*\}\s*\}\);/,
  `app.post('/api/admin/packages/delete/:pkg', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const pkgName = req.params.pkg;
    const docRef = doc(db, 'settings', 'packages');
    await updateDoc(docRef, {
      [pkgName]: deleteField()
    });
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    if (error.code === 'not-found') {
      res.json({ success: true, message: 'Package deleted' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});`
);

fs.writeFileSync('server.js', server);
