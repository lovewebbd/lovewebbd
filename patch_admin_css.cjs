const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

if (!html.includes('.table-container {')) {
  html = html.replace('</style>', `
    .table-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 15px;
      border-radius: 8px;
      border: 1px solid var(--admin-border);
    }
    .data-table {
      width: 100%;
      min-width: 600px;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th, .data-table td {
      padding: 12px 15px;
      border-bottom: 1px solid var(--admin-border);
      color: var(--admin-text);
    }
    .data-table th {
      background: rgba(0,0,0,0.2);
      font-weight: 600;
    }
    .data-table tbody tr:hover {
      background-color: rgba(59, 130, 246, 0.05);
    }
</style>`);
}

fs.writeFileSync('admin/index.html', html);
