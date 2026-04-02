/**
 * Component Loader
 *
 * This script loads all universal web components used across the site.
 * Include this single script in your HTML to load all components at once.
 *
 * Usage in HTML:
 * <script src="components/load-components.js"></script>
 *
 * Then use components anywhere:
 * <side-menu-panel></side-menu-panel>
 * <universal-nav></universal-nav>
 * <calendar-panel></calendar-panel>
 * <universal-footer></universal-footer>
 */

// Create script elements for each component
const components = [
  'universal-menu.js',
  'universal-nav.js',
  'side-menu-panel.js',
  'calendar-panel.js',
  'universal-footer.js'
];

// Get the current script's directory
const currentScript = document.currentScript;
const scriptPath = currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1);

// Load all component scripts
components.forEach(component => {
  const script = document.createElement('script');
  script.src = scriptPath + component;
  script.async = false; // Maintain order
  document.head.appendChild(script);
});

console.log('%c✓ Organically Components Loaded', 'color: #7ec700; font-weight: bold; font-size: 12px;');
