export function CalendarPanel() {
  return (
    <div className="calendar-module">
      <div className="calendar-panel-content">
        <div className="calendar-header">
          <h3 className="calendar-title">Let&apos;s Connect</h3>
          <p className="calendar-subtitle">Pick a time that works for you</p>
        </div>
        <div className="calendar-embed-wrapper">
          <iframe
            src="https://calendly.com/organically/30min?embed_domain=organicallyseo.com&embed_type=Inline&hide_gdpr_banner=1&primary_color=7ec700&hide_event_type_details=1"
            width="100%"
            height="600"
            frameBorder="0"
            loading="lazy"
          />
        </div>
        <div className="calendar-review">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/green 5 star.png"
            alt="5 stars"
            className="review-stars"
          />
          <p className="review-quote">
            &quot;Ryan was an absolute beauty to work with—thoughtful, creative,
            and genuinely invested in making our vision come to life.&quot;
          </p>
          <p className="review-author">— Sarah M., Founder</p>
        </div>
      </div>
    </div>
  );
}
