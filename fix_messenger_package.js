import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const regex = /if \(window\.location\.pathname\.includes\('place-order'\)\) \{[\s\S]*?\} else \{/m;
const newLogic = `if (window.location.pathname.includes('place-order')) {
                        const cards = document.querySelectorAll('.package-card');
                        cards.forEach(card => {
                            if (card.innerHTML.includes(pkg) && typeof selectPackage === 'function') {
                                selectPackage(card, pkg);
                                voiceTranscript.innerText = pkg + " প্যাকেজ সিলেক্ট করা হয়েছে";
                            }
                        });
                     } else {`;
                     
code = code.replace(regex, newLogic);
fs.writeFileSync('js/messenger.js', code);
console.log('Fixed messenger package logic');
