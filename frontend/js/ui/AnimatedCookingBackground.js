import { KITCHEN_BG_URL, INGREDIENT_ASSETS } from "./cooking/assets.js";
import { clamp, lerp, pointInCircle, pointInEllipse, rand } from "./cooking/physics.js";

export class AnimatedCookingBackground {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.reducedMotion = reducedMotion;
    this.dpr = 1;
    this.width = 0;
    this.height = 0;
    this.lastTime = 0;
    this.rafId = 0;
    this.running = false;
    this.time = 0;
    this.sceneIntensity = 1;
    this.targetIntensity = 1;

    this.pointer = {
      x: 0,
      y: 0,
      down: false,
      active: false,
      pointerId: null,
      lastTap: 0,
    };

    this.items = [];
    this.maxItems = reducedMotion ? 12 : 24;
    this.minFallingItems = reducedMotion ? 5 : 10;
    this.hoveredId = null;
    this.draggedId = null;
    this.spawnAccumulator = 0;
    this.sizzleParticles = [];
    this.panShake = 0;
    this.panHeatBoost = 0;

    this.assets = INGREDIENT_ASSETS.map((asset) => ({
      ...asset,
      image: this.loadImage(asset.icon),
    }));
    this.kitchenBg = this.loadImage(KITCHEN_BG_URL);
    this.panGeom = null;

    this.boundFrame = this.frame.bind(this);
    this.onResize = this.resize.bind(this);
    this.onVisibility = this.handleVisibility.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onPointerUp = this.handlePointerUp.bind(this);
    this.onPointerCancel = this.handlePointerCancel.bind(this);
    this.onDoubleClick = this.handleDoubleClick.bind(this);
    this.onContextMenu = this.handleContextMenu.bind(this);
  }

  loadImage(src) {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    return image;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.resize();
    this.seedItems();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerCancel);
    this.canvas.addEventListener("dblclick", this.onDoubleClick);
    this.canvas.addEventListener("contextmenu", this.onContextMenu);
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.boundFrame);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerCancel);
    this.canvas.removeEventListener("dblclick", this.onDoubleClick);
    this.canvas.removeEventListener("contextmenu", this.onContextMenu);
  }

  setFocusMode(active) {
    this.targetIntensity = active ? 0.7 : 1;
  }

  handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(this.rafId);
      return;
    }
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.boundFrame);
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.computePanGeometry();
  }

  computePanGeometry() {
    const panWidth = Math.min(this.width * 0.62, 560);
    const panHeight = Math.max(160, panWidth * 0.31);
    const centerX = this.width * 0.5;
    const centerY = this.height - 78;
    this.panGeom = {
      centerX,
      centerY,
      width: panWidth,
      height: panHeight,
      handleLength: panWidth * 0.33,
      dropZone: {
        cx: centerX,
        cy: centerY - panHeight * 0.26,
        rx: panWidth * 0.33,
        ry: panHeight * 0.3,
      },
    };
  }

  seedItems() {
    this.items = [];
    const initialCount = this.reducedMotion ? 8 : 14;
    for (let i = 0; i < initialCount; i += 1) {
      const item = this.createItem();
      item.y = rand(-this.height, this.height * 0.35);
      this.items.push(item);
    }
  }

  createItem() {
    const asset = this.assets[Math.floor(rand(0, this.assets.length))];
    const radius = rand(24, 34);
    return {
      id: `ing_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      asset,
      x: rand(radius, this.width - radius),
      y: rand(-220, -80),
      vx: rand(-0.24, 0.24),
      vy: rand(0.28, 0.72),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.022, 0.022),
      radius,
      scale: 1,
      targetScale: 1,
      state: "falling",
      inPanSince: 0,
      pinnedUntil: 0,
      hitPulse: 0,
      z: 0,
    };
  }

  frame(now) {
    if (!this.running || document.hidden) return;
    const dt = clamp((now - this.lastTime) / 1000, 0, 0.033);
    this.lastTime = now;
    this.time += dt;
    this.sceneIntensity = lerp(this.sceneIntensity, this.targetIntensity, 0.08);
    this.update(dt, now);
    this.render(now);
    this.rafId = requestAnimationFrame(this.boundFrame);
  }

  update(dt, now) {
    this.spawnAccumulator += dt;
    const spawnEvery = this.reducedMotion ? 1.05 : 0.62;
    const fallingCount = this.items.filter((item) => item.state !== "inPan").length;
    const shouldForceSpawn = fallingCount < this.minFallingItems;
    const hardLimit = this.maxItems + 6;
    if ((this.items.length < this.maxItems || (shouldForceSpawn && this.items.length < hardLimit)) && this.spawnAccumulator >= spawnEvery * (1.35 - this.sceneIntensity * 0.35)) {
      this.spawnAccumulator = 0;
      this.items.push(this.createItem());
    }

    const gravity = this.reducedMotion ? 120 : 190;
    const pan = this.panGeom;

    this.items.forEach((item) => {
      if (item.id === this.draggedId) return;
      if (item.pinnedUntil > now) {
        item.vy = Math.min(item.vy, 20);
        item.vx *= 0.95;
      } else {
        item.vy += gravity * dt;
      }

      if (item.state === "inPan") {
        if (!item.inPanSince) item.inPanSince = now;
        item.vx *= 0.95;
        item.vy = lerp(item.vy, 0, 0.24);
        const panLife = now - item.inPanSince;
        const recycleAfter = this.reducedMotion ? 6800 : 5200;
        if (panLife > recycleAfter) {
          Object.assign(item, this.createItem(), {
            x: rand(item.radius, this.width - item.radius),
            y: rand(-220, -80),
          });
          return;
        }
      } else {
        item.inPanSince = 0;
        item.vx *= 0.995;
      }

      item.x += item.vx * dt * 60;
      item.y += item.vy * dt * 60;
      if (!this.reducedMotion) item.rot += item.vr * dt * 60;

      this.resolvePanCollision(item);
      if (item.y > this.height + 120) Object.assign(item, this.createItem());

      item.targetScale = item.id === this.hoveredId ? 1.25 : 1;
      item.scale = lerp(item.scale, item.targetScale, 0.2);
      item.hitPulse = Math.max(0, item.hitPulse - dt * 3);
    });

    this.sizzleParticles = this.sizzleParticles.filter((particle) => {
      particle.life -= dt;
      particle.x += particle.vx * dt * 60;
      particle.y += particle.vy * dt * 60;
      particle.vy -= dt * 14;
      particle.alpha = clamp(particle.life / particle.maxLife, 0, 1);
      return particle.life > 0;
    });

    this.panShake = Math.max(0, this.panShake - dt * 4);
    this.panHeatBoost = Math.max(0, this.panHeatBoost - dt * 1.8);
  }

  resolvePanCollision(item) {
    const drop = this.panGeom.dropZone;
    const inDropZone = pointInEllipse(item.x, item.y, drop.cx, drop.cy, drop.rx, drop.ry);
    if (!inDropZone && item.state === "inPan" && item.y < drop.cy - drop.ry - 10) {
      item.state = "falling";
    }

    if (!inDropZone && item.state !== "inPan") return;

    const nx = (item.x - drop.cx) / drop.rx;
    const floorY = drop.cy + drop.ry * 0.62 - (1 - (nx * nx)) * 12;
    const leftBound = drop.cx - drop.rx + item.radius * 0.52;
    const rightBound = drop.cx + drop.rx - item.radius * 0.52;
    item.x = clamp(item.x, leftBound, rightBound);

      if (item.y + item.radius >= floorY) {
        item.y = floorY - item.radius;
        item.state = "inPan";
        item.inPanSince = performance.now();
        item.vy *= -0.35;
        item.vx *= 0.75;
      if (Math.abs(item.vy) < 18) item.vy = 0;
      item.hitPulse = 1;
    } else if (item.state === "inPan") {
      item.vx += (drop.cx - item.x) * 0.003;
    }
  }

  getTopItemAt(x, y) {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      const radius = item.radius * (item.scale || 1);
      if (pointInCircle(x, y, item.x, item.y, radius)) return item;
    }
    return null;
  }

  pointerToCanvas(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  handlePointerMove(event) {
    const point = this.pointerToCanvas(event);
    this.pointer.x = point.x;
    this.pointer.y = point.y;
    this.pointer.active = true;

    if (this.draggedId) {
      const dragged = this.items.find((item) => item.id === this.draggedId);
      if (dragged) {
        dragged.x = point.x;
        dragged.y = point.y;
        dragged.scale = lerp(dragged.scale, 1.35, 0.35);
      }
      return;
    }

    const hit = this.getTopItemAt(point.x, point.y);
    this.hoveredId = hit ? hit.id : null;
    this.canvas.style.cursor = hit ? "grab" : "default";
  }

  handlePointerDown(event) {
    const point = this.pointerToCanvas(event);
    this.pointer.down = true;
    this.pointer.pointerId = event.pointerId;
    this.pointer.x = point.x;
    this.pointer.y = point.y;
    const hit = this.getTopItemAt(point.x, point.y);
    this.hoveredId = hit ? hit.id : null;
    if (!hit || this.reducedMotion) return;

    this.draggedId = hit.id;
    this.canvas.style.cursor = "grabbing";
    hit.state = "dragged";
    hit.vx = 0;
    hit.vy = 0;
    hit.z = 10;
    hit.targetScale = 1.35;
    this.canvas.setPointerCapture(event.pointerId);
  }

  handlePointerUp(event) {
    const point = this.pointerToCanvas(event);
    if (!this.draggedId) {
      this.pointer.down = false;
      return;
    }
    const item = this.items.find((candidate) => candidate.id === this.draggedId);
    if (item) {
      const drop = this.panGeom.dropZone;
      const droppedInPan = pointInEllipse(point.x, point.y, drop.cx, drop.cy, drop.rx, drop.ry);
      if (droppedInPan) {
        item.state = "inPan";
        item.inPanSince = performance.now();
        item.vx = rand(-0.7, 0.7);
        item.vy = -rand(1.2, 2.6);
        item.targetScale = 1.05;
        this.spawnSizzle(point.x, point.y);
      } else {
        item.state = "falling";
        item.vx = rand(-0.35, 0.35);
        item.vy = rand(0.3, 1.1);
        item.targetScale = 1;
      }
      item.z = 0;
    }

    this.draggedId = null;
    this.pointer.down = false;
    this.canvas.style.cursor = "default";
    this.canvas.releasePointerCapture(event.pointerId);
  }

  handlePointerCancel(event) {
    if (this.draggedId) {
      const item = this.items.find((candidate) => candidate.id === this.draggedId);
      if (item) item.state = "falling";
      this.draggedId = null;
    }
    this.pointer.down = false;
    this.canvas.style.cursor = "default";
    if (event.pointerId !== undefined) this.canvas.releasePointerCapture(event.pointerId);
  }

  handleDoubleClick(event) {
    const point = this.pointerToCanvas(event);
    const hit = this.getTopItemAt(point.x, point.y);
    if (!hit) return;
    hit.pinnedUntil = performance.now() + 1000;
    hit.vx = 0;
    hit.vy = -0.4;
  }

  handleContextMenu(event) {
    event.preventDefault();
    const point = this.pointerToCanvas(event);
    const hit = this.getTopItemAt(point.x, point.y);
    if (!hit) return;
    this.items = this.items.filter((item) => item.id !== hit.id);
  }

  spawnSizzle(x, y) {
    const count = this.reducedMotion ? 5 : 12;
    for (let i = 0; i < count; i += 1) {
      this.sizzleParticles.push({
        x,
        y: y - 4,
        vx: rand(-1.4, 1.4),
        vy: rand(-2.2, -0.3),
        life: rand(0.25, 0.46),
        maxLife: 0.46,
        alpha: 1,
      });
    }
    this.panShake = 1;
    this.panHeatBoost = 1;
  }

  drawBackground() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    ctx.fillStyle = "#1a130d";
    ctx.fillRect(0, 0, w, h);

    if (this.kitchenBg.complete && this.kitchenBg.naturalWidth > 0) {
      const imgRatio = this.kitchenBg.naturalWidth / this.kitchenBg.naturalHeight;
      const cvRatio = w / h;
      let dw = w;
      let dh = h;
      let dx = 0;
      let dy = 0;
      if (imgRatio > cvRatio) {
        dh = h;
        dw = h * imgRatio;
        dx = (w - dw) * 0.5;
      } else {
        dw = w;
        dh = w / imgRatio;
        dy = (h - dh) * 0.5;
      }
      ctx.globalAlpha = 0.44 * this.sceneIntensity;
      ctx.drawImage(this.kitchenBg, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }

    const overlay = ctx.createLinearGradient(0, 0, 0, h);
    overlay.addColorStop(0, "rgba(22,16,12,0.62)");
    overlay.addColorStop(0.58, "rgba(18,13,9,0.56)");
    overlay.addColorStop(1, "rgba(10,8,6,0.89)");
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, w, h);
  }

  drawFire(now) {
    const ctx = this.ctx;
    const pan = this.panGeom;
    const fireY = pan.centerY + pan.height * 0.33;
    const flameCount = this.reducedMotion ? 4 : 8;
    const strength = 0.6 + this.panHeatBoost * 0.5;

    const ember = ctx.createRadialGradient(pan.centerX, fireY + 8, 8, pan.centerX, fireY + 8, pan.width * 0.38);
    ember.addColorStop(0, `rgba(255,145,62,${0.35 + strength * 0.25})`);
    ember.addColorStop(1, "rgba(255,84,31,0)");
    ctx.fillStyle = ember;
    ctx.beginPath();
    ctx.ellipse(pan.centerX, fireY + 8, pan.width * 0.36, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < flameCount; i += 1) {
      const offset = (i / (flameCount - 1 || 1)) - 0.5;
      const x = pan.centerX + offset * pan.width * 0.42;
      const oscillation = Math.sin((now * 0.01) + i * 0.9) * (this.reducedMotion ? 3 : 6);
      const flameH = 26 + Math.sin((now * 0.012) + i) * 8 + this.panHeatBoost * 8;
      const flameW = 20 + Math.cos((now * 0.009) + i * 0.5) * 4;
      const gradient = ctx.createLinearGradient(x, fireY + 16, x, fireY - flameH);
      gradient.addColorStop(0, "rgba(255,102,30,0.88)");
      gradient.addColorStop(0.55, "rgba(255,184,75,0.78)");
      gradient.addColorStop(1, "rgba(251,238,156,0.08)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(x - flameW * 0.5, fireY + 12);
      ctx.quadraticCurveTo(x - flameW * 0.3, fireY - flameH * 0.35, x, fireY - flameH + oscillation);
      ctx.quadraticCurveTo(x + flameW * 0.3, fireY - flameH * 0.35, x + flameW * 0.5, fireY + 12);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawPan() {
    const ctx = this.ctx;
    const pan = this.panGeom;
    const shakeOffset = Math.sin(this.time * 42) * this.panShake * 5;
    ctx.save();
    ctx.translate(shakeOffset, 0);

    ctx.fillStyle = "rgba(0,0,0,0.36)";
    ctx.beginPath();
    ctx.ellipse(pan.centerX, pan.centerY + pan.height * 0.28, pan.width * 0.42, pan.height * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    const handleGrad = ctx.createLinearGradient(pan.centerX + pan.width * 0.47, pan.centerY - 8, pan.centerX + pan.width * 0.47 + pan.handleLength, pan.centerY + 12);
    handleGrad.addColorStop(0, "#7c8088");
    handleGrad.addColorStop(1, "#3f454f");
    ctx.fillStyle = handleGrad;
    ctx.beginPath();
    ctx.roundRect(pan.centerX + pan.width * 0.39, pan.centerY - 12, pan.handleLength, 24, 12);
    ctx.fill();

    const outerGrad = ctx.createLinearGradient(pan.centerX, pan.centerY - pan.height * 0.5, pan.centerX, pan.centerY + pan.height * 0.5);
    outerGrad.addColorStop(0, "#8b9099");
    outerGrad.addColorStop(0.5, "#575d66");
    outerGrad.addColorStop(1, "#2f353f");
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.ellipse(pan.centerX, pan.centerY, pan.width * 0.44, pan.height * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();

    const innerGrad = ctx.createRadialGradient(pan.centerX, pan.centerY - pan.height * 0.2, 10, pan.centerX, pan.centerY - pan.height * 0.1, pan.width * 0.35);
    innerGrad.addColorStop(0, "rgba(33,38,43,0.98)");
    innerGrad.addColorStop(1, "rgba(16,19,22,0.98)");
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.ellipse(pan.centerX, pan.centerY - pan.height * 0.05, pan.width * 0.35, pan.height * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(224,234,246,0.24)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(pan.centerX, pan.centerY - pan.height * 0.03, pan.width * 0.35, pan.height * 0.26, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  drawIngredient(item) {
    const ctx = this.ctx;
    const radius = item.radius;
    const glow = item.id === this.hoveredId || item.id === this.draggedId;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rot);
    ctx.scale(item.scale, item.scale);

    if (glow) {
      ctx.shadowColor = "rgba(255, 200, 130, 0.75)";
      ctx.shadowBlur = 18;
    }

    const image = item.asset.image;
    if (image.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, -radius, -radius, radius * 2, radius * 2);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    if (item.hitPulse > 0) {
      ctx.strokeStyle = `rgba(255,220,144,${item.hitPulse * 0.55})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius * (1.1 + item.hitPulse * 0.2), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawTooltip() {
    if (!this.hoveredId || this.draggedId) return;
    const item = this.items.find((candidate) => candidate.id === this.hoveredId);
    if (!item) return;
    const ctx = this.ctx;
    const text = item.asset.name;
    ctx.save();
    ctx.font = "600 13px 'Segoe UI', sans-serif";
    const textWidth = ctx.measureText(text).width;
    const boxW = textWidth + 18;
    const boxH = 28;
    const x = clamp(item.x - boxW * 0.5, 10, this.width - boxW - 10);
    const y = item.y - item.radius - 34;

    ctx.fillStyle = "rgba(14, 12, 10, 0.9)";
    ctx.strokeStyle = "rgba(255, 195, 122, 0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffe6be";
    ctx.fillText(text, x + 9, y + 18);
    ctx.restore();
  }

  drawSizzle() {
    const ctx = this.ctx;
    this.sizzleParticles.forEach((particle) => {
      ctx.fillStyle = `rgba(255, ${Math.floor(180 + particle.alpha * 50)}, 105, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 1.8 + particle.alpha * 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawIngredientsLayer() {
    const inPan = [];
    const falling = [];
    let dragged = null;
    this.items.forEach((item) => {
      if (item.id === this.draggedId) {
        dragged = item;
      } else if (item.state === "inPan") {
        inPan.push(item);
      } else {
        falling.push(item);
      }
    });

    inPan.forEach((item) => this.drawIngredient(item));
    falling.forEach((item) => this.drawIngredient(item));
    if (dragged) this.drawIngredient(dragged);
  }

  render(now) {
    this.drawBackground();
    this.drawFire(now);
    this.drawPan();
    this.drawIngredientsLayer();
    this.drawSizzle();
    this.drawTooltip();
  }
}
