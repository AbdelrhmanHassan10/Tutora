const fs = require('fs');

const files = fs.readdirSync('.', {recursive:true}).filter(f => f.endsWith('.html') && !f.includes('node_modules'));

const injection = `
      <div class="menu-dropdown" id="menuProfileLink" style="display: none;">
        <button class="menu-link dropdown-toggle">
          <span data-i18n="nav.profile_menu">Profile Menu</span>
          <span class="material-symbols-outlined">expand_more</span>
        </button>
        <div class="dropdown-items">
          <a href="../Profile/profile.html" class="dropdown-item" style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
          <a href="../setting/setting.html" class="dropdown-item" style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px;">settings</span> Settings</a>
          <a href="#" class="dropdown-item" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
        </div>
      </div>

      <a href="../2.login/code.html" class="menu-link" id="menuLoginBtn" style="display: none; align-items: center; gap: 8px;">
        <span class="material-symbols-outlined">login</span>
        <span data-i18n="nav.login">Login</span>
      </a>
    </nav>`;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Check if we already injected it
    if (content.includes('id="menuProfileLink"')) {
        // remove old injection to replace it if needed, or skip. For now, skip if exists.
        return;
    }

    // Find the end of </nav> in the mobile menu context.
    // We can target the exact Collection dropdown closing divs and nav.
    // A reliable way is to find `<nav class="menu-nav">` and then find its closing `</nav>`.
    
    const menuNavMatch = content.match(/<nav class="menu-nav">[\s\S]*?<\/nav>/);
    if (menuNavMatch) {
        let navContent = menuNavMatch[0];
        let newNavContent = navContent.replace(/<\/nav>$/, injection.trim() + '\n    </nav>');
        let newContent = content.replace(navContent, newNavContent);
        
        if (content !== newContent) {
            fs.writeFileSync(f, newContent);
            console.log('Updated mobile menu in', f);
        }
    }
});
