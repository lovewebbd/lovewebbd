// Supabase Credentials
const SUPABASE_URL = "https://xotiwgyalsnqpzbvodmd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdGl3Z3lhbHNucXB6YnZvZG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTY2NDMsImV4cCI6MjEwMzkzMjY0M30.RoSQVbj0ZSPKlLEnD8MP5ECjDUUg0yNkJF2B6QHc-x8";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Google Apps Script Web App URL (Gmail দিয়ে সরাসরি ওটিপি পাঠানোর জন্য)
// আপনার Google Script Deploy করার পর পাওয়া Web App URL টি এখানে দিন অথবা localStorage এ 'google_script_webapp_url' কি-তে সেট করতে পারেন
const GOOGLE_SCRIPT_WEBAPP_URL = localStorage.getItem('google_script_webapp_url') || "";

// সব পেজে ওটিপি প্রেরণের কেন্দ্রীয় POST ফাংশন (Gmail App Password /api/send-otp, Google Apps Script & Supabase fallback)
async function sendOtpEmailDirect(email, otp, options = {}) {
    // ১. সার্ভার-সাইড জিমেইল এসএমটিপি ও অ্যাপ পাসওয়ার্ড দিয়ে সরাসরি ইমেইল পাঠানো (/api/send-otp)
    try {
        const res = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: otp, ...options })
        });
        const result = await res.json();
        if (res.ok && result && result.success) {
            console.log('OTP dispatched via Love Web OTP (Gmail SMTP) to:', email);
            return { success: true, messageId: result.messageId };
        } else {
            console.warn('Server /api/send-otp returned error:', result);
            if (result && result.message) {
                throw new Error(result.message);
            }
        }
    } catch (apiErr) {
        console.warn('Server /api/send-otp failed, trying fallback:', apiErr);
    }

    const scriptUrl = localStorage.getItem('google_script_webapp_url') || GOOGLE_SCRIPT_WEBAPP_URL;

    // ২. Google Apps Script Web App-এ POST রিকোয়েস্ট (যদি সেট করা থাকে)
    if (scriptUrl && scriptUrl.trim().startsWith('http')) {
        try {
            await fetch(scriptUrl.trim(), {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({ email: email, otp: otp, ...options })
            });
            console.log('OTP dispatched via Google Apps Script POST to:', email);
            return { success: true };
        } catch (fetchErr) {
            console.warn('Google Apps Script fetch failed, attempting Supabase fallback:', fetchErr);
        }
    }

    // ৩. ফলব্যাক হিসেবে Supabase Edge Function কল
    try {
        const { error } = await _supabase.functions.invoke('send-otp-email', {
            body: { email: email, otp: otp, ...options }
        });
        if (error) console.warn('Supabase invoke warning:', error);
    } catch (sbErr) {
        console.warn('Supabase edge function fallback error:', sbErr);
    }

    return { success: true };
}

// DOM Elements
const authCard = document.getElementById('authCard');
const overlayBtnSignIn = document.getElementById('overlayBtnSignIn');
const overlayBtnSignUp = document.getElementById('overlayBtnSignUp');
const mobileToSignUp = document.getElementById('mobileToSignUp');
const mobileToSignIn = document.getElementById('mobileToSignIn');
const notification = document.getElementById('notification');
const notifMessage = document.getElementById('notifMessage') || document.getElementById('notif-message');

const usernameInput = document.getElementById('signUpUsername');
const phoneInput = document.getElementById('signUpPhone');
const emailInput = document.getElementById('signUpEmail');
const passwordInput = document.getElementById('signUpPassword');
const confirmPasswordInput = document.getElementById('signUpConfirmPassword');
const strengthMeter = document.getElementById('strengthMeter') || document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

// ডাইনামিক নোটিফিকেশন প্রদর্শন ব্যবস্থা
let notifTimeout;
function showNotification(msg, type = 'error') {
    if (!notification) return;
    const msgElement = notifMessage || notification.querySelector('span');
    if (msgElement) msgElement.innerText = msg;
    
    notification.className = `notification-toast show ${type}`;
    
    clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 3200);
}

// পেজ লোড হওয়ার সময় সক্রিয় সেশন পরীক্ষা ও অটো-ফিল লজিক
window.addEventListener('DOMContentLoaded', () => {
    const activeSession = localStorage.getItem('loveweb_session');
    if (activeSession && !window.location.pathname.includes('reset-password')) {
        window.location.href = '../index.html';
    }

    // পাসওয়ার্ড রিসেট পেজে অটো-ফিল ইমেইল লজিক
    const resetEmailInput = document.getElementById('reset-email');
    if (resetEmailInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email');
        const savedEmail = localStorage.getItem('reset_email_target');

        if (emailFromUrl) {
            resetEmailInput.value = emailFromUrl;
        } else if (savedEmail) {
            resetEmailInput.value = savedEmail;
        }
    }
});

// "পাসওয়ার্ড ভুলে গেছেন?" লিঙ্কে ক্লিক করলে ইমেইল সেভ করা
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        sessionStorage.setItem('allow_reset_access', 'true');
        
        const signInIdentifier = document.getElementById('signInIdentifier');
        if (signInIdentifier) {
            const val = signInIdentifier.value.trim().toLowerCase();
            if (val.includes('@')) {
                localStorage.setItem('reset_email_target', val);
            }
        }
    });
}

// প্যানেল পরিবর্তনের অ্যানিমেশন
if (overlayBtnSignUp) overlayBtnSignUp.addEventListener('click', () => authCard.classList.add('active'));
if (overlayBtnSignIn) overlayBtnSignIn.addEventListener('click', () => authCard.classList.remove('active'));
if (mobileToSignUp) mobileToSignUp.addEventListener('click', () => authCard.classList.add('mobile-active'));
if (mobileToSignIn) mobileToSignIn.addEventListener('click', () => authCard.classList.remove('mobile-active'));

// =========================================
// স্পেস নিয়ন্ত্রণ ব্যবস্থা (Space Prevention & Removal)
// =========================================
function preventSpaces(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.keyCode === 32) {
                e.preventDefault();
                showNotification('এই ফিল্ডটিতে স্পেস ব্যবহার গ্রহণযোগ্য নয়।', 'error');
            }
        });

        el.addEventListener('input', (e) => {
            if (e.target.value.includes(' ')) {
                e.target.value = e.target.value.replace(/\s+/g, '');
                showNotification('অপ্রয়োজনীয় স্পেস অপসারণ করা হয়েছে।', 'error');
            }
        });
    }
}

preventSpaces('signInIdentifier');
preventSpaces('signInPassword');
preventSpaces('signUpUsername');
preventSpaces('signUpEmail');
preventSpaces('signUpPhone');
preventSpaces('signUpPassword');
preventSpaces('signUpConfirmPassword');
preventSpaces('reset-email');
preventSpaces('newPassword');
preventSpaces('confirmNewPassword');

// =========================================
// পাসওয়ার্ড দেখা ও আড়াল করার লজিক
// =========================================
function setupPasswordToggle(inputId, toggleIconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(toggleIconId);

    if (input && icon) {
        icon.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isPassword);
            icon.classList.toggle('fa-eye-slash', isPassword);
        });
    }
}

setupPasswordToggle('signInPassword', 'toggleSignInPassword');
setupPasswordToggle('signUpPassword', 'toggleSignUpPassword');
setupPasswordToggle('signUpConfirmPassword', 'toggleConfirmPassword');

// রিয়েল-টাইম ইউজারনেম দৈর্ঘ্য যাচাই
if (usernameInput) {
    usernameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val.length === 0) return;

        if (val.length < 6) {
            showNotification(`ইউজারনেম অন্তত ৬ অক্ষরের হতে হবে (আরও ${6 - val.length} টি অক্ষর প্রয়োজন)`, 'error');
        } else {
            showNotification('ইউজারনেমের দৈর্ঘ্য সঠিক রয়েছে।', 'success');
        }
    });
}

// রিয়েল-টাইম ফোন নম্বর যাচাই
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        const val = e.target.value;

        if (val.length === 0) return;

        if (!val.startsWith('01')) {
            showNotification('ফোন নম্বরটি অবশ্যই 01 দিয়ে শুরু হতে হবে।', 'error');
        } else if (val.length < 11) {
            showNotification(`১১ ডিজিট পূর্ণ হতে আরও ${11 - val.length} টি সংখ্যা প্রয়োজন`, 'error');
        } else if (val.length === 11) {
            showNotification('ফোন নম্বরটি সঠিকভাবে প্রদান করা হয়েছে।', 'success');
        }
    });
}

// অনুমোদিত ইমেল ডোমেইন যাচাইকরণ
function checkAllowedEmail(email) {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    const parts = email.split('@');
    
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return { isValid: false, msg: 'একটি বৈধ ইমেল ঠিকানা প্রদান করুন।' };
    }

    const domain = parts[1].toLowerCase();

    if (!allowedDomains.includes(domain)) {
        return { isValid: false, msg: 'শুধুমাত্র gmail, yahoo, outlook, hotmail বা icloud ইমেল গ্রহণযোগ্য।' };
    }

    return { isValid: true, msg: 'ইমেল ঠিকানাটি সঠিকভাবে প্রদান করা হয়েছে।' };
}

// রিয়েল-টাইম ইমেল যাচাই
if (emailInput) {
    emailInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();
        if (val.length === 0) return;

        if (!val.includes('@')) {
            showNotification('ইমেল ঠিকানায় অবশ্যই "@" চিহ্নটি থাকতে হবে।', 'error');
            return;
        }

        const result = checkAllowedEmail(val);
        if (!result.isValid) {
            showNotification(result.msg, 'error');
        } else {
            showNotification(result.msg, 'success');
        }
    });
}

// সাধারণ ও দুর্বল পাসওয়ার্ডের তালিকা (Blacklist)
const COMMON_WEAK_PASSWORDS = [
    '12345678', '123456789', '1234567890', 'password', 'password123',
    'admin123', 'qwerty123', 'loveweb123', 'iloveyou', 'bangladesh',
    'bangladesh1', 'secret123', 'welcome123', 'pass1234', '11223344',
    '87654321', '00000000', '11111111', 'abcdefgh'
];

// পাসওয়ার্ড সুরক্ষা রুলস ভ্যালিডেশন
function validatePasswordSecurity(pwd, oldPwd = null) {
    if (!pwd || pwd.length < 8) {
        return { isValid: false, msg: 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' };
    }
    if (COMMON_WEAK_PASSWORDS.includes(pwd.toLowerCase())) {
        return { isValid: false, msg: 'অতি সাধারণ বা অনুমানযোগ্য পাসওয়ার্ড গ্রহণযোগ্য নয়। একটি নিরাপদ পাসওয়ার্ড নির্বাচন করুন।' };
    }
    if (!/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd)) {
        return { isValid: false, msg: 'পাসওয়ার্ডে বড় (A-Z) ও ছোট (a-z) উভয় ইংরেজি অক্ষর থাকতে হবে।' };
    }
    if (!/[0-9]/.test(pwd)) {
        return { isValid: false, msg: 'পাসওয়ার্ডে অন্তত একটি সংখ্যা (0-9) থাকা আবশ্যক।' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(pwd)) {
        return { isValid: false, msg: 'পাসওয়ার্ডে অন্তত একটি বিশেষ চিহ্ন (@, #, $, %, !, ইত্যাদি) থাকতে হবে।' };
    }
    if (oldPwd && pwd === oldPwd) {
        return { isValid: false, msg: 'নতুন পাসওয়ার্ডটি পূর্বের পাসওয়ার্ড থেকে আলাদা হতে হবে।' };
    }
    return { isValid: true };
}

// সিকিউরিটি রুলস লাইভ চেকলিস্ট আপডেট
function updateSecurityChecklist(pwd, prefix = 'signUp') {
    const hasLength = pwd.length >= 8;
    const hasCase = /[A-Z]/.test(pwd) && /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(pwd);

    function updateItem(id, valid) {
        const el = document.getElementById(id);
        if (!el) return;
        el.className = `rule-item ${valid ? 'valid' : 'invalid'}`;
        const icon = el.querySelector('i');
        if (icon) {
            icon.className = valid ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
        }
    }

    updateItem(`${prefix}RuleLength`, hasLength);
    updateItem(`${prefix}RuleCase`, hasCase);
    updateItem(`${prefix}RuleNumber`, hasNum);
    updateItem(`${prefix}RuleSpecial`, hasSpecial);
}

// লগইন রেট-লিমিটিং এবং ব্রুট-ফোর্স ডিফেন্স
function checkLoginLock(identifier) {
    if (!identifier) return { isLocked: false };
    const key = `login_lock_${identifier.toLowerCase()}`;
    const lockedUntil = parseInt(localStorage.getItem(key) || '0');
    const now = Date.now();
    if (lockedUntil > now) {
        const remainingSec = Math.ceil((lockedUntil - now) / 1000);
        const mins = Math.floor(remainingSec / 60);
        const secs = remainingSec % 60;
        const timeStr = mins > 0 ? `${mins} মিনিট ${secs} সেকেন্ড` : `${secs} সেকেন্ড`;
        return { isLocked: true, msg: `অতিরিক্ত ভুল চেষ্টার কারণে অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে। অপেক্ষা করুন: ${timeStr}।` };
    }
    return { isLocked: false };
}

function handleFailedLogin(identifier) {
    const attemptKey = `login_fail_count_${identifier.toLowerCase()}`;
    const current = parseInt(localStorage.getItem(attemptKey) || '0') + 1;
    localStorage.setItem(attemptKey, current.toString());

    if (current >= 5) {
        const lockUntil = Date.now() + 5 * 60 * 1000; // ৫ মিনিট লকআউট
        localStorage.setItem(`login_lock_${identifier.toLowerCase()}`, lockUntil.toString());
        localStorage.removeItem(attemptKey);
        return '৫ বার ভুল পাসওয়ার্ড দেওয়ায় অ্যাকাউন্টটি ৫ মিনিটের জন্য সাময়িকভাবে লক করা হলো।';
    } else {
        const remaining = 5 - current;
        return `ভুল পাসওয়ার্ড! আর ${remaining} বার ভুল করলে অ্যাকাউন্ট ৫ মিনিটের জন্য লক হবে।`;
    }
}

function handleSuccessfulLogin(identifier) {
    localStorage.removeItem(`login_fail_count_${identifier.toLowerCase()}`);
    localStorage.removeItem(`login_lock_${identifier.toLowerCase()}`);
}

// ওটিপি ৫ বার ভুল করার ১০ মিনিট লকআউট সিস্টেম
function checkOtpBlock(email) {
    if (!email) return { isBlocked: false };
    const cleanEmail = email.toLowerCase().trim();
    const key = `otp_block_${cleanEmail}`;
    const blockedUntil = parseInt(localStorage.getItem(key) || '0');
    const now = Date.now();
    if (blockedUntil > now) {
        const remainingSec = Math.ceil((blockedUntil - now) / 1000);
        const mins = Math.floor(remainingSec / 60);
        const secs = remainingSec % 60;
        const timeStr = mins > 0 ? `${mins} মিনিট ${secs} সেকেন্ড` : `${secs} সেকেন্ড`;
        return {
            isBlocked: true,
            remainingMs: blockedUntil - now,
            timeStr: timeStr,
            msg: `৫ বার ভুল ওটিপি দেওয়ায় অ্যাকাউন্ট সাময়িকভাবে ১০ মিনিটের জন্য ব্লক করা হয়েছে। অপেক্ষা করুন: ${timeStr}।`
        };
    }
    // ১০ মিনিট পার হলে স্বয়ংক্রিয়ভাবে ব্লক ও ফেইল কাউন্টার রিমুভ
    if (blockedUntil > 0 && blockedUntil <= now) {
        localStorage.removeItem(key);
        localStorage.removeItem(`otp_fail_count_${cleanEmail}`);
    }
    return { isBlocked: false };
}

function handleFailedOtpAttempt(email) {
    const cleanEmail = email.toLowerCase().trim();
    const attemptKey = `otp_fail_count_${cleanEmail}`;
    const current = parseInt(localStorage.getItem(attemptKey) || '0') + 1;
    localStorage.setItem(attemptKey, current.toString());

    if (current >= 5) {
        const lockUntil = Date.now() + 10 * 60 * 1000; // ১০ মিনিট লকআউট
        localStorage.setItem(`otp_block_${cleanEmail}`, lockUntil.toString());
        localStorage.removeItem(attemptKey);
        return {
            blocked: true,
            msg: '৫ বার ভুল ভেরিফিকেশন কোড দেওয়ায় অ্যাকাউন্ট ১০ মিনিটের জন্য সাময়িকভাবে ব্লক করা হলো।'
        };
    } else {
        const remaining = 5 - current;
        return {
            blocked: false,
            remaining: remaining,
            msg: `ভুল ভেরিফিকেশন কোড! আর ${remaining} বার চেষ্টার সুযোগ রয়েছে (এরপর ১০ মিনিটের জন্য ব্লক হবে)।`
        };
    }
}

function handleSuccessfulOtp(email) {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.removeItem(`otp_fail_count_${cleanEmail}`);
    localStorage.removeItem(`otp_block_${cleanEmail}`);
}

// পাসওয়ার্ডের মান নির্দেশক
function checkPasswordStrength(pwd) {
    let score = 0;

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 11) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(pwd)) score += 1;

    const isCommon = COMMON_WEAK_PASSWORDS.includes(pwd.toLowerCase());

    if (isCommon) {
        return { label: 'অতি সাধারণ (Unsafe)', color: '#ff4d4d', percent: 15, isWeak: true };
    }

    switch (score) {
        case 1:
        case 2:
            return { label: 'দুর্বল (Weak)', color: '#ff4d4d', percent: 25, isWeak: true };
        case 3:
            return { label: 'মাঝারি (Medium)', color: '#ffaa00', percent: 50, isWeak: false };
        case 4:
            return { label: 'উত্তম (Good)', color: '#00bcd4', percent: 75, isWeak: false };
        case 5:
            return { label: 'অত্যন্ত শক্তিশালী (Strong)', color: '#00e676', percent: 100, isWeak: false };
        default:
            return { label: 'অত্যন্ত দুর্বল (Weak)', color: '#ff4d4d', percent: 10, isWeak: true };
    }
}

// পাসওয়ার্ড রিয়েল-টাইম পরীক্ষা
if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
        const val = e.target.value;

        // লাইভ রুলস চেকলিস্ট আপডেট
        updateSecurityChecklist(val, 'signUp');

        if (val.length === 0) {
            if (strengthMeter) strengthMeter.style.width = '0%';
            if (strengthText) strengthText.innerText = '';
            return;
        }

        const result = checkPasswordStrength(val);

        if (strengthMeter) {
            strengthMeter.style.width = result.percent + '%';
            strengthMeter.style.backgroundColor = result.color;
        }

        if (strengthText) {
            strengthText.innerText = `পাসওয়ার্ডের মান: ${result.label}`;
            strengthText.style.color = result.color;
        }
    });
}

// নিশ্চিতকরণ পাসওয়ার্ড পরীক্ষা
if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', (e) => {
        const pwd = passwordInput.value;
        const confirmPwd = e.target.value;

        if (confirmPwd.length === 0) return;

        if (pwd !== confirmPwd) {
            showNotification('পাসওয়ার্ড দুটি মিলছে না।', 'error');
        } else {
            showNotification('পাসওয়ার্ড সফলভাবে মিলেছে।', 'success');
        }
    });
}

// স্বয়ংক্রিয় অনন্য ইউজারনেম তৈরি
const btnGenerateUsername = document.getElementById('btnGenerateUsername');
if (btnGenerateUsername) {
    btnGenerateUsername.addEventListener('click', () => {
        const fullNameInput = document.getElementById('signUpFullName');
        const fullName = fullNameInput ? fullNameInput.value.trim() : '';
        if (!fullName) {
            showNotification('ইউজারনেম তৈরি করতে প্রথমে আপনার পুরো নাম লিখুন।', 'error');
            return;
        }
        let cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanName.length < 3) cleanName = (cleanName + 'user').slice(0, 4);
        
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedUsername = `${cleanName}${randomNum}`;
        
        if (usernameInput) usernameInput.value = generatedUsername;
        const usernameErrEl = document.getElementById('usernameError');
        if (usernameErrEl) usernameErrEl.style.display = 'none';
        showNotification(`নতুন ইউজারনেম তৈরি হয়েছে: ${generatedUsername}`, 'success');
    });
}

// ইউজারনেমের পূর্ব অস্তিত্ব পরীক্ষা
async function checkUsernameExists(username) {
    const { data } = await _supabase
        .from('User_Information')
        .select('username')
        .eq('username', username);
    
    return data && data.length > 0;
}

// ইমেইলের পূর্ব অস্তিত্ব পরীক্ষা (Supabase)
async function checkEmailExists(email) {
    const { data, error } = await _supabase
        .from('User_Information')
        .select('email')
        .eq('email', email);
    
    if (error) return false;
    return data && data.length > 0;
}

// সাইন-আপ ফর্ম সাবমিট
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('signUpFullName').value.trim();
        const username = document.getElementById('signUpUsername').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const phone = document.getElementById('signUpPhone').value.trim();
        const password = document.getElementById('signUpPassword').value.trim();
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';
        const usernameErrEl = document.getElementById('usernameError');

        if (username.length < 6) {
            showNotification('ইউজারনেম অন্তত ৬ অক্ষরের হওয়া আবশ্যক।', 'error');
            return;
        }

        if (!phone.startsWith('01') || phone.length !== 11) {
            showNotification('১১ ডিজিটের সঠিক ফোন নম্বর প্রদান করুন (01XXXXXXXXX)।', 'error');
            return;
        }

        const emailValidation = checkAllowedEmail(email);
        if (!emailValidation.isValid) {
            showNotification(emailValidation.msg, 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('প্রদত্ত পাসওয়ার্ড দুটি একে অপরের সাথে মিলছে না।', 'error');
            return;
        }

        const securityCheck = validatePasswordSecurity(password);
        if (!securityCheck.isValid) {
            showNotification(securityCheck.msg, 'error');
            return;
        }

        const isTaken = await checkUsernameExists(username);
        if (isTaken) {
            if (usernameErrEl) {
                usernameErrEl.innerText = "এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে।";
                usernameErrEl.style.display = "block";
            }
            showNotification("এই ইউজারনেমটি অনন্য নয়, অনুগ্রহ করে অন্য একটি চেষ্টা করুন।", "error");
            return;
        }
        if (usernameErrEl) usernameErrEl.style.display = "none";

        const createdAt = new Date().toISOString();
        const { data, error } = await _supabase
            .from('User_Information')
            .insert([
                { full_name: fullName, username: username, email: email, phone: phone, password: password, created_at: createdAt }
            ])
            .select();

        if (error) {
            // যদি created_at কলাম স্কিমাতে না থাকে, সাধারণ ইনসার্ট দিয়ে ফলব্যাক
            const fallbackInsert = await _supabase
                .from('User_Information')
                .insert([
                    { full_name: fullName, username: username, email: email, phone: phone, password: password }
                ])
                .select();

            if (fallbackInsert.error) {
                showNotification("নিবন্ধন ব্যর্থ হয়েছে: " + fallbackInsert.error.message, "error");
                return;
            }
            const newUser = fallbackInsert.data[0];
            newUser.created_at = createdAt;
            showNotification("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", "success");
            localStorage.setItem('loveweb_session', JSON.stringify(newUser));
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1200);
        } else {
            showNotification("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", "success");
            const savedUser = data[0];
            if (!savedUser.created_at) savedUser.created_at = createdAt;
            localStorage.setItem('loveweb_session', JSON.stringify(savedUser));
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1200);
        }
    });
}

// সাইন-ইন (লগইন) ফর্ম সাবমিট
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const identifier = document.getElementById('signInIdentifier').value.trim();
        const password = document.getElementById('signInPassword').value.trim();

        // ১. ব্রুট-ফোর্স লকআউট পরীক্ষা
        const lockStatus = checkLoginLock(identifier);
        if (lockStatus.isLocked) {
            showNotification(lockStatus.msg, "error");
            return;
        }

        const { data: userCheck, error: userError } = await _supabase
            .from('User_Information')
            .select('*')
            .or(`email.eq.${identifier},username.eq.${identifier}`);

        if (userError || !userCheck || userCheck.length === 0) {
            showNotification("এই তথ্যের সাথে নিবন্ধিত কোনো অ্যাকাউন্ট পাওয়া যায়নি।", "error");
            return;
        }

        const matchedUser = userCheck.find(user => user.password === password);

        if (!matchedUser) {
            // ভুল পাসওয়ার্ডের ক্ষেত্রে অ্যাটেম্পট কাউন্টার বৃদ্ধি ও ওয়ার্নিং প্রদান
            const warningMsg = handleFailedLogin(identifier);
            showNotification(warningMsg, "error");
        } else {
            // সফল লগইনে অ্যাটেম্পট কাউন্টার ক্লিয়ার
            handleSuccessfulLogin(identifier);

            // অ্যাকাউন্ট তৈরির সময় নিশ্চিত করা
            if (!matchedUser.created_at) {
                matchedUser.created_at = new Date().toISOString();
            }

            showNotification("লগইন সফল হয়েছে। অপেক্ষা করুন...", "success");
            localStorage.setItem('loveweb_session', JSON.stringify(matchedUser));
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
    });
}

// =========================================
// পাসওয়ার্ড রিসেট, OTP ভেরিফিকেশন ও লাইভ টাইমার লজিক
// =========================================

// ১. রিসেট রিকোয়েস্ট (reset-password/index.html)
const resetRequestForm = document.getElementById('reset-request-form');
if (resetRequestForm) {
    resetRequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const resetEmailInput = document.getElementById('reset-email');
        const emailValue = resetEmailInput ? resetEmailInput.value.trim().toLowerCase() : '';

        if (!emailValue) return showNotification('অনুগ্রহ করে একটি ইমেইল প্রদান করুন।', 'error');

        // ১০ মিনিট ওটিপি ব্লক সক্রিয় আছে কি না পরীক্ষা
        const blockStatus = checkOtpBlock(emailValue);
        if (blockStatus.isBlocked) {
            return showNotification(blockStatus.msg, 'error');
        }

        const emailValidation = checkAllowedEmail(emailValue);
        if (!emailValidation.isValid) return showNotification(emailValidation.msg, 'error');

        showNotification('অ্যাকাউন্ট অনুসন্ধান করা হচ্ছে...', 'success');
        const exists = await checkEmailExists(emailValue);

        if (!exists) {
            return showNotification('আপনার এই ইমেইলে কোনো অ্যাকাউন্ট নিবন্ধিত নেই।', 'error');
        }

        const now = Date.now();
        const lastSentTime = localStorage.getItem(`otp_sent_time_${emailValue}`);

        // ১০ মিনিটের ভেতরে ওটিপি পাঠানো থাকলে সরাসরি ভেরিফিকেশন পেজে যাবে
        if (lastSentTime) {
            const timeDiffMinutes = (now - parseInt(lastSentTime)) / (1000 * 60);
            if (timeDiffMinutes < 10) {
                sessionStorage.setItem('reset_verified_email', emailValue);
                sessionStorage.setItem('reset_step', 'verification');
                showNotification('আপনার পূর্বের ওটিপি কোডটি এখনো কার্যকর আছে।', 'success');
                setTimeout(() => {
                    window.location.href = `verification.html?email=${encodeURIComponent(emailValue)}`;
                }, 1000);
                return;
            }
        }

        // ১০ মিনিট পর নতুন OTP জেনারেট হবে
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(now + 10 * 60 * 1000).toISOString();

        // Database-এ সেভ করা
        const { error: dbError } = await _supabase
            .from('Password_Resets')
            .insert([{ email: emailValue, otp_code: generatedOTP, expires_at: expiresAt }]);

        if (dbError) {
            return showNotification('কোড পাঠাতে সমস্যা হয়েছে: ' + dbError.message, 'error');
        }

        // Google Apps Script / Supabase-এ POST মেথডে জিমেইলে ওটিপি ডেসপ্যাচ
        showNotification('ইমেইলে ওটিপি পাঠানো হচ্ছে...', 'success');
        await sendOtpEmailDirect(emailValue, generatedOTP);

        localStorage.setItem(`otp_sent_time_${emailValue}`, now.toString());
        localStorage.setItem(`otp_expiry_time_${emailValue}`, (now + 10 * 60 * 1000).toString());
        sessionStorage.setItem('reset_verified_email', emailValue);
        sessionStorage.setItem('reset_step', 'verification');

        showNotification('ভেরিফিকেশন কোড ইমেইলে পাঠানো হয়েছে! (১০ মিনিট মেয়াদ)', 'success');
        setTimeout(() => {
            window.location.href = `verification.html?email=${encodeURIComponent(emailValue)}`;
        }, 1200);
    });
}

// ২. ভেরিফিকেশন পেজ (reset-password/verification.html)
if (window.location.pathname.includes('verification.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = (urlParams.get('email') || '').toLowerCase().trim();
    const referrer = document.referrer.toLowerCase();
    const currentStep = sessionStorage.getItem('reset_step');

    const isValidReferrer = referrer.includes('reset-password/index.html') || referrer.includes('reset-password/') || referrer.includes('settings/');

    if (!emailParam || !isValidReferrer || currentStep !== 'verification') {
        showNotification('অবৈধ প্রবেশ চেষ্টা! সঠিক উপায়ে চেষ্টা করুন।', 'error');
        setTimeout(() => { window.location.href = '../sign-in/index.html'; }, 1500);
    }

    const otpInputs = document.querySelectorAll('.otp-input');
    const otpExpiryEl = document.getElementById('otpExpiryTimer');
    const otpExpiryBox = document.getElementById('otpExpiryTimerBox');
    const otpBlockedBox = document.getElementById('otpBlockedTimerBox');
    const otpBlockedTimerEl = document.getElementById('otpBlockedTimer');
    const resendCountdownEl = document.getElementById('resendCountdown');
    const resendTimerText = document.getElementById('resendTimerText');
    const btnResendCode = document.getElementById('btnResendCode');
    const btnSubmitOtp = document.getElementById('btnSubmitOtp');

    let expiryInterval = null;
    let resendInterval = null;
    let blockedCountdownInterval = null;

    // --- ১০ মিনিট লকআউট সিঙ্ক্রোনাইজেশন লজিক ---
    function syncOtpBlockUI() {
        const block = checkOtpBlock(emailParam);

        if (block.isBlocked) {
            if (otpBlockedBox) otpBlockedBox.style.display = 'block';
            if (otpExpiryBox) otpExpiryBox.style.display = 'none';
            if (btnSubmitOtp) btnSubmitOtp.disabled = true;
            if (btnResendCode) btnResendCode.disabled = true;
            otpInputs.forEach(input => {
                input.disabled = true;
                input.value = '';
            });

            clearInterval(blockedCountdownInterval);
            blockedCountdownInterval = setInterval(() => {
                const cur = checkOtpBlock(emailParam);
                if (cur.isBlocked) {
                    const totalSec = Math.ceil(cur.remainingMs / 1000);
                    const mins = Math.floor(totalSec / 60);
                    const secs = totalSec % 60;
                    if (otpBlockedTimerEl) {
                        otpBlockedTimerEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    }
                } else {
                    // ১০ মিনিট অতিক্রান্ত হয়েছে - আনব্লক ও পুনরায় চালু
                    clearInterval(blockedCountdownInterval);
                    if (otpBlockedBox) otpBlockedBox.style.display = 'none';
                    if (otpExpiryBox) otpExpiryBox.style.display = 'block';
                    if (btnSubmitOtp) btnSubmitOtp.disabled = false;
                    if (btnResendCode) btnResendCode.disabled = false;
                    otpInputs.forEach(input => { input.disabled = false; });
                    showNotification('আপনার ব্লকের ১০ মিনিট শেষ হয়েছে। নতুন ভেরিফিকেশন কোডের জন্য "পুনরায় পাঠান" বাটনে ক্লিক করুন।', 'success');
                    startLiveTimers();
                }
            }, 1000);
            return true;
        } else {
            if (otpBlockedBox) otpBlockedBox.style.display = 'none';
            if (otpExpiryBox) otpExpiryBox.style.display = 'block';
            return false;
        }
    }

    // --- লাইভ ১০ মিনিট এক্সপায়ারি এবং ৫ মিনিট রিসেন্ড টাইমার লজিক ---
    function startLiveTimers() {
        if (checkOtpBlock(emailParam).isBlocked) return;

        const expiryTimestamp = parseInt(localStorage.getItem(`otp_expiry_time_${emailParam}`) || '0');
        const sentTimestamp = parseInt(localStorage.getItem(`otp_sent_time_${emailParam}`) || '0');

        // ১. ১০ মিনিটের লাইভ OTP এক্সপায়ারি টাইমার
        clearInterval(expiryInterval);
        expiryInterval = setInterval(() => {
            const now = Date.now();
            const remainingMs = expiryTimestamp - now;

            if (remainingMs <= 0) {
                clearInterval(expiryInterval);
                if (otpExpiryEl) otpExpiryEl.innerText = "মেয়াদ শেষ!";
                if (btnSubmitOtp) btnSubmitOtp.disabled = true;
                showNotification('ভেরিফিকেশন কোডের ১০ মিনিটের মেয়াদ শেষ হয়ে গেছে।', 'error');
            } else {
                const totalSeconds = Math.floor(remainingMs / 1000);
                const mins = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                if (otpExpiryEl) {
                    otpExpiryEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);

        // ২. ৫ মিনিটের রিসেন্ড লক টাইমার
        clearInterval(resendInterval);
        resendInterval = setInterval(() => {
            const now = Date.now();
            const resendMs = (sentTimestamp + 5 * 60 * 1000) - now;

            if (resendMs <= 0) {
                clearInterval(resendInterval);
                if (btnResendCode) btnResendCode.disabled = false;
                if (resendTimerText) resendTimerText.style.display = 'none';
            } else {
                if (btnResendCode) btnResendCode.disabled = true;
                if (resendTimerText) resendTimerText.style.display = 'block';
                const totalSeconds = Math.floor(resendMs / 1000);
                const mins = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                if (resendCountdownEl) {
                    resendCountdownEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);
    }

    // প্রাথমিক লোডে ব্লক ও টাইমার ইনিশিয়ালাইজেশন
    const isCurrentlyBlocked = syncOtpBlockUI();
    if (!isCurrentlyBlocked) {
        startLiveTimers();
    }

    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
                if (pastedData) {
                    const digits = pastedData.split('');
                    otpInputs.forEach((inp, idx) => { if (digits[idx]) inp.value = digits[idx]; });
                    const nextFocusIndex = Math.min(digits.length, otpInputs.length) - 1;
                    if (nextFocusIndex >= 0) otpInputs[nextFocusIndex].focus();
                }
            });
        });
    }

    // OTP নিশ্চিতকরণ ফর্ম
    const verificationForm = document.getElementById('verificationForm');
    if (verificationForm) {
        verificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // ব্লক স্ট্যাটাস পরীক্ষা
            const block = checkOtpBlock(emailParam);
            if (block.isBlocked) {
                syncOtpBlockUI();
                return showNotification(block.msg, 'error');
            }

            let enteredCode = '';
            otpInputs.forEach(input => enteredCode += input.value);

            if (enteredCode.length !== 6) return showNotification('৬ ডিজিটের পুরো কোডটি দিন।', 'error');

            showNotification('কোড যাচাই করা হচ্ছে...', 'success');

            // ডেটাবেজে নিরাপদ কুয়েরি (created_at নির্ভরতা মুক্ত)
            const { data, error } = await _supabase
                .from('Password_Resets')
                .select('*')
                .eq('email', emailParam)
                .eq('otp_code', enteredCode);

            let isCodeValid = false;
            if (!error && data && data.length > 0) {
                // ১০ মিনিটের মেয়াদ আছে এমন রেকর্ড ফিল্টার
                const now = new Date();
                const matched = data.find(r => new Date(r.expires_at) > now);
                if (matched) {
                    isCodeValid = true;
                }
            }

            if (!isCodeValid) {
                // ভুল বা মেয়াদোত্তীর্ণ কোড
                const failResult = handleFailedOtpAttempt(emailParam);
                if (failResult.blocked) {
                    // ডেটাবেজ থেকে এই ইমেইলের কোড পরিষ্কার করা
                    try {
                        await _supabase.from('Password_Resets').delete().eq('email', emailParam);
                    } catch (delErr) {
                        console.error('Failed to cleanup OTP on block:', delErr);
                    }
                    showNotification(failResult.msg, 'error');
                    syncOtpBlockUI();
                    return;
                } else {
                    return showNotification(failResult.msg, 'error');
                }
            }

            // সফল ভেরিফিকেশন: কাউন্টার ও ব্লক ক্লিয়ার
            handleSuccessfulOtp(emailParam);

            // ব্যবহৃত ওটিপি মুছে ফেলা
            try {
                await _supabase.from('Password_Resets').delete().eq('email', emailParam);
            } catch (delErr) {
                console.error('Failed to delete used OTP:', delErr);
            }

            sessionStorage.setItem('reset_step', 'new_password');
            showNotification('কোড সঠিকভাবে যাচাই করা হয়েছে!', 'success');
            setTimeout(() => {
                window.location.href = `new-password.html?email=${encodeURIComponent(emailParam)}`;
            }, 1000);
        });
    }

    // "পুনরায় পাঠান" (Resend Code) বাটন
    if (btnResendCode) {
        btnResendCode.addEventListener('click', async () => {
            // ব্লক স্ট্যাটাস পরীক্ষা
            const block = checkOtpBlock(emailParam);
            if (block.isBlocked) {
                syncOtpBlockUI();
                return showNotification(block.msg, 'error');
            }

            const now = Date.now();
            const lastSentTime = localStorage.getItem(`otp_sent_time_${emailParam}`);
            
            if (lastSentTime) {
                const timeDiffMinutes = (now - parseInt(lastSentTime)) / (1000 * 60);
                if (timeDiffMinutes < 5) {
                    const waitTime = Math.ceil(5 - timeDiffMinutes);
                    return showNotification(`পুনরায় কোড পাঠাতে আরও ${waitTime} মিনিট অপেক্ষা করুন।`, 'error');
                }
            }

            const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(now + 10 * 60 * 1000).toISOString();

            const { error: dbError } = await _supabase
                .from('Password_Resets')
                .insert([{ email: emailParam, otp_code: generatedOTP, expires_at: expiresAt }]);

            if (dbError) {
                return showNotification('নতুন কোড তৈরি করতে সমস্যা হয়েছে: ' + dbError.message, 'error');
            }

            // Google Apps Script / Supabase-এ POST মেথডে পুনরায় ইমেইল প্রেরণ
            showNotification('নতুন ওটিপি ইমেইলে পাঠানো হচ্ছে...', 'success');
            await sendOtpEmailDirect(emailParam, generatedOTP);

            localStorage.setItem(`otp_sent_time_${emailParam}`, now.toString());
            localStorage.setItem(`otp_expiry_time_${emailParam}`, (now + 10 * 60 * 1000).toString());

            if (btnSubmitOtp) btnSubmitOtp.disabled = false;

            startLiveTimers();
            showNotification('নতুন ভেরিফিকেশন কোড ইমেইলে পাঠানো হয়েছে। (১০ মিনিট মেয়াদ)', 'success');
        });
    }
}

// ৩. নতুন পাসওয়ার্ড সেট পেজ (reset-password/new-password.html)
if (window.location.pathname.includes('new-password.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const referrer = document.referrer.toLowerCase();
    const currentStep = sessionStorage.getItem('reset_step');

    const isValidReferrer = referrer.includes('verification.html');

    if (!emailParam || !isValidReferrer || currentStep !== 'new_password') {
        showNotification('অবৈধ এক্সেস! আপনি এই পেজে সরাসরি প্রবেশ করতে পারবেন না।', 'error');
        setTimeout(() => { window.location.href = '../sign-in/index.html'; }, 1500);
    }

    setupPasswordToggle('newPassword', 'toggleNewPassword');
    setupPasswordToggle('confirmNewPassword', 'toggleConfirmPassword');

    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', (e) => {
            const val = e.target.value;

            // লাইভ সিকিউরিটি রুলস চেকলিস্ট আপডেট
            updateSecurityChecklist(val, 'reset');

            if (val.length === 0) {
                if (strengthMeter) strengthMeter.style.width = '0%';
                if (strengthText) strengthText.innerText = '';
                return;
            }

            const result = checkPasswordStrength(val);
            if (strengthMeter) {
                strengthMeter.style.width = result.percent + '%';
                strengthMeter.style.backgroundColor = result.color;
            }

            if (strengthText) {
                strengthText.innerText = `পাসওয়ার্ডের মান: ${result.label}`;
                strengthText.style.color = result.color;
            }
        });
    }

    // পাসওয়ার্ড আপডেট ও সাইন-ইন পেজে রিডাইরেক্ট
    const newPasswordForm = document.getElementById('newPasswordForm');
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();

            if (newPassword !== confirmNewPassword) {
                return showNotification('পাসওয়ার্ড দুটি একে অপরের সাথে মিলছে না।', 'error');
            }

            // কঠোর পাসওয়ার্ড সিকিউরিটি যাচাই
            const securityCheck = validatePasswordSecurity(newPassword);
            if (!securityCheck.isValid) {
                return showNotification(securityCheck.msg, 'error');
            }

            showNotification('নিরাপত্তা যাচাই ও পাসওয়ার্ড আপডেট করা হচ্ছে...', 'success');

            // পূর্বের পাসওয়ার্ডের সাথে মেলানো (পূর্বের পাসওয়ার্ড পুনর্ব্যবহার রোধ)
            const { data: currentUserData } = await _supabase
                .from('User_Information')
                .select('password')
                .eq('email', emailParam)
                .single();

            if (currentUserData && currentUserData.password === newPassword) {
                return showNotification('নতুন পাসওয়ার্ডটি আপনার পূর্বের পাসওয়ার্ডের মতো হতে পারবে না। ভিন্ন পাসওয়ার্ড দিন।', 'error');
            }

            // Supabase Database-এ নতুন পাসওয়ার্ড আপডেট
            const { error } = await _supabase
                .from('User_Information')
                .update({ password: newPassword })
                .eq('email', emailParam);

            if (error) {
                showNotification('পাসওয়ার্ড আপডেট করতে ব্যর্থ: ' + error.message, 'error');
            } else {
                // ব্যবহৃত ওটিপি কোড ডিলিট করে রি-প্লে আক্রমণ রোধ
                await _supabase.from('Password_Resets').delete().eq('email', emailParam);

                // সক্রিয় লোকাল সেশন থাকলে তা আপডেট
                const rawSession = localStorage.getItem('loveweb_session');
                if (rawSession) {
                    try {
                        const parsed = JSON.parse(rawSession);
                        if (parsed && parsed.email === emailParam) {
                            parsed.password = newPassword;
                            localStorage.setItem('loveweb_session', JSON.stringify(parsed));
                        }
                    } catch (err) {}
                }

                // সেশন ও রিসেট স্টেট ক্লিয়ার
                sessionStorage.removeItem('reset_step');
                sessionStorage.removeItem('reset_verified_email');
                
                const hasActiveSession = !!localStorage.getItem('loveweb_session');
                if (hasActiveSession) {
                    showNotification('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! মূল পেজে নিয়ে যাওয়া হচ্ছে...', 'success');
                    setTimeout(() => { 
                        window.location.href = '../index.html'; 
                    }, 1500);
                } else {
                    showNotification('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! সাইন-ইন পেজে নিয়ে যাওয়া হচ্ছে...', 'success');
                    setTimeout(() => { 
                        window.location.href = '../sign-in/index.html'; 
                    }, 1500);
                }
            }
        });
    }
}
