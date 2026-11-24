/**
 * GLSL shaders for the particle portrait system.
 *
 * Vertex shader handles:
 *   - Scatter → target interpolation (intro)
 *   - Idle noise jitter
 *   - Cursor repulsion
 *   - Scroll-synced progressive fluid distortion
 *   - Accurate convergence into "TANMAY KUMAR CHAURASIA"
 *   - Continuous horizontal marquee on the formed name
 *   - Per-particle size/brightness modulation
 *
 * Fragment shader draws a soft-edged circle with tone-based brightness.
 */

export const vertexShader = /* glsl */ `
  precision highp float;

  // Per-particle attributes
  attribute vec3 aTarget;        // portrait position
  attribute vec3 aScatter;       // random scatter start position
  attribute vec4 aRandom;        // x=delay, y=speed, z=sizeSeed, w=phase
  attribute float aTone;         // luminance 0-1
  attribute vec3 aNameTarget;    // name band position

  // Uniforms
  uniform float uTime;           // seconds since load
  uniform float uIntroProgress;  // 0→1 intro animation progress
  uniform float uScroll;         // 0→1 scroll progress
  uniform vec2 uMouse;           // smoothed mouse in world space
  uniform float uMouseActive;    // 0 or 1
  uniform vec2 uResolution;      // viewport px
  uniform float uDPR;
  uniform float uReducedMotion;  // 1 = skip animations
  uniform float uNameBandWidth;  // seamless marquee tile width

  // Config uniforms
  uniform float uDotSizeBase;
  uniform float uDotSizeMax;
  uniform float uIntroSizeBoost;
  uniform float uIntroBrightnessBoost;
  uniform float uIdleNoiseAmp;
  uniform float uIdleNoiseSpeed;
  uniform float uCursorRadius;
  uniform float uCursorSizeBoost;
  uniform float uCursorBrightness;
  uniform float uCursorRepel;
  uniform float uDissolveDriftY;
  uniform float uDissolveDriftX;
  uniform float uDissolveFade;
  uniform float uDissolveShrink;
  uniform float uNameOpacity;
  uniform float uNameDriftSpeed;

  varying float vAlpha;
  varying float vTone;

  // ── Simplex-ish noise (hash-based) ──────────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Curl-noise for swirl during intro & scroll distortion
  vec2 curlNoise(vec2 p) {
    float eps = 0.1;
    float n1 = noise2D(p + vec2(eps, 0.0));
    float n2 = noise2D(p - vec2(eps, 0.0));
    float n3 = noise2D(p + vec2(0.0, eps));
    float n4 = noise2D(p - vec2(0.0, eps));
    return vec2((n3 - n4), -(n1 - n2)) / (2.0 * eps);
  }

  void main() {
    float delay = aRandom.x;
    float speed = aRandom.y;
    float sizeSeed = aRandom.z;
    float phase = aRandom.w;

    // ── Intro: scatter → portrait ───────────────────
    float introStart = delay;
    float introDur = mix(1.8, 2.2, speed);
    float rawT = (uTime - introStart) / introDur;
    float t = clamp(rawT, 0.0, 1.0);

    // Exponential out easing
    float eased = 1.0 - pow(1.0 - t, 4.0);

    if (uReducedMotion > 0.5) {
      eased = 1.0;
      t = 1.0;
    }

    // Current base position: lerp scatter → portrait target
    vec3 portraitPos = mix(aScatter, aTarget, eased);

    // Add curl noise during travel (decays as t→1)
    float curlStrength = 0.15 * (1.0 - eased) * (1.0 - eased);
    vec2 curl = curlNoise(portraitPos.xy * 0.003 + uTime * 0.5 + phase * 10.0);
    portraitPos.xy += curl * curlStrength * uResolution.y * 0.15;

    // ── Idle noise jitter (after arrival) ────────────
    if (t >= 1.0 && uReducedMotion < 0.5) {
      float nx = noise2D(portraitPos.xy * 0.01 + uTime * uIdleNoiseSpeed + phase * 100.0) - 0.5;
      float ny = noise2D(portraitPos.xy * 0.01 + uTime * uIdleNoiseSpeed + phase * 100.0 + 50.0) - 0.5;
      portraitPos.x += nx * uIdleNoiseAmp * uDPR;
      portraitPos.y += ny * uIdleNoiseAmp * uDPR;
    }

    vec3 pos = portraitPos;

    // ── Scroll Stages: Accurately synced with uScroll ─
    if (uReducedMotion < 0.5) {
      // Stage 1: Distortion (uScroll: 0.10 → 0.52)
      // As user scrolls down, portrait dots slowly detach and fluidly swirl in 1:1 sync with scroll speed
      float distortRaw = clamp((uScroll - 0.10) / 0.42, 0.0, 1.0);
      float distortEase = distortRaw * distortRaw * (3.0 - 2.0 * distortRaw);

      vec2 flowCoord = aTarget.xy * 0.0022 + vec2(phase * 4.0, phase * 2.8);
      // uScroll drives the physical progression; uTime * 0.08 gives gentle organic idle breathing if scroll pauses
      vec2 scrollFlow = curlNoise(flowCoord + vec2(uScroll * 2.2 + uTime * 0.08));
      vec2 scrollNoise = vec2(
        noise2D(flowCoord * 2.0 + uScroll * 2.6 + uTime * 0.08) - 0.5,
        noise2D(flowCoord * 2.0 + uScroll * 2.6 + uTime * 0.08 + 35.0) - 0.5
      );

      float spreadX = (scrollFlow.x * 0.75 + scrollNoise.x * 0.55) * uResolution.x * 0.40;
      float spreadY = (scrollFlow.y * 0.65 + scrollNoise.y * 0.45) * uResolution.y * 0.35;

      vec3 distortedPos = vec3(aTarget.xy + vec2(spreadX, spreadY), 0.0);
      vec3 intermediatePos = mix(portraitPos, distortedPos, distortEase);

      // Stage 2: Convergence into TANMAY KUMAR CHAURASIA (uScroll: 0.45 → 0.83)
      // Add subtle per-particle delay stagger for breathtaking starfield stream
      float pStagger = aRandom.x * 0.08;
      float nameRaw = clamp((uScroll - 0.45 - pStagger) / 0.32, 0.0, 1.0);
      float nameEase = nameRaw * nameRaw * (3.0 - 2.0 * nameRaw);

      vec3 namePos = aNameTarget;

      // Continuous horizontal marquee drift (always glides horizontally to the left)
      float marquee = uTime * uNameDriftSpeed * uDPR * 45.0;
      float tileWidth = max(uNameBandWidth, uResolution.x + 500.0);

      // Seamless modulo wrap
      float wrappedX = mod(namePos.x - marquee, tileWidth);
      if (wrappedX < 0.0) {
        wrappedX += tileWidth;
      }

      // Smooth shortest-path wrap during interpolation to prevent visual jump
      if (nameEase < 1.0) {
        float dx = wrappedX - intermediatePos.x;
        if (dx > tileWidth * 0.5) wrappedX -= tileWidth;
        else if (dx < -tileWidth * 0.5) wrappedX += tileWidth;
      }

      namePos.x = wrappedX;

      // Final position: smoothly interpolates portrait -> distorted -> name
      pos = mix(intermediatePos, namePos, nameEase);
    }

    // ── Cursor interaction (hover) ───────────────────
    float cursorRadiusPx = uCursorRadius * uResolution.y;
    float distToCursor = length(pos.xy - uMouse);
    float cursorInfluence = 0.0;

    if (uMouseActive > 0.5 && distToCursor < cursorRadiusPx && uReducedMotion < 0.5) {
      cursorInfluence = 1.0 - smoothstep(0.0, cursorRadiusPx, distToCursor);
    }

    // ── Size calculation ─────────────────────────────
    float baseSize = mix(uDotSizeBase, uDotSizeMax, aTone * sizeSeed);
    float introBoost = mix(uIntroSizeBoost, 1.0, eased);
    float sz = baseSize * introBoost;

    // Shrink dots under cursor so colored photo shows through with 100% clarity
    if (uMouseActive > 0.5 && uScroll < 0.15) {
      sz *= (1.0 - cursorInfluence * 0.90);
    }

    // Compute scroll progress factors for sizing
    float distFactor = clamp((uScroll - 0.10) / 0.42, 0.0, 1.0);
    float nameFactor = clamp((uScroll - 0.45) / 0.35, 0.0, 1.0);

    // Size remains crisp throughout distortion and typography
    sz = mix(sz, baseSize * 1.15, distFactor * (1.0 - nameFactor));
    sz = mix(sz, baseSize * 1.30, nameFactor);

    // ── Alpha / brightness ───────────────────────────
    float alpha = aTone * 0.9;
    alpha *= mix(uIntroBrightnessBoost, 1.0, eased);

    // Make dots completely transparent under cursor so real colored image shows up crystal clear
    if (uMouseActive > 0.5 && uScroll < 0.15) {
      alpha *= (1.0 - cursorInfluence);
    }

    // Dots remain visible during distortion
    alpha = mix(alpha, max(0.68, aTone * 0.9), distFactor * (1.0 - nameFactor));

    // Bright, bold typography when formed into name
    alpha = mix(alpha, uNameOpacity, nameFactor);

    // Hide particles that haven't started intro yet
    if (uTime < delay && uReducedMotion < 0.5) {
      alpha *= 0.08;
      sz *= 0.4;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = sz * uDPR;

    vAlpha = clamp(alpha, 0.0, 1.0);
    vTone = aTone;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying float vAlpha;
  varying float vTone;

  void main() {
    // Soft circle with smoothstep edge
    float dist = length(gl_PointCoord - vec2(0.5));
    float circle = 1.0 - smoothstep(0.35, 0.5, dist);

    if (circle < 0.01) discard;

    // Crisp white dot with tone-based alpha
    vec3 color = vec3(1.0);
    float finalAlpha = circle * vAlpha;

    gl_FragColor = vec4(color, finalAlpha);
  }
`;
