const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

html = html.replace(
  /function deleteDemoRow\(idx\) \{[\s\S]*?renderDemosAdmin\(\);\s*\}/,
  `function deleteDemoRow(idx) {
      if(confirm('Are you sure you want to remove this demo?')) {
        syncDemosFromDOM();
        currentDemos.splice(idx, 1);
        renderDemosAdmin();
        setTimeout(saveDemos, 100);
      }`
);

fs.writeFileSync('admin/index.html', html);
