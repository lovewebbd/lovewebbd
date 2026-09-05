import fs from 'fs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const code = fs.readFileSync('js/messenger.js', 'utf8');

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
dom.window.eval(code);

setTimeout(() => {
  const fab = dom.window.document.getElementById('chatFab');
  const panel = dom.window.document.getElementById('chatPanel');
  console.log('FAB exists:', !!fab);
  console.log('Panel exists:', !!panel);
  console.log('Panel classes before click:', panel.className);
  
  // click it
  if (fab) fab.click();
  
  console.log('Panel classes after click:', panel.className);
}, 100);
