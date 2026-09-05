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
  border: 4px solid #FFC300; /* Solid golden border like the image */
  background: transparent;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 195, 0, 0.3);
}

.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar.elite-frame {
  position: relative;
  border-radius: 50%;
  border: 4px solid #00D4FF; /* Professional cyan/blue for elite */
  background: transparent;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

/* Crown Icons positioned exactly like the image */
.premium-crown, .elite-crown {
  position: absolute;
  top: -14px;
  right: -10px;
  font-size: 1.5rem;
  z-index: 10;
  transform: rotate(25deg);
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));
}
.premium-crown { color: #FFC300; }
.elite-crown { color: #00D4FF; }

/* Scale down icons for smaller nav avatars */
.top-bar-avatar.premium-frame,
.top-bar-avatar.elite-frame {
  border-width: 2px;
  padding: 1px;
}

.top-bar-avatar .premium-crown,
.top-bar-avatar .elite-crown {
  font-size: 0.9rem;
  top: -8px;
  right: -6px;
}

/* Base style for the bottom badge pill, precisely placed like the image */
.premium-tag, .elite-tag {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 900;
  color: #fff;
  z-index: 10;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  text-transform: uppercase;
  border: 2px solid #fff; /* White outline on the pill like the image */
}

[data-theme="dark"] .premium-tag,
[data-theme="dark"] .elite-tag {
  border-color: #12141e; /* Match dark bg so it looks like it cuts out the border */
}

.premium-tag {
  background: linear-gradient(135deg, #F5B041, #F39C12);
}

.elite-tag {
  background: linear-gradient(135deg, #0288D1, #00D4FF);
}

.top-bar-avatar .premium-tag,
.top-bar-avatar .elite-tag {
  font-size: 0.45rem;
  padding: 2px 6px;
  bottom: -10px;
  border-width: 1px;
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
  margin-bottom: 8px; /* space for the badge */
}

.top-bar-avatar {
  margin-bottom: 6px; /* space for badge in top bar */
}

/* Let the top bar avatar not be cramped */
.top-bar-user-pill {
  overflow: visible !important;
}
`;

fs.writeFileSync('css/style.css', code);
console.log('CSS updated');
