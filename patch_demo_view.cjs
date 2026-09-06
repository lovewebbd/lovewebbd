const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldScript = `          const protectionScript = \`<script>
            document.addEventListener('contextmenu', event => event.preventDefault());
            document.addEventListener('selectstart', event => event.preventDefault());
            document.addEventListener('dragstart', event => event.preventDefault());
            document.addEventListener('keydown', (e) => {
              if(e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) e.preventDefault();
              if(e.key === 'F12') e.preventDefault();
            });
          </script>\`;
          html = html.replace('</body>', protectionScript + '</body>');`;

const newScript = `          const protectionScript = \`<script>
            document.addEventListener('contextmenu', event => event.preventDefault());
            document.addEventListener('selectstart', event => event.preventDefault());
            document.addEventListener('dragstart', event => event.preventDefault());
            document.addEventListener('keydown', (e) => {
              if(e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) e.preventDefault();
              if(e.key === 'F12') e.preventDefault();
            });
            // Disable all links and buttons so user doesn't leave the demo
            document.addEventListener('click', (e) => {
              const link = e.target.closest('a');
              if (link) {
                e.preventDefault();
              }
            });
          </script>\`;
          const backBtn = \`<div style="position:fixed; top:20px; left:20px; z-index:999999999;">
            <button onclick="window.location.href='/demos/index.html'" style="background: #ff2a6d; color: #fff; border: none; padding: 10px 20px; border-radius: 50px; font-weight: bold; font-family: sans-serif; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 42, 109, 0.4); display: flex; align-items: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
              ফিরে যান
            </button>
          </div>\`;
          html = html.replace('</body>', backBtn + protectionScript + '</body>');`;

if (code.includes(oldScript)) {
  code = code.replace(oldScript, newScript);
  fs.writeFileSync('server.js', code);
  console.log('Successfully patched demo view');
} else {
  console.log('Could not find oldScript in server.js');
}
