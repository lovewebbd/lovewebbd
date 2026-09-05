import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

const cssToAdd = `
    .ai-branding-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 0 16px 0;
      color: #fff;
    }
    .ai-branding-icon-large {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF2A6D, #A020F0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin-bottom: 6px;
      box-shadow: 0 4px 12px rgba(255, 42, 109, 0.3);
    }
    .ai-branding-text {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .ai-area-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: rgba(0,0,0,0.1);
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
    }
    .ai-area-icon-small {
      color: #A020F0;
      font-size: 1rem;
    }
    
    [data-theme="light"] .ai-branding-header { color: #191e2b; }
    [data-theme="light"] .ai-area-header { background: #f8f9fa; border-bottom-color: #eaeaea; color: #191e2b; }
`;

code = code.replace("/* AI Chatbot Section */", cssToAdd + "\n    /* AI Chatbot Section */");

const newHtml = `
        <div class="divider">অথবা</div>

        <!-- AI Branding Header -->
        <div class="ai-branding-header">
          <div class="ai-branding-icon-large"><i class="fa-solid fa-robot"></i></div>
          <div class="ai-branding-text">এআই সহায়তা</div>
        </div>

        <!-- AI Chatbot -->
        <div class="ai-chatbot-area">
          <div class="ai-area-header">
             <i class="fa-solid fa-wand-magic-sparkles ai-area-icon-small"></i>
             LoveWeb এআই অ্যাসিস্ট্যান্ট
          </div>
`;

code = code.replace(`        <div class="divider">অথবা</div>

        <!-- AI Chatbot -->
        <div class="ai-chatbot-area">`, newHtml);

fs.writeFileSync('js/messenger.js', code);
console.log('Patched messenger UI');
