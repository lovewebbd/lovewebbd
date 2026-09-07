const http = require('http');
const data = JSON.stringify({
  bkashNumber: '01711111111',
  nagadNumber: '01811111111'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/settings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer loveweb-super-secret-key-12345',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let resData = '';
  res.on('data', d => resData += d);
  res.on('end', () => console.log(resData));
});
req.write(data);
req.end();
