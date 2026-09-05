import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, query, where, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Body parser middleware for JSON POST requests
app.use(express.json());

// Firebase Client SDK Init
const configPath = path.join(__dirname, 'firebase-applet-config.json');
let db = null;
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const firebaseConfig = {
    projectId: config.projectId,
    appId: config.appId,
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId
  }
  const app = initializeApp(firebaseConfig);
  db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);
  console.log('Firebase Client SDK initialized.');
}


// Gmail App Password configuration for Love Web OTP
const GMAIL_USER = process.env.GMAIL_USER || 'lovewebbd@gmail.com';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || 'kipypzmbxlmfslsd').replace(/\s+/g, '');

// Reusable Gmail Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

// Helper to generate stylish LoveWeb Email HTML (for OTPs and Notifications)
function generateLoveWebEmailHtml({ title, badge, message, otp, note }) {
  const displayTitle = title || 'অ্যাকাউন্ট ভেরিফিকেশন কোড';
  const displayBadge = badge || '💖 LOVEWEB';
  const displayMessage = message || 'আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিচের ভেরিফিকেশন কোডটি ব্যবহার করুন।';
  const displayNote = note || '🔒 <strong>সতর্কতা:</strong> এই ভেরিফিকেশন কোডটি অত্যন্ত গোপনীয়। এটি কারো সাথে শেয়ার করবেন না। আপনি যদি এই অনুরোধটি না করে থাকেন, তবে নিশ্চিন্তে এই ইমেইলটি উপেক্ষা করুন।';

  const otpBlock = otp ? `
    <!-- OTP Code Display -->
    <tr>
      <td style="padding: 15px 30px; text-align: center;">
        <div style="background: rgba(5, 217, 232, 0.05); border: 2px dashed #05d9e8; border-radius: 14px; padding: 20px 15px; margin: 8px 0;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #05d9e8; text-shadow: 0 0 12px rgba(5, 217, 232, 0.4); display: inline-block; padding-left: 12px;">
            ${otp}
          </span>
        </div>
        <div style="display: inline-block; margin-top: 8px; color: #ffaa00; font-size: 13px; font-weight: 600;">
          ⏱️ এই কোডটির মেয়াদ থাকবে পরবর্তী <strong>১০ মিনিট</strong>
        </div>
      </td>
    </tr>
  ` : '';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayTitle}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0b0c10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0c10; padding: 35px 12px;">
      <tr>
        <td align="center">
          <!-- Main Card Container -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background: #161824; border: 1px solid rgba(255, 42, 109, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
            
            <!-- Top Gradient Bar -->
            <tr>
              <td style="background: linear-gradient(135deg, #ff2a6d 0%, #05d9e8 100%); height: 5px;"></td>
            </tr>

            <!-- Header & Branding -->
            <tr>
              <td style="padding: 32px 30px 10px 30px; text-align: center;">
                <div style="display: inline-block; padding: 8px 18px; background: rgba(255, 42, 109, 0.12); border-radius: 50px; border: 1px solid rgba(255, 42, 109, 0.3); margin-bottom: 14px;">
                  <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.2px; color: #ff2a6d;">${displayBadge}</span>
                </div>
                <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 8px 0 8px 0;">${displayTitle}</h1>
                <p style="color: #a0a5b8; font-size: 14px; margin: 0; line-height: 1.6;">${displayMessage}</p>
              </td>
            </tr>

            ${otpBlock}

            <!-- Security Notice -->
            <tr>
              <td style="padding: 10px 30px 25px 30px;">
                <div style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid #ff2a6d; padding: 12px 14px; border-radius: 4px;">
                  <p style="margin: 0; color: #d1d5db; font-size: 13px; line-height: 1.6;">
                    ${displayNote}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #0f1019; padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">
                  © 2026 LoveWeb Security Systems. All rights reserved.
                </p>
                <p style="color: #4b5563; font-size: 11px; margin: 0;">
                  এটি একটি স্বয়ংক্রিয় ইমেইল, এতে সরাসরি উত্তর (reply) দিবেন না।
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// POST endpoint to send OTP email via Gmail App Password
app.post('/api/send-otp', async (req, res) => {
  const { email, otp, subject, title, message, badge, note } = req.body || {}

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const mailSubject = subject || `🔐 আপনার LoveWeb ভেরিফিকেশন কোড: ${otp}`;
    const mailOptions = {
      from: `"LoveWeb Security" <${GMAIL_USER}>`,
      to: email,
      subject: mailSubject,
      html: generateLoveWebEmailHtml({
        title: title || 'অ্যাকাউন্ট ভেরিফিকেশন কোড',
        badge: badge || '💖 LOVEWEB SECURITY',
        message: message || 'আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিচের ভেরিফিকেশন কোডটি ব্যবহার করুন।',
        otp: otp,
        note: note
      })
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL SUCCESS] OTP sent to ${email} (${mailSubject}): ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(`[MAIL ERROR] Failed to send OTP email to ${email}:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST endpoint to send Dual OTP emails for email change flow
app.post('/api/send-dual-otp', async (req, res) => {
  const { currentEmail, newEmail, otpCurrent, otpNew } = req.body || {}

  const cleanCurrentEmail = (currentEmail || '').toString().toLowerCase().trim();
  const cleanNewEmail = (newEmail || '').toString().toLowerCase().trim();
  const cleanOtpCurrent = (otpCurrent || '').toString().trim();
  const cleanOtpNew = (otpNew || '').toString().trim();

  if (!cleanCurrentEmail || !cleanNewEmail) {
    return res.status(400).json({ success: false, message: 'বর্তমান এবং নতুন উভয় ইমেইল ঠিকানা প্রদান করা আবশ্যক।' });
  }

  if (!cleanOtpCurrent || !cleanOtpNew) {
    return res.status(400).json({ success: false, message: 'উভয় ইমেইলের ওটিপি কোড থাকা আবশ্যক।' });
  }

  if (cleanCurrentEmail === cleanNewEmail) {
    return res.status(400).json({ success: false, message: 'বর্তমান এবং নতুন ইমেইল একই হতে পারবে না।' });
  }

  const results = {
    currentEmail: { email: cleanCurrentEmail, sent: false, messageId: null, error: null },
    newEmail: { email: cleanNewEmail, sent: false, messageId: null, error: null }
  }

  try {
    // ১. বর্তমান ইমেইলে ১ম কোড প্রেরণ
    const currentSubject = `🔐 LoveWeb ইমেইল পরিবর্তন: বর্তমান ইমেইল ভেরিফিকেশন কোড (${cleanOtpCurrent})`;
    const currentMailOptions = {
      from: `"LoveWeb Security" <${GMAIL_USER}>`,
      to: cleanCurrentEmail,
      subject: currentSubject,
      html: generateLoveWebEmailHtml({
        title: 'বর্তমান ইমেইল ভেরিফিকেশন (ধাপ ১/২)',
        badge: '১ম ধাপ: বর্তমান ইমেইল যাচাই',
        message: `আপনার LoveWeb অ্যাকাউন্টের ইমেইল পরিবর্তনের জন্য বর্তমান ইমেইল (${cleanCurrentEmail}) যাচাই করতে এই কোডটি ব্যবহার করুন। এটি ফর্মের প্রথম বক্সে বসান।`,
        otp: cleanOtpCurrent,
        note: `⚠️ এই কোডটি শুধুমাত্র আপনার বর্তমান ইমেইল (${cleanCurrentEmail}) এর জন্য। নতুন ইমেইলের জন্য আলাদা কোড নতুন ঠিকানায় পাঠানো হয়েছে।`
      })
    }

    const currentInfo = await transporter.sendMail(currentMailOptions);
    results.currentEmail.sent = true;
    results.currentEmail.messageId = currentInfo.messageId;
    console.log(`[DUAL MAIL 1/2 SUCCESS] Current email OTP sent to ${cleanCurrentEmail}: ${currentInfo.messageId}`);
  } catch (errCurrent) {
    console.error(`[DUAL MAIL 1/2 ERROR] Failed sending to current email ${cleanCurrentEmail}:`, errCurrent);
    results.currentEmail.error = errCurrent.message;
  }

  // 600ms বিরতি যাতে জিমেইল এসএমটিপিতে রেস কন্ডিশন বা রেট লিমিট না ঘটে
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    // ২. নতুন ইমেইলে ২য় কোড প্রেরণ
    const newSubject = `🔐 LoveWeb ইমেইল পরিবর্তন: নতুন ইমেইল ভেরিফিকেশন কোড (${cleanOtpNew})`;
    const newMailOptions = {
      from: `"LoveWeb Security" <${GMAIL_USER}>`,
      to: cleanNewEmail,
      subject: newSubject,
      html: generateLoveWebEmailHtml({
        title: 'নতুন ইমেইল ভেরিফিকেশন (ধাপ ২/২)',
        badge: '২য় ধাপ: নতুন ইমেইল যাচাই',
        message: `আপনার LoveWeb অ্যাকাউন্টের সাথে নতুন ইমেইল (${cleanNewEmail}) সংযুক্ত করতে এই কোডটি ব্যবহার করুন। এটি ফর্মের দ্বিতীয় বক্সে বসান।`,
        otp: cleanOtpNew,
        note: `⚠️ এই কোডটি শুধুমাত্র আপনার নতুন ইমেইল (${cleanNewEmail}) এর জন্য।`
      })
    }

    const newInfo = await transporter.sendMail(newMailOptions);
    results.newEmail.sent = true;
    results.newEmail.messageId = newInfo.messageId;
    console.log(`[DUAL MAIL 2/2 SUCCESS] New email OTP sent to ${cleanNewEmail}: ${newInfo.messageId}`);
  } catch (errNew) {
    console.error(`[DUAL MAIL 2/2 ERROR] Failed sending to new email ${cleanNewEmail}:`, errNew);
    results.newEmail.error = errNew.message;
  }

  // রেসপন্স হ্যান্ডলিং
  if (results.currentEmail.sent && results.newEmail.sent) {
    return res.json({
      success: true,
      message: 'উভয় ইমেইলেই সফলভাবে পৃথক ভেরিফিকেশন কোড পাঠানো হয়েছে!',
      results
    });
  } else if (results.currentEmail.sent && !results.newEmail.sent) {
    return res.status(502).json({
      success: false,
      message: `বর্তমান ইমেইলে কোড সফলভাবে গেছে, কিন্তু নতুন ইমেইলে পাঠানো যায়নি: ${results.newEmail.error}`,
      results
    });
  } else if (!results.currentEmail.sent && results.newEmail.sent) {
    return res.status(502).json({
      success: false,
      message: `নতুন ইমেইলে কোড সফলভাবে গেছে, কিন্তু বর্তমান ইমেইলে পাঠানো যায়নি: ${results.currentEmail.error}`,
      results
    });
  } else {
    return res.status(500).json({
      success: false,
      message: `উভয় ইমেইলেই ওটিপি পাঠানো ব্যর্থ হয়েছে: ${results.currentEmail.error || results.newEmail.error}`,
      results
    });
  }
});

// POST endpoint to send transactional / notification email (e.g. email change confirmation)
app.post('/api/send-email', async (req, res) => {
  const { to, email, subject, title, message, badge, note } = req.body || {}
  const recipient = to || email;

  if (!recipient || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Recipient, subject, and message are required' });
  }

  try {
    const mailOptions = {
      from: `"LoveWeb Security" <${GMAIL_USER}>`,
      to: recipient,
      subject: subject,
      html: generateLoveWebEmailHtml({
        title: title || subject,
        badge: badge || '💖 LOVEWEB NOTIFICATION',
        message: message,
        note: note || '🔒 আপনি যদি এই কার্যক্রম নিজে না করে থাকেন, তবে অবিলম্বে আমাদের সাপোর্ট সেন্টারে যোগাযোগ করুন।'
      })
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL SUCCESS] Notification email sent to ${recipient}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(`[MAIL ERROR] Failed to send notification email to ${recipient}:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Direct root route to sign-in page automatically (no separate pre-login landing page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// API to place an order

app.post('/api/generate-page-descriptions', async (req, res) => {
  try {
    const { idea, packageType, requiredPages, optionalPages } = req.body;
    if (!idea) return res.status(400).json({ success: false, message: 'Idea is required' });
    
    // Randomly decide how many optional pages to fill (between 0 and optionalPages)
    const numOptionalToGenerate = Math.floor(Math.random() * (optionalPages + 1));
    const totalToGenerate = requiredPages + numOptionalToGenerate;

    const prompt = `The user wants to build a website.
Idea: "${idea}"
Package: ${packageType}.
You MUST generate detailed descriptions for exactly ${totalToGenerate} pages (e.g., Home, About, Services, Contact, etc.).
Make the descriptions detailed and tailored to the idea. Write in Bengali (বাংলা).

Return a JSON array of strings, where each string is the detailed description of a specific page. The length of the array must be exactly ${totalToGenerate}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "An array of page descriptions in Bengali."
        }
      }
    });

    const pages = JSON.parse(response.text.trim());
    res.json({ success: true, pages });
  } catch (error) {
    console.error('Error generating pages:', error);
    res.status(500).json({ success: false, message: 'Failed to generate descriptions.' });
  }
});

app.post('/api/place-order', async (req, res) => {
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
          const usedBy = data.usedBy || {}
          const userUses = usedBy[username] || 0;
          if (!(data.maxUsesPerUser && userUses >= data.maxUsesPerUser)) {
             couponDiscountPercent = data.discountPercent || 0;
             usedBy[username] = userUses + 1;
             await updateDoc(docRef, { usedBy });
          }
        }
      }
    }
    
    // Calculate User's Total Spent for Discount Policy
    let totalSpent = 0;
    try {
      const q = query(collection(db, 'orders'), where('userPhone', '==', phone));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        const o = docSnap.data();
        if (o.status === 'ডেলিভারড' || o.status === 'Delivered' || o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত') {
          totalSpent += (Number(o.totalPrice) || 0);
        }
      });
    } catch(err) {
      console.error('Error calculating total spent', err);
    }

    let discountPercent = 0;
    if (totalSpent >= 2000) discountPercent = 8;
    else if (totalSpent >= 1000) discountPercent = 4;

    // Determine prices
    let advancePayment = 200; // default (Exclusive)
    let basePrice = 649;
    if (packageType === 'Regular') {
      advancePayment = 150;
      basePrice = 349;
    } else if (packageType === 'Exclusive') {
      advancePayment = 200;
      basePrice = 649;
    } else if (packageType === 'Premium') {
      advancePayment = 300;
      basePrice = 949;
    }
    
    const discountAmount = Math.floor(basePrice * (discountPercent / 100));
    const totalPrice = basePrice - discountAmount;
    const duePayment = totalPrice - advancePayment;

    const orderId = '#LW-' + Math.floor(10000000 + Math.random() * 90000000);
    
    const newOrder = {
      orderId,
      username: username || phone,
      userPhone: phone,
      websiteType,
      package: packageType,
      description,
      pages,
      contactPhone,
      advancePaymentPhone,
      status: 'প্রক্রিয়াকরণ চলছে',
      basePrice,
      discountPercent,
      discountAmount,
      totalPrice,
      advancePayment,
      duePayment,
      advancePaymentStatus: 'পেন্ডিং',
      customizeCharge: packageType === 'Premium' ? 'ফ্রি (১ বার)' : '৳ ১৫০',
      createdAt: new Date().toISOString()
    }
    
    await addDoc(collection(db, 'orders'), newOrder);
    res.json({ success: true, orderId, message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// API to submit feedback


app.post('/api/submit-feedback', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { orderId, feedback } = req.body;
    if (!orderId || !feedback) return res.status(400).json({ success: false, message: 'Bad request.' });
    
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { feedback, feedbackTime: new Date().toISOString() });
    
    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// API to get user orders
app.get('/api/orders/:username', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { username } = req.params;
    const q = query(collection(db, 'orders'), where('username', '==', username), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Serve static assets from project root
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: false
}));

// Named route fallbacks
const routes = ['place-order', '404', 
  'sign-in',
  'reset-password',
  'order-details',
  'profile',
  'settings',
  'help',
  'privacy-and-rules',
  'admin'
];

routes.forEach((route) => {
  app.get(`/${route}`, (req, res) => {
    res.sendFile(path.join(__dirname, route, 'index.html'));
  });
});

// Home and Dashboard route for users
app.get(['/home', '/dashboard'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


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
    const usedBy = data.usedBy || {}
    const userUses = usedBy[username] || 0;
    if (data.maxUsesPerUser && userUses >= data.maxUsesPerUser) {
      return res.json({ success: false, message: 'You have reached the max usage for this coupon.' });
    }
    
    res.json({ success: true, discountPercent: data.discountPercent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ====================
// ADMIN API ROUTES
// ====================
let ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'loveweb2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'loveweb-super-secret-key-12345';

// Try to load password from db if initialized, otherwise use memory
async function getAdminCredentials() {
  if (db) {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'admin'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.username) ADMIN_USERNAME = data.username;
        if (data.password) ADMIN_PASSWORD = data.password;
      }
    } catch(e) { console.error('Error loading admin settings', e); }
  }
  return { user: ADMIN_USERNAME, pass: ADMIN_PASSWORD }
}

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
}

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const creds = await getAdminCredentials();
  if (username === creds.user && password === creds.pass) {
    res.json({ success: true, token: ADMIN_SECRET });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/admin/change-password', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    await setDoc(doc(db, 'settings', 'admin'), { password: newPassword }, { merge: true });
    ADMIN_PASSWORD = newPassword;
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});



app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.post('/api/admin/orders/payment', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { id, value } = req.body;
    const orderRef = doc(db, 'orders', id);
    const updates = { advancePaymentStatus: value }
    
    if (value === 'সম্পূর্ণ পরিশোধিত') {
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        const o = snap.data();
        updates.duePayment = 0;
        updates.advancePayment = o.totalPrice !== undefined ? Number(o.totalPrice) : (o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349));
        updates.status = 'ডেলিভারড'; // Auto delivery
      }
    } else if (value === 'পেমেন্ট বাতিল') {
       updates.status = 'অর্ডার বাতিল'; // Auto reject
    }
    
    await updateDoc(orderRef, updates);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.post('/api/admin/orders/status', verifyAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Database not initialized.' });
  try {
    const { id, value } = req.body;
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, { status: value });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});



// AI Helper Functions
async function checkOrderStatus(args) {
  try {
    const { identifier } = args;
    if (!identifier) return { status: 'error', message: 'No identifier provided.' }
    
    // Check by phone
    let snapshot = await db.collection('orders').where('phone', '==', identifier).get();
    if (snapshot.empty) {
      // Check by username
      snapshot = await db.collection('orders').where('username', '==', identifier).get();
    }
    
    if (snapshot.empty) {
      return { status: 'not_found', message: 'আপনার এই নাম্বার বা ইউজারনেম দিয়ে কোনো অর্ডার পাওয়া যায়নি।' }
    }
    
    const orders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      orders.push({
        orderId: doc.id,
        packageType: data.packageType || 'Unknown',
        status: data.status || 'পেন্ডিং',
        advancePaymentStatus: data.advancePaymentStatus || 'অপেক্ষমান'
      });
    });
    return { status: 'success', message: 'অর্ডার পাওয়া গেছে।', orders }
  } catch (error) {
    console.error('Error checking order status:', error);
    return { status: 'error', message: 'অর্ডার চেক করতে সমস্যা হয়েছে।' }
  }
}

async function placeNewOrder(args) {
  try {
    const newOrder = {
       orderId: 'LWEB' + Date.now().toString().slice(-6),
       username: args.contactPhone,
       phone: args.contactPhone,
       websiteType: args.websiteType || 'Anniversary',
       packageType: args.packageType || 'Regular',
       description: args.description || '',
       contactPhone: args.contactPhone,
       advancePaymentPhone: args.advancePaymentPhone,
       status: 'পেন্ডিং',
       advancePaymentStatus: 'অপেক্ষমান',
       totalPrice: args.packageType === 'Premium' ? '1000' : (args.packageType === 'Exclusive' ? '700' : '400'),
       createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
    await db.collection('orders').add(newOrder);
    return { status: 'success', orderId: newOrder.orderId, message: 'আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে। অ্যাডমিন প্যানেল থেকে খুব শীঘ্রই যোগাযোগ করা হবে।' }
  } catch (error) {
    console.error('Error placing new order:', error);
    return { status: 'error', message: 'অর্ডার প্লেস করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।' }
  }
}

const aiTools = [{
  functionDeclarations: [
    {
      name: 'check_order_status',
      description: 'Check the status of an existing order. Requires a phone number or username.',
      parameters: {
        type: Type.OBJECT,
        properties: { identifier: { type: Type.STRING, description: 'Phone number or username of the customer' } },
        required: ['identifier'],
      }
    },
    {
      name: 'place_new_order',
      description: 'Place a new order. MUST ask for websiteType (Anniversary/Birthday etc.), packageType (Regular/Exclusive/Premium), contactPhone, and advancePaymentPhone before calling.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          websiteType: { type: Type.STRING, description: 'Type of website' },
          packageType: { type: Type.STRING, description: 'Package: Regular, Exclusive, or Premium' },
          description: { type: Type.STRING, description: 'Details or idea for the website' },
          contactPhone: { type: Type.STRING, description: 'Contact phone number (11 digits)' },
          advancePaymentPhone: { type: Type.STRING, description: 'Phone number used for advance payment' }
        },
        required: ['websiteType', 'packageType', 'contactPhone', 'advancePaymentPhone']
      }
    }
  ]
}];

// AI Text Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const systemInstruction = `You are the official chat and voice assistant for LoveWeb, a platform for creating relationship and anniversary wishing websites. You must answer questions in Bengali (বাংলা).
IMPORTANT KNOWLEDGE BASE:
- Packages & Delivery Time: Regular Package (1 to 3 days delivery), Exclusive Package (3 to 5 days delivery), Premium Package (5 to 7 days delivery). NEVER say delivery is done in 24 hours.
- How to order: Users can place an order by going to the 'Place Order' page, selecting a package, choosing add-ons (Custom Domain, Background Music, Fast Delivery), and submitting their info.
- Memberships: Elite Member (spent 1000+ tk, gets 4% discount), Premium Member (spent 2000+ tk, gets 8% discount).
- Website Types (IMPORTANT): Automatically suggest "Auto Queue Theme", "Normal", and "Wishing Website" as default categories when taking an order. LoveWeb builds ONLY wishing/relationship single-page sites. These do NOT have standard pages like "Home Page", "About Us", or "Contact Us". NEVER suggest or generate descriptions for professional portfolios, corporate sites, or standard personal websites.
You have tools to check order status or place a new order. Always provide helpful, complete, and polite answers.`;

    let formattedHistory = [];
    if (history && Array.isArray(history)) {
       formattedHistory = history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
       }));
    }

    const chatSession = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction: systemInstruction + " You have tools to place orders and check order status. Always use them if the user asks. Before placing an order, ask for all required details nicely.",
        temperature: 0.7,
        tools: aiTools
      },
      history: formattedHistory
    });

    let response = await chatSession.sendMessage({ message });
    
    // Handle tool calls in text chat
    if (response.functionCalls && response.functionCalls.length > 0) {
       const call = response.functionCalls[0];
       let result = {}
       if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
                else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
                else if (call.name === 'navigate_to_page') {
                    if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ client_command: { action: 'navigate', url: call.args.url } }));
                    result = { success: true, message: "Navigating user." }
                }
                else if (call.name === 'select_order_package') {
                    if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ client_command: { action: 'select_package', value: call.args.package } }));
                    result = { success: true, message: "Package selected on screen." }
                }
       else if (call.name === 'navigate_to_page' || call.name === 'select_order_package') {
           result = { success: true, message: "Tell the user to click the link or select manually in text chat." }
       }
       
       response = await chatSession.sendMessage([{
          functionResponse: {
             name: call.name,
             response: result
          }
       }]);
    }

    res.json({ success: true, text: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get AI response.' });
  }
});

// Fallback to sign-in for unspecified requests
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404', 'index.html'));
});


const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/live' });

wss.on("connection", async (clientWs) => {
  try {
    const session = await ai.live.connect({
      model: "gemini-2.0-flash-exp",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
        },
        systemInstruction: `You are the official chat and voice assistant for LoveWeb, a platform for creating relationship and anniversary wishing websites. You must answer questions in Bengali (বাংলা).
IMPORTANT KNOWLEDGE BASE:
- Packages & Delivery Time: Regular Package (1 to 3 days delivery), Exclusive Package (3 to 5 days delivery), Premium Package (5 to 7 days delivery). NEVER say delivery is done in 24 hours.
- How to order: Users can place an order by going to the 'Place Order' page, selecting a package, choosing add-ons (Custom Domain, Background Music, Fast Delivery), and submitting their info.
- Memberships: Elite Member (spent 1000+ tk, gets 4% discount), Premium Member (spent 2000+ tk, gets 8% discount).
- Website Types (IMPORTANT): Automatically suggest "Auto Queue Theme", "Normal", and "Wishing Website" as default categories when taking an order. LoveWeb builds ONLY wishing/relationship single-page sites. These do NOT have standard pages like "Home Page", "About Us", or "Contact Us". NEVER suggest or generate descriptions for professional portfolios, corporate sites, or standard personal websites.
You have tools to check order status or place a new order. Always provide helpful, complete, and polite answers.`,
      },
      callbacks: {
        onmessage: async (message) => {
          const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ audio }));
          }
          
          // Tool call handling for Live API
          const toolCalls = message.serverContent?.modelTurn?.parts?.filter(p => p.functionCall) || [];
          if (toolCalls.length > 0) {
             const responses = [];
             for (const part of toolCalls) {
                const call = part.functionCall;
                let result = {}
                if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
                else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
                responses.push({ id: call.id, name: call.name, response: result });
             }
             if (session) {
                session.sendToolResponse(responses);
             }
          }

          if (message.serverContent?.interrupted) {
            if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
           console.log("Live session closed");
        },
        onerror: (err) => {
           console.error("Live session error:", err);
        }
      }
    });

    clientWs.on("message", (data) => {
      try {
        const { audio } = JSON.parse(data.toString());
        if (audio) {
          session.sendRealtimeInput({
            audio: { data: audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (err) {
        console.error("Error processing websocket message", err);
      }
    });

    clientWs.on("close", () => {
      // Clean up if needed
    });
  } catch (err) {
    console.error("Error setting up live api:", err);
    if (clientWs.readyState === 1) {
       clientWs.send(JSON.stringify({ error: "AI Server Error: " + err.message }));
       clientWs.close();
    }
  }
});

server.on('error', (err) => {
  console.error("HTTP Server Error:", err);
});

wss.on('error', (err) => {
  console.error("WebSocket Server Error:", err);
});

server.listen(PORT, HOST, () => {
  console.log(`LoveWeb application listening at http://${HOST}:${PORT}`);
});

