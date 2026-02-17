import { guardRecipePage } from "../services/guards.js";
import { getRecipeById, getRecipeImage, getFallbackImage } from "../services/recipeService.js";
import { markRecipeCooked, toggleFavoriteRecipe } from "../services/userService.js";
import { renderNavbar, bindNavbarActions } from "../ui/navbar.js";

const access = guardRecipePage();
if (!access) {
  throw new Error("redirect");
}

const { session, user } = access;

const navbarRoot = document.getElementById("topbarMount");
navbarRoot.innerHTML = renderNavbar({
  active: "recipe",
  title: "Receta seleccionada",
  subtitle: `${user?.name || session.email} | Paso a paso`,
});
bindNavbarActions();

const pageEl = document.getElementById("recipePage");

function getRecipeId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || localStorage.getItem("fitmenu_selected_recipe");
}

function difficultyLabel(value) {
  const map = { easy: "Facil", medium: "Media", hard: "Alta" };
  return map[value] || value;
}

function costLabel(value) {
  const map = { low: "Bajo", mid: "Medio", high: "Alto" };
  return map[value] || value;
}

function renderRecipe(recipe) {
  pageEl.innerHTML = `
    <section class="recipe-hero">
      <img class="recipe-img" src="${recipe.image || getRecipeImage(recipe.id)}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${getFallbackImage()}'" />
      <div class="recipe-hero-overlay">
        <h2>${recipe.name}</h2>
        <p class="muted">${recipe.calories} kcal | P ${recipe.protein_g} g | C ${recipe.carbs_g} g | G ${recipe.fat_g} g</p>
        <div class="badges">
          <span class="badge">${recipe.prep_minutes || "-"} min</span>
          <span class="badge">Dificultad ${difficultyLabel(recipe.difficulty || "easy")}</span>
          <span class="badge">Costo ${costLabel(recipe.cost_level || "mid")}</span>
        </div>
      </div>
    </section>
    <section class="recipe-layout">
      <article class="recipe-block">
        <h3>Ingredientes</h3>
        <ul>${recipe.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="recipe-block">
        <h3>Paso a paso</h3>
        <ol>${recipe.steps.map((step) => `<li>${step.text || step}</li>`).join("")}</ol>
      </article>
    </section>
    <section class="recipe-actions glass">
      <button id="backToMenuBtn" class="ghost" type="button">Volver al menu</button>
      <button id="markCookedBtn" class="primary" type="button">Marcar como hecha</button>
      <button id="favoriteBtn" class="ghost" type="button">Anadir a favoritos</button>
      <button id="notesBtn" class="ghost" type="button" aria-disabled="true">Notas (proximamente)</button>
      <p id="recipeActionStatus" class="muted"></p>
    </section>
  `;

  const statusEl = document.getElementById("recipeActionStatus");
  document.getElementById("backToMenuBtn").addEventListener("click", () => window.location.assign("menu.html"));
  document.getElementById("markCookedBtn").addEventListener("click", () => {
    markRecipeCooked(session.userId, recipe.id);
    statusEl.textContent = "Receta marcada como cocinada.";
  });
  document.getElementById("favoriteBtn").addEventListener("click", () => {
    toggleFavoriteRecipe(session.userId, recipe.id);
    statusEl.textContent = "Receta actualizada en favoritos.";
  });
}

async function init() {
  const recipeId = getRecipeId();
  if (!recipeId) {
    window.location.replace("menu.html");
    return;
  }

  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    pageEl.innerHTML = "No se pudo cargar la receta seleccionada.";
    return;
  }

  localStorage.setItem("fitmenu_selected_recipe", recipe.id);
  renderRecipe(recipe);
}

init();
