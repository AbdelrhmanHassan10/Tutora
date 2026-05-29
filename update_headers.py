import os
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # Fallback to other encoding if needed
        return

    original_content = content
    changed = False

    # 1. Replace logo-section div with a tag
    logo_pattern = r'<div class="logo-section">([\s\S]*?)<h2 class="logo-text">Tutora</h2>\s*</div>'
    
    # Calculate prefix based on logo.png path
    prefix_match = re.search(r'src="(.*?)logo\.png"', content)
    prefix = prefix_match.group(1) if prefix_match else "../"

    logo_replacement = f'<a href="{prefix}4.home/code.html" class="logo-section" style="text-decoration: none;">\\1<h2 class="logo-text">Tutora</h2></a>'
    
    if re.search(logo_pattern, content):
        content = re.sub(logo_pattern, logo_replacement, content)
        changed = True
    elif 'class="logo-section"' in content and '<h2 class="logo-text">Tutora</h2></a>' not in content:
        # Maybe it's slightly different
        pass

    # 2. Add titles to icons in header-right
    # themeBtn
    if '<button class="theme-btn" id="themeBtn">' in content:
        content = content.replace('<button class="theme-btn" id="themeBtn">', '<button class="theme-btn" id="themeBtn" title="Toggle Theme">')
        changed = True

    # booking btn
    booking_pattern = r'(<a href="[^"]*?booking/booking\.html"[^>]*class="btn-booking"[^>]*)(?<!title="Book Tickets")>'
    if re.search(booking_pattern, content):
        content = re.sub(booking_pattern, r'\1 title="Book Tickets">', content)
        changed = True

    # fav btn
    fav_pattern = r'(<a href="[^"]*?fav/favourite\.html" class="icon-btn-link")(?<!title="Favorites")>'
    if re.search(fav_pattern, content):
        content = re.sub(fav_pattern, r'\1 title="Favorites">', content)
        changed = True

    # cart btn
    cart_pattern = r'(<a href="[^"]*?card/card\.html" class="icon-btn-link")(?<!title="Cart")>'
    if re.search(cart_pattern, content):
        content = re.sub(cart_pattern, r'\1 title="Cart">', content)
        changed = True

    # langBtn
    if '<button class="icon-btn" id="langBtn">' in content:
        content = content.replace('<button class="icon-btn" id="langBtn">', '<button class="icon-btn" id="langBtn" title="Language">')
        changed = True

    # 3. Profile link to dropdown
    profile_pattern = r'<a href="([^"]*?Profile/profile\.html)" class="profile-link">\s*<img src="([^"]*?)" alt="Profile" class="profile-img"\s*/?>\s*</a>'
    
    def profile_repl(m):
        profile_url = m.group(1)
        img_src = m.group(2)
        
        settings_url = prefix + "setting/setting.html"
        login_url = prefix + "2.login/code.html"

        return f'''<div class="nav-dropdown profile-dropdown" id="navProfileLink" style="display: none;" title="Profile">
            <button class="nav-link dropdown-trigger profile-trigger" style="padding: 0; background: transparent; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <img src="{img_src}" alt="Profile" class="profile-img" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary-gold);" />
              <span class="material-symbols-outlined" style="color: var(--text-primary);">expand_more</span>
            </button>
            <div class="dropdown-menu" style="right: 0; left: auto; min-width: 150px;">
              <a href="{profile_url}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
              <a href="{settings_url}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px;">settings</span> Settings</a>
              <a href="#" class="dropdown-link" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
            </div>
          </div>
          
          <a href="{login_url}" class="icon-btn-link" id="navLoginBtn" style="display: none;" title="Login">
            <button class="icon-btn">
              <span class="material-symbols-outlined">login</span>
            </button>
          </a>'''

    if re.search(profile_pattern, content):
        content = re.sub(profile_pattern, profile_repl, content)
        changed = True

    if changed and content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            process_file(filepath)
