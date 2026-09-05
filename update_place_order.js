import fs from 'fs';

let html = fs.readFileSync('place-order/index.html', 'utf8');

// Replace the step 2 UI
const step2UI = `
      <div id="step2" style="display:none;">
        <h3 style="margin-bottom:15px; color:var(--primary-pink);"><i class="fa-solid fa-file-lines"></i> ওয়েবসাইটের বিস্তারিত বিবরণ</h3>
        
        <div style="background: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #8b5cf6; margin-bottom: 20px;">
          <h4 style="color: #8b5cf6; margin-bottom: 10px; font-size: 1rem;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI দিয়ে বিবরণ জেনারেট করুন</h4>
          <p style="font-size:0.85rem; color:var(--text-sub); margin-bottom:10px;">আপনার ওয়েবসাইটের আইডিয়া সংক্ষেপে লিখুন। আমাদের AI স্বয়ংক্রিয়ভাবে আপনার প্যাকেজ অনুযায়ী পেজগুলোর সুন্দর বিবরণ তৈরি করে দিবে।</p>
          <textarea id="aiIdeaInput" placeholder="আপনার আইডিয়াটি বর্ণনা করুন (যেমন: একটি রেস্টুরেন্টের ওয়েবসাইট, যেখানে মেনু, বুকিং আর কন্টাক্ট পেজ থাকবে)..." style="min-height: 80px; margin-bottom: 10px; border-color: rgba(139, 92, 246, 0.5);"></textarea>
          <button type="button" id="aiGenerateBtn" class="submit-btn" style="background:#8b5cf6; width:auto; padding:8px 16px; font-size:0.9rem;" onclick="generateAIPages()"><i class="fa-solid fa-robot"></i> জেনারেট করুন</button>
        </div>

        <p style="font-size:0.9rem; color:var(--text-sub); margin-bottom:20px;">আপনার ওয়েবসাইটের প্রতিটি পেজে কী কী কন্টেন্ট, লেখা বা ছবি থাকবে তা বিস্তারিত লিখুন।</p>
        
        <div id="dynamicPageContainer">
          <!-- Dynamic inputs injected here via JS -->
        </div>
        
        <div style="display:flex; justify-content:space-between; gap:10px;">
           <button type="button" class="submit-btn" style="background:#334155; width:auto; padding:10px 20px;" onclick="prevStep(1)"><i class="fa-solid fa-arrow-left" style="margin-right:8px;"></i> পূর্ববর্তী ধাপ</button>
           <button type="button" class="submit-btn" style="width:auto; padding:10px 20px;" onclick="nextStep(3)">পরবর্তী ধাপ (Continue) <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i></button>
        </div>
      </div> <!-- End Step 2 -->
`;

const oldStep2Regex = /<div id="step2" style="display:none;">[\s\S]*?<\/div> <!-- End Step 2 -->/;
html = html.replace(oldStep2Regex, step2UI);


// Modify nextStep and add dynamic logic
const jsLogic = `
    let requiredPages = 3;
    let optionalPages = 1;
    let totalPages = 4;
    let lastRenderedPackage = '';

    function buildDynamicPages() {
      const pkg = document.getElementById('selectedPackage').value;
      if (pkg === lastRenderedPackage) return;
      lastRenderedPackage = pkg;

      if (pkg === 'Regular') {
         requiredPages = 3;
         optionalPages = 1;
      } else if (pkg === 'Exclusive') {
         requiredPages = 5;
         optionalPages = 2;
      } else if (pkg === 'Premium') {
         requiredPages = 7;
         optionalPages = 4;
      }
      totalPages = requiredPages + optionalPages;

      let html = '';
      for (let i = 1; i <= totalPages; i++) {
        const isRequired = i <= requiredPages;
        const reqStr = isRequired ? '(Required)' : '(Optional)';
        const reqAttr = isRequired ? 'required' : '';
        html += \`
        <div class="order-form-group">
          <label><i class="fa-solid fa-align-left"></i> পেজ \${i} এর বিবরণ \${reqStr}</label>
          <textarea id="pageDesc\${i}" class="page-desc-input" placeholder="পেজ \${i} এ কি কি লেখা বা ছবি থাকবে তা বিস্তারিত লিখুন..." \${reqAttr}></textarea>
        </div>
        \`;
      }
      document.getElementById('dynamicPageContainer').innerHTML = html;
    }

    async function generateAIPages() {
      const idea = document.getElementById('aiIdeaInput').value.trim();
      if (!idea) {
        alert('অনুগ্রহ করে আপনার আইডিয়াটি বর্ণনা করুন।');
        return;
      }
      const pkg = document.getElementById('selectedPackage').value;
      const btn = document.getElementById('aiGenerateBtn');
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> জেনারেট হচ্ছে...';

      try {
        const res = await fetch('/api/generate-page-descriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, packageType: pkg, requiredPages, optionalPages })
        });
        const data = await res.json();
        if (data.success && data.pages && data.pages.length > 0) {
          for (let i = 0; i < totalPages; i++) {
             const el = document.getElementById(\`pageDesc\${i+1}\`);
             if (el && data.pages[i]) {
                el.value = data.pages[i];
             }
          }
        } else {
          alert('দুঃখিত, কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
      } catch (err) {
        console.error(err);
        alert('Error generating pages.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-robot"></i> জেনারেট করুন';
      }
    }

    function nextStep(step) {
      if (step === 2) {
         if (!document.getElementById('selectedWebsiteType').value) {
            alert('অনুগ্রহ করে ওয়েবসাইটের ধরন নির্বাচন করুন।');
            return;
         }
         if (!document.getElementById('selectedPackage').value) {
            alert('অনুগ্রহ করে ওয়েবসাইট প্যাকেজ নির্বাচন করুন।');
            return;
         }
         buildDynamicPages();
      }
      if (step === 3) {
         for (let i = 1; i <= requiredPages; i++) {
            const val = document.getElementById(\`pageDesc\${i}\`).value.trim();
            if (!val) {
               alert(\`অনুগ্রহ করে পেজ \${i} এর বিবরণ (Required) পূরণ করুন।\`);
               return;
            }
         }
      }
      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'none';
      document.getElementById('step3').style.display = 'none';
      document.getElementById('step' + step).style.display = 'block';
      window.scrollTo(0,0);
    }
`;

html = html.replace(/function nextStep[\s\S]*?window\.scrollTo\(0,0\);\n    }/, jsLogic);

// Modify submitOrderForm
const submitLogic = `
      const pages = [];
      for(let i = 1; i <= totalPages; i++) {
         const el = document.getElementById(\`pageDesc\${i}\`);
         if(el) {
            pages.push(el.value.trim());
         }
      }
      const generalDesc = document.getElementById('generalDesc').value;
      const description = generalDesc; 
      const contactPhone = document.getElementById('orderContactPhone').value;
      const advancePaymentPhone = document.getElementById('orderAdvancePhone').value;
      
      if(!type) {
        alert('অনুগ্রহ করে ওয়েবসাইটের ধরন নির্বাচন করুন।');
        return;
      }
      if(!pkg) {
        alert('অনুগ্রহ করে ওয়েবসাইট প্যাকেজ নির্বাচন করুন।');
        return;
      }
      if(!contactPhone || !advancePaymentPhone) {
        alert('অনুগ্রহ করে ফর্মের সকল তথ্য সঠিকভাবে পূরণ করুন।');
        return;
      }
`;

const oldSubmitRegex = /const page1Desc = [\s\S]*?return;\n      }/;
html = html.replace(oldSubmitRegex, submitLogic);

html = html.replace(
  `page1Desc,
            page2Desc,
            page3Desc,
            page4Desc,`,
  `pages,`
);

fs.writeFileSync('place-order/index.html', html);
console.log('place-order/index.html updated successfully.');
