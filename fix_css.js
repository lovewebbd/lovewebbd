import fs from 'fs';
let code = fs.readFileSync('css/style.css', 'utf8');

const regex = /\/\* =========================================\n   Elite & Premium Professional Avatar Frames[\s\S]*$/;
code = code.replace(regex, "");

code += `
/* =========================================
   Elite & Premium Professional Avatar Frames (Upgraded)
   ========================================= */

/* Dark Theme Variables */
:root {
  --prem-border-1: #FFE066;
  --prem-border-2: #F59E0B;
  --prem-crown: #FDE047;
  --prem-shadow: rgba(245, 158, 11, 0.5);
  --prem-tag-bg1: #F59E0B;
  --prem-tag-bg2: #B45309;
  
  --elite-border-1: #67E8F9;
  --elite-border-2: #0284C7;
  --elite-crown: #67E8F9;
  --elite-shadow: rgba(2, 132, 199, 0.5);
  --elite-tag-bg1: #0EA5E9;
  --elite-tag-bg2: #0369A1;
}

/* Light Theme Variables */
[data-theme="light"] {
  --prem-border-1: #F59E0B;
  --prem-border-2: #D97706;
  --prem-crown: #D97706;
  --prem-shadow: rgba(217, 119, 6, 0.4);
  --prem-tag-bg1: #D97706;
  --prem-tag-bg2: #92400E;
  
  --elite-border-1: #0EA5E9;
  --elite-border-2: #0284C7;
  --elite-crown: #0284C7;
  --elite-shadow: rgba(2, 132, 199, 0.4);
  --elite-tag-bg1: #0284C7;
  --elite-tag-bg2: #075985;
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
  border-radius: 50% !important; /* Always circle */
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
  background: var(--bg-dark); /* Match background so there's a gap between avatar and frame */
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

/* Premium Gradient Border using pseudo-element for professional look */
.profile-avatar-wrap.premium-frame::before,
.drawer-avatar-wrap.premium-frame::before,
.top-bar-avatar-wrap.premium-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--prem-border-1), var(--prem-border-2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  box-shadow: inset 0 0 8px var(--prem-shadow), 0 4px 15px var(--prem-shadow);
  z-index: -1;
}

/* Elite Gradient Border */
.profile-avatar-wrap.elite-frame::before,
.drawer-avatar-wrap.elite-frame::before,
.top-bar-avatar-wrap.elite-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--elite-border-1), var(--elite-border-2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  box-shadow: inset 0 0 8px var(--elite-shadow), 0 4px 15px var(--elite-shadow);
  z-index: -1;
}

/* Crowns */
.premium-crown, .elite-crown {
  position: absolute;
  z-index: 20;
  transform: rotate(20deg);
  filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.4));
}
.premium-crown { color: var(--prem-crown); }
.elite-crown { color: var(--elite-crown); }

/* Tags */
.premium-tag, .elite-tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 12px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  text-align: center;
  letter-spacing: 0.5px;
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.2);
}
.premium-tag { background: linear-gradient(135deg, var(--prem-tag-bg1), var(--prem-tag-bg2)); }
.elite-tag { background: linear-gradient(135deg, var(--elite-tag-bg1), var(--elite-tag-bg2)); }

/* Responsive adjustments */
/* 1. TOP BAR */
.top-bar-avatar-wrap {
  margin: 6px 4px 8px 0;
  padding: 2px;
}
.top-bar-avatar-wrap::before { padding: 2px; }
.top-bar-avatar-wrap .premium-crown,
.top-bar-avatar-wrap .elite-crown {
  font-size: 0.9rem;
  top: -8px;
  right: -6px;
}
.top-bar-avatar-wrap .premium-tag,
.top-bar-avatar-wrap .elite-tag {
  font-size: 0.45rem;
  padding: 2px 6px;
  bottom: -9px;
}

/* 2. SIDE DRAWER */
.drawer-avatar-wrap.premium-frame,
.drawer-avatar-wrap.elite-frame {
  margin: 8px 0 14px 0;
  padding: 3px;
}
.drawer-avatar-wrap .premium-crown,
.drawer-avatar-wrap .elite-crown {
  font-size: 1.2rem;
  top: -12px;
  right: -8px;
}
.drawer-avatar-wrap .premium-tag,
.drawer-avatar-wrap .elite-tag {
  font-size: 0.55rem;
  padding: 2px 8px;
  bottom: -10px;
}
.drawer-status-dot {
  z-index: 25;
  right: -2px;
  bottom: 4px;
}

/* 3. PROFILE DASHBOARD & HOME DASHBOARD */
.profile-avatar-wrap.premium-frame,
.profile-avatar-wrap.elite-frame {
  margin: 12px 0 16px 0 !important;
  padding: 4px !important;
}
.profile-avatar-wrap::before { padding: 4px !important; }
.profile-avatar-wrap .premium-crown,
.profile-avatar-wrap .elite-crown {
  font-size: 1.6rem;
  top: -16px;
  right: -10px;
}
.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  font-size: 0.7rem;
  padding: 4px 12px;
  bottom: -12px;
}

/* Make sure container overflow is visible */
.top-bar-user-pill, .official-top-bar, .top-bar-right, .dash-user-meta {
  overflow: visible !important;
}
`;

fs.writeFileSync('css/style.css', code);
console.log('Fixed CSS avatar styling to be more professional.');
