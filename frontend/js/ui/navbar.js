import { logoutUser } from "../services/authService.js";

export function renderNavbar({ active = "", title = "FitMenu AI Studio", subtitle = "", showBack = true } = {}) {
  return `
    <header class="topbar glass topbar-pro">
      <div class="brand-block">
        <p class="eyebrow">Performance Nutrition</p>
        <h1>${title}</h1>
        <p class="muted">${subtitle}</p>
      </div>
      <nav class="nav-links" aria-label="Navegacion principal">
        ${showBack ? '<button id="backBtn" class="ghost" type="button">Atras</button>' : ""}
        <a class="${active === "login" ? "active" : ""}" href="login.html">Login</a>
        <a class="${active === "form" ? "active" : ""}" href="form.html?edit=1">Formulario</a>
        <a class="${active === "menu" ? "active" : ""}" href="menu.html">Menu semanal</a>
        <a class="${active === "recipes" ? "active" : ""}" href="recipes.html">Cartas 3D</a>
        <a class="${active === "recipe" ? "active" : ""}" href="recipe.html">Receta</a>
        <button id="logoutBtn" class="ghost" type="button">Salir</button>
      </nav>
    </header>
  `;
}

export function bindNavbarActions(root = document) {
  const backBtn = root.querySelector("#backBtn");
  const logoutBtn = root.querySelector("#logoutBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => window.history.back());
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => logoutUser());
  }
}
