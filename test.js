
    let allDemos = [];
    
    async function loadDemos() {
      try {
        const res = await fetch('/api/demos');
        const data = await res.json();
        if (data.success) {
          allDemos = data.demos || [];
        }
      } catch (err) {
        console.error("Failed to load demos:", err);
      }
    }
    
    function openCategory(catName) {
      document.getElementById('categoriesView').style.display = 'none';
      document.getElementById('demosListView').style.display = 'flex';
      document.getElementById('categoryTitle').innerText = catName + ' Demos';
      
      const grid = document.getElementById('demosGrid');
      grid.innerHTML = '';
      
      // Filter demos based on category if they have it, otherwise just do basic keyword matching or fallback
      let filtered = allDemos.filter(d => (d.category && d.category === catName));
      
      // Fallback: if no category match, try keyword in name
      if (filtered.length === 0) {
         filtered = allDemos.filter(d => d.name.toLowerCase().includes(catName.toLowerCase()));
      }
      // If still empty and "Others", show everything else
      if (filtered.length === 0 && catName === 'Others') {
         filtered = allDemos.filter(d => !d.category || !['Birthday', 'Anniversary', 'Relationship', 'Friendship'].includes(d.category));
      }

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No demos found in this category.</p>';
      } else {
        filtered.forEach(demo => {
          let imgSrc = '';
          if(demo.category === 'Birthday' || catName === 'Birthday') {
            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Birthday%20Cake.png';
          } else if(demo.category === 'Anniversary' || catName === 'Anniversary') {
            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Ring.png';
          } else if(demo.category === 'Relationship' || catName === 'Relationship') {
            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png';
          } else if(demo.category === 'Friendship' || catName === 'Friendship') {
            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png';
          } else {
            imgSrc = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png';
          }

          grid.innerHTML += `
            <div class="demo-item" onclick="openDemo('${demo.id}')">
              <div class="demo-item-icon">
                <img src="${imgSrc}" width="30" height="30" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));">
              </div>
              <div class="demo-item-details">
                <h4>${demo.name}</h4>
                <span class="view-btn"><i class="fa-solid fa-eye"></i> View Demo</span>
              </div>
            </div>
          `;
        });
      }
    }
    
    function backToCategories() {
      document.getElementById('demosListView').style.display = 'none';
      document.getElementById('categoriesView').style.display = 'grid';
    }
    
    function openDemo(id) {
      const demo = allDemos.find(d => d.id === id);
      document.getElementById('demoModalTitle').innerText = demo ? demo.name : 'Demo View';
      document.getElementById('demoIframe').src = '/api/demo/view/' + id;
      document.getElementById('demoModal').style.display = 'flex';
    }

    function closeDemoModal() {
      document.getElementById('demoModal').style.display = 'none';
      document.getElementById('demoIframe').src = '';
    }
    
    window.addEventListener('DOMContentLoaded', loadDemos);
  