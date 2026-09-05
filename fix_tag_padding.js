import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

// Replace the tag CSS specifically to remove left/right space
// And adjust the bottom positioning so it looks better relative to the frame
css = css.replace(
  /\.profile-avatar-wrap \.premium-tag,\s*\.profile-avatar-wrap \.elite-tag\s*\{[\s\S]*?\}/,
  `.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  font-size: 0.6rem !important;
  padding: 1px 6px !important; 
  bottom: -4px !important;
  line-height: 1.2 !important;
  letter-spacing: 0.5px !important;
  border-radius: 4px !important;
}`
);

// We should also override the base .premium-tag, .elite-tag to be smaller padding by default
css = css.replace(
  /padding: 2px 6px; \/\* Base padding \*\//,
  'padding: 1px 4px !important; /* Minimized padding */'
);

fs.writeFileSync('css/style.css', css);
console.log('Fixed padding of tags');
