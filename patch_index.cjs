const fs = require('fs');
let html = fs.readFileSync('demos/index.html', 'utf8');

const modalHtml = `
  <!-- Demo Iframe Modal -->
  <div id="demoModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:#181d28; z-index:9999999; flex-direction:column;">
    <div style="background: #181d28; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,42,109,0.3);">
      <h3 id="demoModalTitle" style="color: #fff; margin: 0; font-family: 'Hind Siliguri', sans-serif;">Demo View</h3>
      <button onclick="closeDemoModal()" style="background: #ff2a6d; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-xmark"></i> বন্ধ করুন
      </button>
    </div>
    <iframe id="demoIframe" style="flex:1; width:100%; border:none; background:#fff;" sandbox="allow-scripts allow-same-origin"></iframe>
  </div>
`;

if (!html.includes('id="demoModal"')) {
  html = html.replace('</body>', modalHtml + '\n</body>');
}

const oldOpenDemo = `function openDemo(id) {
      window.location.href = '/api/demo/view/' + id;
    }`;

const newOpenDemo = `function openDemo(id, name) {
      document.getElementById('demoModalTitle').innerText = name || 'Demo View';
      document.getElementById('demoIframe').src = '/api/demo/view/' + id;
      document.getElementById('demoModal').style.display = 'flex';
    }

    function closeDemoModal() {
      document.getElementById('demoModal').style.display = 'none';
      document.getElementById('demoIframe').src = '';
    }`;

if (html.includes(oldOpenDemo)) {
  html = html.replace(oldOpenDemo, newOpenDemo);
}

html = html.replace(/onclick="openDemo\('\$\{demo\.id\}'\)"/g, `onclick="openDemo('\\$\\{demo.id\\}', '\\$\\{demo.name.replace(/'/g, \\\\\\'')\\}')"`);

fs.writeFileSync('demos/index.html', html);
console.log('Successfully updated demos/index.html');
