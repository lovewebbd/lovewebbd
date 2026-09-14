const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(serverJsPath, 'utf8');

// 1. Add firebase/storage import
if (!content.includes('from \'firebase/storage\'')) {
    content = content.replace(
        "import { getFirestore, collection",
        "import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';\nimport { getFirestore, collection"
    );
}

// 2. Export/Save app reference
if (!content.includes('let firebaseApp;')) {
    content = content.replace(
        "let firestoreDb;",
        "let firestoreDb;\nlet firebaseApp;"
    );
    content = content.replace(
        "const app = initializeApp(config);",
        "const app = initializeApp(config);\n    firebaseApp = app;"
    );
}

// 3. Replace upload logic
const oldUploadCodeRegex = /const storage = multer\.diskStorage\(\{[\s\S]*?app\.post\('\/api\/upload'[\s\S]*?\}\);/g;
const newUploadCode = `const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.array('images', 50), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded.' });
  if (!firebaseApp) return res.status(500).json({ success: false, message: 'Firebase not initialized.' });
  
  try {
    const fbStorage = getStorage(firebaseApp);
    const urls = [];
    
    for (const file of req.files) {
      const ext = path.extname(file.originalname);
      // Clean filename for safety
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + safeName;
      
      const storageRef = ref(fbStorage, 'uploads/' + uniqueName);
      
      await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
      const downloadUrl = await getDownloadURL(storageRef);
      urls.push(downloadUrl);
    }
    
    res.json({ success: true, urls });
  } catch (error) {
    console.error('Firebase Storage Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});`;

content = content.replace(oldUploadCodeRegex, newUploadCode);

fs.writeFileSync(serverJsPath, content);
console.log('Server.js patched for Firebase Storage.');
