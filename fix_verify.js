import fs from 'fs';
let server = fs.readFileSync('server.js', 'utf8');

const target = `const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};`;

const replacement = `function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
}`;

if (server.includes('const verifyAdmin = (req, res, next) => {')) {
  server = server.replace(target, replacement);
  fs.writeFileSync('server.js', server);
  console.log('Patched via full replace');
} else if (server.includes('function verifyAdmin(req, res, next) {')) {
  console.log('Already patched');
} else {
  console.log('Could not find verifyAdmin');
}
