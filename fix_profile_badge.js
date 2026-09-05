import fs from 'fs';
let code = fs.readFileSync('profile/index.html', 'utf8');

const regexPremium = /if\(avatarWrap\) avatarWrap\.classList\.add\('premium-frame'\);/g;
code = code.replace(regexPremium, `if(avatarWrap) {
                    avatarWrap.classList.add('premium-frame');
                    if (!avatarWrap.querySelector('.premium-crown')) {
                      avatarWrap.insertAdjacentHTML('beforeend', '<div class="premium-crown"><i class="fa-solid fa-crown"></i></div><div class="premium-tag">PREMIUM</div>');
                    }
                  }`);

const regexElite = /if\(avatarWrap\) avatarWrap\.classList\.add\('elite-frame'\);/g;
code = code.replace(regexElite, `if(avatarWrap) {
                    avatarWrap.classList.add('elite-frame');
                    if (!avatarWrap.querySelector('.elite-crown')) {
                      avatarWrap.insertAdjacentHTML('beforeend', '<div class="elite-crown"><i class="fa-solid fa-gem"></i></div><div class="elite-tag">ELITE</div>');
                    }
                  }`);

fs.writeFileSync('profile/index.html', code);
console.log('Fixed profile DOM injection.');
