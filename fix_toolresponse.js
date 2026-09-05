import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');
code = code.replace("session.send({ toolResponse: { functionResponses: responses } });", "session.sendToolResponse(responses);");
fs.writeFileSync('server.js', code);
