import fs from 'fs';
let css = fs.readFileSync('css/style.css', 'utf8');

const finalTagFix = `
/* ========================================================
   FINAL TAG FIX: REMOVE WHITE BORDER & PERFECT CENTERING
   ======================================================== */

.profile-avatar-wrap .premium-tag,
.profile-avatar-wrap .elite-tag {
  bottom: -10px !important;
  left: 50% !important;
  transform: translateX(-50%) !important; /* Perfect Center Alignment */
  padding: 1.5px 7px !important; 
  font-size: 0.55rem !important; /* Made the text slightly smaller */
  border-radius: 12px !important;
  border: none !important; /* Removed the white border */
  z-index: 30 !important;
  display: inline-block !important;
  line-height: 1.1 !important;
  text-align: center !important;
}

/* Ensure global tag rules don't override the border removal */
.elite-tag {
  border: none !important;
}
.premium-tag {
  border: none !important;
}
`;

css += '\n' + finalTagFix;
fs.writeFileSync('css/style.css', css);
console.log('Removed tag white border and centered text.');
