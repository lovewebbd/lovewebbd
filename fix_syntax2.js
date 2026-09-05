import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

// I notice another syntax error:
// tools: aiTools
//        + " You can place orders and check order status. Use tools when needed.",
//        tools: aiTools
const regex3 = /tools: aiTools\s*\+\s*" You can place orders and check order status. Use tools when needed.",\s*tools: aiTools/m;
const fix3 = `tools: aiTools`;

code = code.replace(regex3, fix3);

fs.writeFileSync('server.js', code);
console.log('Fixed syntax error 2');
