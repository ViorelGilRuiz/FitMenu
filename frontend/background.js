import { AnimatedCookingBackground } from "./js/ui/AnimatedCookingBackground.js";

function createWarmStarfield(canvas, reducedMotion) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let rafId = 0;
  let lastTime = 0;
  let time = 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: Math.max(90, Math.floor((width * height) / 18000)) }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.7, 2),
      v: rand(0.08, 0.22) * (reducedMotion ? 0.35 : 1),
      a: rand(0.2, 0.9),
    }));
  }

  function render(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    time += dt;

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#1b140f");
    bg.addColorStop(1, "#0d0906");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      star.x -= star.v;
      if (star.x < -3) star.x = width + 3;
      const alpha = Math.max(0.14, Math.min(0.95, star.a + Math.sin(time * 2 + star.y * 0.02) * 0.08));
      ctx.fillStyle = `rgba(255, ${180 + Math.floor(alpha * 45)}, ${95 + Math.floor(alpha * 30)}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = requestAnimationFrame(render);
  }

  function start() {
    resize();
    lastTime = performance.now();
    rafId = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        return;
      }
      lastTime = performance.now();
      rafId = requestAnimationFrame(render);
    });
  }

  return { start };
}

function initBackground() {
  const canvas = document.getElementById("universe-bg");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scene = document.body.dataset.scene || "app";

  if (scene === "login") {
    const cookingBackground = new AnimatedCookingBackground(canvas, { reducedMotion });
    cookingBackground.start();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("focusin", () => cookingBackground.setFocusMode(true));
      loginForm.addEventListener("focusout", () => {
        const active = document.activeElement;
        const stillInside = active && loginForm.contains(active);
        if (!stillInside) cookingBackground.setFocusMode(false);
      });
    }
    return;
  }

  const starfield = createWarmStarfield(canvas, reducedMotion);
  starfield.start();
}

initBackground();
