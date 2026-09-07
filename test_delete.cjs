const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/packages/delete/' + encodeURIComponent('Basic'),
  method: 'POST',
  headers: {
    'Authorization': 'Bearer loveweb-super-secret-key-12345'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(res.statusCode, data));
});
req.end();
