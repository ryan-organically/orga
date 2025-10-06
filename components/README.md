# Universal Menu Web Component

A reusable, zero-dependency navigation menu component for the Organically website.

---

## 📚 Quick Start Guide

### What You Created

You now have a **Web Component** - a reusable piece of code that works like a custom HTML tag. Instead of copying/pasting 200+ lines of menu code on every page, you now have a single `<universal-menu>` tag.

### Files Created

```
components/
├── universal-menu.js       # The Web Component (use this)
├── menu-example.html        # Example page showing usage
└── README.md               # This file
```

---

## 🚀 How to Use It

### Step 1: Add the Script (Once Per Page)

Add this line **just before the closing `</body>` tag** on every HTML page:

```html
<script src="components/universal-menu.js"></script>
</body>
</html>
```

### Step 2: Use the Component

Replace your existing menu HTML with the custom element:

**Before (Old Way):**
```html
<div class="universal-menu">
  <div class="menu-toggle">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <!-- 200+ lines of menu code... -->
</div>
```

**After (New Way):**
```html
<div class="universal-menu">
  <universal-menu></universal-menu>
  <!-- Your other nav items -->
  <div class="light-dark-mode-wrapper">...</div>
  <a href="..." class="button-1">Book call</a>
</div>
```

---

## 🎯 Deploy Across All 49 Pages

### Manual Method (Simple but Tedious)

1. Open each HTML file
2. Find the `<div class="menu-toggle">` section
3. Replace everything from `<div class="menu-toggle">` through `<div class="menu-overlay"></div>` with `<universal-menu></universal-menu>`
4. Add `<script src="components/universal-menu.js"></script>` before `</body>`
5. Save and test

### Automated Method (Recommended)

Use find-and-replace or a script to update all files at once:

**Option A: VS Code Find & Replace**
1. Open the entire project folder in VS Code
2. Press `Ctrl+Shift+H` (or `Cmd+Shift+H` on Mac)
3. Enable "Regex" mode (.*icon)
4. Find: `<div class="menu-toggle">[\s\S]*?<div class="menu-overlay"></div>`
5. Replace: `<universal-menu></universal-menu>`
6. Review changes before replacing all

**Option B: Command Line (Linux/Mac/WSL)**
```bash
# Navigate to your project directory
cd "/mnt/c/dev/orga website"

# Backup first!
cp -r . ../orga-website-backup

# Use sed to replace the menu HTML (test on one file first)
# This is a simplified example - adjust regex as needed
find . -name "*.html" -type f -exec sed -i 's/OLD_PATTERN/NEW_PATTERN/g' {} \;
```

---

## 🔧 Customizing the Menu

### Update Navigation Links

Edit `components/universal-menu.js` and find this section:

```javascript
<nav class="menu-nav">
  <a href="index.html" class="menu-nav-link">Home</a>
  <a href="web-design.html" class="menu-nav-link">Web design</a>
  <a href="seo.html" class="menu-nav-link">SEO</a>
  <a href="branding.html" class="menu-nav-link">Creative</a>
</nav>
```

Change the links, add new ones, or remove them. **The change will apply to all 49 pages automatically** after a browser refresh.

### Update Styles

Edit the `<style>` section inside `universal-menu.js`:

```javascript
.menu-panel {
  background: #666;  /* Change menu background color */
  width: 50vw;       /* Change menu width */
}

.menu-nav-link {
  font-size: 48px;   /* Change link font size */
  color: #e2e2e2;    /* Change link color */
}
```

### Add Active Page Highlighting

To highlight the current page in the menu, you can:

**Option 1: Add via JavaScript**
```javascript
// Add this to the connectedCallback() method
const currentPage = window.location.pathname.split('/').pop();
const links = this.shadowRoot.querySelectorAll('.menu-nav-link');
links.forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('w--current');
  }
});
```

**Option 2: Use a data attribute**
```html
<!-- In your HTML -->
<universal-menu current-page="index.html"></universal-menu>
```

Then read it in the component with `this.getAttribute('current-page')`.

---

## 🧪 Testing

### Test in Browser

1. Open `components/menu-example.html` in a browser
2. Click the hamburger menu (top left)
3. Verify it opens/closes smoothly
4. Test on mobile (use browser dev tools responsive mode)
5. Press ESC key to close menu
6. Click overlay to close menu

### Test on Your Actual Pages

1. Update one page first (try `index.html`)
2. Open it in a browser
3. Verify the menu works
4. Check for console errors (F12 → Console tab)
5. If it works, deploy to all other pages

---

## 🐛 Troubleshooting

### Menu doesn't appear
- Check if the script is loaded: `<script src="components/universal-menu.js"></script>`
- Check browser console for errors (F12 → Console)
- Verify the file path is correct (relative to the HTML file)

### Styles look wrong
- Make sure you kept the `.universal-menu` wrapper div
- Check if your global CSS is conflicting
- Shadow DOM isolates styles, but global `var(--orga)` should still work

### Menu doesn't close
- Check browser console for JavaScript errors
- Verify event listeners are attaching (add `console.log` in `attachEventListeners()`)

### Menu links don't work
- Update the `href` attributes in `universal-menu.js`
- Make sure the paths are correct relative to each page

---

## 💡 Web Component Concepts

### What's Happening Behind the Scenes?

1. **Custom Element**: You created a new HTML tag called `<universal-menu>`
2. **Shadow DOM**: The component's HTML/CSS is isolated (won't conflict with page styles)
3. **Lifecycle**: When the browser sees `<universal-menu>`, it runs `connectedCallback()`
4. **Registration**: `customElements.define()` tells the browser about your new element

### Key Methods

```javascript
class UniversalMenu extends HTMLElement {
  constructor() {
    // Called when element is created (rarely used)
  }

  connectedCallback() {
    // Called when element is added to the page
    // Perfect for rendering and setup
  }

  disconnectedCallback() {
    // Called when element is removed (cleanup)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Called when attributes change
    // e.g., <universal-menu theme="dark">
  }
}
```

---

## ✨ 3D Rotation Effect (INCLUDED!)

The component now includes **GSAP-powered 3D rotation animations**! When the menu opens/closes, you'll see:

### Animation Breakdown

**When Opening:**
1. **Navigation Bar**: Rotates in 3D space (rotationX: -5°, rotationY: 3°, z: -20px)
2. **Menu Panel**: Slides in from left with Y-axis rotation creating depth
3. **Overlay**: Fades in smoothly

**When Closing:**
1. **Navigation Bar**: Returns to normal position (rotationX/Y/Z: 0)
2. **Menu Panel**: Slides out with rotation effect
3. **Overlay**: Fades out

### Testing the 3D Effect

Open `components/test-3d-menu.html` in your browser to see a live demo with detailed explanations.

```bash
# From your project directory
explorer.exe components/test-3d-menu.html
```

### Requirements

- **GSAP must be loaded** on the page before the component
- Already included in your pages via: `<script src="https://cdn.prod.website-files.com/gsap/3.13.0/gsap.min.js"></script>`
- The component automatically detects GSAP and falls back gracefully if not available

### Customizing the 3D Effect

Edit `components/universal-menu.js` and find the animation timelines in `openMenu()` and `closeMenu()`:

```javascript
// Adjust rotation intensity
tl.to(this.navBar, {
  rotationX: -5,    // ← Change this (try -10 for more tilt)
  rotationY: 3,     // ← Change this (try 5 for more rotation)
  z: -20,           // ← Change this (try -50 for more depth)
  duration: 0.6,    // ← Speed (lower = faster)
  ease: 'power2.out' // ← Motion curve
}, 0);

// Adjust menu panel rotation
tl.fromTo(menuPanel, {
  rotationY: -15,   // ← Starting rotation angle
}, {
  rotationY: 0,     // ← Ending rotation angle
  duration: 0.7,    // ← Animation speed
}, 0.1);
```

### Performance Notes

- Uses **GPU-accelerated transforms** for smooth 60fps animations
- Includes animation locking (`isAnimating` flag) to prevent conflicts
- Optimized with GSAP timeline for coordinated animations
- Works smoothly on mobile devices

### Disable 3D Effects

If you want the menu without 3D effects:

1. Remove the GSAP animations in `openMenu()` and `closeMenu()`
2. Or simply don't load GSAP - the component will fall back to basic functionality

---

## 📝 Summary

**Before**: 200+ lines of menu code copy/pasted on 49 pages = 9,800 lines to maintain

**After**: 1 line `<universal-menu></universal-menu>` on 49 pages = 49 lines + 1 component file

**Result**: Change the menu once, update everywhere 🎉

---

## 🤔 Questions?

- **"Do I need Node.js or npm?"** No! Web Components are native browser features.
- **"Will this work in old browsers?"** Yes, all modern browsers since 2020. No IE11.
- **"Can I use this with Webflow?"** Yes! Just add the custom element to your Webflow custom code.
- **"Does this affect SEO?"** No, the HTML is rendered immediately (not client-side like React).

---

Need help? Check `menu-example.html` for a working demo or ask for clarification!
