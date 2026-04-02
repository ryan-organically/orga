/**
 * Universal Navigation Web Component
 * Usage: <universal-nav></universal-nav>
 *
 * This component creates the universal navigation bar with hamburger menu,
 * light/dark mode toggle, and calendar toggle button.
 * Works in coordination with universal-menu, side-menu-panel, and calendar-panel components.
 */

class UniversalNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <div class="universal-menu">
    <universal-menu></universal-menu>
    <div data-w-id="537f5dda-a0ec-0ec7-c578-d41b05873930" class="light-dark-mode-wrapper">
      <div class="dark-mode-button"></div><img src="images/brightness-2.png" loading="lazy" alt="" class="light-mode-icon"><img src="images/moon-1.png" loading="lazy" alt="" class="dark-mode-icon">
    </div>
    <a href="#" class="button-1 w-button" id="calendar-toggle">Schedule a call</a>
  </div>
    `;
  }
}

// Register the custom element
customElements.define('universal-nav', UniversalNav);
