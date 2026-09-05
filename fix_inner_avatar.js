import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

// The shape issue: the inner div is stretching or has conflicting paddings.
// We should reset its width/height strictly inside the wrapper.

css += `
/* Absolute strictness for inner circle */
.premium-frame .profile-avatar,
.elite-frame .profile-avatar,
.premium-frame .drawer-avatar,
.elite-frame .drawer-avatar,
.premium-frame .top-bar-avatar,
.elite-frame .top-bar-avatar,
.premium-frame .dash-avatar-circle,
.elite-frame .dash-avatar-circle {
  width: 100% !important;
  height: 100% !important;
  min-width: unset !important;
  min-height: unset !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.profile-avatar-wrap.premium-frame,
.profile-avatar-wrap.elite-frame,
.drawer-avatar-wrap.premium-frame,
.drawer-avatar-wrap.elite-frame,
.top-bar-avatar-wrap.premium-frame,
.top-bar-avatar-wrap.elite-frame {
  aspect-ratio: 1/1 !important; /* Force the wrapper itself to be perfectly square */
}

/* Base explicit sizes for the wrappers so they don't deform */
.top-bar-avatar-wrap {
  width: 32px;
  height: 32px;
}
.drawer-avatar-wrap {
  width: 46px;
  height: 46px;
}
.profile-avatar-wrap,
.dash-user-meta .profile-avatar-wrap {
  width: 60px;
  height: 60px;
}
@media (max-width: 480px) {
  .dash-user-meta .profile-avatar-wrap {
    width: 50px;
    height: 50px;
  }
}
`;

fs.writeFileSync('css/style.css', css);
console.log('Fixed wrapper sizes and inner avatar strictness');
