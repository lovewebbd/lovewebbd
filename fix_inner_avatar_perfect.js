import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

// The ultimate fix for inner circle stretching. We will ensure the wrapper is completely round
// and the inner child ignores border/padding issues by being absolutely positioned if necessary,
// or strictly boxed.

const extraCss = `
/* ULTIMATE INNER CIRCLE FIX */
.premium-frame, .elite-frame {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  box-sizing: border-box !important;
}

/* Ensure the inner element holding the initial/image is a perfect circle */
.premium-frame > div:not(.premium-crown):not(.premium-tag):not(.elite-crown):not(.elite-tag):not(.drawer-status-dot),
.elite-frame > div:not(.premium-crown):not(.premium-tag):not(.elite-crown):not(.elite-tag):not(.drawer-status-dot) {
  width: calc(100% - 6px) !important; /* exactly container minus padding */
  height: calc(100% - 6px) !important;
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  margin: 0 !important;
  position: absolute !important;
  top: 3px !important;
  left: 3px !important;
  background-size: cover !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
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
  padding: 3px;
  background: conic-gradient(from var(--bg-angle), var(--prem-border-1), var(--prem-border-2), #ffffff, var(--prem-border-1));
  animation: spinGradient 3s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.profile-avatar-wrap.elite-frame::before,
.drawer-avatar-wrap.elite-frame::before,
.top-bar-avatar-wrap.elite-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(from var(--bg-angle), var(--elite-border-1), var(--elite-border-2), #ffffff, var(--elite-border-1));
  animation: spinGradient 3s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
`;

// Clean up old shiny logic to replace with conic gradient spinning
css = css.replace(/\/\* Premium Gradient Border with Shiny Animation \*\/[\s\S]*?(?=\/\* Tags - Glassmorphism)/, extraCss + '\n\n/* Tags - Glassmorphism');

fs.writeFileSync('css/style.css', css);
console.log('Fixed circle rendering and added rotating border animation');
