import fs from 'fs';
let code = fs.readFileSync('css/style.css', 'utf8');

const regex = /\/\* =========================================\n   Elite & Premium Professional Avatar Frames[\s\S]*$/;
code = code.replace(regex, "");

code += `
/* =========================================
   Elite & Premium Professional Avatar Frames
   ========================================= */

/* Default (Dark Theme) Variables */
:root {
  --prem-border: #FFC300;
  --prem-crown: #FFC300;
  --prem-grad-1: #FFB300;
  --prem-grad-2: #FF8F00;
  --prem-shadow: rgba(255, 195, 0, 0.4);
  --prem-tag-text: #ffffff;

  --elite-border: #00E5FF;
  --elite-crown: #00E5FF;
  --elite-grad-1: #00B0FF;
  --elite-grad-2: #0091EA;
  --elite-shadow: rgba(0, 229, 255, 0.4);
  --elite-tag-text: #ffffff;
}

/* Light Theme Variables (Darker, richer colors for contrast) */
[data-theme="light"] {
  --prem-border: #D97706; /* Darker amber */
  --prem-crown: #D97706;
  --prem-grad-1: #B45309;
  --prem-grad-2: #92400E;
  --prem-shadow: rgba(217, 119, 6, 0.35);
  --prem-tag-text: #ffffff;

  --elite-border: #0284C7; /* Darker sky blue */
  --elite-crown: #0284C7;
  --elite-grad-1: #0369A1;
  --elite-grad-2: #075985;
  --elite-shadow: rgba(2, 132, 199, 0.35);
  --elite-tag-text: #ffffff;
}

/* Common Wrapper Styling */
.profile-avatar-wrap.premium-frame,
.drawer-avatar-wrap.premium-frame,
.top-bar-avatar-wrap.premium-frame,
.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar-wrap.elite-frame {
  position: relative;
  border-radius: 50%;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-avatar-wrap.premium-frame,
.drawer-avatar-wrap.premium-frame,
.top-bar-avatar-wrap.premium-frame {
  border: 3px solid var(--prem-border);
  box-shadow: 0 4px 15px var(--prem-shadow);
}

.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar-wrap.elite-frame {
  border: 3px solid var(--elite-border);
  box-shadow: 0 4px 15px var(--elite-shadow);
}

/* Base Crown Styles */
.premium-crown, .elite-crown {
  position: absolute;
  z-index: 15;
  transform: rotate(25deg);
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.35));
}
.premium-crown { color: var(--prem-crown); }
.elite-crown { color: var(--elite-crown); }

/* Base Tag Styles */
.premium-tag, .elite-tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 15;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  text-align: center;
  letter-spacing: 0.5px;
}

.premium-tag {
  background: linear-gradient(135deg, var(--prem-grad-1), var(--prem-grad-2));
  color: var(--prem-tag-text);
  border: 2px solid var(--prem-border);
}

.elite-tag {
  background: linear-gradient(135deg, var(--elite-grad-1), var(--elite-grad-2));
  color: var(--elite-tag-text);
  border: 2px solid var(--elite-border);
}

/* Disable default borders/margins on inner avatars when framed */
.premium-frame .profile-avatar,
.elite-frame .profile-avatar,
.premium-frame .drawer-avatar,
.elite-frame .drawer-avatar,
.premium-frame .top-bar-avatar,
.elite-frame .top-bar-avatar {
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

/* ==================================================
   Specific Context Sizing (Top Bar, Drawer, Profile)
===================================================== */

/* 1. TOP BAR */
.top-bar-avatar-wrap {
  position: relative;
  /* Add margin to accommodate the absolute crown/tag within flex containers */
  margin-top: 4px;
  margin-bottom: 8px;
  margin-right: 4px;
  padding: 2px;
}
.top-bar-avatar-wrap.premium-frame,
.top-bar-avatar-wrap.elite-frame {
  border-width: 2px;
}
.top-bar-avatar-wrap .premium-crown,
.top-bar-avatar-wrap .elite-crown {
  font-size: 0.85rem;
  top: -8px;
  right: -6px;
}
.top-bar-avatar-wrap .premium-tag,
.top-bar-avatar-wrap .elite-tag {
  font-size: 0.45rem;
  padding: 2px 6px;
  bottom: -9px;
  border-width: 1.5px;
}
/* Ensure the pill is fully visible and flex works cleanly */
.top-bar-user-pill {
  overflow: visible !important;
  align-items: center;
}

/* 2. SIDE DRAWER */
.drawer-avatar-wrap.premium-frame,
.drawer-avatar-wrap.elite-frame {
  margin-top: 6px;
  margin-bottom: 12px;
  padding: 3px;
}
.drawer-avatar-wrap .premium-crown,
.drawer-avatar-wrap .elite-crown {
  font-size: 1.15rem;
  top: -12px;
  right: -8px;
}
.drawer-avatar-wrap .premium-tag,
.drawer-avatar-wrap .elite-tag {
  font-size: 0.55rem;
  padding: 3px 8px;
  bottom: -11px;
}
.drawer-status-dot {
  z-index: 20;
}

/* 3. PROFILE DASHBOARD */
.profile-avatar-wrap.premium-frame,
.profile-avatar-wrap.elite-frame {
  border-width: 4px;
  padding: 4px;
}
.profile-avatar-wrap .premium-crown,
.profile-avatar-wrap .elite-crown {
  font-size: 1.6rem;
  top: -16px;
  right: -12px;
}
.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  font-size: 0.75rem;
  padding: 4px 14px;
  bottom: -14px;
}

`;

fs.writeFileSync('css/style.css', code);
console.log('Robust Avatar CSS deployed.');
