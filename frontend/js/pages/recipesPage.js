import { guardRecipePage } from "../services/guards.js";
import { getRecipeCatalog, getRecipeImage, getFallbackImage } from "../services/recipeService.js";
import { renderNavbar, bindNavbarActions } from "../ui/navbar.js";

const access = guardRecipePage();
if (!access) {
  throw new Error("redirect");
}

const { session, user } = access;

const navbarRoot = document.getElementById("topbarMount");
navbarRoot.innerHTML = renderNavbar({
  active: "recipes",
  title: "Cartas de recetas",
  subtitle: `${user?.name || session.email} | Biblioteca visual`,
});
bindNavbarActions();

const cardsGrid = document.getElementById("cardsGrid");

function applyTilt(card) {
  card.addEventListener("mousemove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.transform = `rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-3px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  });
}

function difficultyLabel(level) {
  if (level === "hard") return "alta";
  if (level === "medium") return "media";
  return "facil";
}

async function renderCards() {
  const recipes = await getRecipeCatalog();
  cardsGrid.innerHTML = "";

  recipes.forEach((recipe, index) => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.style.setProperty("--card-delay", `${index * 38}ms`);
    card.innerHTML = `
      <div class="recipe-card-media">
        <img src="${recipe.image || getRecipeImage(recipe.id)}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${getFallbackImage()}'" />
        <span class="recipe-card-difficulty ${recipe.difficulty || "easy"}">${difficultyLabel(recipe.difficulty || "easy")}</span>
      </div>
      <div class="recipe-card-body">
        <h3>${recipe.name}</h3>
        <p>${recipe.calories} kcal | P ${recipe.protein_g} g | ${recipe.prep_minutes || "-"} min</p>
      </div>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("fitmenu_selected_recipe", recipe.id);
      window.location.assign(`recipe.html?id=${encodeURIComponent(recipe.id)}`);
    });
    applyTilt(card);
    cardsGrid.appendChild(card);
  });
}

renderCards();
