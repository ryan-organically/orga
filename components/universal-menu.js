/**
 * Universal Menu Web Component
 * Usage: <universal-menu></universal-menu>
 *
 * This component creates a reusable hamburger menu that works across all pages.
 * Features smooth GSAP animations with button morphing into close arrow.
 *
 * Requirements: GSAP must be loaded on the page before this component.
 */

class UniversalMenu extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM for style encapsulation
    this.attachShadow({ mode: 'open' });
    this.isAnimating = false; // Prevent animation conflicts
    this.isOpen = false; // Track menu state
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
          width: 65px;
          height: 65px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          will-change: transform;
        }

        .menu-toggle span {
          position: absolute;
          width: 40px;
          height: 3.5px;
          background: var(--333, #333);
          border-radius: 2px;
          will-change: transform, opacity;
          transition: background 0.3s ease;
        }

        .menu-toggle:hover span {
          background: #7ec700;
        }

        .menu-toggle span:nth-child(1) {
          transform: translateY(-10px);
        }

        .menu-toggle span:nth-child(2) {
          /* Middle line - centered */
        }

        .menu-toggle span:nth-child(3) {
          transform: translateY(10px);
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
    const sidePanel = document.querySelector('.side-panel');
    const bodySection = document.querySelector('.body-section');
    const menuOverlay = this.shadowRoot.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-nav-link');
    const lines = this.shadowRoot.querySelectorAll('.menu-toggle span');

    const animateToArrow = () => {
      if (!this.gsapAvailable) return;

      const tl = gsap.timeline();

      // Animate lines to form an arrow pointing left (close icon)
      tl.to(lines[0], {
        rotation: -45,
        y: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0)
      .to(lines[1], {
        opacity: 0,
        scale: 0.3,
        duration: 0.3,
        ease: 'power2.in'
      }, 0)
      .to(lines[2], {
        rotation: 45,
        y: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0);
    };

    const animateToHamburger = () => {
      if (!this.gsapAvailable) return;

      const tl = gsap.timeline();

      // Animate lines back to hamburger
      tl.to(lines[0], {
        rotation: 0,
        y: -10,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0)
      .to(lines[1], {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.1)
      .to(lines[2], {
        rotation: 0,
        y: 10,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0);
    };

    const openMenu = () => {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.isOpen = true;

      // Animate side panel content to visible
      if (this.gsapAvailable) {
        const sideMenuPanel = document.querySelector('.side-menu-panel');
        const calendarModule = document.querySelector('.calendar-module');

        // Calculate slide distance based on screen size
        const isMobile = window.innerWidth <= 767;
        const slideDistance = isMobile ? '45vw' : '15vw'; // Match panel width on mobile

        gsap.to(sidePanel, {
          autoAlpha: 1,
          duration: 0.6,
          ease: 'expo.out'
        });

        // Slide body-section right proportionally
        gsap.to(bodySection, {
          x: slideDistance,
          duration: 0.6,
          ease: 'expo.out'
        });
      }

      menuToggle.classList.add('active');
      menuOverlay.classList.add('active');
      animateToArrow();

      setTimeout(() => { this.isAnimating = false; }, 600);
    };

    const closeMenu = () => {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.isOpen = false;

      animateToHamburger();

      // Animate side panel content to hidden
      if (this.gsapAvailable) {
        const sideMenuPanel = document.querySelector('.side-menu-panel');
        const calendarModule = document.querySelector('.calendar-module');

        gsap.to(sidePanel, {
          autoAlpha: 0,
          duration: 0.6,
          ease: 'expo.out'
        });

        // Slide body-section back to center
        gsap.to(bodySection, {
          x: 0,
          duration: 0.6,
          ease: 'expo.out'
        });
      }

      setTimeout(() => {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        this.isAnimating = false;
      }, 600);
    };

    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isOpen) {
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
      if (e.key === 'Escape' && this.isOpen) {
        closeMenu();
      }
    });
  }
}

// Register the custom element
customElements.define('universal-menu', UniversalMenu);
