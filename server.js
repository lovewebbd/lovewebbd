import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Body parser middleware for JSON POST requests
app.use(express.json());

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
  const { email, otp, subject, title, message, badge, note } = req.body || {};

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
    };

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
  const { currentEmail, newEmail, otpCurrent, otpNew } = req.body || {};

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
  };

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
    };

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
    };

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
  const { to, email, subject, title, message, badge, note } = req.body || {};
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
    };

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
  res.sendFile(path.join(__dirname, 'sign-in', 'index.html'));
});

// Serve static assets from project root
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: false
}));

// Named route fallbacks
const routes = [
  'sign-in',
  'reset-password',
  'order-details',
  'profile',
  'settings',
  'help',
  'privacy-and-rules'
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

// Fallback to sign-in for unspecified requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sign-in', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`LoveWeb application listening at http://${HOST}:${PORT}`);
});
