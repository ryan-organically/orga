/**
 * Side Menu Panel Web Component
 * Usage: <side-menu-panel></side-menu-panel>
 *
 * This component creates the left side menu panel that slides in when the hamburger menu is clicked.
 * Features smooth GSAP animations coordinated with the universal-menu component.
 */

class SideMenuPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <!-- Left Menu Panel -->
  <div class="side-menu-panel">
      <div class="side-panel">
        <div class="menu-header">
          <p class="menu-tagline">Redefining agency marketing—one organic idea at a time.</p>
        </div>
        <nav class="menu-nav">
          <a href="index.html" class="menu-nav-link">Home</a>
          <a href="web-design.html" class="menu-nav-link">Web design</a>
          <a href="seo.html" class="menu-nav-link">SEO</a>
          <a href="branding.html" class="menu-nav-link">Creative</a>
          <a href="blog.html" class="menu-nav-link">Blog</a>
        </nav>
      </div>
    </div>
    `;
  }
}

// Register the custom element
customElements.define('side-menu-panel', SideMenuPanel);
