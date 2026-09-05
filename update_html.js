import fs from 'fs';
let html = fs.readFileSync('place-order/index.html', 'utf8');

const oldBox = /<div style="background: rgba\(139, 92, 246, 0\.1\); padding: 15px; border-radius: 8px; border: 1px solid #8b5cf6; margin-bottom: 20px;">[\s\S]*?<\/div>/;

const newBox = `
        <style>
          .ai-gen-container {
            background: rgba(139, 92, 246, 0.08);
            padding: 24px;
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.4);
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .ai-gen-title {
            color: #a78bfa;
            margin: 0;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .ai-gen-desc {
            font-size: 0.9rem;
            color: var(--text-sub);
            margin: 0;
            line-height: 1.5;
          }
          .ai-gen-textarea {
            width: 100%;
            min-height: 100px;
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 8px;
            padding: 14px;
            color: var(--text-main);
            font-family: inherit;
            font-size: 0.95rem;
            resize: vertical;
            transition: 0.3s;
          }
          .ai-gen-textarea:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
          }
          .ai-gen-btn-wrapper {
            display: flex;
            justify-content: flex-end;
          }
          .ai-gen-btn {
            background: #8b5cf6;
            color: #fff;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .ai-gen-btn:hover {
            background: #7c3aed;
            transform: translateY(-1px);
          }
          .ai-gen-btn:disabled {
            background: #a78bfa;
            cursor: not-allowed;
            transform: none;
          }
          @media (max-width: 600px) {
            .ai-gen-container {
              padding: 16px;
            }
            .ai-gen-btn-wrapper {
              justify-content: stretch;
            }
            .ai-gen-btn {
              width: 100%;
              justify-content: center;
            }
          }
        </style>
        <div class="ai-gen-container">
          <h4 class="ai-gen-title"><i class="fa-solid fa-wand-magic-sparkles"></i> AI দিয়ে বিবরণ জেনারেট করুন</h4>
          <p class="ai-gen-desc">আপনার ওয়েবসাইটের আইডিয়া সংক্ষেপে লিখুন। আমাদের AI স্বয়ংক্রিয়ভাবে আপনার প্যাকেজ অনুযায়ী পেজগুলোর সুন্দর বিবরণ তৈরি করে দিবে। (অপশনাল পেজগুলো AI প্রয়োজন অনুযায়ী রেন্ডমলি যুক্ত করবে)</p>
          <textarea id="aiIdeaInput" class="ai-gen-textarea" placeholder="আপনার আইডিয়াটি বর্ণনা করুন (যেমন: একটি রেস্টুরেন্টের ওয়েবসাইট, যেখানে মেনু, বুকিং আর কন্টাক্ট পেজ থাকবে)..."></textarea>
          <div class="ai-gen-btn-wrapper">
            <button type="button" id="aiGenerateBtn" class="ai-gen-btn" onclick="generateAIPages()"><i class="fa-solid fa-robot"></i> জেনারেট করুন</button>
          </div>
        </div>
`;

html = html.replace(oldBox, newBox);
fs.writeFileSync('place-order/index.html', html);
console.log('place-order/index.html updated successfully.');
