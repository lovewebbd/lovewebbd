import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

// The issue with the elite tag having too much padding:
css = css.replace(
  /\.profile-avatar-wrap \.premium-tag,\s*\.profile-avatar-wrap \.elite-tag\s*\{[\s\S]*?\}/,
  `.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  font-size: 0.65rem;
  padding: 2px 8px; /* Reduced padding */
  bottom: -6px;
  line-height: 1.2;
}`
);

css = css.replace(
  /\.premium-tag, \.elite-tag\s*\{[\s\S]*?\}/,
  `.premium-tag, .elite-tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 6px; /* slightly sharper for a better look */
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
  padding: 2px 6px; /* Base padding */
  font-size: 0.55rem; /* Base size */
}`
);


// Ensure all inner avatars are strictly circular
const extraCss = `

/* Ensure perfect circle for avatar images/initials */
.profile-avatar, .drawer-avatar, .top-bar-avatar, .dash-avatar-circle {
  border-radius: 50% !important;
  object-fit: cover !important;
  aspect-ratio: 1/1 !important;
}

/* Specific fix for inner avatar when framed */
.premium-frame > div:not(.premium-tag):not(.premium-crown),
.elite-frame > div:not(.elite-tag):not(.elite-crown) {
  border-radius: 50% !important;
  aspect-ratio: 1/1 !important;
  overflow: hidden !important;
}
`;

css += extraCss;

fs.writeFileSync('css/style.css', css);
console.log('Fixed CSS for avatars and tags');
