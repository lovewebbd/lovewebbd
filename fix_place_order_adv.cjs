const fs = require('fs');
let code = fs.readFileSync('place-order/index.html', 'utf8');

const oldUl = `<ul style="list-style: none; padding-left: 0; font-size: 0.9rem; color: var(--text-main); line-height: 1.6;">
            <li><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-pink); margin-right: 5px;"></i> রেগুলার প্যাকেজ: <strong>৳১৫০ অগ্রিম</strong></li>
            <li><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-pink); margin-right: 5px;"></i> এক্সক্লুসিভ প্যাকেজ: <strong>৳২০০ অগ্রিম</strong></li>
            <li><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-pink); margin-right: 5px;"></i> প্রিমিয়াম প্যাকেজ: <strong>৳৩০০ অগ্রিম</strong></li>
          </ul>`;

const newUl = `<ul id="dynamicAdvanceRules" style="list-style: none; padding-left: 0; font-size: 0.9rem; color: var(--text-main); line-height: 1.6;">
            <!-- Rendered via JS -->
          </ul>`;

code = code.replace(oldUl, newUl);

const renderOld = `      container.innerHTML = htmlContent;
    }`;

const renderNew = `      container.innerHTML = htmlContent;

      const rulesContainer = document.getElementById('dynamicAdvanceRules');
      if (rulesContainer) {
        let rulesHtml = '';
        for(const [pkgName, data] of Object.entries(p)) {
          let bn = data.bnName ? data.bnName : pkgName;
          let adv = data.advance !== undefined ? data.advance : 200;
          rulesHtml += \`<li><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-pink); margin-right: 5px;"></i> \${bn} প্যাকেজ: <strong>৳\${adv} অগ্রিম</strong></li>\`;
        }
        rulesContainer.innerHTML = rulesHtml;
      }
    }`;

code = code.replace(renderOld, renderNew);

fs.writeFileSync('place-order/index.html', code);
console.log('Fixed place order dynamic advance display');
