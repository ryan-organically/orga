# Mobile Ticker & Blog Nav Fix — GSAP Plugin Gate Timeout

## Problem
Two homepage features were completely dead on mobile:
1. The "Proven to move the needle" ticker — not animating
2. The Coffee Break blog card arrows — not responding to taps

Both worked fine on desktop.

## Root Cause
Both features were inside `_initSecondaryAnimations()`, which gates on **all five** GSAP plugins loading:

```js
if (typeof gsap === 'undefined' || typeof SplitText === 'undefined' ||
    typeof ScrollTrigger === 'undefined' || typeof Draggable === 'undefined' ||
    typeof InertiaPlugin === 'undefined') {
    if ((Date.now() - window._gsapWaitStart2) < 2000) {
        setTimeout(_initSecondaryAnimations, 50); return;
    }
    return; // ← entire function bails, ticker + blog nav never init
}
```

On mobile connections, the 5 deferred CDN scripts (gsap, SplitText, ScrollTrigger, InertiaPlugin, Draggable) couldn't all load within the 2-second timeout. The function silently bailed and neither feature initialized.

The ticker only needs `gsap` core. The blog nav doesn't need GSAP at all.

## What Didn't Work

### Attempt 1: `document.fonts.ready` wrapper
Wrapped ticker measurement in `document.fonts.ready.then()` assuming Safari was measuring `scrollWidth` before the custom font loaded. This was Allen's theory — that the Coolvetica font timing caused wrong loop distances. **Wrong diagnosis.** The animation wasn't misaligned, it wasn't running at all.

### Attempt 2: Increase timeout from 2s to 10s
Bumped the plugin gate timeout to 10 seconds. Still failed — the issue wasn't that plugins were slow, they were potentially failing entirely on some mobile connections, or the timeout still wasn't enough.

### Attempt 3: CSS fixes (overflow, flex-shrink)
Added `overflow: hidden` to mobile media queries, `flex: 0 0 auto` on cards, `width: max-content` on track. None of this mattered because the JS never ran.

### Attempt 4: Rewrite Draggable setup
Rewrote the blog nav with proper GSAP Draggable config (DOM element bounds, `dragClickables: true`, `touch-action: pan-y`). Still inside the plugin gate — still never ran.

### Attempt 5: Disable Lenis + strip Draggable
Disabled Lenis smooth scroll entirely, stripped Draggable, left only `gsap.to()` on arrow click. Still inside the plugin gate — still never ran.

### Attempt 6: Move blog nav outside plugin gate
Extracted blog nav into standalone `_initBlogNav()` that only waits for gsap core (like the ticker fix). **Still didn't work.** GSAP core itself wasn't loading reliably on mobile.

### Attempt 7: Raw JS — no GSAP at all (worked)
Replaced everything with `style.transform = "translateX()"` and `style.transition`. No library dependency. **This worked immediately.**

## The Fix

### Ticker
Extracted from `_initSecondaryAnimations` into standalone `_initTicker()`. Still uses GSAP (needed for the infinite modular loop), but only waits on gsap core with a 5s timeout.

### Blog Nav
Removed all GSAP/Draggable dependency. Pure JS:
- Measures card width + margin dynamically via `offsetWidth + getComputedStyle`
- Moves track via `style.transform = translateX()`
- CSS transition handles the animation
- Snaps exactly one card per arrow click on any viewport

## Lesson
Don't gate simple features behind complex dependency chains. The ticker needed gsap core. The blog nav needed nothing. Both were held hostage by SplitText, ScrollTrigger, Draggable, and InertiaPlugin — none of which they used.

**GSAP on mobile CDN is not reliable enough to gate critical UI.** Use raw JS for anything that must work, reserve GSAP for progressive enhancement.
