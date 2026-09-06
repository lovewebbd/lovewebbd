const fetch = require('node-fetch');
fetch('http://localhost:3000/api/orders/ongkur')
  .then(res => res.json())
  .then(console.log);
