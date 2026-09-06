const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("admin/index.html", "utf8");

const virtualConsole = new (require("jsdom").VirtualConsole)();
virtualConsole.on("error", (e) => {
  console.log("Console Error:", e);
});
virtualConsole.on("jsdomError", (e) => {
  console.log("JSDOM Error:", e);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  virtualConsole,
  url: "http://localhost:3000/admin/"
});

setTimeout(() => {
  try {
     dom.window.updateStats([{
       status: 'ডেলিভারড',
       advancePaymentStatus: 'অপেক্ষমান'
     }]);
     console.log("updateStats ran successfully");
     dom.window.switchTab('deliveredOrder');
     console.log("switchTab ran successfully");
  } catch(e) {
     console.error("Test Error:", e);
  }
  console.log("Done");
}, 2000);
