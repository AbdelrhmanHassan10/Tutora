const fs = require('fs');
let css = fs.readFileSync('Artifact-show/style.css', 'utf8');

if (!css.includes('[dir="rtl"] .info-content')) {
    css += `

/* RTL Support */
[dir="rtl"] .info-content { text-align: right; }
[dir="rtl"] .artifact-title, [dir="rtl"] .intro-heading, [dir="rtl"] .details-heading, [dir="rtl"] .stats-grid h3 { text-align: right; }
[dir="rtl"] .stat-card { text-align: right; border-left: none; border-right: 4px solid var(--primary); padding-right: 1.5rem; padding-left: 0; }
[dir="rtl"] .back-btn-breadcrumbs .material-symbols-outlined { transform: scaleX(-1); }
`;
    fs.writeFileSync('Artifact-show/style.css', css, 'utf8');
}
