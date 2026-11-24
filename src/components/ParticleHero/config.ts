/**
 * ParticleHero — Every tunable value lives here.
 * Tweak any constant and the effect adjusts globally.
 */

export const CONFIG = {
  /* ── Particle budget ─────────────────────────────────── */
  PARTICLE_COUNT_DESKTOP: 160_000,
  PARTICLE_COUNT_MOBILE: 60_000,
  MOBILE_BREAKPOINT: 768,

  /* ── Dot appearance ──────────────────────────────────── */
  DOT_SIZE_BASE: 1.8,          // px at 1× DPR
  DOT_SIZE_MAX: 2.6,
  DOT_OPACITY_BASE: 0.85,
  DOT_COLOR: [1.0, 1.0, 1.0],  // RGB 0-1

  /* ── Background ──────────────────────────────────────── */
  BG_COLOR: 0x101010,

  /* ── Portrait layout ─────────────────────────────────── */
  PORTRAIT_HEIGHT_RATIO: 0.85,  // % of viewport height
  PORTRAIT_X_OFFSET: -0.08,     // shift left of center (fraction of width)

  /* ── Scatter (intro start) ───────────────────────────── */
  SCATTER_RADIUS: 1.8,          // multiplier of viewport diagonal
  SCATTER_ARC_BIAS_Y: 0.3,     // vertical arc bias (top-heavy)

  /* ── Intro timeline ──────────────────────────────────── */
  INTRO_DELAY_MAX: 0.8,         // max random per-particle delay (s)
  INTRO_DURATION_MIN: 1.8,      // min travel time (s)
  INTRO_DURATION_MAX: 2.2,      // max travel time (s)
  INTRO_SIZE_BOOST: 1.6,        // size multiplier while traveling
  INTRO_BRIGHTNESS_BOOST: 1.3,
  INTRO_CURL_STRENGTH: 0.15,    // noise swirl amplitude
  INTRO_CURL_DECAY: 0.92,       // per-frame decay to zero on arrival

  /* ── Idle jitter ─────────────────────────────────────── */
  IDLE_NOISE_AMP: 0.5,          // px of jitter at rest
  IDLE_NOISE_SPEED: 0.4,        // speed of noise evolution

  /* ── Cursor interaction ──────────────────────────────── */
  CURSOR_LERP: 0.15,           // smooth factor per frame
  CURSOR_RADIUS: 0.18,         // fraction of portrait height (~160-180px)
  CURSOR_SIZE_BOOST: 1.0,      // keep natural fine dot size
  CURSOR_BRIGHTNESS: 0.85,     // balanced brightness
  CURSOR_REPEL: 0.0,           // zero displacement
  CURSOR_EASE_BACK: 0.6,       // seconds to ease back to normal

  /* ── Scroll dissolve ─────────────────────────────────── */
  SCROLL_RANGE_VH: 250,         // viewport heights of scrub (extended for slow, smooth sync)
  DISSOLVE_DRIFT_Y: 180,        // downward drift in px
  DISSOLVE_DRIFT_X: 280,        // horizontal spread in px
  DISSOLVE_FADE: 0.8,           // min opacity during dissolve (keeps particles clearly visible)
  DISSOLVE_SHRINK: 0.9,         // size factor during dissolve

  /* ── Name band (second target) ───────────────────────── */
  NAME_TEXT: "TANMAY KUMAR CHAURASIA",
  NAME_FONT_SIZE_VW: 11.5,      // vw units for the rasterized text
  NAME_FONT: "900 {{SIZE}}px Inter, sans-serif",
  NAME_OPACITY: 0.92,           // bright, prominent typography
  NAME_DRIFT_SPEED: 0.55,       // horizontal marquee speed
  NAME_Y_POSITION: 0.50,        // fraction of viewport height (0.50 = center)

  /* ── DPR ─────────────────────────────────────────────── */
  MAX_DPR: 2,

  /* ── Colors ──────────────────────────────────────────── */
  ACCENT_INDIGO: "#5851D5",
  ACCENT_GREEN: "#22c55e",
} as const;
