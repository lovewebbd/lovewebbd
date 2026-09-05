import fs from 'fs';

// Since the user asked to hide the chat icon (presumably the messenger widget) for admin or everywhere
// We will just hide the entire widget button via CSS or modify the init function

let code = fs.readFileSync('js/messenger.js', 'utf8');

// The widget is added in init function
// We can check if the user is lovewebbd@gmail.com and just not render it, or hide it
code = code.replace(
  /const btn = document\.createElement\('button'\);/,
  `// Hide widget if admin
    let userStr = localStorage.getItem('loveweb_session');
    let isAdmin = false;
    if(userStr) {
      try { isAdmin = JSON.parse(userStr).email === 'lovewebbd@gmail.com'; } catch(e){}
    }
    const btn = document.createElement('button');
    if(isAdmin) {
       // Hide for admin panel/admin user
       return;
    }`
);

fs.writeFileSync('js/messenger.js', code);
console.log('Fixed messenger visibility for admin');
