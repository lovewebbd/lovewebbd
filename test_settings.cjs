const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/settings',
  method: 'GET'
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
});
req.end();
