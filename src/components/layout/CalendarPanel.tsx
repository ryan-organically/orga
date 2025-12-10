"use client";

interface CalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarPanel({ isOpen, onClose }: CalendarPanelProps) {
  return (
    <div className="calendar-module">
      <div
        className="calendar-panel-content"
        style={{
          minWidth: 500,
          opacity: 0,
          visibility: "hidden",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 10,
            zIndex: 10,
          }}
          aria-label="Close calendar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

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
            style={{ border: "none", display: "block", minHeight: 600 }}
          />
        </div>

        <div className="calendar-review">
          <div className="review-stars" style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 20 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="25" height="25" viewBox="0 0 20 20" fill="#7ec700">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <p className="review-quote">
            &quot;Ryan was an absolute beauty to work with—thoughtful, creative, and genuinely invested in making our vision come to life.&quot;
          </p>
          <p className="review-author">— Sarah M., Founder</p>
        </div>
      </div>
    </div>
  );
}
