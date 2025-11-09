# Lenis + ScrollTrigger Scroll Jump Fix

## Problem
When using GSAP SplitText (or any DOM manipulation) on page load with Lenis smooth scroll and ScrollTrigger active, the page would experience a scroll position jump - the scrollbar would visibly move down then snap back to the top.

## Root Cause
The issue was caused by a combination of:

1. **Browser scroll restoration** - Browsers try to restore previous scroll position on page load
2. **DOM manipulation timing** - SplitText wrapping words in divs changed the DOM structure/height
3. **ScrollTrigger recalculation** - When DOM changes, ScrollTrigger tries to maintain relative scroll position
4. **Lenis initialization race** - Smooth scroll system initializing while scroll position is unstable

**Timeline of the problem:**
1. Page loads → Browser tries to restore scroll position
2. DOMContentLoaded fires → Lenis initializes and takes over scroll
3. SplitText runs → Wraps text in divs, changes DOM height
4. ScrollTrigger detects change → Recalculates and adjusts scroll position
5. **Result:** Visible scroll jump as position bounces between states

## Solution

### 1. Disable Browser Scroll Restoration
```javascript
// Run immediately, before DOMContentLoaded
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
```

### 2. Force Initial Scroll Position
```javascript
// Force scroll to top before any other scripts run
window.scrollTo(0, 0);
```

### 3. Lock Scroll After DOM Manipulation
```javascript
// After SplitText or other DOM changes
window.scrollTo(0, 0);

// Hard refresh ScrollTrigger with killAll
if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh(true);
}
```

## Implementation

**Location:** `web-design.html`

**Script placement order matters:**
```html
<!-- 1. Load Lenis -->
<script src="https://unpkg.com/lenis@1.3.3/dist/lenis.min.js"></script>

<!-- 2. Disable restoration BEFORE DOMContentLoaded -->
<script>
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
    // 3. Initialize Lenis
    const lenis = new Lenis({...});
    // ... rest of setup
});
</script>

<!-- 4. DOM manipulation script -->
<script>
document.addEventListener("DOMContentLoaded", () => {
    // Do SplitText or other DOM manipulation
    const split = new SplitText(...);

    // Force position and refresh
    window.scrollTo(0, 0);
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh(true);
    }

    // Then animate
});
</script>
```

## Key Takeaways

1. **Always disable scroll restoration** when using Lenis + ScrollTrigger
2. **Force scroll position** before AND after DOM manipulation
3. **Use `ScrollTrigger.refresh(true)`** (hard refresh) after structural DOM changes
4. **Script order matters** - disable restoration before any DOMContentLoaded listeners

## Related Issues

- Applies to any GSAP SplitText usage with smooth scroll
- Relevant for any dynamic DOM manipulation on page load
- Affects Lenis, Locomotive Scroll, and other smooth scroll libraries with ScrollTrigger integration

## Date
2025-01-08
