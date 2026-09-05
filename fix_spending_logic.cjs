const fs = require('fs');

// We need to fetch from API just like in profile, because localStorage might be empty or outdated!
// But since index.html and official-nav.js are synchronous rendering HTML before fetch completes,
// we will have to adjust them to fetch and then update the DOM dynamically, or fetch inside the script.
