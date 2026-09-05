import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

const finalCssFix = `
/* ========================================================
   FINAL REFINEMENT: GLASSMORPHISM, THIN BORDERS, PERFECT ROUND PFP 
   ======================================================== */

/* Force exact dimensions so they NEVER warp or become oval */
.top-bar-avatar-wrap {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  min-height: 36px !important;
}
.drawer-avatar-wrap {
  width: 52px !important;
  height: 52px !important;
  min-width: 52px !important;
  min-height: 52px !important;
}
.profile-avatar-wrap {
  width: 74px !important;
  height: 74px !important;
  min-width: 74px !important;
  min-height: 74px !important;
}

/* Base Frame - Glassmorphism and Thin Padding */
.premium-frame, .elite-frame {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  box-sizing: border-box !important;
  padding: 2px !important; /* Extremely thin padding to make the gap tiny */
  z-index: 1 !important; 
  /* Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
}

/* Make sure the before element has the thin border mask */
.profile-avatar-wrap.premium-frame::before,
.drawer-avatar-wrap.premium-frame::before,
.top-bar-avatar-wrap.premium-frame::before,
.profile-avatar-wrap.elite-frame::before,
.drawer-avatar-wrap.elite-frame::before,
.top-bar-avatar-wrap.elite-frame::before {
  padding: 1.5px !important; /* The actual animated ring thickness is now super thin */
}

/* The Avatar Inside - MUST BE 100% ROUND */
.premium-frame > div:not(.premium-crown):not(.premium-tag):not(.elite-crown):not(.elite-tag):not(.drawer-status-dot),
.elite-frame > div:not(.premium-crown):not(.premium-tag):not(.elite-crown):not(.elite-tag):not(.drawer-status-dot) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  object-fit: cover !important; /* ensures images fit nicely */
  margin: 0 !important;
  position: relative !important; 
  top: 0 !important;
  left: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important; /* Clips anything outside the circle */
  box-sizing: border-box !important;
  z-index: 2 !important; 
  background-clip: padding-box !important;
  border: none !important;
}

/* Ensure text inside initials remains centered and images stay round */
.dash-avatar-circle, .drawer-avatar, .top-bar-avatar {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  object-fit: cover !important;
}

/* Override padding for tag to keep it small and pill-shaped */
.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  bottom: -10px !important;
  padding: 1px 8px !important; /* Kept very thin padding */
  font-size: 0.65rem !important;
  border-radius: 12px !important; /* Pill shape */
}

/* Adjust the crown position to fit the slightly larger frame sizes */
.profile-avatar-wrap .premium-crown,
.profile-avatar-wrap .elite-crown {
  top: -12px !important;
  right: -6px !important;
}
.drawer-avatar-wrap .premium-crown,
.drawer-avatar-wrap .elite-crown {
  top: -8px !important;
  right: -4px !important;
}
.top-bar-avatar-wrap .premium-crown,
.top-bar-avatar-wrap .elite-crown {
  top: -6px !important;
  right: -4px !important;
}
`;

css += '\n' + finalCssFix;
fs.writeFileSync('css/style.css', css);
console.log('Fixed final avatar CSS.');
