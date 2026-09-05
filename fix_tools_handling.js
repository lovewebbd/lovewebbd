import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

// The text chat block is around line 761.
// The voice chat block is around line 829.

// Replace text chat block manually
const textRegex = /if \(call\.name === 'check_order_status'\)[\s\S]*?result = \{ success: true, message: "Package selected on screen\." \};\s*\}/m;
code = code.replace(textRegex, `if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
       else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
       else if (call.name === 'navigate_to_page' || call.name === 'select_order_package') {
           result = { success: true, message: "Tell the user to click the link or select manually in text chat." };
       }`);

// Replace voice chat block
const voiceRegex = /if \(call\.name === 'check_order_status'\) result = await checkOrderStatus\(call\.args\);\s*else if \(call\.name === 'place_new_order'\) result = await placeNewOrder\(call\.args\);/m;
code = code.replace(voiceRegex, `if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
                else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
                else if (call.name === 'navigate_to_page') {
                    if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ client_command: { action: 'navigate', url: call.args.url } }));
                    result = { success: true, message: "Navigating user." };
                }
                else if (call.name === 'select_order_package') {
                    if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ client_command: { action: 'select_package', value: call.args.package } }));
                    result = { success: true, message: "Package selected on screen." };
                }`);

fs.writeFileSync('server.js', code);
console.log('Fixed tools handling');
