const fs = require('fs');
const files = ['settings/index.html', 'js/auth.js', 'js/google-signup.js'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it already has .order
    if (!content.includes('order: (col, opts)')) {
      const target = `or: (cond) => { query.filters.push({ type: 'or', cond }); return builder; },
                        single: () => { query.single = true; return builder; },`;
      const replacement = `or: (cond) => { query.filters.push({ type: 'or', cond }); return builder; },
                        single: () => { query.single = true; return builder; },
                        order: (col, opts) => { query.order = { col, opts }; return builder; },
                        limit: (num) => { query.limitNum = num; return builder; },`;
                        
      if (content.includes(target)) {
          content = content.replace(target, replacement);
      } else {
          // Alternative target (some files might not have 'or')
          const target2 = `single: () => { query.single = true; return builder; },`;
          const replacement2 = `single: () => { query.single = true; return builder; },
                        order: (col, opts) => { query.order = { col, opts }; return builder; },
                        limit: (num) => { query.limitNum = num; return builder; },`;
          content = content.replace(target2, replacement2);
      }

      // Now patch the .then
      const thenTarget = `const p = runQuery(query).then(r => {
                            if (query.single) return { data: (r.data && r.data[0]) || null, error: r.error };
                            return r;
                        });`;
      const thenReplacement = `const p = runQuery(query).then(r => {
                            if (r.data && query.order) {
                                r.data.sort((a,b) => {
                                    const valA = a[query.order.col];
                                    const valB = b[query.order.col];
                                    if (valA < valB) return query.order.opts?.ascending === false ? 1 : -1;
                                    if (valA > valB) return query.order.opts?.ascending === false ? -1 : 1;
                                    return 0;
                                });
                            }
                            if (r.data && query.limitNum) {
                                r.data = r.data.slice(0, query.limitNum);
                            }
                            if (query.single) return { data: (r.data && r.data[0]) || null, error: r.error };
                            return r;
                        });`;
      
      content = content.replace(thenTarget, thenReplacement);
      fs.writeFileSync(file, content);
      console.log(`Patched ${file}`);
    }
  }
});
