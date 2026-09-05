import fs from 'fs';
let code = fs.readFileSync('css/style.css', 'utf8');

// Replace the previous frame CSS
const regex = /\/\* =========================================\n   Elite & Premium Avatar Frames[\s\S]*$/;
code = code.replace(regex, "");

code += `
/* =========================================
   Elite & Premium Professional Avatar Frames
   ========================================= */

/* The Wrapper (relative positioning context) */
.profile-avatar-wrap.premium-frame,
.drawer-avatar-wrap.premium-frame,
.top-bar-avatar.premium-frame {
  position: relative;
  border-radius: 50%;
  border: 3px solid #FFC300;
  box-shadow: 0 0 8px rgba(255, 195, 0, 0.4);
  background: transparent;
  padding: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar.elite-frame {
  position: relative;
  border-radius: 50%;
  border: 3px solid #00D4FF;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
  background: transparent;
  padding: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Base style for icons inside the border */
.premium-crown, .elite-crown {
  position: absolute;
  top: -12px;
  right: -8px;
  font-size: 1.1rem;
  z-index: 10;
  transform: rotate(20deg);
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.5));
}
.premium-crown { color: #FFC300; }
.elite-crown { color: #00D4FF; }

/* Scale down icons for smaller nav avatars */
.top-bar-avatar .premium-crown,
.top-bar-avatar .elite-crown {
  font-size: 0.8rem;
  top: -8px;
  right: -5px;
}

/* Base style for the bottom badge pill */
.premium-tag, .elite-tag {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 800;
  color: #fff;
  z-index: 10;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  text-transform: uppercase;
}

.premium-tag {
  background: linear-gradient(135deg, #F39C12, #FFC300);
}

.elite-tag {
  background: linear-gradient(135deg, #0288D1, #00D4FF);
}

.top-bar-avatar .premium-tag,
.top-bar-avatar .elite-tag {
  font-size: 0.45rem;
  padding: 2px 6px;
  bottom: -8px;
}

/* Adjust the inner avatar inside the frame so it fits perfectly */
.premium-frame .profile-avatar,
.elite-frame .profile-avatar,
.premium-frame .drawer-avatar,
.elite-frame .drawer-avatar {
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Fix size adjustments */
.drawer-avatar-wrap.premium-frame,
.drawer-avatar-wrap.elite-frame {
  margin-bottom: 5px;
}
`;

fs.writeFileSync('css/style.css', code);
console.log('CSS added');
