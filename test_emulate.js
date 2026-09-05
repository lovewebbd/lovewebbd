import fs from 'fs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const code = fs.readFileSync('js/messenger.js', 'utf8');

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

// Mock globals needed by messenger.js
window.AudioContext = class {};
window.webkitAudioContext = class {};
window.navigator.mediaDevices = { getUserMedia: async () => ({}) };

// Try evaluating
try {
  const scriptEl = document.createElement('script');
  scriptEl.textContent = code;
  document.body.appendChild(scriptEl);
} catch (e) {
  console.error("Eval error:", e);
}

setTimeout(() => {
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  console.log("FAB exists:", !!fab);
  console.log("Panel exists:", !!panel);
  if (fab) {
    fab.click();
    console.log("Panel classes after click:", panel.className);
  }
}, 500);
