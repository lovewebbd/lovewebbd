import fs from 'fs';

let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add column header
html = html.replace(
  '<th>Order Status</th>',
  '<th>Order Status</th>\n                  <th>Details</th>'
);

// 2. Add column data
html = html.replace(
  '<td><span class="badge ${statusBadge}">${statusText}</span></td>',
  `<td><span class="badge \${statusBadge}">\${statusText}</span></td>
          <td>
            <button class="btn-action" style="background:var(--admin-primary); padding:4px 8px; font-size:0.75rem;" onclick="viewOrderDetails('\${o.id}')"><i class="fa-solid fa-file-lines"></i> Details</button>
          </td>`
);

// 3. Add modal HTML
const modalHtml = `
    <!-- Order Details Modal -->
    <div class="confirm-modal-overlay" id="orderDetailsModal">
      <div class="confirm-modal" style="max-width: 500px; text-align: left;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom: 1px solid var(--admin-border); padding-bottom:10px;">
          <h3 style="margin:0; font-size:1.1rem; color:var(--admin-primary);"><i class="fa-solid fa-file-invoice"></i> Order Details</h3>
          <button style="background:transparent; border:none; color:var(--admin-text-sub); font-size:1.2rem; cursor:pointer;" onclick="closeOrderDetailsModal()"><i class="fa-solid fa-times"></i></button>
        </div>
        <div id="orderDetailsContent" style="max-height: 60vh; overflow-y: auto; font-size: 0.9rem; line-height: 1.5; color: var(--admin-text-main);">
          <!-- Dynamic Content -->
        </div>
      </div>
    </div>
`;
html = html.replace('<!-- Customer Profile Modal -->', modalHtml + '\n    <!-- Customer Profile Modal -->');

// 4. Add JS functions
const jsFunctions = `
    function viewOrderDetails(id) {
      const order = allOrders.find(o => o.id === id);
      if(!order) return;
      
      let content = '';
      
      if(order.description) {
        content += \`<div style="margin-bottom:15px;"><strong>General Description:</strong><br><div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-top:5px; white-space:pre-wrap;">\${order.description}</div></div>\`;
      }
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
      
      if(!content) {
         content = '<em>No additional details provided.</em>';
      }
      
      document.getElementById('orderDetailsContent').innerHTML = content;
      document.getElementById('orderDetailsModal').style.display = 'flex';
    }
    
    function closeOrderDetailsModal() {
      document.getElementById('orderDetailsModal').style.display = 'none';
    }
`;
html = html.replace('function viewCustomerProfile(', jsFunctions + '\n    function viewCustomerProfile(');

fs.writeFileSync('admin/index.html', html);
console.log('admin/index.html updated successfully.');
