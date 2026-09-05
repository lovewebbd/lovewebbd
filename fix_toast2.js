import fs from 'fs';
let html = fs.readFileSync('place-order/index.html', 'utf8');

// 1. Remove the injected CSS
const cssRegex = /\/\* Toast Notifications \*\/[\s\S]*?\.toast-title \{[\s\S]*?\}/;
html = html.replace(cssRegex, '');

// 2. Replace the HTML container
html = html.replace('<div class="order-toast-container" id="orderToastContainer"></div>', `<div id="notification" class="notification-toast">
        <span id="notifMessage"></span>
    </div>`);

// 3. Replace the JS
const jsRegex = /\/\/ Toast Notification Logic[\s\S]*?\}, 3500\);\s*\}/;
const newJs = `// Toast Notification Logic
    let notifTimeout;
    function showToast(msg, type = 'error') {
      const notification = document.getElementById('notification');
      const notifMessage = document.getElementById('notifMessage');
      if (!notification) return;
      if (notifMessage) notifMessage.innerText = msg;
      
      notification.className = \`notification-toast show \${type}\`;
      
      clearTimeout(notifTimeout);
      notifTimeout = setTimeout(() => {
          notification.classList.remove('show');
      }, 3200);
    }`;
html = html.replace(jsRegex, newJs);

fs.writeFileSync('place-order/index.html', html);
console.log('Fixed toast to match login page');
