/**
 * Universal Menu Web Component
 * Usage: <universal-menu></universal-menu>
 *
 * This component creates a reusable hamburger menu that works across all pages.
 * Simple slide-in menu panel (50vw width) with smooth GSAP animations.
 *
 * Requirements: GSAP must be loaded on the page before this component.
 */

class UniversalMenu extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM for style encapsulation
    this.attachShadow({ mode: 'open' });
    this.isAnimating = false; // Prevent animation conflicts
  }

  connectedCallback() {
    // Render the component when it's added to the page
    this.render();
    this.attachEventListeners();
    this.initializeGSAP();
  }

  initializeGSAP() {
    // Wait for GSAP to be available (it's loaded on the page)
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not found. Animations will be disabled.');
      this.gsapAvailable = false;
    } else {
      this.gsapAvailable = true;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Host element - don't constrain children */
        :host {
          display: contents;
        }

        /* Menu Toggle Button */
        .menu-toggle {
          position: relative;
          width: 50px;
          height: 50px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          z-index: 10000;
          transition: all 0.3s ease;
        }

        .menu-toggle span {
          width: 30px;
          height: 3px;
          background: var(--333, #333);
          border-radius: 2px;
          transition: opacity 0.2s ease;
        }

        .menu-toggle.active span {
          opacity: 0.6;
        }

        /* Menu Overlay */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          z-index: 5;
          backdrop-filter: none;
        }

        .menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }
      </style>

      <!-- Menu Toggle Button -->
      <div class="menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- Menu Overlay -->
      <div class="menu-overlay"></div>
    `;
  }

  attachEventListeners() {
    const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
    const menuPanel = document.querySelector('.menu-panel');
    const menuOverlay = this.shadowRoot.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-nav-link');

    const openMenu = () => {
      if (this.isAnimating) return;
      this.isAnimating = true;

      // Add active classes
      menuToggle.classList.add('active');
      menuPanel.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Get the body-section from the parent document
      const bodySection = document.querySelector('.body-section');

      // Simple slide-in animation
      if (this.gsapAvailable) {
        const tl = gsap.timeline({
          onComplete: () => { this.isAnimating = false; }
        });

        // Just slide the body-section to the right (toggle button moves with it naturally)
        // Menu panel stays fixed in place
        if (bodySection) {
          // Get the actual width of the menu panel to ensure body-section moves the exact amount
          const panelWidth = menuPanel.offsetWidth;
          tl.to(bodySection, {
            x: panelWidth,
            duration: 0.5,
            ease: 'power3.out',
          }, 0);
        }

        // Fade in overlay
        tl.to(menuOverlay, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, 0);
      } else {
        // Fallback without GSAP
        this.isAnimating = false;
      }
    };

    const closeMenu = () => {
      if (this.isAnimating) return;
      this.isAnimating = true;

      // Get the body-section from the parent document
      const bodySection = document.querySelector('.body-section');

      // Simple slide-out animation
      if (this.gsapAvailable) {
        const tl = gsap.timeline({
          onComplete: () => {
            menuToggle.classList.remove('active');
            menuPanel.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isAnimating = false;
          }
        });

        // Just slide the body-section back to original position (toggle button moves with it naturally)
        // Menu panel stays fixed in place
        if (bodySection) {
          tl.to(bodySection, {
            x: '0vw',
            duration: 0.4,
            ease: 'power3.in',
          }, 0);
        }

        // Fade out overlay
        tl.to(menuOverlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        }, 0);
      } else {
        // Fallback without GSAP
        menuToggle.classList.remove('active');
        menuPanel.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isAnimating = false;
      }
    };

    // Open menu on toggle click
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuPanel.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu on overlay click
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking links
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
        closeMenu();
      }
    });
  }
}

// Register the custom element
customElements.define('universal-menu', UniversalMenu);
