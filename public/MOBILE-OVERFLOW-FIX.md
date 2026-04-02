# Mobile Overflow Fix Guide

## The Problem
Blog content (`.blog-massive-wrapper`, `.blog-p1`) overflows its container on small screens (479px and below), causing horizontal scroll.

## Why It Took Multiple Attempts

### 1. Fixed Width in Base Styles
The base CSS has hardcoded widths that don't respond to screen size:
```css
/* Base styles - line ~1625 */
.blog-massive-wrapper {
  width: 700px;  /* PROBLEM: Fixed width */
}

/* Base styles - line ~760 */
.blog-p1 {
  width: 700px;  /* PROBLEM: Fixed width */
}
```

### 2. Multiple Media Query Locations
The same class is styled in **multiple media queries** throughout the file:
- `.blog-massive-wrapper` appears at lines: 1625, 5777, 6898, 7775
- Each breakpoint needs the fix independently

### 3. `100vw` vs `100%` - Critical Difference
```css
/* BAD - causes overflow */
width: 100vw;  /* 100% of VIEWPORT - ignores parent padding */

/* GOOD - respects container */
width: 100%;   /* 100% of PARENT - stays within bounds */
```

### 4. CSS Cascade Order
- External CSS (`organicallyseo-com.webflow.css`) loads in `<head>`
- Inline `<style>` blocks in HTML body load later BUT...
- Specificity and `!important` rules can still conflict
- **Fix in the source CSS file, not just inline styles**

### 5. Missing `box-sizing`
Without `box-sizing: border-box`, padding adds to width:
```css
/* Without box-sizing */
width: 100%;
padding: 15px;  /* Element is now 100% + 30px = OVERFLOW */

/* With box-sizing */
width: 100%;
padding: 15px;
box-sizing: border-box;  /* Element stays at 100% */
```

## The Fix (Apply to Each Breakpoint)

In `css/organicallyseo-com.webflow.css`, find each media query and update:

### For `@media (max-width: 767px)` - Two locations (~line 5777 and ~6902)
```css
.blog-massive-wrapper {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}
```

### For `@media screen and (max-width: 479px)` (~line 7775)
```css
.blog-massive-wrapper {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.blog-p1 {
  width: 100%;
  max-width: 100%;
  font-weight: 300;
}

.blog-p1.embeds {
  min-width: auto;  /* Was: 100vw - caused overflow */
  width: 100%;
  margin-right: 0;
}
```

## Checklist for Other Pages

1. **Search for fixed widths**: `width: 700px`, `width: 600px`, etc.
2. **Search for `100vw`**: Replace with `100%` where it causes overflow
3. **Search for `min-width`**: Look for `min-width: 100vw` specifically
4. **Check all breakpoints**: 767px and 479px both need fixes
5. **Add `box-sizing: border-box`** when adding padding
6. **Test at exact breakpoint widths**: 479px, 480px, 767px, 768px

## Quick Grep Commands
```bash
# Find problematic patterns in CSS
grep -n "width: 700px" css/organicallyseo-com.webflow.css
grep -n "width: 100vw" css/organicallyseo-com.webflow.css
grep -n "min-width: 100vw" css/organicallyseo-com.webflow.css
```
