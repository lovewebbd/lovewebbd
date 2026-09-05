import fs from 'fs';
let html = fs.readFileSync('place-order/index.html', 'utf8');

html = html.replace(`body: JSON.stringify({
            username: sessionUsername,
            phone: sessionPhone,
            websiteType: type,
            packageType: pkg,
            description,
            contactPhone,
            advancePaymentPhone
          })`, `body: JSON.stringify({
            username: sessionUsername,
            phone: sessionPhone,
            websiteType: type,
            packageType: pkg,
            description,
            pages,
            contactPhone,
            advancePaymentPhone
          })`);

fs.writeFileSync('place-order/index.html', html);
console.log('Fixed payload');
