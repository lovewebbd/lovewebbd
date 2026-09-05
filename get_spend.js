// A quick script to verify why localstorage parsing might fail in JS
// It's likely the order keys are wrong for your specific user. 
// We will look at profile/index.html to see how it calculates 1298 taka.
let profileCode = require('fs').readFileSync('profile/index.html', 'utf8');
let match = profileCode.match(/const rawOrders = (.*?);/);
console.log("Profile gets orders using:", match ? match[1] : "not found");
