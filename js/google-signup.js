import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseDB = (() => {
    async function runQuery(payload) {
        try {
            const res = await fetch('/api/db-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch (err) {
            return { data: null, error: err.message };
        }
    }
    return {
        from: (table) => ({
            select: () => {
                const query = { action: 'select', table, filters: [], single: false };
                const builder = {
                    eq: (col, val) => { query.filters.push({ type: 'eq', col, val }); return builder; },
                    single: () => { query.single = true; return builder; },
                    then: (res) => runQuery(query).then(r => {
                        if (query.single) return res({ data: (r.data && r.data[0]) || null, error: r.error });
                        return res(r);
                    })
                };
                return builder;
            },
            insert: (arr) => {
                const query = { action: 'insert', table, data: arr };
                const builder = {
                    select: () => builder,
                    then: (res) => runQuery(query).then(res)
                };
                return builder;
            }
        })
    };
})();

document.addEventListener('DOMContentLoaded', async () => {
    const notifEl = document.getElementById('notification');
    const notifMsg = document.getElementById('notifMessage');

    function showNotification(msg, type = 'info') {
        if (!notifEl) return alert(msg);
        notifEl.className = 'notification-toast show ' + type;
        notifMsg.textContent = msg;
        setTimeout(() => {
            notifEl.classList.remove('show');
        }, 4000);
    }
    
    // Check pending session
    const pendingDataStr = sessionStorage.getItem('pendingGoogleSignUp');
    if (!pendingDataStr) {
        // Not accessed properly
        window.location.href = '../sign-in/index.html';
        return;
    }
    
    const pendingData = JSON.parse(pendingDataStr);
    
    // Populate form
    document.getElementById('googleFullName').value = pendingData.fullName || '';
    document.getElementById('googleEmail').value = pendingData.email || '';
    document.getElementById('googlePhone').value = pendingData.phone || '';
    
    // Generate default username
    let defaultUsername = pendingData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    defaultUsername += Math.floor(Math.random() * 1000);
    document.getElementById('googleUsername').value = defaultUsername;
    
    document.getElementById('cancelGoogleSignUp').addEventListener('click', async () => {
        sessionStorage.removeItem('pendingGoogleSignUp');
        window.location.href = '../sign-in/index.html';
    });
    
    document.getElementById('googleCompleteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('googleUsername').value.trim();
        const phone = document.getElementById('googlePhone').value.trim();
        
        if (username.length < 6) {
            showNotification('ইউজারনেম অন্তত ৬ অক্ষরের হওয়া আবশ্যক।', 'error');
            return;
        }
        
        if (phone && (!phone.startsWith('01') || phone.length !== 11)) {
            showNotification('সঠিক ফোন নম্বর প্রদান করুন (01XXXXXXXXX)।', 'error');
            return;
        }
        
        showNotification('অ্যাকাউন্ট তৈরি হচ্ছে...', 'info');
        
        // Check if username exists
        const userCheck = await firebaseDB
            .from('User_Information')
            .select()
            .eq('username', username)
            .single()
            .then();
            
        if (userCheck.data) {
            showNotification('এই ইউজারনেমটি আগে থেকেই ব্যবহৃত হচ্ছে। অন্য একটি চেষ্টা করুন।', 'error');
            return;
        }
        
        const createdAt = new Date().toISOString();
        
        const insertRes = await firebaseDB
            .from('User_Information')
            .insert([
                { 
                    full_name: pendingData.fullName, 
                    username: username, 
                    email: pendingData.email, 
                    phone: phone, 
                    password: window.LoveWebCrypto.encrypt(pendingData.uid), // Dummy encrypted pwd
                    created_at: createdAt 
                }
            ])
            .select()
            .then();
            
        if (insertRes.error) {
            showNotification("নিবন্ধন ব্যর্থ হয়েছে: " + insertRes.error.message, "error");
            return;
        }
        
        const newUser = insertRes.data[0];
        newUser.created_at = createdAt;
        
        localStorage.setItem('userEmail', newUser.email);
        localStorage.setItem('userFullName', newUser.full_name);
        localStorage.setItem('userPhone', newUser.phone || "");
        localStorage.setItem('userUsername', newUser.username);
        
        sessionStorage.removeItem('pendingGoogleSignUp');
        
        showNotification('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
        
        setTimeout(() => {
            const storedRedirect = localStorage.getItem('redirectAfterLogin');
            if (storedRedirect) {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = storedRedirect;
            } else {
                window.location.href = '../dashboard/index.html';
            }
        }, 1500);
    });
});
