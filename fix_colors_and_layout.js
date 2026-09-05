import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

// The user wants the border color, tag color, and crown color to be completely matching the theme
// Elite: Purple theme
// Premium: Golden theme

const matchingColorsCss = `
/* MATCHING THEME COLORS FOR ELITE AND PREMIUM */
:root {
  /* Elite (Purple) */
  --elite-color-primary: #a855f7;
  --elite-color-light: #d8b4fe;
  --elite-color-dark: #7e22ce;
  
  /* Premium (Golden) */
  --prem-color-primary: #f59e0b;
  --prem-color-light: #fcd34d;
  --prem-color-dark: #b45309;
}

/* OVERRIDE CROWNS */
.elite-crown i {
  color: var(--elite-color-light) !important;
  filter: drop-shadow(0 2px 4px rgba(168, 85, 247, 0.4));
}
.premium-crown i {
  color: var(--prem-color-light) !important;
  filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4));
}

/* OVERRIDE TAGS */
.elite-tag {
  background: var(--elite-color-primary) !important;
  color: #fff !important;
  border: 2px solid #fff !important;
  box-shadow: 0 4px 6px rgba(168, 85, 247, 0.3) !important;
}

.premium-tag {
  background: var(--prem-color-primary) !important;
  color: #fff !important;
  border: 2px solid #fff !important;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3) !important;
}

/* OVERRIDE ROTATING BORDERS TO MATCH THEME SOLIDLY */
.profile-avatar-wrap.elite-frame::before,
.drawer-avatar-wrap.elite-frame::before,
.top-bar-avatar-wrap.elite-frame::before {
  background: conic-gradient(from var(--bg-angle), var(--elite-color-dark), var(--elite-color-primary), var(--elite-color-light), var(--elite-color-primary), var(--elite-color-dark)) !important;
  padding: 4px !important;
}

.profile-avatar-wrap.premium-frame::before,
.drawer-avatar-wrap.premium-frame::before,
.top-bar-avatar-wrap.premium-frame::before {
  background: conic-gradient(from var(--bg-angle), var(--prem-color-dark), var(--prem-color-primary), var(--prem-color-light), var(--prem-color-primary), var(--prem-color-dark)) !important;
  padding: 4px !important;
}

/* MATCHING THE SHAPE IN THE IMAGE - THICK SOLID BORDERS */
/* Let's give them a solid background matching the theme, with a slight gradient for the 3D look */
.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar-wrap.elite-frame {
  padding: 4px !important;
}

.profile-avatar-wrap.premium-frame,
.drawer-avatar-wrap.premium-frame,
.top-bar-avatar-wrap.premium-frame {
  padding: 4px !important;
}

/* TAG POSITIONING TO MATCH THE SHUTTERSTOCK IMAGE */
.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  bottom: -8px !important;
  border-radius: 12px !important; /* Pill shape like the image */
  padding: 2px 10px !important;
  font-size: 0.7rem !important;
  letter-spacing: 1px !important;
  z-index: 30 !important;
}

/* CROWN POSITIONING TO MATCH THE IMAGE (Top Right, Angled) */
.profile-avatar-wrap .premium-crown,
.profile-avatar-wrap .elite-crown {
  top: -12px !important;
  right: -8px !important;
  font-size: 1.6rem !important;
  transform: rotate(15deg);
}

.drawer-avatar-wrap .premium-crown,
.drawer-avatar-wrap .elite-crown {
  top: -8px !important;
  right: -6px !important;
  font-size: 1.2rem !important;
  transform: rotate(15deg);
}

.top-bar-avatar-wrap .premium-crown,
.top-bar-avatar-wrap .elite-crown {
  top: -6px !important;
  right: -6px !important;
  font-size: 0.9rem !important;
  transform: rotate(15deg);
}

/* Disable the floating animation if we want it to look exactly like the static badge image, 
   but we can keep a subtle glow instead of heavy floating */
@keyframes glowCrownGem {
  0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
  50% { filter: drop-shadow(0 0 8px currentColor); }
}

.premium-crown i, .elite-crown i {
  animation: glowCrownGem 2s ease-in-out infinite !important;
}
`;

css += '\n' + matchingColorsCss;
fs.writeFileSync('css/style.css', css);
console.log('Fixed styling to match provided image.');
