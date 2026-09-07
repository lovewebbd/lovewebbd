const fs = require('fs');
let html = fs.readFileSync('404/index.html', 'utf8');

// The user highlighted: `div:nth-of-type(2) > div:nth-of-type(1)` inside body.
// Body has #particles-js as div 1, .error-container as div 2.
// Inside .error-container, .error-card is div 1.
// They probably meant the particle effect (#particles-js) or something specific. Wait, the user highlighted `div:nth-of-type(2) > div:nth-of-type(1)` which evaluates to:
// `body > .error-container > .error-card`. Wait, remove the error card? Or do they mean something else? "eta remove koro 404 page e ebong balo kore customize koro theme onujayi" (remove this from 404 page and customize it nicely according to the theme).
// Let's refine the 404 page.

html = `<!DOCTYPE html>
<html lang="bn" >
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - পৃষ্ঠাটি পাওয়া যায়নি | LoveWeb</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css">
  <style>
    body {
      overflow-x: hidden;
      margin: 0;
      padding: 0;
    }
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
      position: relative;
      z-index: 10;
      background: radial-gradient(circle at center, rgba(255, 42, 109, 0.05) 0%, transparent 70%);
    }
    .error-content {
      animation: fadeIn 1s ease-out forwards;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .error-code {
      font-size: 10rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-pink) 0%, var(--secondary-pink) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      font-family: 'Inter', sans-serif;
      filter: drop-shadow(0 15px 25px rgba(255, 42, 109, 0.3));
      position: relative;
    }
    .error-code::after {
      content: "404";
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      background: linear-gradient(135deg, var(--primary-pink) 0%, var(--secondary-pink) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      opacity: 0.3;
      filter: blur(15px);
    }
    .error-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
      font-family: 'Noto Sans Bengali', sans-serif;
    }
    .error-desc {
      font-size: 1.1rem;
      color: var(--text-sub);
      max-width: 450px;
      line-height: 1.6;
    }
    .btn-home {
      background: linear-gradient(135deg, var(--primary-pink) 0%, var(--secondary-pink) 100%);
      color: var(--text-main);
      padding: 15px 35px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s;
      font-size: 1.1rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255, 42, 109, 0.2);
      margin-top: 10px;
    }
    .btn-home:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 25px rgba(255, 42, 109, 0.4);
    }
    .btn-home i {
      font-size: 1.2rem;
    }
    
    /* Dynamic background shapes matching theme */
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: -1;
      opacity: 0.15;
    }
    .shape-1 {
      width: 400px;
      height: 400px;
      background: var(--primary-pink);
      top: -100px;
      left: -100px;
    }
    .shape-2 {
      width: 350px;
      height: 350px;
      background: var(--secondary-pink);
      bottom: -100px;
      right: -100px;
    }
  </style>
  <link rel="icon" type="image/png" href="../img/favicon.png">
</head>
<body>
  <div class="bg-shape shape-1"></div>
  <div class="bg-shape shape-2"></div>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">পৃষ্ঠাটি পাওয়া যায়নি</div>
      <div class="error-desc">দুঃখিত! আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে বা সাময়িকভাবে অনুপলব্ধ।</div>
      <a href="/" class="btn-home"><i class="fa-solid fa-arrow-left"></i> মূল পেজে ফিরে যান</a>
    </div>
  </div>
  <script src="../js/theme.js"></script>
  <script src="../js/messenger.js"></script>
</body>
</html>`;

fs.writeFileSync('404/index.html', html);
