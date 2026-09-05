import fs from 'fs';

let html = fs.readFileSync('place-order/index.html', 'utf8');

// 1. Replace CSS
const oldCssRegex = /\/\* Dynamic Order Notifications \*\/[\s\S]*?\.toast-time \{[\s\S]*?\}/;
const newCss = `/* Toast Notifications */
    .order-toast-container {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      width: 90%;
      max-width: 400px;
    }
    .order-toast {
      background: var(--admin-card);
      border-left: 4px solid var(--primary-pink);
      border-radius: 8px;
      padding: 12px 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    .order-toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    .order-toast.error { border-left-color: #ef4444; }
    .order-toast.success { border-left-color: #22c55e; }
    .order-toast.info { border-left-color: #3b82f6; }
    
    .toast-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .toast-icon.error { color: #ef4444; background: rgba(239,68,68,0.1); }
    .toast-icon.success { color: #22c55e; background: rgba(34,197,94,0.1); }
    .toast-icon.info { color: #3b82f6; background: rgba(59,130,246,0.1); }
    
    .toast-content {
      display: flex;
      flex-direction: column;
    }
    .toast-title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-main);
      margin-bottom: 0;
      line-height: 1.4;
    }`;
html = html.replace(oldCssRegex, newCss);

// 2. Replace JS Logic
const oldJsRegex = /\/\/ Dynamic Notifications Logic[\s\S]*?\/\/ Start dynamic notifications\s*startDynamicNotifications\(\);/m;
const newJs = `// Toast Notification Logic
    function showToast(message, type = 'error') {
      const container = document.getElementById('orderToastContainer');
      const toast = document.createElement('div');
      toast.className = \`order-toast \${type}\`;
      
      let icon = 'fa-circle-exclamation';
      if (type === 'success') icon = 'fa-circle-check';
      if (type === 'info') icon = 'fa-circle-info';

      toast.innerHTML = \`
        <div class="toast-icon \${type}">
          <i class="fa-solid \${icon}"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">\${message}</div>
        </div>
      \`;
      
      container.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      // Remove after some time
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }`;

// Replace the old JS block. Wait, the old JS block might not match exactly because of the `document.addEventListener` wrapping.
// Let's replace the whole chunk from `// Dynamic Notifications Logic` to `startDynamicNotifications();`
// We'll use a string replacement to be safer.

// Find the start and end of the block to replace
const jsStartIndex = html.indexOf('// Dynamic Notifications Logic');
const jsEndIndex = html.indexOf('startDynamicNotifications();') + 'startDynamicNotifications();'.length;

if (jsStartIndex !== -1 && jsEndIndex !== -1) {
  html = html.substring(0, jsStartIndex) + newJs + html.substring(jsEndIndex);
}

// 3. Replace all alert() with showToast()
// alert('Hello'); -> showToast('Hello', 'error');
html = html.replace(/alert\((['"`].*?['"`])\)/g, "showToast($1, 'error')");
html = html.replace(/alert\((.*?)\)/g, "showToast($1, 'error')"); // Catch remaining

fs.writeFileSync('place-order/index.html', html);
console.log('place-order/index.html updated successfully.');
