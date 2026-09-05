import fs from 'fs';

let server = fs.readFileSync('server.js', 'utf8');

const oldOrderStart = `app.post('/api/place-order', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { username, phone, websiteType, packageType, description, pages, contactPhone, advancePaymentPhone } = req.body;`;

const newOrderStart = `app.post('/api/place-order', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { username, phone, websiteType, packageType, description, pages, contactPhone, advancePaymentPhone, couponCode } = req.body;
    let couponDiscountPercent = 0;
    
    // Validate coupon
    if (couponCode) {
      const docRef = doc(db, 'coupons', couponCode.toUpperCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!(data.expiryDate && new Date(data.expiryDate) < new Date())) {
          const usedBy = data.usedBy || {};
          const userUses = usedBy[username] || 0;
          if (!(data.maxUsesPerUser && userUses >= data.maxUsesPerUser)) {
             couponDiscountPercent = data.discountPercent || 0;
             usedBy[username] = userUses + 1;
             await updateDoc(docRef, { usedBy });
          }
        }
      }
    }`;

const oldOrderSave = `    await addDoc(collection(db, 'orders'), {
      username,
      phone,
      websiteType,
      packageType,
      description,
      pages,
      contactPhone,
      advancePaymentPhone,
      status: 'pending',
      advancePaymentStatus: 'pending',
      amountReceived: 0,
      createdAt: new Date().toISOString()
    });`;

const newOrderSave = `    await addDoc(collection(db, 'orders'), {
      username,
      phone,
      websiteType,
      packageType,
      description,
      pages,
      contactPhone,
      advancePaymentPhone,
      couponCode: couponDiscountPercent > 0 ? couponCode : null,
      couponDiscountPercent: couponDiscountPercent,
      status: 'pending',
      advancePaymentStatus: 'pending',
      amountReceived: 0,
      createdAt: new Date().toISOString()
    });`;

if (server.includes(oldOrderStart)) {
  server = server.replace(oldOrderStart, newOrderStart);
  server = server.replace(oldOrderSave, newOrderSave);
  fs.writeFileSync('server.js', server);
  console.log('Order API patched for coupon support.');
} else {
  console.log('Order API patch failed. Code mismatch.');
}
