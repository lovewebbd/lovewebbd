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

// Helper to generate the stylish LoveWeb OTP Email HTML
function generateOtpEmailHtml(otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LoveWeb Verification Code</title>
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
              <td style="padding: 35px 30px 10px 30px; text-align: center;">
                <div style="display: inline-block; padding: 10px 20px; background: rgba(255, 42, 109, 0.12); border-radius: 50px; border: 1px solid rgba(255, 42, 109, 0.3); margin-bottom: 15px;">
                  <span style="font-size: 18px; font-weight: 800; letter-spacing: 1.5px; color: #ff2a6d;">💖 LOVE<span style="color: #05d9e8;">WEB</span></span>
                </div>
                <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 10px 0 6px 0;">অ্যাকাউন্ট ভেরিফিকেশন কোড</h1>
                <p style="color: #a0a5b8; font-size: 14px; margin: 0; line-height: 1.5;">আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিচের ভেরিফিকেশন কোডটি ব্যবহার করুন।</p>
              </td>
            </tr>

            <!-- OTP Code Display -->
            <tr>
              <td style="padding: 20px 30px; text-align: center;">
                <div style="background: rgba(5, 217, 232, 0.05); border: 2px dashed #05d9e8; border-radius: 14px; padding: 22px 15px; margin: 10px 0;">
                  <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #05d9e8; text-shadow: 0 0 12px rgba(5, 217, 232, 0.4); display: inline-block; padding-left: 12px;">
                    ${otp}
                  </span>
                </div>
                <div style="display: inline-block; margin-top: 10px; color: #ffaa00; font-size: 13px; font-weight: 600;">
                  ⏱️ এই কোডটির মেয়াদ থাকবে পরবর্তী <strong>১০ মিনিট</strong>
                </div>
              </td>
            </tr>

            <!-- Security Notice -->
            <tr>
              <td style="padding: 10px 30px 25px 30px;">
                <div style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid #ff2a6d; padding: 12px 14px; border-radius: 4px;">
                  <p style="margin: 0; color: #d1d5db; font-size: 13px; line-height: 1.6;">
                    🔒 <strong>সতর্কতা:</strong> এই ভেরিফিকেশন কোডটি অত্যন্ত গোপনীয়। এটি কারো সাথে শেয়ার করবেন না। আপনি যদি এই অনুরোধটি না করে থাকেন, তবে নিশ্চিন্তে এই ইমেইলটি উপেক্ষা করুন।
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
  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"LoveWeb Security" <${GMAIL_USER}>`,
      to: email,
      subject: `🔐 আপনার LoveWeb ভেরিফিকেশন কোড: ${otp}`,
      html: generateOtpEmailHtml(otp)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL SUCCESS] OTP sent to ${email}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('[MAIL ERROR] Failed to send email via Gmail:', error);
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

// Dashboard route for authenticated users
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to sign-in for unspecified requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sign-in', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`LoveWeb application listening at http://${HOST}:${PORT}`);
});
