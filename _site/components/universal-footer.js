/**
 * Universal Footer Web Component
 * Usage: <universal-footer></universal-footer>
 *
 * This component creates a reusable footer that works across all pages.
 * Edit once, updates everywhere automatically.
 */

class UniversalFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <div id="Footer" class="footer">
    <div class="footer-typemark-div">
      <a href="index.html" class="link-block w-inline-block">
        <div class="footer-typemark">Organically</div>
      </a>
      <div class="footer-social-wrapper">
        <a href="https://twitter.com/organicallyseo" class="footer-social-link w-inline-block"><img src="images/X-black.png" loading="lazy" width="28" alt="" class="footer-social-image light"><img src="images/X-black.png" loading="lazy" width="28" alt="" class="footer-social-image dark"></a>
        <a href="https://www.linkedin.com/in/ryan-scanlon31/" class="footer-social-link w-inline-block"><img src="images/LinkedIn-Black.png" loading="lazy" width="28" alt="" class="footer-social-image light"><img src="images/LinkedIn-Black.png" loading="lazy" width="28" alt="" class="footer-social-image dark"></a>
      </div>
      <div class="copyright-bar">Copyright 2025 Organically SEO. All rights reserved. </div>
    </div>
    <div class="footer-wrapper-1">
      <div class="footer-div">
        <div class="footer-subheading">Agency</div>
        <a href="seo.html" class="footer-text">Website</a>
        <a href="seo-audit-services.html" class="footer-text">Audit</a>
        <a href="blog.html" class="footer-text">Blog</a>
      </div>
      <div class="footer-div">
        <div class="footer-subheading">Contact</div>
        <div class="footer-text">Form</div>
        <div class="footer-text">ryan.organically@gmail.com</div>
      </div>
      <div class="footer-div">
        <div class="footer-subheading">Boring</div>
        <a href="privacy-policy.html" class="footer-text">Privacy Policy</a>
        <a href="sitemap.html" class="footer-text">Sitemap</a>
      </div>
    </div>
  </div>
    `;
  }
}

// Register the custom element
customElements.define('universal-footer', UniversalFooter);
