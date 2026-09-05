import fs from 'fs';

let server = fs.readFileSync('server.js', 'utf8');

// Inject Settings and Coupon APIs for Admin
const newApis = `
// ====================
// SETTINGS & COUPON APIs
// ====================

app.get('/api/settings', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.json({ success: true, settings: docSnap.data() });
    } else {
      res.json({ success: true, settings: { bkashNumber: '', nagadNumber: '' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/settings', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { bkashNumber, nagadNumber } = req.body;
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, { bkashNumber, nagadNumber }, { merge: true });
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/coupons', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const snapshot = await getDocs(collection(db, 'coupons'));
    const coupons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/coupons', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { code, discountPercent, expiryDate, maxUsesPerUser } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });
    const docRef = doc(db, 'coupons', code.toUpperCase());
    await setDoc(docRef, { 
      code: code.toUpperCase(), 
      discountPercent: Number(discountPercent), 
      expiryDate, 
      maxUsesPerUser: Number(maxUsesPerUser),
      createdAt: new Date().toISOString()
    }, { merge: true });
    res.json({ success: true, message: 'Coupon saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/coupons/delete', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code required' });
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'coupons', code));
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/validate-coupon', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { code, username } = req.body;
    if (!code || !username) return res.status(400).json({ success: false, message: 'Code and username required' });
    
    const docRef = doc(db, 'coupons', code.toUpperCase());
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return res.json({ success: false, message: 'Invalid coupon code.' });
    
    const data = docSnap.data();
    
    // Check expiry
    if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
      return res.json({ success: false, message: 'Coupon has expired.' });
    }
    
    // Check usage
    const usedBy = data.usedBy || {};
    const userUses = usedBy[username] || 0;
    if (data.maxUsesPerUser && userUses >= data.maxUsesPerUser) {
      return res.json({ success: false, message: 'You have reached the max usage for this coupon.' });
    }
    
    res.json({ success: true, discountPercent: data.discountPercent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

if (!server.includes('/api/settings')) {
  server = server.replace('// ====================', newApis + '\n\n// ====================');
}

fs.writeFileSync('server.js', server);
console.log('Server APIs updated');
