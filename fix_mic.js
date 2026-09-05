import fs from 'fs';
let html = fs.readFileSync('help/index.html', 'utf8');

html = html.replace(/} catch \(err\) {[\s\S]*?alert\("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে।"\);[\s\S]*?}/, `} catch (err) {
          console.error(err);
          btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
          status.innerText = "মাইক্রোফোন পারমিশন দেওয়া হয়নি";
          status.style.color = "#ff2a6d";
          status.classList.add('visible');
          
          if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
             alert("দয়া করে আপনার ব্রাউজারের মাইক্রোফোন পারমিশন Allow করুন।");
          } else {
             alert("মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে। " + err.message);
          }
       }`);

fs.writeFileSync('help/index.html', html);
console.log('Fixed mic error handling');
