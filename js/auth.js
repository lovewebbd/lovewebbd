// Supabase Credentials
const SUPABASE_URL = "https://xotiwgyalsnqpzbvodmd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdGl3Z3lhbHNucXB6YnZvZG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTY2NDMsImV4cCI6MjEwMzkzMjY0M30.RoSQVbj0ZSPKlLEnD8MP5ECjDUUg0yNkJF2B6QHc-x8";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// পাসওয়ার্ডের মান নির্দেশক
function checkPasswordStrength(pwd) {
    let score = 0;

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 11) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

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

        if (val.length === 0) {
            if (strengthMeter) strengthMeter.style.width = '0%';
            if (strengthText) strengthText.innerText = '';
            return;
        }

        if (val.length < 8) {
            showNotification('পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।', 'error');
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

        if (password.length < 8) {
            showNotification('পাসওয়ার্ড বাধ্যতামূলকভাবে অন্তত ৮ অক্ষরের হতে হবে।', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('প্রদত্ত পাসওয়ার্ড দুটি একে অপরের সাথে মিলছে না।', 'error');
            return;
        }

        const pwdStrength = checkPasswordStrength(password);
        if (pwdStrength.isWeak) {
            showNotification('দুর্বল পাসওয়ার্ড গ্রহণযোগ্য নয়। সংখ্যা ও বিশেষ চিহ্ন যোগ করুন।', 'error');
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

        const { data, error } = await _supabase
            .from('User_Information')
            .insert([
                { full_name: fullName, username: username, email: email, phone: phone, password: password }
            ])
            .select();

        if (error) {
            showNotification("নিবন্ধন ব্যর্থ হয়েছে: " + error.message, "error");
        } else {
            showNotification("অ্যাকেউন্ট সফলভাবে তৈরি হয়েছে!", "success");
            localStorage.setItem('loveweb_session', JSON.stringify(data[0]));
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1200);
        }
    });
}

// সাইন-ইন ফর্ম সাবমিট
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const identifier = document.getElementById('signInIdentifier').value.trim();
        const password = document.getElementById('signInPassword').value.trim();

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
            showNotification("আপনার প্রদানকৃত পাসওয়ার্ডটি সঠিক নয়।", "error");
        } else {
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

        const emailValidation = checkAllowedEmail(emailValue);
        if (!emailValidation.isValid) return showNotification(emailValidation.msg, 'error');

        showNotification('অ্যাকাউন্ট অনুসন্ধান করা হচ্ছে...', 'success');
        const exists = await checkEmailExists(emailValue);

        if (!exists) {
            return showNotification('আপনার এই ইমেইলে কোনো অ্যাকাউন্ট নিবন্ধিত নেই।', 'error');
        }

        // ২০ মিনিট রিসেন্ড চেক
        const lastSentTime = localStorage.getItem(`otp_sent_time_${emailValue}`);
        if (lastSentTime) {
            const timeDiff = (Date.now() - parseInt(lastSentTime)) / (1000 * 60);
            if (timeDiff < 20) {
                const waitTime = Math.ceil(20 - timeDiff);
                return showNotification(`অনুরোধ ব্যর্থ হয়েছে! অনুগ্রহ করে ${waitTime} মিনিট পর পুনরায় চেষ্টা করুন।`, 'error');
            }
        }

        // ৬ ডিজিট OTP জেনারেট এবং ১০ মিনিটের মেয়াদ নির্ধারণ
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const now = Date.now();
        const expiresAt = new Date(now + 10 * 60 * 1000).toISOString(); // ১০ মিনিট

        const { error } = await _supabase
            .from('Password_Resets')
            .insert([{ email: emailValue, otp_code: generatedOTP, expires_at: expiresAt }]);

        if (error) {
            return showNotification('কোড পাঠাতে সমস্যা হয়েছে: ' + error.message, 'error');
        }

        localStorage.setItem(`otp_sent_time_${emailValue}`, now.toString());
        localStorage.setItem(`otp_expiry_time_${emailValue}`, (now + 10 * 60 * 1000).toString());
        sessionStorage.setItem('reset_verified_email', emailValue);
        sessionStorage.setItem('reset_step', 'verification');

        showNotification('ভেরিফিকেশন কোড পাঠানো হয়েছে! (১০ মিনিট মেয়াদ)', 'success');
        setTimeout(() => {
            window.location.href = `verification.html?email=${encodeURIComponent(emailValue)}`;
        }, 1200);
    });
}

// ২. ভেরিফিকেশন পেজ (reset-password/verification.html)
if (window.location.pathname.includes('verification.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const referrer = document.referrer.toLowerCase();
    const currentStep = sessionStorage.getItem('reset_step');

    const isValidReferrer = referrer.includes('reset-password/index.html') || referrer.includes('reset-password/') || referrer.includes('settings/');

    if (!emailParam || !isValidReferrer || currentStep !== 'verification') {
        showNotification('অবৈধ প্রবেশ চেষ্টা! সঠিক উপায়ে চেষ্টা করুন।', 'error');
        setTimeout(() => { window.location.href = '../sign-in/index.html'; }, 1500);
    }

    // --- লাইভ ১০ মিনিট এক্সপায়ারি এবং ২০ মিনিট রিসেন্ড টাইমার লজিক ---
    let expiryInterval, resendInterval;

    function startLiveTimers() {
        const otpExpiryEl = document.getElementById('otpExpiryTimer');
        const resendCountdownEl = document.getElementById('resendCountdown');
        const resendTimerText = document.getElementById('resendTimerText');
        const btnResendCode = document.getElementById('btnResendCode');
        const btnSubmitOtp = document.getElementById('btnSubmitOtp');

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

        // ২. ২০ মিনিটের লাইভ রিসেন্ড লক টাইমার
        clearInterval(resendInterval);
        resendInterval = setInterval(() => {
            const now = Date.now();
            const resendMs = (sentTimestamp + 20 * 60 * 1000) - now; // ২০ মিনিট

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

    startLiveTimers();

    const otpInputs = document.querySelectorAll('.otp-input');
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
            let enteredCode = '';
            otpInputs.forEach(input => enteredCode += input.value);

            if (enteredCode.length !== 6) return showNotification('৬ ডিজিটের পুরো কোডটি দিন।', 'error');

            showNotification('কোড যাচাই করা হচ্ছে...', 'success');

            const { data, error } = await _supabase
                .from('Password_Resets')
                .select('*')
                .eq('email', emailParam)
                .eq('otp_code', enteredCode)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error || !data || data.length === 0) {
                return showNotification('ভুল ভেরিফিকেশন কোড প্রদান করা হয়েছে।', 'error');
            }

            const record = data[0];
            if (new Date() > new Date(record.expires_at)) {
                return showNotification('ভেরিফিকেশন কোডের মেয়াদ (১০ মিনিট) শেষ হয়ে গেছে।', 'error');
            }

            sessionStorage.setItem('reset_step', 'new_password');
            showNotification('কোড সঠিকভাবে যাচাই করা হয়েছে!', 'success');
            setTimeout(() => {
                window.location.href = `new-password.html?email=${encodeURIComponent(emailParam)}`;
            }, 1000);
        });
    }

    // রিসেন্ড কোড বাটন
    const btnResendCode = document.getElementById('btnResendCode');
    if (btnResendCode) {
        btnResendCode.addEventListener('click', async () => {
            const now = Date.now();
            const lastSentTime = localStorage.getItem(`otp_sent_time_${emailParam}`);
            
            if (lastSentTime) {
                const timeDiff = (now - parseInt(lastSentTime)) / (1000 * 60);
                if (timeDiff < 20) {
                    const waitTime = Math.ceil(20 - timeDiff);
                    return showNotification(`পুনরায় কোড পাঠাতে আরও ${waitTime} মিনিট অপেক্ষা করুন।`, 'error');
                }
            }

            const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(now + 10 * 60 * 1000).toISOString();

            await _supabase.from('Password_Resets').insert([{ email: emailParam, otp_code: generatedOTP, expires_at: expiresAt }]);
            
            localStorage.setItem(`otp_sent_time_${emailParam}`, now.toString());
            localStorage.setItem(`otp_expiry_time_${emailParam}`, (now + 10 * 60 * 1000).toString());

            const btnSubmitOtp = document.getElementById('btnSubmitOtp');
            if (btnSubmitOtp) btnSubmitOtp.disabled = false;

            startLiveTimers();
            showNotification('নতুন ভেরিফিকেশন কোড পাঠানো হয়েছে।', 'success');
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

    const newPasswordForm = document.getElementById('newPasswordForm');
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();

            if (newPassword.length < 8) return showNotification('পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।', 'error');
            if (newPassword !== confirmNewPassword) return showNotification('পাসওয়ার্ড দুটি মিলছে না।', 'error');

            const pwdStrength = checkPasswordStrength(newPassword);
            if (pwdStrength.isWeak) return showNotification('দুর্বল পাসওয়ার্ড গ্রহণযোগ্য নয়।', 'error');

            showNotification('পাসওয়ার্ড আপডেট করা হচ্ছে...', 'success');

            const { error } = await _supabase
                .from('User_Information')
                .update({ password: newPassword })
                .eq('email', emailParam);

            if (error) {
                showNotification('পাসওয়ার্ড আপডেট করতে ব্যর্থ: ' + error.message, 'error');
            } else {
                sessionStorage.removeItem('reset_step');
                sessionStorage.removeItem('reset_verified_email');
                showNotification('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! লগইন করুন।', 'success');
                setTimeout(() => { window.location.href = '../sign-in/index.html'; }, 1500);
            }
        });
    }
}
