const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

// The original line:
// const q = query(collection(db, 'orders'), where('username', '==', username), orderBy('createdAt', 'desc'));
// The replacement line:
// const q = query(collection(db, 'orders'), where('username', '==', username));
// Then we sort the orders array before sending:

content = content.replace(
  "const q = query(collection(db, 'orders'), where('username', '==', username), orderBy('createdAt', 'desc'));",
  "const q = query(collection(db, 'orders'), where('username', '==', username));"
);

content = content.replace(
  "orders.push({ id: doc.id, ...doc.data() });\n    });\n    res.json({ success: true, orders });",
  "orders.push({ id: doc.id, ...doc.data() });\n    });\n    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));\n    res.json({ success: true, orders });"
);

fs.writeFileSync('server.js', content);
