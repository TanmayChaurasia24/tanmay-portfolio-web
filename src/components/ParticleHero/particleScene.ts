/**
 * Three.js particle scene engine.
 *
 * Manages the WebGL renderer, camera, particle geometry with attributes,
 * shader material, and per-frame uniform updates. Provides methods to
 * set scroll/mouse uniforms from the React component.
 */

import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import { CONFIG } from "./config";

/* ─── Types ────────────────────────────────────────── */

interface ParticleSceneOptions {
  canvas: HTMLCanvasElement;
  imageSrc: string;
  onReady?: () => void;
}

/* ─── Scene Class ──────────────────────────────────── */

export class ParticleScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material: THREE.ShaderMaterial;
  private points: THREE.Points | null = null;
  private rafId: number | null = null;
  private startTime = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private smoothMouse = new THREE.Vector2(-9999, -9999);
  private targetMouse = new THREE.Vector2(-9999, -9999);
  private mouseActive = false;
  private scrollProgress = 0;
  private disposed = false;
  private visible = true;
  private reducedMotion = false;
  private isMobile = false;
  private onReady?: () => void;

  constructor(options: ParticleSceneOptions) {
    const { canvas, imageSrc, onReady } = options;
    this.onReady = onReady;
    this.isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
    this.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.MAX_DPR);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.width = canvas.clientWidth || window.innerWidth;
    this.height = canvas.clientHeight || window.innerHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setClearColor(0x000000, 0);

    // Scene
    this.scene = new THREE.Scene();

    // Orthographic camera matching pixel coordinates (top = height, bottom = 0)
    this.camera = new THREE.OrthographicCamera(
      0, this.width, this.height, 0, 0.1, 10
    );
    this.camera.position.z = 1;

    // Material (created once; geometry attached after image load)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uIntroProgress: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uMouseActive: { value: 0 },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uDPR: { value: this.dpr },
        uReducedMotion: { value: this.reducedMotion ? 1.0 : 0.0 },
        uNameBandWidth: { value: this.width * 2.0 },
        // Config uniforms
        uDotSizeBase: { value: CONFIG.DOT_SIZE_BASE },
        uDotSizeMax: { value: CONFIG.DOT_SIZE_MAX },
        uIntroSizeBoost: { value: CONFIG.INTRO_SIZE_BOOST },
        uIntroBrightnessBoost: { value: CONFIG.INTRO_BRIGHTNESS_BOOST },
        uIdleNoiseAmp: { value: CONFIG.IDLE_NOISE_AMP },
        uIdleNoiseSpeed: { value: CONFIG.IDLE_NOISE_SPEED },
        uCursorRadius: { value: CONFIG.CURSOR_RADIUS },
        uCursorSizeBoost: { value: CONFIG.CURSOR_SIZE_BOOST },
        uCursorBrightness: { value: CONFIG.CURSOR_BRIGHTNESS },
        uCursorRepel: { value: CONFIG.CURSOR_REPEL },
        uDissolveDriftY: { value: CONFIG.DISSOLVE_DRIFT_Y },
        uDissolveDriftX: { value: CONFIG.DISSOLVE_DRIFT_X },
        uDissolveFade: { value: CONFIG.DISSOLVE_FADE },
        uDissolveShrink: { value: CONFIG.DISSOLVE_SHRINK },
        uNameOpacity: { value: CONFIG.NAME_OPACITY },
        uNameDriftSpeed: { value: CONFIG.NAME_DRIFT_SPEED },
      },
    });

    // Load image and build particles
    this.loadImage(imageSrc);

    // Visibility API
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  /* ─── Image Sampling ─────────────────────────────── */

  private loadImage(src: string) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.width = this.renderer.domElement.clientWidth || window.innerWidth;
      this.height = this.renderer.domElement.clientHeight || window.innerHeight;
      this.renderer.setSize(this.width, this.height, false);
      this.camera.left = 0;
      this.camera.right = this.width;
      this.camera.top = this.height;
      this.camera.bottom = 0;
      this.camera.updateProjectionMatrix();
      this.material.uniforms.uResolution.value.set(this.width, this.height);

      this.buildParticles(img);
      this.startTime = performance.now() / 1000;
      this.animate();
      this.onReady?.();
    };
    img.onerror = () => {
      if (src !== "/tanmay.jpg") {
        this.loadImage("/tanmay.jpg");
      } else {
        console.error("ParticleScene: failed to load image", src);
      }
    };
    img.src = src;
  }

  private buildParticles(img: HTMLImageElement) {
    const count = this.isMobile
      ? CONFIG.PARTICLE_COUNT_MOBILE
      : CONFIG.PARTICLE_COUNT_DESKTOP;

    // ── Sample image into offscreen canvas ──────────
    const isMobile = this.width < CONFIG.MOBILE_BREAKPOINT;
    const heightRatio = isMobile ? 0.65 : CONFIG.PORTRAIT_HEIGHT_RATIO;
    const xOffset = isMobile ? 0.0 : CONFIG.PORTRAIT_X_OFFSET;
    const portraitH = this.height * heightRatio;
    const portraitW = (portraitH / img.height) * img.width;
    const offsetX = this.width * (0.5 + xOffset) - portraitW / 2;
    const offsetY = this.height - portraitH; // bottom-aligned

    const offCanvas = document.createElement("canvas");
    offCanvas.width = Math.ceil(portraitW);
    offCanvas.height = Math.ceil(portraitH);
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);
    const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imgData.data;

    // ── Build luminance map for rejection sampling ──
    type SamplePoint = { x: number; y: number; luma: number; weight: number };
    const candidates: SamplePoint[] = [];
    let totalWeight = 0;

    const step = 2;
    for (let py = 0; py < offCanvas.height; py += step) {
      for (let px = 0; px < offCanvas.width; px += step) {
        const idx = (py * offCanvas.width + px) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const a = pixels[idx + 3];
        // Background has alpha < 30 -> empty!
        if (a < 30) continue;

        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Density follows luminance: lit areas are dense, shadows are sparse
        const weight = 0.08 + Math.pow(luma, 1.15) * 0.92;
        candidates.push({
          x: px + offsetX,
          y: this.height - (py + offsetY), // flip Y for Three.js
          luma,
          weight,
        });
        totalWeight += weight;
      }
    }

    if (candidates.length === 0) return;

    // ── Build cumulative distribution for weighted sampling ─
    const cdf = new Float32Array(candidates.length);
    let cumulative = 0;
    for (let i = 0; i < candidates.length; i++) {
      cumulative += candidates[i].weight / totalWeight;
      cdf[i] = cumulative;
    }

    // ── Rasterize name text for second target ──────────
    const nameTargets = this.rasterizeNameText();

    // ── Allocate attribute arrays ──────────────────────
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const scatters = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const tones = new Float32Array(count);
    const nameTargetArr = new Float32Array(count * 3);

    const diag = Math.sqrt(this.width * this.width + this.height * this.height);
    const scatterR = diag * CONFIG.SCATTER_RADIUS;

    for (let i = 0; i < count; i++) {
      // ── Weighted sample from portrait via Binary Search (O(log N)) ──
      const r = Math.random();
      let low = 0;
      let high = candidates.length - 1;
      let sampleIdx = 0;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (cdf[mid] >= r) {
          sampleIdx = mid;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      // Add sub-pixel jitter
      const sample = candidates[sampleIdx];
      const tx = sample.x + (Math.random() - 0.5) * step;
      const ty = sample.y + (Math.random() - 0.5) * step;
      const luma = sample.luma;

      targets[i * 3] = tx;
      targets[i * 3 + 1] = ty;
      targets[i * 3 + 2] = 0;

      // ── Scatter positions (arc/dome shape) ────────
      const angle = Math.random() * Math.PI * 2;
      const radius = scatterR * (0.3 + Math.random() * 0.7);
      const sx = this.width * 0.5 + Math.cos(angle) * radius;
      const sy = this.height * (0.5 + CONFIG.SCATTER_ARC_BIAS_Y) + Math.sin(angle) * radius * 0.6;

      scatters[i * 3] = sx;
      scatters[i * 3 + 1] = sy;
      scatters[i * 3 + 2] = 0;

      // Start at scatter position
      positions[i * 3] = sx;
      positions[i * 3 + 1] = sy;
      positions[i * 3 + 2] = 0;

      // ── Random attributes ─────────────────────────
      randoms[i * 4] = Math.random() * CONFIG.INTRO_DELAY_MAX;      // delay
      randoms[i * 4 + 1] = Math.random();                            // speed seed
      randoms[i * 4 + 2] = 0.5 + Math.random() * 0.5;              // size seed
      randoms[i * 4 + 3] = Math.random() * Math.PI * 2;             // phase

      // ── Tone: shadows are dark grey, lit areas are bright white ─
      tones[i] = 0.22 + 0.78 * Math.pow(luma, 1.1);

      // ── Name target ───────────────────────────────
      if (nameTargets.length > 0) {
        const targetIdx = Math.floor(Math.random() * nameTargets.length);
        const nt = nameTargets[targetIdx];
        const jx = (Math.random() - 0.5) * 2.5;
        const jy = (Math.random() - 0.5) * 2.5;
        nameTargetArr[i * 3] = nt.x + jx;
        nameTargetArr[i * 3 + 1] = nt.y + jy;
        nameTargetArr[i * 3 + 2] = 1.0; // flag: valid
      } else {
        nameTargetArr[i * 3 + 2] = 0.0; // invalid
      }
    }

    // ── Build geometry ────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatters, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 4));
    geometry.setAttribute("aTone", new THREE.BufferAttribute(tones, 1));
    geometry.setAttribute("aNameTarget", new THREE.BufferAttribute(nameTargetArr, 3));

    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);
  }

  /* ─── Name Text Rasterization ────────────────────── */

  private rasterizeNameText(): Array<{ x: number; y: number }> {
    const unitText = `${CONFIG.NAME_TEXT}   •   `;
    const fontSize = Math.max(48, Math.min(180, Math.round((CONFIG.NAME_FONT_SIZE_VW / 100) * this.width)));
    const font = `900 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];

    ctx.font = font;
    const unitWidth = Math.ceil(ctx.measureText(unitText).width);
    const repeatCount = Math.max(2, Math.ceil(this.width / unitWidth) + 1);
    const fullText = unitText.repeat(repeatCount);
    const totalWidth = unitWidth * repeatCount;

    canvas.width = totalWidth;
    canvas.height = Math.ceil(fontSize * 1.5);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText(fullText, 0, canvas.height / 2);

    // Pass the repeating marquee banner width to the vertex shader
    this.material.uniforms.uNameBandWidth.value = totalWidth;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const points: Array<{ x: number; y: number }> = [];
    const sampleStep = 2; // high density
    const bandY = this.height * (CONFIG.NAME_Y_POSITION || 0.50);

    for (let py = 0; py < canvas.height; py += sampleStep) {
      for (let px = 0; px < canvas.width; px += sampleStep) {
        const idx = (py * canvas.width + px) * 4;
        const luma = data[idx];
        if (luma > 60) {
          points.push({
            x: px + (Math.random() - 0.5) * sampleStep,
            y: bandY - (py - canvas.height / 2) + (Math.random() - 0.5) * sampleStep,
          });
        }
      }
    }

    return points;
  }

  /* ─── Animation Loop ─────────────────────────────── */

  private animate = () => {
    if (this.disposed) return;

    if (!this.visible) {
      this.rafId = requestAnimationFrame(this.animate);
      return;
    }

    const now = performance.now() / 1000;
    const elapsed = now - this.startTime;

    // Update uniforms
    this.material.uniforms.uTime.value = elapsed;
    this.material.uniforms.uIntroProgress.value = Math.min(1, elapsed / 3.5);
    this.material.uniforms.uScroll.value = this.scrollProgress;

    // Smooth mouse
    this.smoothMouse.x += (this.targetMouse.x - this.smoothMouse.x) * CONFIG.CURSOR_LERP;
    this.smoothMouse.y += (this.targetMouse.y - this.smoothMouse.y) * CONFIG.CURSOR_LERP;
    this.material.uniforms.uMouse.value.set(this.smoothMouse.x, this.smoothMouse.y);
    this.material.uniforms.uMouseActive.value = this.mouseActive ? 1.0 : 0.0;

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.animate);
  };

  /* ─── Public API ─────────────────────────────────── */

  setMouse(clientX: number, clientY: number) {
    // Convert from DOM coords to Three.js orthographic coords
    // In our ortho camera: (0,0) is top-left in DOM but we set up
    // camera with y=0 at top, y=height at bottom... actually:
    // Camera: left=0, right=width, top=0, bottom=height => no, let's check.
    // Camera is set as (0, width, 0, height) which is (left, right, top, bottom)
    // Three.js ortho: top > bottom means y increases downward
    // But we stored positions with y flipped. Let me fix.
    // Actually in buildParticles we flip Y: y = height - (py + offsetY)
    // So Three.js Y=0 is bottom of viewport, Y=height is top.
    // The camera is (0, width, 0, height) => left=0, right=width, top=0, bottom=height
    // Wait: OrthographicCamera(left, right, top, bottom, near, far)
    // top=0, bottom=height means y=0 is at top in NDC... but that maps
    // to Three.js camera with top at y=0. Since we stored positions as
    // y = height - ... (ie y=0 bottom, y=height top), we need camera
    // top=height, bottom=0.
    // Let me fix this in the camera setup instead. For now, convert:
    this.targetMouse.set(clientX, this.height - clientY);
    this.mouseActive = true;
  }

  clearMouse() {
    this.targetMouse.set(-9999, -9999);
    this.mouseActive = false;
  }

  setScroll(progress: number) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  resize() {
    const canvas = this.renderer.domElement;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.renderer.setSize(this.width, this.height, false);

    // Update camera
    this.camera.left = 0;
    this.camera.right = this.width;
    this.camera.top = this.height; // fixed: top=height so y=0 is bottom
    this.camera.bottom = 0;
    this.camera.updateProjectionMatrix();

    this.material.uniforms.uResolution.value.set(this.width, this.height);
  }

  private handleVisibility = () => {
    this.visible = !document.hidden;
  };

  dispose() {
    this.disposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    document.removeEventListener("visibilitychange", this.handleVisibility);

    if (this.points) {
      this.points.geometry.dispose();
      this.scene.remove(this.points);
    }
    this.material.dispose();
    this.renderer.dispose();
  }

  /* ─── Setup camera correctly on init ─────────────── */
  initCamera() {
    // Fix camera so y=0 is bottom, y=height is top (matching our coordinate system)
    this.camera.left = 0;
    this.camera.right = this.width;
    this.camera.top = this.height;
    this.camera.bottom = 0;
    this.camera.updateProjectionMatrix();
  }
}
