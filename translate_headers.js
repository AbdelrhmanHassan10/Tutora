const fs = require('fs');
const path = require('path');

const navMap = {
    'Home': { k: 'nav.home', ar: 'الرئيسية' },
    'Plan Your Visit': { k: 'nav.plan_visit', ar: 'خطط لزيارتنك' },
    'Kids-Museum': { k: 'nav.kids_museum', ar: 'متحف الأطفال' },
    'Event': { k: 'nav.events', ar: 'الفعاليات' },
    'AI Experience': { k: 'nav.ai_experience', ar: 'تجربة الذكاء الاصطناعي' },
    'AI Tour Guide': { k: 'nav.ai_guide', ar: 'المرشد السياحي بالذكاء الاصطناعي' },
    'AI Chatbot': { k: 'nav.ai_chatbot', ar: 'دردشة الذكاء الاصطناعي' },
    'AI Artifact Identifier': { k: 'nav.ai_identifier', ar: 'التعرف على القطع الأثرية' },
    'AI Voice Storytelling (3D )': { k: 'nav.ai_3d', ar: 'القصص الصوتية (ثلاثية الأبعاد)' },
    'Tutora laboratory': { k: 'nav.ai_lab', ar: 'مختبر توتورا' },
    'Shop': { k: 'nav.shop', ar: 'المتجر' },
    'About': { k: 'nav.about', ar: 'عنا' },
    'Collection': { k: 'nav.collection', ar: 'المجموعة' },
    'Main Gallery': { k: 'nav.main_gallery', ar: 'المعرض الرئيسي' },
    'Exhibition Halls': { k: 'nav.exhibitions', ar: 'قاعات العرض' }
};

function processFile(filepath) {
    let content;
    try {
        content = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
        return;
    }

    const originalContent = content;
    let changed = false;

    for (const [enText, data] of Object.entries(navMap)) {
        // Regex to match exact text content between tags, avoiding if it already has data-i18n
        // This is tricky because some tags have whitespace.
        // We look for: > [whitespace] Text [whitespace] <
        const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
        const flexText = escapedText.replace(/\\s+/g, '\\s+');
        
        const regex = new RegExp(`(<a[^>]*class="[^"]*(?:menu-link|dropdown-link|dropdown-item)[^"]*"[^>]*>\\s*)(${flexText})(\\s*<\\/a>)`, 'g');
        const regex2 = new RegExp(`(<a[^>]*>\\s*)(${flexText})(\\s*<\\/a>)`, 'g');
        const regexButton = new RegExp(`(<button[^>]*class="[^"]*(?:menu-link|dropdown-trigger)[^"]*"[^>]*>\\s*)(${flexText})(\\s*<span)`, 'g');
        const regexButton2 = new RegExp(`(<button[^>]*class="[^"]*(?:menu-link|dropdown-trigger)[^"]*"[^>]*>\\s*)(${flexText})(\\s*<\\/button>)`, 'g');

        content = content.replace(regex, (match, p1, p2, p3) => {
            if (p1.includes('data-i18n')) return match;
            changed = true;
            return p1.replace('>', ` data-i18n="${data.k}">`) + p2 + p3;
        });

        content = content.replace(regexButton, (match, p1, p2, p3) => {
            if (p1.includes('data-i18n')) return match;
            changed = true;
            // Add a span around the text if it's mixed with a span icon
            return p1 + `<span data-i18n="${data.k}">${p2}</span>` + p3;
        });
        
        content = content.replace(regexButton2, (match, p1, p2, p3) => {
            if (p1.includes('data-i18n')) return match;
            changed = true;
            return p1.replace('>', ` data-i18n="${data.k}">`) + p2 + p3;
        });
        
        // Also find inside Desktop Nav <nav class="desktop-nav"> ... </nav>
        const desktopRegex = new RegExp(`(<a[^>]*href="[^"]*"[^>]*>\\s*)(${flexText})(\\s*<\\/a>)`, 'g');
        content = content.replace(desktopRegex, (match, p1, p2, p3) => {
            // make sure it's inside header or nav
            if (p1.includes('data-i18n')) return match;
            changed = true;
            return p1.replace('>', ` data-i18n="${data.k}">`) + p2 + p3;
        });
    }

    if (changed && content !== originalContent) {
        // Fix double attributes
        content = content.replace(/data-i18n="[^"]+"\s+data-i18n="([^"]+)"/g, 'data-i18n="$1"');
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === '.git' || file === 'node_modules' || file.startsWith('.')) return;
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filepath));
        } else {
            if (filepath.endsWith('.html')) {
                results.push(filepath);
            }
        }
    });
    return results;
}

console.log("Processing HTML files...");
const htmlFiles = walk('.');
htmlFiles.forEach(processFile);

console.log("Updating global-lang.js...");
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const enEntries = Object.entries(navMap).filter(([en, data]) => !langContent.includes('"' + data.k + '"')).map(([en, data]) => '"' + data.k + '": "' + en + '"').join(',\n        ');
const arEntries = Object.entries(navMap).filter(([en, data]) => !langContent.includes('"' + data.k + '"')).map(([en, data]) => '"' + data.k + '": "' + data.ar + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

langContent = langContent.split('\\\\n').join(String.fromCharCode(10));

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log("Done.");
