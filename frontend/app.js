const form = document.getElementById("profileForm");
const statusEl = document.getElementById("status");
const menuEl = document.getElementById("menu");
const recipeDetailEl = document.getElementById("recipeDetail");
const summaryEl = document.getElementById("summary");
const shoppingListEl = document.getElementById("shoppingList");
const recipeWheelEl = document.getElementById("recipeWheel");

let recipeCache = new Map();
const wheelState = {
  recipes: [],
  index: 0,
  lastScrollTs: 0,
};

const RECIPE_IMAGES = {
  r1: "https://loremflickr.com/900/600/oatmeal,breakfast?lock=11",
  r2: "https://loremflickr.com/900/600/chicken,rice,bowl?lock=12",
  r3: "https://loremflickr.com/900/600/chickpea,quinoa,salad?lock=13",
  r4: "https://loremflickr.com/900/600/yogurt,berries,nuts?lock=14",
  r5: "https://loremflickr.com/900/600/tofu,stirfry,rice?lock=15",
  r6: "https://loremflickr.com/900/600/salmon,potato?lock=16",
  r7: "https://loremflickr.com/900/600/omelette,spinach?lock=17",
  r8: "https://loremflickr.com/900/600/smoothie,protein?lock=18",
  r9: "https://loremflickr.com/900/600/chia,pudding,mango?lock=19",
  r10: "https://loremflickr.com/900/600/lentil,stew?lock=20",
};

const FALLBACK_IMG = "https://placehold.co/900x600/1a3a62/dbeafe?text=FitMenu+Recipe";

function normalizeDay(day) {
  const labels = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miercoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sabado",
    sunday: "Domingo",
  };
  return labels[day] || day;
}

function normalizeMealType(mealType) {
  const labels = {
    breakfast: "Desayuno",
    lunch: "Comida",
    dinner: "Cena",
    snack: "Snack",
    snack_am: "Snack AM",
    snack_pm: "Snack PM",
    late_snack: "Snack Noche",
  };
  return labels[mealType] || mealType;
}

function difficultyLabel(value) {
  const labels = { easy: "Facil", medium: "Media", hard: "Alta" };
  return labels[value] || value;
}

function costLabel(value) {
  const labels = { low: "Bajo", mid: "Medio", high: "Alto" };
  return labels[value] || value;
}

function getRecipeImage(recipeId) {
  return RECIPE_IMAGES[recipeId] || "https://loremflickr.com/900/600/healthy,food?lock=21";
}

function profilePayload() {
  const allergiesText = document.getElementById("allergies").value.trim();
  return {
    age: Number(document.getElementById("age").value),
    weight_kg: Number(document.getElementById("weight").value),
    height_cm: Number(document.getElementById("height").value),
    goal: document.getElementById("goal").value,
    diet: document.getElementById("diet").value,
    lactose_free: document.getElementById("lactoseFree").checked,
    gluten_free: document.getElementById("glutenFree").checked,
    allergies: allergiesText ? allergiesText.split(",").map((x) => x.trim()).filter(Boolean) : [],
    meals_per_day: Number(document.getElementById("mealsPerDay").value),
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyTilt(el, maxTilt = 7) {
  el.classList.add("tilted");
  el.addEventListener("mousemove", (event) => {
    const bounds = el.getBoundingClientRect();
    const relX = (event.clientX - bounds.left) / bounds.width;
    const relY = (event.clientY - bounds.top) / bounds.height;
    const rotY = (relX - 0.5) * maxTilt * 2;
    const rotX = (0.5 - relY) * maxTilt * 2;
    el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
  });
}

function bootTiltEffects() {
  document.querySelectorAll(".panel").forEach((panel) => applyTilt(panel, 5));
}

async function fetchRecipe(apiUrl, recipeId) {
  if (recipeCache.has(recipeId)) return recipeCache.get(recipeId);
  const response = await fetch(`${apiUrl}/recipes/${recipeId}`);
  if (!response.ok) {
    throw new Error(`No se pudo cargar receta ${recipeId}`);
  }
  const data = await response.json();
  recipeCache.set(recipeId, data);
  return data;
}

function renderRecipe(recipe) {
  recipeDetailEl.innerHTML = `
    <img class="recipe-hero" src="${getRecipeImage(recipe.id)}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" />
    <h3>${recipe.name}</h3>
    <p class="recipe-macros">${recipe.calories} kcal | P ${recipe.protein_g} g | C ${recipe.carbs_g} g | G ${recipe.fat_g} g</p>
    <div class="recipe-meta-row">
      <span class="meta-pill">${recipe.prep_minutes || "-"} min</span>
      <span class="meta-pill">Dificultad: ${difficultyLabel(recipe.difficulty || "easy")}</span>
      <span class="meta-pill">Costo: ${costLabel(recipe.cost_level || "mid")}</span>
    </div>
    <strong>Ingredientes</strong>
    <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <strong>Pasos</strong>
    <ol>${recipe.steps.map((s) => `<li>${s.text}</li>`).join("")}</ol>
  `;
}

function wrappedOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function paintWheelCards() {
  const cards = recipeWheelEl.querySelectorAll(".wheel-card");
  const n = wheelState.recipes.length;

  cards.forEach((card, index) => {
    const offset = wrappedOffset(index, wheelState.index, n);
    const depth = Math.abs(offset);
    const x = offset * 36;
    const y = depth * 13;
    const z = -depth * 118;
    const rotY = offset * -14;
    const scale = 1 - depth * 0.06;

    card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
    card.style.opacity = `${clamp(1 - depth * 0.22, 0.16, 1)}`;
    card.style.filter = `blur(${depth > 0 ? Math.min(1.8, depth * 0.7) : 0}px)`;
    card.style.zIndex = `${100 - depth}`;
    card.classList.toggle("active", index === wheelState.index);
  });

  if (wheelState.recipes[wheelState.index]) {
    renderRecipe(wheelState.recipes[wheelState.index]);
  }
}

function moveWheel(direction) {
  const total = wheelState.recipes.length;
  if (!total) return;
  wheelState.index = (wheelState.index + direction + total) % total;
  paintWheelCards();
}

function syncWheelToRecipe(recipeId) {
  const idx = wheelState.recipes.findIndex((r) => r.id === recipeId);
  if (idx >= 0) {
    wheelState.index = idx;
    paintWheelCards();
  }
}

function renderRecipeWheel(recipes) {
  wheelState.recipes = recipes;
  wheelState.index = 0;
  recipeWheelEl.innerHTML = "";

  if (!recipes.length) {
    recipeWheelEl.innerHTML = '<div class="wheel-empty">Genera un menu para activar la ruleta de recetas.</div>';
    return;
  }

  recipes.forEach((recipe, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "wheel-card";
    card.innerHTML = `
      <img class="thumb" src="${getRecipeImage(recipe.id)}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" />
      <div>
        <h4>${recipe.name}</h4>
        <p>${recipe.calories} kcal | P ${recipe.protein_g}g C ${recipe.carbs_g}g G ${recipe.fat_g}g</p>
      </div>
    `;
    card.addEventListener("click", () => {
      wheelState.index = index;
      paintWheelCards();
    });
    recipeWheelEl.appendChild(card);
  });

  paintWheelCards();
}

function handleWheelScroll(event) {
  event.preventDefault();
  const now = performance.now();
  if (now - wheelState.lastScrollTs < 130) return;
  wheelState.lastScrollTs = now;
  moveWheel(event.deltaY > 0 ? 1 : -1);
}

function renderShoppingList(legacyMenu, recipesById, shoppingList = null) {
  if (Array.isArray(shoppingList) && shoppingList.length) {
    shoppingListEl.innerHTML = shoppingList
      .map((item) => `<li>${item.ingredient} <strong>x${item.count}</strong></li>`)
      .join("");
    return;
  }

  const ingredients = [];
  for (const day of legacyMenu.week) {
    for (const meal of day.meals) {
      const recipe = recipesById.get(meal.recipe_id);
      if (recipe) ingredients.push(...recipe.ingredients);
    }
  }
  const counts = new Map();
  for (const ing of ingredients) {
    counts.set(ing, (counts.get(ing) || 0) + 1);
  }

  shoppingListEl.innerHTML = Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([ingredient, qty]) => `<li>${ingredient} <strong>x${qty}</strong></li>`)
    .join("");
}

function renderSummary(menu, kpis = null) {
  if (kpis) {
    summaryEl.innerHTML = `
      <strong>Objetivo:</strong> ${menu.target_calories} kcal/dia<br>
      <strong>Recetas unicas:</strong> ${kpis.unique_recipes} | <strong>Promedio kcal:</strong> ${kpis.avg_daily_calories}<br>
      <strong>Promedio proteina:</strong> ${kpis.avg_daily_protein_g} g/dia | <strong>Prep media:</strong> ${kpis.avg_prep_minutes_per_meal} min
    `;
    return;
  }
  summaryEl.textContent = `Objetivo calorico estimado: ${menu.target_calories} kcal/dia | ${menu.profile_summary}`;
}

function renderMenu(menu, apiUrl, recipesById) {
  renderSummary(menu, menu.kpis || null);
  menuEl.innerHTML = "";

  for (const [index, day] of menu.week.entries()) {
    const dayCard = document.createElement("div");
    dayCard.className = "day";
    dayCard.style.animationDelay = `${index * 68}ms`;
    applyTilt(dayCard, 8);

    const title = document.createElement("h3");
    const extra = day.total_calories ? ` (${day.total_calories} kcal | P ${day.total_protein_g}g)` : "";
    title.textContent = `${normalizeDay(day.day)}${extra}`;
    dayCard.appendChild(title);

    for (const meal of day.meals) {
      const recipeId = meal.recipe_id || meal.recipe?.id;
      const recipe = meal.recipe || recipesById.get(recipeId);
      const btn = document.createElement("button");
      btn.className = "meal-btn";
      btn.type = "button";
      btn.textContent = `${normalizeMealType(meal.meal_type)}: ${recipe ? recipe.name : recipeId}`;
      btn.addEventListener("click", async () => {
        try {
          const detail = recipe || (await fetchRecipe(apiUrl, recipeId));
          renderRecipe(detail);
          syncWheelToRecipe(detail.id);
        } catch (err) {
          statusEl.textContent = err.message;
          statusEl.style.color = "#ff9db4";
        }
      });
      dayCard.appendChild(btn);
    }

    menuEl.appendChild(dayCard);
  }
}

function mapFullMenuToLegacy(fullMenu) {
  return {
    profile_summary: fullMenu.profile_summary,
    target_calories: fullMenu.target_calories,
    week: fullMenu.week.map((day) => ({
      day: day.day,
      total_calories: day.total_calories,
      total_protein_g: day.total_protein_g,
      meals: day.meals.map((meal) => ({
        meal_type: meal.meal_type,
        recipe_id: meal.recipe.id,
        recipe: meal.recipe,
      })),
    })),
    shopping_list: fullMenu.shopping_list,
    kpis: fullMenu.kpis,
  };
}

async function fetchWeeklyData(apiUrl, payload) {
  const fullResponse = await fetch(`${apiUrl}/menus/weekly/full`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (fullResponse.ok) {
    const fullData = await fullResponse.json();
    const mapped = mapFullMenuToLegacy(fullData);
    const recipesById = new Map();

    for (const day of mapped.week) {
      for (const meal of day.meals) {
        recipesById.set(meal.recipe.id, meal.recipe);
      }
    }
    const recipes = [...recipesById.values()];
    return { menu: mapped, recipesById, recipes, shopping: mapped.shopping_list };
  }

  const fallbackResponse = await fetch(`${apiUrl}/menus/weekly`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!fallbackResponse.ok) {
    const message = await fallbackResponse.text();
    throw new Error(`Error API (${fallbackResponse.status}): ${message}`);
  }

  const menu = await fallbackResponse.json();
  const uniqueRecipeIds = [...new Set(menu.week.flatMap((day) => day.meals.map((m) => m.recipe_id)))];
  const recipes = await Promise.all(uniqueRecipeIds.map((id) => fetchRecipe(apiUrl, id)));
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  return { menu, recipesById, recipes, shopping: null };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Generando menu semanal...";
  statusEl.style.color = "#b3e7ff";
  recipeDetailEl.textContent = "Cargando receta...";
  shoppingListEl.innerHTML = "";

  const apiUrl = document.getElementById("apiUrl").value.trim().replace(/\/$/, "");

  try {
    const payload = profilePayload();
    const data = await fetchWeeklyData(apiUrl, payload);

    renderMenu(data.menu, apiUrl, data.recipesById);
    renderShoppingList(data.menu, data.recipesById, data.shopping);
    renderRecipeWheel(data.recipes);

    statusEl.textContent = "Menu generado correctamente.";
    statusEl.style.color = "#7df7c5";
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.style.color = "#ff9db4";
  }
});

recipeWheelEl.addEventListener("wheel", handleWheelScroll, { passive: false });
bootTiltEffects();
renderRecipeWheel([]);
