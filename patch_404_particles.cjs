const fs = require('fs');
let html = fs.readFileSync('404/index.html', 'utf8');

// Add particles container after body tag
if (!html.includes('id="particles-js"')) {
  html = html.replace('<body>', '<body>\n  <div id="particles-js" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1;"></div>');
}

// Add particles script before closing body
if (!html.includes('particles.js/2.0.0')) {
  const particleScript = `
  <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
  <script>
    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: '#ff2a6d' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#ff2a6d', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  </script>
</body>`;
  html = html.replace('</body>', particleScript);
}

fs.writeFileSync('404/index.html', html);
