const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

html = html.replace(
  '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; align-items: start;">',
  '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr)); gap: 20px; align-items: start;">'
);

html = html.replace(
  '<div class="settings-panel" style="display: flex; flex-direction: column; height: 100%; min-height: 600px;">',
  '<div class="settings-panel" style="display: flex; flex-direction: column; height: 100%; min-height: 600px; width: 100%; overflow: hidden;">'
);

html = html.replace(
  '<div style="flex: 1; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px dashed var(--admin-border); overflow: hidden; padding: 20px;">',
  '<div style="flex: 1; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px dashed var(--admin-border); overflow: hidden; padding: 20px; max-width: 100%;">'
);

fs.writeFileSync('admin/index.html', html);
