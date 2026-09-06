const fs = require('fs');

let content = fs.readFileSync('demos/index.html', 'utf8');

// The incorrect replacements:
// 1.
//       if (filtered.length === 0) {
//        grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No demos found in this category.</p>';
//      } else if(demo.category === 'Friendship' || catName === 'Friendship') {
//            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png';
//          } else {
//        filtered.forEach(demo => {
content = content.replace(
  `} else if(demo.category === 'Friendship' || catName === 'Friendship') {\n            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png';\n          } else {\n        filtered.forEach(demo => {`,
  `} else {\n        filtered.forEach(demo => {`
);

// 2. 
//      if(type === 'desktop') {
//        document.getElementById('btnDesktop').classList.add('active');
//      } else if(demo.category === 'Friendship' || catName === 'Friendship') {
//            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png';
//          } else {
//        document.getElementById('btnMobile').classList.add('active');
//      }
content = content.replace(
  `} else if(demo.category === 'Friendship' || catName === 'Friendship') {\n            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png';\n          } else {\n        document.getElementById('btnMobile').classList.add('active');`,
  `} else {\n        document.getElementById('btnMobile').classList.add('active');`
);

fs.writeFileSync('demos/index.html', content);
