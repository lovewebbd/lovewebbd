const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

c = c.replace(
  "pkgs[pkgName] = { \n      bnName: bnName || '',\n      icon: icon || '',\n      headColor: headColor || '',\n      base: Number(base),\n      advance: Number(advance),\n      order: Number(order) || 0,\n      original: Number(original), \n      features, \n      tooltip,\n      deliveryTime: Number(deliveryTime) || 7,\n      minPages: Number(minPages) || 3,\n      maxPages: Number(maxPages) || 4,\n      maxImagesPerDesc: maxImagesPerDesc !== undefined ? Number(maxImagesPerDesc) : 5,\n      maxTotalImages: maxTotalImages !== undefined ? Number(maxTotalImages) : 15\n    };",
  "pkgs[pkgName] = { \n      bnName: bnName || '',\n      icon: icon || '',\n      headColor: headColor || '',\n      base: Number(base) || 0,\n      advance: Number(advance) || 0,\n      order: Number(order) || 0,\n      original: Number(original) || 0, \n      features: features || [], \n      tooltip: tooltip || '',\n      deliveryTime: Number(deliveryTime) || 7,\n      minPages: Number(minPages) || 3,\n      maxPages: Number(maxPages) || 4,\n      maxImagesPerDesc: maxImagesPerDesc !== undefined ? Number(maxImagesPerDesc) : 5,\n      maxTotalImages: maxTotalImages !== undefined ? Number(maxTotalImages) : 15\n    };"
);

fs.writeFileSync('server.js', c);
