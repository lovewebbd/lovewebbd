         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
         body: JSON.stringify(adminPackagesConfig[pkgName])
      }).catch(e => console.error(e));
    }

    async function deletePackage(pkgName) {
      if(!confirm('Are you sure you want to delete the ' + pkgName + ' package?')) return;
      try {
        const token = window.adminToken || localStorage.getItem('loveweb_admin_token');
        const res = await fetch('/api/admin/packages/delete/' + encodeURIComponent(pkgName), {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if(res.ok) {
           delete adminPackagesConfig[pkgName];
           if (adminSelectedPkg === pkgName) adminSelectedPkg = null;
           renderAdminPackages();
           alert('Package deleted');
        } else {
           alert('Failed to delete package');
        }
      } catch(e) {
        alert('Error deleting package');
      }
    }
