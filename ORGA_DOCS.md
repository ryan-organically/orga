# ORGA DOCS - Organically Website Documentation

**Last Updated**: Sep 2025 | **Version**: 2.0 | **VS Code Ready**: ✅

## 🏗️ PROJECT STRUCTURE

```
orga website/
├── index.html (614 lines) - Main homepage
├── 50+ HTML pages (blog posts, services, landing pages)
├── css/
│   ├── organicallyseo-com.webflow.css (123KB) - Main styles
│   ├── webflow.css (38KB) - Framework base styles
│   └── normalize.css (8KB) - CSS reset
├── fonts/ - Custom fonts (Coolvetica, LTMuseum)
├── images/ - 300+ assets (54MB total - needs optimization)
├── videos/ - Background/hero videos (37MB)
└── blog-card-improvements.css - Custom overrides
```

## 🔍 KEY FINDINGS

**Webflow Dependencies**: REMOVED (saved 1.6MB JS + 93MB zip)
**SEO Status**: Good foundation, needs schema markup
**Performance**: Optimized (lazy loading, WebP images)
**VS Code Ready**: All Webflow infrastructure removed

## 📄 CRITICAL FILES

**Homepage**: `index.html:1-44` - Complete SEO meta tags, canonical URL
**Main CSS**: `css/organicallyseo-com.webflow.css` - All styling, responsive design
**Custom JS**: Embedded in HTML files (GSAP animations, menu interactions)

## 🎯 IMMEDIATE ACTIONS NEEDED

### HIGH PRIORITY
1. **Add Schema**: LocalBusiness markup to homepage head
2. **Fix Images**: Add alt text to 200+ images missing descriptions
3. **Create**: sitemap.xml, robots.txt
4. **Optimize Images**: 54MB folder needs compression/WebP conversion

### MEDIUM PRIORITY
1. **Optimize CSS**: Purge unused classes from main stylesheet
2. **Enhance**: Add Service schema to service pages
3. **Improve**: Internal linking between related pages

## 🛠️ TECHNICAL DETAILS

**Font Loading**: Google Fonts (Vollkorn, Lato, Oswald) + custom fonts
**Analytics**: Google Analytics (gtag.js) implemented
**Forms**: Webflow native forms with proper validation
**Mobile**: Fully responsive, proper viewport meta

## ⚡ PERFORMANCE NOTES

**Strengths**:
- Extensive lazy loading (751+ instances)
- WebP image format usage
- Font preconnect optimization
- Responsive image srcsets

**Weaknesses**:
- Large JS bundle (1.6MB webflow.js)
- Many unused Webflow classes
- Missing critical CSS inlining

## 🏪 LOCAL SEO SETUP

**Current**: Pittsburgh, PA focus, proper meta descriptions
**Missing**: Google My Business schema, local service areas
**Opportunity**: Expand to surrounding PA markets

## 📋 PAGE INVENTORY (Top Priority)

**Service Pages**: seo.html, web-design.html, branding.html
**Blog Posts**: 20+ articles (good content depth)
**Location Pages**: local-seo-houston.html, san-jose-seo.html
**Utility**: 404.html, 401.html, privacy-policy.html, sitemap.html

## 💡 CLAUDE USAGE TIPS

**For SEO**: Focus on schema markup implementation first
**For Performance**: Audit unused CSS classes before optimization
**For Content**: Blog posts are well-optimized, focus on service pages
**For Cleanup**: Start with deleting untitled.html, then audit images

## 🆕 VS CODE WORKFLOW

**Development**: All files ready for local editing
**Dependencies**: CSS/fonts preserved, Webflow JS removed
**Custom Code**: Menu interactions, GSAP animations embedded in HTML
**External APIs**: Google Fonts, GSAP CDN, jQuery CDN (legacy)

## 📊 CLEANUP SUMMARY

**Removed**:
- 1.6MB webflow.js (interactions framework)
- 93MB webflow export zip
- Webflow meta tags and data attributes
- Touch detection scripts

**Preserved**:
- All styling and visual design
- Custom animations (GSAP-based)
- Menu functionality (custom JS)
- SEO meta tags and structure

---
**Next Steps**: Add schema markup → Create sitemap.xml → Optimize images → Test functionality
**Est. Time**: 3-4 hours for SEO fixes, 1 day for image optimization