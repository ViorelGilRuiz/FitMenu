(function () {
  const canvas = document.getElementById("universe-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scene = document.body.dataset.scene || "default";

  let w = 0;
  let h = 0;
  let time = 0;

  const farStars = [];
  const midStars = [];
  const nearStars = [];
  const atoms = [];
  const dust = [];
  const pulses = [];
  const mouseTrail = [];
  const nebula = [];
  const sparks = [];
  const bolts = [];
  let autoPulseTimer = 0;

  const mouse = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    active: false,
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    mouse.x = w * 0.5;
    mouse.y = h * 0.5;
    mouse.tx = mouse.x;
    mouse.ty = mouse.y;
  }

  function makeStars(buffer, count, radiusMin, radiusMax, speedMin, speedMax) {
    buffer.length = 0;
    for (let i = 0; i < count; i += 1) {
      buffer.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(radiusMin, radiusMax),
        speed: rand(speedMin, speedMax),
        alpha: rand(0.2, 0.95),
        twinkle: rand(0.004, 0.024),
      });
    }
  }

  function create() {
    const base = Math.max(150, Math.floor((w * h) / 11000));
    makeStars(farStars, base, 0.45, 1.2, 0.02, 0.06);
    makeStars(midStars, Math.floor(base * 0.55), 0.6, 1.8, 0.05, 0.12);
    makeStars(nearStars, Math.floor(base * 0.22), 0.9, 2.6, 0.1, 0.28);

    atoms.length = 0;
    dust.length = 0;
    nebula.length = 0;
    pulses.length = 0;
    mouseTrail.length = 0;
    sparks.length = 0;
    bolts.length = 0;

    for (let i = 0; i < 10; i += 1) {
      atoms.push({
        x: rand(0, w),
        y: rand(0, h),
        orbit: rand(15, 38),
        core: rand(1.8, 3.2),
        angle: rand(0, Math.PI * 2),
        speed: rand(0.004, 0.01),
      });
    }

    const dustCount = scene === "login" ? 150 : 80;
    for (let i = 0; i < dustCount; i += 1) {
      dust.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.12, 0.12),
        r: rand(0.8, 1.9),
        alpha: rand(0.14, 0.55),
      });
    }

    if (scene === "login") {
      for (let i = 0; i < 7; i += 1) {
        nebula.push({
          x: rand(0, w),
          y: rand(0, h),
          radius: rand(180, 420),
          hue: i % 2 === 0 ? 195 : 160,
          alpha: rand(0.03, 0.1),
          drift: rand(0.03, 0.09),
        });
      }
    }

    const sparkCount = scene === "login" ? 130 : 70;
    for (let i = 0; i < sparkCount; i += 1) {
      sparks.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(2.2, 5.8),
        vy: rand(-0.8, 0.8),
        len: rand(8, 24),
        alpha: rand(0.18, 0.55),
      });
    }
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, w, h);
    if (scene === "login") {
      g.addColorStop(0, "#040815");
      g.addColorStop(0.45, "#050c1d");
      g.addColorStop(1, "#02050f");
    } else {
      g.addColorStop(0, "#081327");
      g.addColorStop(1, "#0a0f24");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawNebula() {
    if (scene !== "login") return;
    for (const n of nebula) {
      n.x += Math.cos(time * n.drift) * 0.15;
      n.y += Math.sin(time * n.drift) * 0.11;
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      grad.addColorStop(0, `hsla(${n.hue}, 94%, 63%, ${n.alpha})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStars(buffer, color, parallaxStrength) {
    const px = ((mouse.x / w) - 0.5) * parallaxStrength;
    const py = ((mouse.y / h) - 0.5) * parallaxStrength;

    for (const s of buffer) {
      s.alpha += s.twinkle;
      if (s.alpha > 1 || s.alpha < 0.15) s.twinkle *= -1;
      s.x -= s.speed;
      if (s.x < -4) s.x = w + 4;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${color},${clamp(s.alpha, 0.12, 1)})`;
      ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawAtoms() {
    for (const a of atoms) {
      a.angle += a.speed;
      const ex = a.x + Math.cos(a.angle) * a.orbit;
      const ey = a.y + Math.sin(a.angle) * (a.orbit * 0.58);

      ctx.strokeStyle = "rgba(87,149,255,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(a.x, a.y, a.orbit, a.orbit * 0.58, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "rgba(93,222,255,0.88)";
      ctx.arc(ex, ey, 1.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "rgba(54,244,194,0.8)";
      ctx.arc(a.x, a.y, a.core, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDustAndMouseEnergy() {
    const influence = scene === "login" ? 170 : 95;
    for (const p of dust) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt((dx * dx) + (dy * dy));

      if (mouse.active && dist < influence) {
        const force = (1 - (dist / influence)) * (scene === "login" ? 0.08 : 0.04);
        p.vx += (dx / (dist + 0.01)) * force;
        p.vy += (dy / (dist + 0.01)) * force;
      }

      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -8) p.x = w + 8;
      if (p.x > w + 8) p.x = -8;
      if (p.y < -8) p.y = h + 8;
      if (p.y > h + 8) p.y = -8;

      ctx.beginPath();
      ctx.fillStyle = `rgba(111,196,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (scene !== "login") return;

    const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
    glow.addColorStop(0, "rgba(92,215,255,0.14)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawElectricLayer() {
    for (const s of sparks) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x > w + 30 || s.y < -20 || s.y > h + 20) {
        s.x = -20;
        s.y = rand(0, h);
        s.vx = rand(1.3, scene === "login" ? 4.2 : 2.4);
        s.vy = rand(-1.1, 1.1);
      }
      ctx.strokeStyle = `rgba(97,228,255,${s.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y + (s.len * 0.25));
      ctx.stroke();
    }

    for (let i = bolts.length - 1; i >= 0; i -= 1) {
      const b = bolts[i];
      b.life -= 0.05;
      if (b.life <= 0) {
        bolts.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(66,199,255,${b.life * 0.45})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      for (let p = 0; p < b.points.length; p += 1) {
        const point = b.points[p];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  }

  function createBolt() {
    const startX = rand(0, w);
    const startY = rand(0, h * 0.65);
    const segments = 5 + Math.floor(rand(0, 4));
    const points = [];
    let cx = startX;
    let cy = startY;
    for (let i = 0; i < segments; i += 1) {
      cx += rand(35, 80);
      cy += rand(-28, 28);
      points.push({ x: cx, y: cy });
    }
    bolts.push({ x: startX, y: startY, points, life: scene === "login" ? 0.45 : 0.25 });
  }

  function drawTrailAndPulses() {
    if (scene === "login") {
      for (let i = mouseTrail.length - 1; i >= 0; i -= 1) {
        const t = mouseTrail[i];
        t.life -= 0.02;
        if (t.life <= 0) {
          mouseTrail.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(104,220,255,${t.life * 0.35})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(t.x1, t.y1);
        ctx.lineTo(t.x2, t.y2);
        ctx.stroke();
      }
    }

    for (let i = pulses.length - 1; i >= 0; i -= 1) {
      const p = pulses[i];
      p.r += p.growth;
      p.alpha -= 0.013;
      if (p.alpha <= 0) {
        pulses.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(93,213,255,${p.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function frame() {
    time += 0.01;
    autoPulseTimer += 1;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    if (autoPulseTimer % (scene === "login" ? 12 : 18) === 0) {
      pulses.push({ x: rand(0, w), y: rand(0, h), r: rand(4, 10), growth: rand(2.2, 4.2), alpha: 0.28 });
    }
    if (autoPulseTimer % (scene === "login" ? 28 : 55) === 0) {
      createBolt();
    }

    drawBackground();
    drawNebula();
    drawStars(farStars, "178,210,255", 6);
    drawStars(midStars, "164,216,255", 11);
    drawStars(nearStars, "198,232,255", 18);
    drawElectricLayer();
    drawAtoms();
    drawDustAndMouseEnergy();
    drawTrailAndPulses();

    requestAnimationFrame(frame);
  }

  function onMove(event) {
    mouse.active = true;
    const prevX = mouse.tx;
    const prevY = mouse.ty;
    mouse.tx = event.clientX;
    mouse.ty = event.clientY;

    if (scene === "login") {
      mouseTrail.push({
        x1: prevX,
        y1: prevY,
        x2: mouse.tx,
        y2: mouse.ty,
        life: 0.55,
      });
      if (mouseTrail.length > 45) mouseTrail.shift();
    }
  }

  function onLeave() {
    mouse.active = false;
  }

  function onClick(event) {
    pulses.push({ x: event.clientX, y: event.clientY, r: 6, growth: 3.2, alpha: 0.45 });
    if (scene === "login") {
      pulses.push({ x: event.clientX, y: event.clientY, r: 12, growth: 4.8, alpha: 0.25 });
    }
  }

  resize();
  create();
  frame();

  window.addEventListener("resize", () => {
    resize();
    create();
  });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseleave", onLeave);
  window.addEventListener("click", onClick);
})();
