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
console.log("JSDOM Loaded");
setTimeout(() => console.log("Done"), 2000);
