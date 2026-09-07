const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
  "couponCode: couponDiscountPercent > 0 ? couponCode : null,",
  "couponCode: couponDiscountPercent > 0 ? couponCode : null,\n      paymentScreenshot,"
);

fs.writeFileSync('server.js', server);
