# Claude Code Guidelines

## URL Strategy (IMPORTANT - Read Before Editing Links)

This site uses Jekyll with `permalink: pretty` in `_config.yml`. This has critical implications for internal links.

### How Jekyll Pretty Permalinks Work

| Source File | Jekyll Serves At | Direct Access |
|-------------|------------------|---------------|
| `blog.html` | `/blog/` | `/blog` 301→ `/blog/` |
| `seo.html` | `/seo/` | `/seo` 301→ `/seo/` |
| `es/seo.html` | `/es/seo/` | `/es/seo` 301→ `/es/seo/` |

### Internal Link Rules

**ALWAYS use trailing slashes for internal links:**

```html
<!-- CORRECT -->
<a href="/blog/">Blog</a>
<a href="/seo/">SEO Services</a>
<a href="/web-design/">Web Design</a>
<a href="/es/seo/">SEO (Spanish)</a>

<!-- WRONG - causes 301 redirect -->
<a href="/blog">Blog</a>
<a href="/seo">SEO Services</a>

<!-- WRONG - breaks on trailing-slash pages, causes 404 -->
<a href="blog.html">Blog</a>
<a href="seo.html">SEO Services</a>

<!-- WRONG - .html with absolute path, may not resolve -->
<a href="/blog.html">Blog</a>
```

### Why This Matters

1. **Relative `.html` links break**: If user accesses `/seo-for-dentists/` (with trailing slash), a relative link `href="blog.html"` resolves to `/seo-for-dentists/blog.html` which 404s.

2. **No-trailing-slash links cause 301s**: `href="/blog"` works but 301 redirects to `/blog/`. This wastes crawl budget and slows page loads.

3. **Trailing-slash links work directly**: `href="/blog/"` serves the page immediately with no redirect.

### Quick Reference

| Page | Correct Link |
|------|--------------|
| Homepage | `/` |
| SEO | `/seo/` |
| Web Design | `/web-design/` |
| Branding | `/branding/` |
| Blog | `/blog/` |
| About | `/about-us/` |
| Privacy Policy | `/privacy-policy/` |
| Spanish Homepage | `/es/` |
| Spanish SEO | `/es/seo/` |

### Current State (as of Jan 2025)

The site historically used mixed URL formats. A cleanup was performed to fix broken relative links, but not all links have trailing slashes yet. When editing any file, ensure new links follow the trailing-slash convention above.

---

## CSS Rules

- Never use `!important` in CSS. Use higher specificity selectors instead (e.g., `[style]` attribute selector to override inline styles).
- Verify CSS variables exist in `css/organicallyseo-com.webflow.css` before using them. Non-existent variables silently fail.
- `--black-40` is the standard border color.

### CSS Debugging Rule

When analyzing CSS for a specific selector, always search for ALL occurrences of that selector within:
1. The file's inline `<style>` block(s) - check the ENTIRE file, not just the first match
2. The global CSS file (`css/organicallyseo-com.webflow.css`)

Later rules in the cascade override earlier ones. Use `grep` on the target file before summarizing what styles apply:

```bash
# Find all instances of a selector in a file
grep -n "\.hero-section" contractor-funnel.html
```

Never assume you've found all overrides after the first few matches.

## Homepage Layout System (index.html)

### Structure
```
body.horizontal-body (flex, justify-content: center)
├── .side-menu-panel (5% visible, actually 75vw mobile / ~40vw desktop)
│   └── .side-panel (100% of parent)
│       └── .menu-nav (must be 100% width of parent)
│           └── .menu-nav-link (must extend full width of parent)
├── .body-section (90% width, margin: 0 auto, centered, scrollable)
│   └── sections/content (100% of body-section)
└── .calendar-module (5% visible, actually 75vw mobile / ~40vw desktop)
    └── .calendar-panel-content
```

### Key Principles

1. **Three-column flex layout**: Body has exactly 3 direct children arranged horizontally
2. **Visual vs actual widths**: Side panels appear as 5% margins but are actually wide (75vw mobile, ~40vw desktop) - user can pan horizontally to reveal sticky side menus
3. **Centered body-section**: The body-section is centered and is what scrolls vertically
4. **Equal margins**: Left and right margins must always be equal (5% each visually)
5. **Side panels are relative/sticky**: Not position:fixed - they participate in flexbox flow
6. **Menu items full width**: .menu-nav and .menu-nav-link must extend to full width of their parent .side-panel

### Width Calculations
- body: 100%
- side-menu-panel: 5% (visual), actual content width ~75vw mobile / 40vw desktop
- body-section: 90% with margin: 0 auto
- calendar-module: 5% (visual), actual content width ~75vw mobile / 40vw desktop
- Total: 5% + 90% + 5% = 100%

### Critical CSS Locations
- External CSS: `css/organicallyseo-com.webflow.css` (body, body-section base styles)
- Inline CSS: `index.html` line ~1224 (panel positioning, breakpoints)

### Do Not Change Without Permission
- Panel widths or positioning
- body-section centering (margin: 0 auto)
- Flexbox layout on body.horizontal-body

---

## Development Workflow

### Running the Site Locally

```bash
# Install dependencies (first time only)
bundle config set --local path 'vendor/bundle'
bundle install

# Serve the site locally
bundle exec jekyll serve
```

Site will be available at `http://127.0.0.1:4000/`

**Note:** Jekyll doesn't auto-rebuild `css/` changes into `_site/`. After editing CSS, copy it manually: `cp css/organicallyseo-com.webflow.css _site/css/` or restart the server.

### Jekyll Requirements

All HTML files must have **front matter** at the very top for Jekyll to process Liquid tags:

```html
---
---
<!DOCTYPE html>
...
```

Without front matter, `{% include %}` tags will render as literal text.

---

## Component System (Jekyll Includes)

Shared components live in `_includes/`. Use them to avoid duplicating HTML.

### Available Includes

| Include | Usage | Description |
|---------|-------|-------------|
| `side-menu.html` | `{% include side-menu.html %}` | Left navigation panel with site links |
| `universal-menu.html` | `{% include universal-menu.html %}` | Top bar with hamburger, dark mode toggle, CTA button |
| `footer.html` | `{% include footer.html %}` | Site footer |
| `footer-es.html` | `{% include footer-es.html %}` | Spanish site footer |
| `toc.html` | `{% include toc.html %}` | Sticky table of contents (uses page front matter) |

### Page Structure

```html
---
---
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body class="horizontal-body">
  {% include side-menu.html %}

  <div class="body-section">
    {% include universal-menu.html %}
    <!-- Page content here -->
    {% include footer.html %}
  </div>

  <div class="calendar-module">...</div>
</body>
</html>
```

### Table of Contents Component

The `toc.html` include reads from page front matter:

```yaml
---
toc_title: "What You're Reading..."
toc:
  - anchor: section-1
    text: First Section
  - anchor: section-2
    text: Second Section
---
```

Then use in the page:
```html
{% include toc.html %}
```

You can also pass items directly:
```html
{% include toc.html title="Custom Title" items=page.toc %}
```

### Asset Paths

Always use **absolute paths** for assets (CSS, images, JS):

```html
<!-- CORRECT -->
<link href="/css/normalize.css" rel="stylesheet">
<img src="/images/logo.png">

<!-- WRONG - breaks with pretty URLs -->
<link href="css/normalize.css" rel="stylesheet">
<img src="images/logo.png">
```
