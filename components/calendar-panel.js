/**
 * Calendar Panel Web Component
 * Usage: <calendar-panel></calendar-panel>
 *
 * This component creates the right calendar panel with Calendly integration.
 * Features smooth GSAP animations when the calendar toggle button is clicked.
 */

class CalendarPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <!-- Right Calendar Panel -->
    <div class="calendar-module">
      <div class="calendar-panel-content">
        <div class="calendar-header">
          <h3 class="calendar-title">Let's Connect</h3>
          <p class="calendar-subtitle">Pick a time that works for you</p>
        </div>
        <div class="calendar-embed-wrapper">
          <iframe
            src="https://calendly.com/organically/30min?embed_domain=organicallyseo.com&embed_type=Inline&hide_gdpr_banner=1&primary_color=7ec700&hide_event_type_details=1"
            width="100%"
            height="600"
            frameborder="0"
            loading="lazy">
          </iframe>
        </div>
        <div class="calendar-review">
          <img src="green 5 star.png" alt="5 stars" class="review-stars">
          <p class="review-quote">"Ryan was an absolute beauty to work with—thoughtful, creative, and genuinely invested in making our vision come to life."</p>
          <p class="review-author">— Sarah M., Founder</p>
        </div>
      </div>
    </div>
    `;
  }
}

// Register the custom element
customElements.define('calendar-panel', CalendarPanel);
