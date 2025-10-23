# Organically Web Components Guide

This directory contains reusable web components used across all pages of the Organically website.

## 🎯 What Are Web Components?

Web components are custom, reusable HTML elements that encapsulate functionality. They allow you to **edit once and update everywhere** - no need to manually update 51 HTML files!

## 📦 Available Components

### 1. **universal-menu.js**
The hamburger menu button that morphs into a close arrow.
- Features GSAP animations
- Coordinates with side-menu-panel
- Already existed (unchanged)

### 2. **universal-nav.js**
The complete navigation bar at the top of each page.
- Contains the universal-menu hamburger
- Light/dark mode toggle
- "Schedule a call" calendar toggle button

**Usage:**
```html
<universal-nav></universal-nav>
```

### 3. **side-menu-panel.js**
The left-side menu panel that slides in when hamburger is clicked.
- Contains site navigation links
- 20vw width, fixed position
- Tagline: "Redefining agency marketing—one organic idea at a time."

**Usage:**
```html
<side-menu-panel></side-menu-panel>
```

### 4. **calendar-panel.js**
The right-side calendar panel with Calendly integration.
- Contains booking iframe
- Customer review section
- 20vw width, fixed position
- Slides in when "Schedule a call" button is clicked

**Usage:**
```html
<calendar-panel></calendar-panel>
```

### 5. **universal-footer.js**
The footer with links, social media, and copyright.
- Agency links (Website, Audit, Blog)
- Contact information
- Boring section (Privacy Policy, Sitemap)
- Social media links (Twitter/X, LinkedIn)

**Usage:**
```html
<universal-footer></universal-footer>
```

### 6. **load-components.js** (Component Loader)
Automatically loads all components with a single script tag.

**Usage:**
```html
<!-- Load Universal Components -->
<script src="components/load-components.js"></script>
```

Place this before `</body>` tag on every page.

## 🚀 How to Use Components

### On Every Page:

1. **In the `<body>` tag** (after opening):
   ```html
   <body class="horizontal-body">
     <side-menu-panel></side-menu-panel>

     <div class="body-section">
       <universal-nav></universal-nav>

       <!-- Your page content here -->

       <universal-footer></universal-footer>
     </div><!-- .body-section -->

     <calendar-panel></calendar-panel>
   ```

2. **Before `</body>` tag**:
   ```html
     <!-- Load Universal Components -->
     <script src="components/load-components.js"></script>
   </body>
   ```

## ✏️ How to Edit Components

### To Update Navigation:
Edit `components/universal-nav.js` - changes apply to all 51 pages instantly.

### To Update Footer:
Edit `components/universal-footer.js` - changes apply to all pages with footer instantly.

### To Update Side Menu:
Edit `components/side-menu-panel.js` - changes apply everywhere instantly.

### To Update Calendar:
Edit `components/calendar-panel.js` - changes apply everywhere instantly.

## 🎨 Example: Adding a New Footer Link

**Before (had to edit 51 files):**
Open every HTML file and manually add the link in the footer.

**Now (edit 1 file):**
1. Open `components/universal-footer.js`
2. Find the footer HTML in the `innerHTML`
3. Add your link:
   ```html
   <a href="new-page.html" class="footer-text">New Page</a>
   ```
4. Save the file
5. **All 51 pages update automatically!** 🎉

## 🔄 Component Status

**Current Implementation:**
- ✅ All 51 pages use `<side-menu-panel>`
- ✅ All 51 pages use `<universal-nav>`
- ✅ All 51 pages use `<calendar-panel>`
- ✅ 45/51 pages use `<universal-footer>` (some pages have different footer structures)
- ✅ All 51 pages load `components/load-components.js`

## 🛠️ Technical Details

- **Technology:** Vanilla JavaScript Web Components (Custom Elements API)
- **Browser Support:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **No Build Step:** Components load directly in the browser
- **SEO-Friendly:** Server-rendered HTML, no JavaScript required for content
- **GSAP Compatible:** Works seamlessly with existing GSAP animations
- **Lightweight:** ~5KB total for all components

## 🆚 Why Not React?

We chose Web Components over React because:
- ✅ **Better for SEO** - Static HTML with no hydration needed
- ✅ **No build step** - Edit and reload, instant feedback
- ✅ **Smaller bundle** - No framework overhead (~150KB React vs ~5KB Web Components)
- ✅ **GSAP friendly** - No reconciliation conflicts with animations
- ✅ **Webflow compatible** - Works with existing Webflow structure
- ✅ **Progressive enhancement** - Works even if JavaScript fails

## 📝 Notes

- Components use shadow DOM for `universal-menu` only (for style encapsulation)
- Other components use regular DOM for easier CSS styling from main stylesheets
- All components are registered using `customElements.define()`
- Components automatically execute when their tag is found in HTML

## 🐛 Troubleshooting

**Components not showing?**
- Check browser console for errors
- Ensure `load-components.js` is loaded before `</body>`
- Verify component script files exist in `/components/` folder

**Styles not applying?**
- Components inherit styles from main CSS files
- Check that class names in component HTML match your CSS

**GSAP animations not working?**
- Ensure GSAP is loaded before components
- Components rely on global `gsap` variable

---

**Created:** October 2025
**Maintained by:** Organically Team
