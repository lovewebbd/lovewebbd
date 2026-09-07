const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

// Update renderOrders to include data-label
html = html.replace('<td style="font-family: monospace;', '<td data-label="Order ID" style="font-family: monospace;');
html = html.replace('          <td>\n            <div style="font-weight: 600; font-size: 0.85rem;">${(()=>{', '          <td data-label="Date & Time">\n            <div style="font-weight: 600; font-size: 0.85rem;">${(()=>{');
html = html.replace('          <td>\n            <div style="font-weight: 600;">${o.username || \'\'}</div>', '          <td data-label="Customer">\n            <div style="font-weight: 600;">${o.username || \'\'}</div>');
html = html.replace('          <td>\n            <div style="font-weight: 600;">${o.package || \'\'}</div>', '          <td data-label="Package & Price">\n            <div style="font-weight: 600;">${o.package || \'\'}</div>');
html = html.replace('          <td><span class="badge ${payBadge}">${payText}</span></td>', '          <td data-label="Payment Status"><span class="badge ${payBadge}">${payText}</span></td>');
html = html.replace('          <td><span class="badge ${statusBadge}">${statusText}</span></td>', '          <td data-label="Order Status"><span class="badge ${statusBadge}">${statusText}</span></td>');
html = html.replace('          <td>\n            <button class="btn-action" style="background:var(--admin-primary);', '          <td data-label="Details">\n            <button class="btn-action" style="background:var(--admin-primary);');
html = html.replace('          <td>\n            <div class="action-btn-group">', '          <td data-label="Update Payment">\n            <div class="action-btn-group">');
html = html.replace('          <td>\n            <select class="action-select" onchange="updateOrder(event, \\\'${o.id}\\\', \\\'status\\\', this.value)">', '          <td data-label="Update Status">\n            <select class="action-select" onchange="updateOrder(event, \\\'${o.id}\\\', \\\'status\\\', this.value)">');

// Inject the CSS styles
const responsiveCss = `
    @media (max-width: 768px) {
      .table-wrapper table {
        border: 0;
      }
      .table-wrapper table thead {
        display: none;
      }
      .table-wrapper table tr {
        display: block;
        margin-bottom: 20px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--admin-border);
        border-radius: 12px;
        padding: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .table-wrapper table td {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding: 12px 5px;
        font-size: 0.85rem;
        text-align: right;
      }
      .table-wrapper table td:last-child {
        border-bottom: 0;
      }
      .table-wrapper table td::before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--admin-text-sub);
        text-transform: uppercase;
        font-size: 0.75rem;
        margin-right: 15px;
        text-align: left;
      }
      .action-select {
        width: 140px;
        text-align: right;
      }
      .action-btn-group {
        justify-content: flex-end;
      }
    }
`;

html = html.replace('</style>', responsiveCss + '\n  </style>');
fs.writeFileSync('admin/index.html', html);
