# Draggable Cards Component (Coffee Break Style)

This guide shows how to implement a horizontal draggable card carousel using GSAP Draggable with snap-to-card functionality.

## Live Example
See it in action on the Organically homepage: `index.html` in the "Coffee Break" blog section.

---

## Required Scripts

Add these in your `<head>` or before `</body>`:

```html
<!-- GSAP Core -->
<script src="https://cdn.prod.website-files.com/gsap/3.13.0/gsap.min.js"></script>
<!-- GSAP InertiaPlugin (required for smooth drag physics) -->
<script src="https://cdn.prod.website-files.com/gsap/3.13.0/InertiaPlugin.min.js"></script>
<!-- GSAP Draggable -->
<script src="https://cdn.prod.website-files.com/gsap/3.13.0/Draggable.min.js"></script>

<!-- Register plugins -->
<script>
  gsap.registerPlugin(InertiaPlugin, Draggable);
</script>
```

---

## HTML Structure

```html
<!-- Navigation Buttons -->
<div class="blog-nav-buttons">
  <button class="blog-nav-btn" id="blog-prev">&larr;</button>
  <button class="blog-nav-btn" id="blog-next">&rarr;</button>
</div>

<!-- Draggable Cards Container -->
<div class="read-more-module">
  <div class="blog-cards-wrapper">
    <div class="blog-cards-track">
      <!-- Card 1 -->
      <a href="#" class="blog-card-1">
        <div class="blog-card-content">
          <p class="blog-module-card-title">Card Title 1</p>
          <div class="bog-comp-p">Card description text goes here.</div>
        </div>
      </a>

      <!-- Card 2 -->
      <a href="#" class="blog-card-1">
        <div class="blog-card-content">
          <p class="blog-module-card-title">Card Title 2</p>
          <div class="bog-comp-p">Card description text goes here.</div>
        </div>
      </a>

      <!-- Add more cards as needed -->
    </div>
  </div>
</div>
```

---

## Required CSS

```css
/* Wrapper - hides overflow */
.blog-cards-wrapper {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.4);
  padding: 40px 5vw;
  position: relative;
  overflow: hidden;
}

/* Track - the draggable element, contains all cards in a row */
.blog-cards-track {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  padding-right: 20vw; /* Extra space at end */
  position: relative;
  cursor: grab;
}

.blog-cards-track:active {
  cursor: grabbing;
}

/* Individual card */
.blog-card-1 {
  border: 1px solid rgba(0, 0, 0, 0.4);
  background-color: rgba(226, 226, 226, 0.90);
  flex: none; /* Prevents shrinking */
  width: 300px; /* Or use vw units like 30vw */
  height: 350px;
  margin-right: 20px; /* Gap between cards */
  padding: 20px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.blog-cards-track .blog-card-1:last-child {
  margin-right: 0;
}

/* Navigation buttons */
.blog-nav-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.blog-nav-btn {
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s;
}

.blog-nav-btn:hover {
  background: #7ec700; /* Or your accent color */
}
```

---

## JavaScript (The Draggable Logic)

```javascript
document.addEventListener("DOMContentLoaded", () => {
    const cardsTrack = document.querySelector(".blog-cards-track");
    const cardsWrapper = document.querySelector(".blog-cards-wrapper");
    const prevBtn = document.getElementById("blog-prev");
    const nextBtn = document.getElementById("blog-next");

    if (!cardsTrack || !cardsWrapper || !prevBtn || !nextBtn) return;

    let draggableInstance;
    let currentIndex = 0;

    // Config - calculates card dimensions and snap points
    const config = {
        getCardWidth: () => {
            const card = cardsTrack.querySelector(".blog-card-1");
            if (!card) return 300;
            const style = window.getComputedStyle(card);
            return card.offsetWidth + parseInt(style.marginRight || 0);
        },
        getCardCount: () => {
            return cardsTrack.querySelectorAll(".blog-card-1").length;
        },
        getSnapPoints: () => {
            const cardWidth = config.getCardWidth();
            const cardCount = config.getCardCount();
            const points = [];

            for (let i = 0; i < cardCount; i++) {
                points.push(-i * cardWidth);
            }

            return points;
        },
        getBounds: () => {
            const cardWidth = config.getCardWidth();
            const cardCount = config.getCardCount();
            const maxScroll = (cardCount - 1) * cardWidth;
            return { minX: -maxScroll, maxX: 0 };
        }
    };

    // Snap to nearest card function
    function snapToCard(x) {
        const snapPoints = config.getSnapPoints();
        let closest = snapPoints[0];
        let minDistance = Math.abs(x - closest);

        for (let i = 1; i < snapPoints.length; i++) {
            const distance = Math.abs(x - snapPoints[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closest = snapPoints[i];
                currentIndex = i;
            }
        }

        return closest;
    }

    // Initialize GSAP Draggable with snap
    if (typeof gsap !== 'undefined' && typeof Draggable !== 'undefined') {
        draggableInstance = Draggable.create(cardsTrack, {
            type: "x",                        // Horizontal drag only
            bounds: config.getBounds(),       // Limit drag range
            inertia: true,                    // Smooth momentum after release
            edgeResistance: 0.85,             // Resistance at edges
            snap: {
                x: (endValue) => snapToCard(endValue)  // Snap to nearest card
            },
            onThrowComplete: function() {
                // Update currentIndex after drag completes
                const snappedX = gsap.getProperty(cardsTrack, "x");
                const snapPoints = config.getSnapPoints();
                currentIndex = snapPoints.indexOf(snappedX);
            }
        })[0];
    }

    // Button navigation
    function navigate(direction) {
        const snapPoints = config.getSnapPoints();

        if (direction === 'prev') {
            currentIndex = Math.max(0, currentIndex - 1);
        } else {
            currentIndex = Math.min(snapPoints.length - 1, currentIndex + 1);
        }

        const newX = snapPoints[currentIndex];

        gsap.to(cardsTrack, {
            x: newX,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                if (draggableInstance) draggableInstance.update();
            }
        });
    }

    prevBtn.addEventListener("click", () => navigate('prev'));
    nextBtn.addEventListener("click", () => navigate('next'));

    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const snapPoints = config.getSnapPoints();
            const bounds = config.getBounds();

            const newX = snapPoints[currentIndex] || 0;
            gsap.set(cardsTrack, { x: newX });

            if (draggableInstance) {
                draggableInstance.applyBounds(bounds);
                draggableInstance.update();
            }
        }, 150);
    });
});
```

---

## Key Concepts

1. **Structure**: Wrapper (overflow hidden) > Track (draggable, holds cards) > Cards
2. **Snap Points**: Array of x positions, one per card: `[0, -320, -640, -960, ...]`
3. **Bounds**: Limits how far you can drag: `{ minX: -(totalWidth), maxX: 0 }`
4. **InertiaPlugin**: Required for the smooth "throw" physics after releasing drag

---

## Customization Tips

- Change `edgeResistance` (0-1) to control bounce at edges
- Adjust `duration` in navigate() for faster/slower button animations
- Modify card width in CSS to change how many cards show at once
- Add `onClick` callback to Draggable if you need click handling on cards
