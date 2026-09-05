import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

// We will replace the previous ULTIMATE INNER CIRCLE FIX block with a much cleaner layout.
// Absolute positioning the inner circle was causing the clipping.
// By using standard padding on the frame wrapper, flexbox perfectly centers the inner circle.

const newInnerCircleCss = `
/* PERFECT EDGE FIX FOR INNER AVATAR */
.premium-frame, .elite-frame {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  box-sizing: border-box !important;
  padding: 4px !important; /* Space for the animated border */
  z-index: 1; /* Establish stacking context */
  background: transparent !important; /* The background should be transparent so the inner circle shows */
}

/* Ensure the inner element holding the initial/image is a perfect circle */
.premium-frame > div:not(.premium-crown):not(.premium-tag):not(.elite-crown):not(.elite-tag):not(.drawer-status-dot),
.elite-frame > div:not(.premium-crown):not(.premium-tag):not(.elite-crown):not(.elite-tag):not(.drawer-status-dot) {
  width: 100% !important;
  height: 100% !important;
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  margin: 0 !important;
  position: relative !important; /* DO NOT USE ABSOLUTE */
  top: auto !important;
  left: auto !important;
  background-size: cover !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  z-index: 2; /* Ensure it stays above the border background */
}

/* Fix animation rotation for frames */
@keyframes spinGradient {
  0% { --bg-angle: 0deg; }
  100% { --bg-angle: 360deg; }
}

@property --bg-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.profile-avatar-wrap.premium-frame::before,
.drawer-avatar-wrap.premium-frame::before,
.top-bar-avatar-wrap.premium-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px; /* Border thickness */
  background: conic-gradient(from var(--bg-angle), var(--prem-border-1), var(--prem-border-2), #ffffff, var(--prem-border-1));
  animation: spinGradient 3s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 0;
  pointer-events: none;
}

.profile-avatar-wrap.elite-frame::before,
.drawer-avatar-wrap.elite-frame::before,
.top-bar-avatar-wrap.elite-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px; /* Border thickness */
  background: conic-gradient(from var(--bg-angle), var(--elite-border-1), var(--elite-border-2), #ffffff, var(--elite-border-1));
  animation: spinGradient 3s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 0;
  pointer-events: none;
}

/* ANIMATED CROWNS AND GEMS */
@keyframes floatCrown {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.6)); }
  50% { transform: translateY(-4px) rotate(8deg) scale(1.15); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 1)); }
}

@keyframes floatGem {
  0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 3px rgba(192, 132, 252, 0.6)); }
  50% { transform: translateY(-4px) scale(1.15); filter: drop-shadow(0 0 8px rgba(192, 132, 252, 1)); }
}

.premium-crown i {
  animation: floatCrown 2.5s ease-in-out infinite;
  display: inline-block;
  color: #fbbf24;
}

.elite-crown i {
  animation: floatGem 2s ease-in-out infinite;
  display: inline-block;
  color: #c084fc;
}

/* Ensure the crown/gem containers are positioned nicely above everything */
.premium-crown, .elite-crown {
  position: absolute;
  z-index: 25 !important;
  pointer-events: none;
}

/* Specific alignments so the animated icons sit beautifully on the rim */
.profile-avatar-wrap .premium-crown,
.profile-avatar-wrap .elite-crown {
  top: -8px !important;
  right: -2px !important;
  font-size: 1.4rem !important;
}

.drawer-avatar-wrap .premium-crown,
.drawer-avatar-wrap .elite-crown {
  top: -6px !important;
  right: -4px !important;
  font-size: 1.1rem !important;
}

.top-bar-avatar-wrap .premium-crown,
.top-bar-avatar-wrap .elite-crown {
  top: -4px !important;
  right: -6px !important;
  font-size: 0.85rem !important;
}
`;

// Replace the previous ULTIMATE INNER CIRCLE FIX block and its associated animations
css = css.replace(/\/\* ULTIMATE INNER CIRCLE FIX \*\/[\s\S]*?(?=\/\* Tags - Glassmorphism)/, newInnerCircleCss + '\n\n');

fs.writeFileSync('css/style.css', css);
console.log('Fixed clipping and added animated crowns/gems');
