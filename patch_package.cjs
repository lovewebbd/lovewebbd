const fs = require('fs');
let c = fs.readFileSync('admin/index.html', 'utf8');

c = c.replace(
  "if(res.ok) showToast(pkgName + ' package updated!');",
  "if(res.ok) {\n              showToast(pkgName + ' package updated!');\n              adminPackagesConfig[pkgName] = payload;\n            }"
);

fs.writeFileSync('admin/index.html', c);
