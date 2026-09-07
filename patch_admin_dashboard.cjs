const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add Rejected Orders to Dashboard HTML
if (!html.includes('id="statRejected"')) {
  html = html.replace(
    '<div class="stat-card">\n            <div class="stat-title">Half Payments</div>',
    '<div class="stat-card" style="cursor: pointer;" onclick="switchTab(\'allOrders\')">\n            <div class="stat-title">Rejected Orders</div>\n            <div class="stat-value" style="color: var(--admin-danger);" id="statRejected">0</div>\n          </div>\n          <div class="stat-card">\n            <div class="stat-title">Half Payments</div>'
  );
}

// 2. Fix Demo Edit & Delete losing data
html = html.replace(
  'function deleteDemoRow(idx) {',
  `function syncDemosFromDOM() {
      const container = document.getElementById('demosContainer');
      const boxes = container.querySelectorAll('.tier-box');
      const updatedDemos = [];
      boxes.forEach(box => {
        const name = box.querySelector('.demo-name').value;
        const url = box.querySelector('.demo-url').value;
        const category = box.querySelector('.demo-category').value;
        const id = box.querySelector('.demo-id').value;
        updatedDemos.push({ id, name, url, category });
      });
      currentDemos = updatedDemos;
    }
    
    function deleteDemoRow(idx) {`
);

html = html.replace(
  'currentDemos.splice(idx, 1);',
  'syncDemosFromDOM();\n        currentDemos.splice(idx, 1);'
);

html = html.replace(
  'function addDemoRow() {',
  'function addDemoRow() {\n      syncDemosFromDOM();'
);

// 3. Make demo delete auto-save
// Actually, let's just let them click "Save Demos". 

fs.writeFileSync('admin/index.html', html);
