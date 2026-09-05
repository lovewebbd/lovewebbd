import fs from 'fs';
let code = fs.readFileSync('css/style.css', 'utf8');

const regex = /\/\* =========================================\n   Elite & Premium Professional Avatar Frames[\s\S]*$/;
code = code.replace(regex, "");

code += `
/* =========================================
   Elite & Premium Professional Avatar Frames
   ========================================= */

/* The Wrapper */
.profile-avatar-wrap.premium-frame,
.drawer-avatar-wrap.premium-frame,
.top-bar-avatar.premium-frame {
  position: relative;
  border-radius: 50%;
  border: 3px solid #f59e0b; /* Rich gold/amber */
  background: transparent;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
}

.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar.elite-frame {
  position: relative;
  border-radius: 50%;
  border: 3px solid #0ea5e9; /* Rich cyan/sky blue */
  background: transparent;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.25);
}

/* Crown Icons */
.premium-crown, .elite-crown {
  position: absolute;
  top: -14px;
  right: -10px;
  font-size: 1.5rem;
  z-index: 10;
  transform: rotate(25deg);
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
}
.premium-crown { color: #f59e0b; }
.elite-crown { color: #0ea5e9; }

/* Scale down icons for smaller nav avatars */
.top-bar-avatar.premium-frame,
.top-bar-avatar.elite-frame {
  border-width: 2px;
  padding: 1px;
  /* Add margins so the absolute items don't get clipped by the pill */
  margin-top: 8px;
  margin-bottom: 10px;
  margin-right: 4px;
  margin-left: 2px;
}

.top-bar-avatar .premium-crown,
.top-bar-avatar .elite-crown {
  font-size: 0.95rem;
  top: -10px;
  right: -8px;
}

/* Base style for the bottom badge pill */
.premium-tag, .elite-tag {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 800;
  color: #fff;
  z-index: 10;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
  text-transform: uppercase;
  white-space: nowrap;
}

.premium-tag {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.elite-tag {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.top-bar-avatar .premium-tag,
.top-bar-avatar .elite-tag {
  font-size: 0.5rem;
  padding: 2px 6px;
  bottom: -11px;
}

/* Fix size inside the frame */
.premium-frame .profile-avatar,
.elite-frame .profile-avatar,
.premium-frame .drawer-avatar,
.elite-frame .drawer-avatar {
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

.drawer-avatar-wrap.premium-frame,
.drawer-avatar-wrap.elite-frame {
  margin-top: 10px;
  margin-bottom: 14px; /* extra space for the badge */
}

/* Light Theme Adjustments */
[data-theme="light"] .profile-avatar-wrap.premium-frame,
[data-theme="light"] .drawer-avatar-wrap.premium-frame,
[data-theme="light"] .top-bar-avatar.premium-frame {
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

[data-theme="light"] .profile-avatar-wrap.elite-frame,
[data-theme="light"] .drawer-avatar-wrap.elite-frame,
[data-theme="light"] .top-bar-avatar.elite-frame {
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
}

/* Ensure the pill doesn't clip */
.top-bar-user-pill {
  overflow: visible !important;
}
`;

fs.writeFileSync('css/style.css', code);
console.log('Avatar CSS replaced');
