import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

const newTools = `,
  {
    type: "function",
    name: "navigate_to_page",
    description: "Navigates the user's browser to a specific page (e.g., /place-order/, /profile/).",
    parameters: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"]
    }
  },
  {
    type: "function",
    name: "select_order_package",
    description: "Selects a specific package on the place order page (Regular, Exclusive, Premium).",
    parameters: {
      type: "object",
      properties: { package: { type: "string" } },
      required: ["package"]
    }
  }
];`;

code = code.replace(/\];\s*\n*const checkOrderStatus/m, newTools + "\n\nconst checkOrderStatus");

const wsToolHandling = `if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
              else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
              else if (call.name === 'navigate_to_page') {
                  if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ client_command: { action: 'navigate', url: call.args.url } }));
                  result = { success: true, message: "Navigating user." };
              }
              else if (call.name === 'select_order_package') {
                  if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ client_command: { action: 'select_package', value: call.args.package } }));
                  result = { success: true, message: "Package selected on screen." };
              }`;

code = code.replace(/if \(call\.name === 'check_order_status'\) result = await checkOrderStatus\(call\.args\);\s*else if \(call\.name === 'place_new_order'\) result = await placeNewOrder\(call\.args\);/m, wsToolHandling);

// Update text chat tool handling as well to ignore or handle gracefully
const textToolHandling = `if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
       else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
       else if (call.name === 'navigate_to_page' || call.name === 'select_order_package') {
           result = { success: true, message: "Tell the user to click the link or select manually in text chat." };
       }`;
code = code.replace(/if \(call\.name === 'check_order_status'\) result = await checkOrderStatus\(call\.args\);\s*else if \(call\.name === 'place_new_order'\) result = await placeNewOrder\(call\.args\);/m, textToolHandling);


fs.writeFileSync('server.js', code);
console.log('Tools updated');
