const fs = require('fs');
const DB_FILE = 'database.json';

function getDB() {
  if (!fs.existsSync(DB_FILE)) return { orders: {}, settings: {}, coupons: {} };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const db = getDB();
if (!db.coupons) db.coupons = {};
db.coupons['TEST10'] = {
  code: 'TEST10',
  discountPercent: 10,
  maxUsesPerUser: 99,
  expiryDate: '2027-01-01'
};
saveDB(db);
console.log('Added coupon TEST10 directly to JSON db');
