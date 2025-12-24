# Claude Code Guidelines

## CSS Rules

- Never use `!important` in CSS. Use higher specificity selectors instead (e.g., `[style]` attribute selector to override inline styles).

## Homepage Layout System (index.html)

### Structure
```
body.horizontal-body (flex, justify-content: center)
├── .side-menu-panel (5% visible, actually 75vw mobile / ~40vw desktop)
│   └── .side-panel (100% of parent)
│       └── .menu-nav (must be 100% width of parent)
│           └── .menu-nav-link (must extend full width of parent)
├── .body-section (90% width, margin: 0 auto, centered, scrollable)
│   └── sections/content (100% of body-section)
└── .calendar-module (5% visible, actually 75vw mobile / ~40vw desktop)
    └── .calendar-panel-content
```

### Key Principles

1. **Three-column flex layout**: Body has exactly 3 direct children arranged horizontally
2. **Visual vs actual widths**: Side panels appear as 5% margins but are actually wide (75vw mobile, ~40vw desktop) - user can pan horizontally to reveal sticky side menus
3. **Centered body-section**: The body-section is centered and is what scrolls vertically
4. **Equal margins**: Left and right margins must always be equal (5% each visually)
5. **Side panels are relative/sticky**: Not position:fixed - they participate in flexbox flow
6. **Menu items full width**: .menu-nav and .menu-nav-link must extend to full width of their parent .side-panel

### Width Calculations
- body: 100%
- side-menu-panel: 5% (visual), actual content width ~75vw mobile / 40vw desktop
- body-section: 90% with margin: 0 auto
- calendar-module: 5% (visual), actual content width ~75vw mobile / 40vw desktop
- Total: 5% + 90% + 5% = 100%

### Critical CSS Locations
- External CSS: `css/organicallyseo-com.webflow.css` (body, body-section base styles)
- Inline CSS: `index.html` line ~1224 (panel positioning, breakpoints)

### Do Not Change Without Permission
- Panel widths or positioning
- body-section centering (margin: 0 auto)
- Flexbox layout on body.horizontal-body
