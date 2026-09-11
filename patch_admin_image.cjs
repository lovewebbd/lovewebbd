const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, 'admin', 'index.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

// Add Image Modal HTML if it doesn't exist
if (!content.includes('id="imageViewerModal"')) {
    const modalHtml = `
  <!-- Image Viewer Modal -->
  <div class="confirm-modal-overlay" id="imageViewerModal" style="display:none; z-index:10000; padding:20px;">
    <div style="background:var(--admin-card); padding:10px; border-radius:12px; max-width:800px; width:100%; max-height:90vh; display:flex; flex-direction:column; position:relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: modalFadeIn 0.3s ease;">
      <button style="position:absolute; top:15px; right:15px; background:var(--admin-danger); color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3);" onclick="closeImageModal()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div style="flex:1; overflow:hidden; display:flex; align-items:center; justify-content:center; padding-top:25px;">
         <img id="imageViewerImg" src="" style="max-width:100%; max-height:calc(90vh - 50px); object-fit:contain; border-radius:8px;">
      </div>
    </div>
  </div>
  <script>
    function openImageModal(imgUrl, e) {
       if(e) e.preventDefault();
       document.getElementById('imageViewerImg').src = imgUrl;
       document.getElementById('imageViewerModal').style.display = 'flex';
    }
    function closeImageModal() {
       document.getElementById('imageViewerModal').style.display = 'none';
       document.getElementById('imageViewerImg').src = '';
    }
  </script>
`;
    // Insert just before closing body tag
    content = content.replace('</body>', modalHtml + '\n</body>');
}

// Replace Due Payment SS button
content = content.replace(
    /\<a href="\$\{o\.duePaymentScreenshot\}" target="_blank" style="font-size:0\.7rem; color:#3b82f6;"\>/g,
    '<a href="#" onclick="openImageModal(\'${o.duePaymentScreenshot}\', event)" style="font-size:0.7rem; color:#3b82f6;">'
);

// Replace Advance Payment SS button
content = content.replace(
    /\<a href="\$\{o\.paymentScreenshot\}" target="_blank" class="btn-action" style="background:#10b981; padding:4px 8px; font-size:0\.75rem; text-decoration:none; display:inline-block; width:100%; box-sizing:border-box;"\>/g,
    '<a href="#" onclick="openImageModal(\'${o.paymentScreenshot}\', event)" class="btn-action" style="background:#10b981; padding:4px 8px; font-size:0.75rem; text-decoration:none; display:inline-block; width:100%; box-sizing:border-box; text-align:center;">'
);

// Replace Order Details modal image
content = content.replace(
    /\<a href="\$\{order\.paymentScreenshot\}" target="_blank"\>\<img src="\$\{order\.paymentScreenshot\}"/g,
    '<a href="#" onclick="openImageModal(\'${order.paymentScreenshot}\', event)"><img src="${order.paymentScreenshot}"'
);

fs.writeFileSync(adminHtmlPath, content);
console.log('Admin HTML patched for image viewer modal.');
