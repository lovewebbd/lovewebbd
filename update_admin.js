import fs from 'fs';
let html = fs.readFileSync('admin/index.html', 'utf8');

const jsFunctions = `
    function viewOrderDetails(id) {
      const order = allOrders.find(o => o.id === id);
      if(!order) return;
      
      let content = '';
      
      if(order.description) {
        content += \`<div style="margin-bottom:15px;"><strong>General Description:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${order.description}</div></div>\`;
      }
      
      if (order.pages && Array.isArray(order.pages)) {
         order.pages.forEach((pageDesc, idx) => {
            if(pageDesc) {
               content += \`<div style="margin-bottom:15px;"><strong>Page \${idx + 1} Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${pageDesc}</div></div>\`;
            }
         });
      } else {
         // Fallback for old orders
         if(order.page1Desc) {
           content += \`<div style="margin-bottom:15px;"><strong>Page 1 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${order.page1Desc}</div></div>\`;
         }
         if(order.page2Desc) {
           content += \`<div style="margin-bottom:15px;"><strong>Page 2 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${order.page2Desc}</div></div>\`;
         }
         if(order.page3Desc) {
           content += \`<div style="margin-bottom:15px;"><strong>Page 3 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${order.page3Desc}</div></div>\`;
         }
         if(order.page4Desc) {
           content += \`<div style="margin-bottom:15px;"><strong>Page 4 Details:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${order.page4Desc}</div></div>\`;
         }
      }
      
      if(!content) {
         content = '<em>No additional details provided.</em>';
      }
      
      document.getElementById('orderDetailsContent').innerHTML = content;
      document.getElementById('orderDetailsModal').style.display = 'flex';
    }
`;

const oldJS = /function viewOrderDetails\(id\) \{[\s\S]*?document\.getElementById\('orderDetailsModal'\)\.style\.display = 'flex';\n    \}/;
html = html.replace(oldJS, jsFunctions);

fs.writeFileSync('admin/index.html', html);
console.log('admin/index.html updated successfully.');
