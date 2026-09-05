import fs from 'fs';

let css = fs.readFileSync('css/style.css', 'utf8');

// 1. Remove border and background from .top-bar-user-pill
css = css.replace(
  /\.top-bar-user-pill \{[\s\S]*?\}/,
  `.top-bar-user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 10px 2px 2px;
    border-radius: 24px;
    background: transparent;
    border: none;
    color: var(--text-main);
    text-decoration: none;
    font-size: 0.86rem;
    font-weight: 600;
    transition: all 0.3s ease;
}`
);

// Remove the hover border as well
css = css.replace(
  /\.top-bar-user-pill:hover \{[\s\S]*?\}/,
  `.top-bar-user-pill:hover {
    background: rgba(255, 255, 255, 0.05);
}`
);

// 2. Hide tags in top-bar and drawer
const hideTagsCss = `
/* Hide premium/elite text tags everywhere except the main profile display */
.top-bar-avatar-wrap .premium-tag,
.top-bar-avatar-wrap .elite-tag,
.drawer-avatar-wrap .premium-tag,
.drawer-avatar-wrap .elite-tag {
  display: none !important;
}
`;

// 3. Replace the entire "Elite & Premium Professional Avatar Frames (Upgraded)" section
// with a new polished version that includes the glassmorphism and shiny effect.
const framesRegex = /\/\* =========================================\n   Elite & Premium Professional Avatar Frames \(Upgraded\)[\s\S]*$/;

const newFramesCss = `/* =========================================
   Elite & Premium Professional Avatar Frames (Upgraded)
   ========================================= */

/* Dark Theme Variables */
:root {
  --prem-border-1: #FFE066;
  --prem-border-2: #F59E0B;
  --prem-crown: #FDE047;
  --prem-shadow: rgba(245, 158, 11, 0.5);
  --prem-tag-bg: rgba(245, 158, 11, 0.2);
  
  --elite-border-1: #67E8F9;
  --elite-border-2: #0284C7;
  --elite-crown: #67E8F9;
  --elite-shadow: rgba(2, 132, 199, 0.5);
  --elite-tag-bg: rgba(2, 132, 199, 0.2);
}

/* Light Theme Variables */
[data-theme="light"] {
  --prem-border-1: #F59E0B;
  --prem-border-2: #D97706;
  --prem-crown: #D97706;
  --prem-shadow: rgba(217, 119, 6, 0.4);
  --prem-tag-bg: rgba(217, 119, 6, 0.15);
  
  --elite-border-1: #0EA5E9;
  --elite-border-2: #0284C7;
  --elite-crown: #0284C7;
  --elite-shadow: rgba(2, 132, 199, 0.4);
  --elite-tag-bg: rgba(2, 132, 199, 0.15);
}

/* Force inner avatars to be perfect circles and hide their own borders/shadows if framed */
.premium-frame .profile-avatar,
.elite-frame .profile-avatar,
.premium-frame .drawer-avatar,
.elite-frame .drawer-avatar,
.premium-frame .top-bar-avatar,
.elite-frame .top-bar-avatar,
.premium-frame .dash-avatar-circle,
.elite-frame .dash-avatar-circle {
  margin: 0 !important;
  border: 2px solid transparent !important;
  box-shadow: none !important;
  border-radius: 50% !important; 
}
.dash-avatar-circle, .top-bar-avatar, .drawer-avatar, .profile-avatar {
  border-radius: 50% !important;
}

/* Base Wrapper */
.profile-avatar-wrap.premium-frame,
.drawer-avatar-wrap.premium-frame,
.top-bar-avatar-wrap.premium-frame,
.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar-wrap.elite-frame {
  position: relative;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--bg-dark);
  padding: 3px; 
  z-index: 10;
}

[data-theme="light"] .profile-avatar-wrap.premium-frame,
[data-theme="light"] .drawer-avatar-wrap.premium-frame,
[data-theme="light"] .top-bar-avatar-wrap.premium-frame,
[data-theme="light"] .profile-avatar-wrap.elite-frame,
[data-theme="light"] .drawer-avatar-wrap.elite-frame,
[data-theme="light"] .top-bar-avatar-wrap.elite-frame {
  background: #ffffff;
}

/* Premium Gradient Border with Shiny Animation */
.profile-avatar-wrap.premium-frame::before,
.drawer-avatar-wrap.premium-frame::before,
.top-bar-avatar-wrap.premium-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(135deg, var(--prem-border-1), var(--prem-border-2), #ffffff, var(--prem-border-1));
  background-size: 300% 300%;
  animation: borderShine 4s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  box-shadow: inset 0 0 8px var(--prem-shadow), 0 4px 15px var(--prem-shadow);
  z-index: -1;
}

/* Elite Gradient Border with Shiny Animation */
.profile-avatar-wrap.elite-frame::before,
.drawer-avatar-wrap.elite-frame::before,
.top-bar-avatar-wrap.elite-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(135deg, var(--elite-border-1), var(--elite-border-2), #ffffff, var(--elite-border-1));
  background-size: 300% 300%;
  animation: borderShine 4s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  box-shadow: inset 0 0 8px var(--elite-shadow), 0 4px 15px var(--elite-shadow);
  z-index: -1;
}

@keyframes borderShine {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Crowns - Moved down slightly */
.premium-crown, .elite-crown {
  position: absolute;
  z-index: 20;
  transform: rotate(18deg);
  filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.4));
}
.premium-crown { color: var(--prem-crown); }
.elite-crown { color: var(--elite-crown); }

/* Tags - Glassmorphism & Reduced Padding */
.premium-tag, .elite-tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 12px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 20;
  text-align: center;
  letter-spacing: 0.5px;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
}
.premium-tag { background: var(--prem-tag-bg); }
.elite-tag { background: var(--elite-tag-bg); }

/* Shine sweep animation over tags */
.premium-tag::after, .elite-tag::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-20deg);
  animation: shineSweep 3s infinite;
}

@keyframes shineSweep {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

${hideTagsCss}

/* Responsive adjustments */
/* 1. TOP BAR */
.top-bar-avatar-wrap {
  margin: 2px;
  padding: 2px;
}
.top-bar-avatar-wrap .premium-crown,
.top-bar-avatar-wrap .elite-crown {
  font-size: 0.8rem;
  top: -4px;
  right: -4px;
}

/* 2. SIDE DRAWER */
.drawer-avatar-wrap.premium-frame,
.drawer-avatar-wrap.elite-frame {
  margin: 4px 0 6px 0;
  padding: 3px;
}
.drawer-avatar-wrap .premium-crown,
.drawer-avatar-wrap .elite-crown {
  font-size: 1.1rem;
  top: -8px;
  right: -6px;
}
.drawer-status-dot {
  z-index: 25;
  right: 0px;
  bottom: 0px;
}

/* 3. PROFILE DASHBOARD & HOME DASHBOARD */
.profile-avatar-wrap.premium-frame,
.profile-avatar-wrap.elite-frame {
  margin: 12px 0 14px 0 !important;
  padding: 4px !important;
}
.profile-avatar-wrap .premium-crown,
.profile-avatar-wrap .elite-crown {
  font-size: 1.4rem;
  top: -10px;
  right: -8px;
}
.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  font-size: 0.65rem;
  padding: 2px 10px;
  bottom: -6px;
}

/* Make sure container overflow is visible */
.top-bar-user-pill, .official-top-bar, .top-bar-right, .dash-user-meta {
  overflow: visible !important;
}
`;

css = css.replace(framesRegex, newFramesCss);

fs.writeFileSync('css/style.css', css);
console.log('Fixed CSS avatar styling to be more professional.');
