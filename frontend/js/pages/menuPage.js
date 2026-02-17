import { guardMenuPage } from "../services/guards.js";
import { getMenus, getProfile, saveGeneratedMenu } from "../services/userService.js";
import { getRecipeCatalog, getRecipeImage, getFallbackImage } from "../services/recipeService.js";
import { hydrateMenuWithRecipes, buildWeeklyMenu, buildWeekAdvice } from "../services/menuService.js";
import { renderNavbar, bindNavbarActions } from "../ui/navbar.js";

const access = guardMenuPage();
if (!access) {
  throw new Error("redirect");
}

const { session, user } = access;
const profile = getProfile(session.userId);

const navbarRoot = document.getElementById("topbarMount");
navbarRoot.innerHTML = renderNavbar({
  active: "menu",
  title: "Menu semanal",
  subtitle: `${user?.name || session.email} | Plan activo`,
});
bindNavbarActions();

const summaryEl = document.getElementById("summary");
const adviceEl = document.getElementById("aiInsight");
const weekIndicatorEl = document.getElementById("weekIndicator");
const dayIndicatorEl = document.getElementById("dayIndicator");
const dayDotsEl = document.getElementById("dayDots");
const menuListEl = document.getElementById("menuList");
const recipeDetailEl = document.getElementById("recipeDetail");
const statusEl = document.getElementById("menuStatus");

const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const prevDayBtn = document.getElementById("prevDayBtn");
const nextDayBtn = document.getElementById("nextDayBtn");
const editProfileBtn = document.getElementById("editProfileBtn");
const regenerateBtn = document.getElementById("regenerateBtn");

const state = {
  recipes: [],
  menus: [],
  weekIndex: 0,
  dayIndex: 0,
  hydratedMenu: null,
};

const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miercoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sabado",
  sunday: "Domingo",
};

const mealLabels = {
  breakfast: "Desayuno",
  lunch: "Comida",
  dinner: "Cena",
  snack: "Snack",
  snack_am: "Snack AM",
  snack_pm: "Snack PM",
  late_snack: "Snack noche",
};

function setStatus(text, type = "info") {
  statusEl.textContent = text;
  statusEl.style.color = type === "error" ? "#ffb6a6" : type === "ok" ? "#98f2c0" : "#b6c6c7";
}

function renderWeekMeta() {
  const total = state.menus.length;
  const current = state.menus[state.weekIndex];
  weekIndicatorEl.textContent = `${current?.label || "Semana"} (${state.weekIndex + 1}/${total})`;
  summaryEl.innerHTML = `Objetivo <strong>${current?.target_calories || "-"}</strong> kcal/dia`;

  const advice = buildWeekAdvice(profile, current, state.weekIndex);
  adviceEl.innerHTML = `
    <h3>${advice.title}</h3>
    <p>${advice.body}</p>
    <ul>${advice.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul>
  `;
  adviceEl.classList.remove("insight-refresh");
  void adviceEl.offsetWidth;
  adviceEl.classList.add("insight-refresh");
}

function renderDayDots(days) {
  dayDotsEl.innerHTML = "";
  days.forEach((_, idx) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-dot ${idx === state.dayIndex ? "active" : ""}`;
    button.addEventListener("click", () => {
      state.dayIndex = idx;
      renderCurrentDay();
    });
    dayDotsEl.appendChild(button);
  });
}

function renderRecipeDetail(recipe) {
  if (!recipe) {
    recipeDetailEl.innerHTML = "Selecciona una receta para ver detalle.";
    return;
  }
  localStorage.setItem("fitmenu_selected_recipe", recipe.id);
  recipeDetailEl.innerHTML = `
    <img class="recipe-img" src="${recipe.image || getRecipeImage(recipe.id)}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${getFallbackImage()}'" />
    <h3>${recipe.name}</h3>
    <p class="muted">${recipe.calories} kcal | P ${recipe.protein_g} g | C ${recipe.carbs_g} g | G ${recipe.fat_g} g</p>
    <strong>Ingredientes</strong>
    <ul>${recipe.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>
    <a class="primary inline-btn" href="recipe.html?id=${encodeURIComponent(recipe.id)}">Abrir receta</a>
  `;
}

function renderCurrentDay() {
  const currentWeek = state.hydratedMenu;
  const day = currentWeek?.week?.[state.dayIndex];
  if (!day) return;

  dayIndicatorEl.textContent = dayLabels[day.day] || day.day;
  renderDayDots(currentWeek.week);

  menuListEl.innerHTML = "";
  day.meals.forEach((meal, idx) => {
    const recipe = meal.recipe;
    if (!recipe) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "meal-btn meal-card-btn";
    button.style.setProperty("--meal-delay", `${idx * 70}ms`);
    button.innerHTML = `
      <img class="meal-thumb" src="${recipe.image || getRecipeImage(recipe.id)}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${getFallbackImage()}'" />
      <div class="meal-copy">
        <strong>${mealLabels[meal.meal_type] || meal.meal_type}</strong>
        <span>${recipe.name}</span>
      </div>
    `;
    button.addEventListener("click", () => renderRecipeDetail(recipe));
    menuListEl.appendChild(button);
  });

  renderRecipeDetail(day.meals[0]?.recipe || null);
}

function loadWeek(index) {
  state.weekIndex = Math.max(0, Math.min(index, state.menus.length - 1));
  state.dayIndex = 0;
  state.hydratedMenu = hydrateMenuWithRecipes(state.menus[state.weekIndex], state.recipes);
  renderWeekMeta();
  renderCurrentDay();
}

async function regenerateWeek() {
  setStatus("Generando nueva semana...");
  const newMenu = buildWeeklyMenu(profile, state.recipes, state.menus.length);
  saveGeneratedMenu(session.userId, newMenu);
  state.menus = getMenus(session.userId);
  loadWeek(state.menus.length - 1);
  setStatus("Nueva semana generada.", "ok");
}

prevWeekBtn.addEventListener("click", () => loadWeek((state.weekIndex - 1 + state.menus.length) % state.menus.length));
nextWeekBtn.addEventListener("click", () => loadWeek((state.weekIndex + 1) % state.menus.length));
prevDayBtn.addEventListener("click", () => {
  const days = state.hydratedMenu?.week?.length || 1;
  state.dayIndex = (state.dayIndex - 1 + days) % days;
  renderCurrentDay();
});
nextDayBtn.addEventListener("click", () => {
  const days = state.hydratedMenu?.week?.length || 1;
  state.dayIndex = (state.dayIndex + 1) % days;
  renderCurrentDay();
});
editProfileBtn.addEventListener("click", () => window.location.assign("form.html?edit=1"));
regenerateBtn.addEventListener("click", regenerateWeek);

async function init() {
  state.recipes = await getRecipeCatalog();
  state.menus = getMenus(session.userId);
  if (!state.menus.length) {
    window.location.replace("form.html");
    return;
  }
  loadWeek(state.menus.length - 1);
}

init();
