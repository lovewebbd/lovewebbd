const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

const oldDelete = `async function deletePackage(pkgName) {
      if(!confirm('Are you sure you want to delete the ' + pkgName + ' package?')) return;
      try {
        const res = await fetch('/api/admin/packages/delete/' + encodeURIComponent(pkgName), {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });`;

const newDelete = `async function deletePackage(pkgName) {
      if(!confirm('Are you sure you want to delete the ' + pkgName + ' package?')) return;
      try {
        const token = window.adminToken || localStorage.getItem('loveweb_admin_token');
        const res = await fetch('/api/admin/packages/delete/' + encodeURIComponent(pkgName), {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });`;

html = html.replace(oldDelete, newDelete);
fs.writeFileSync('admin/index.html', html);
console.log('Fixed deletePackage token scope');
