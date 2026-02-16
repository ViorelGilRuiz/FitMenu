const session = requireAuth();
bindLogout();
bindBack();

const welcome = document.getElementById("welcome");
const form = document.getElementById("profileForm");
const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const menuEl = document.getElementById("menu");
const dayIndicatorEl = document.getElementById("dayIndicator");
const dayDotsEl = document.getElementById("dayDots");
const prevDayBtn = document.getElementById("prevDayBtn");
const nextDayBtn = document.getElementById("nextDayBtn");
const recipeDetailEl = document.getElementById("recipeDetail");
const aiInsightEl = document.getElementById("aiInsight");

const menuState = {
  week: [],
  currentDayIndex: 0,
};

if (session) {
  const activityLabel = session.activityLevel === "high" ? "Alta" : session.activityLevel === "low" ? "Baja" : "Media";
  welcome.textContent = `${session.name} | Nivel ${levelLabel(session.level)} | Actividad ${activityLabel} | ${session.maxPrepMinutes || 40} min/receta`;
}

function payload() {
  const allergies = document.getElementById("allergies").value.trim();
  const dislikes = document.getElementById("dislikes").value.trim();
  const cookLevel = session.level === "low" ? "basic" : session.level === "advanced" ? "advanced" : "intermediate";

  return {
    sex: document.getElementById('sex').value,
    age: Number(document.getElementById("age").value),
    weight_kg: Number(document.getElementById("weight").value),
    height_cm: Number(document.getElementById("height").value),
    goal: document.getElementById("goal").value,
    diet: document.getElementById("diet").value,
    lactose_free: document.getElementById("lactoseFree").checked,
    gluten_free: document.getElementById("glutenFree").checked,
    allergies: allergies ? allergies.split(",").map((x) => x.trim()).filter(Boolean) : [],
    dislikes: dislikes ? dislikes.split(",").map((x) => x.trim()).filter(Boolean) : [],
    meals_per_day: Number(document.getElementById("mealsPerDay").value),
    cook_level: cookLevel,
    activity_level: session.activityLevel || "moderate",
    training_days: Number.isFinite(session.trainingDays) ? session.trainingDays : 4,
    max_prep_minutes: Number.isFinite(session.maxPrepMinutes) ? session.maxPrepMinutes : 40,
    preferred_cost: session.preferredCost || "any",
  };
}

async function fetchData() {
  const apiUrl = session.apiUrl || DEFAULT_API_URL;
  const body = JSON.stringify(payload());

  const full = await fetch(`${apiUrl}/menus/weekly/full`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (full.ok) return { type: "full", data: await full.json() };

  const base = await fetch(`${apiUrl}/menus/weekly`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!base.ok) throw new Error(await base.text());

  const weekly = await base.json();
  const ids = [...new Set(weekly.week.flatMap((d) => d.meals.map((m) => m.recipe_id)))];
  const recipes = await Promise.all(ids.map(async (id) => {
    const r = await fetch(`${apiUrl}/recipes/${id}`);
    return r.json();
  }));

  return {
    type: "base",
    data: {
      profile_summary: weekly.profile_summary,
      target_calories: weekly.target_calories,
      week: weekly.week.map((d) => ({
        day: d.day,
        meals: d.meals.map((m) => ({ meal_type: m.meal_type, recipe: recipes.find((r) => r.id === m.recipe_id) })),
      })),
      shopping_list: [],
      kpis: null,
    },
  };
}

function showSummary(menu) {
  if (session.level === "advanced" && menu.kpis) {
    summaryEl.innerHTML = `Objetivo <strong>${menu.target_calories}</strong> kcal/dia | Recetas unicas <strong>${menu.kpis.unique_recipes}</strong><br>Promedio kcal <strong>${menu.kpis.avg_daily_calories}</strong> | Proteina <strong>${menu.kpis.avg_daily_protein_g} g</strong> | Prep <strong>${menu.kpis.avg_prep_minutes_per_meal} min</strong>`;
    return;
  }
  if (session.level === "intermediate") {
    summaryEl.innerHTML = `Objetivo <strong>${menu.target_calories}</strong> kcal/dia`;
    return;
  }
  summaryEl.textContent = "Menu generado para tu perfil.";
}

function pulseNode(node) {
  if (!node) return;
  node.classList.remove("pulse-on-action");
  void node.offsetWidth;
  node.classList.add("pulse-on-action");
}

function buildAiInsight(profile, menu) {
  const goalMap = {
    lose_fat: "definir y perder grasa",
    maintain: "mantener tu composicion corporal",
    gain_muscle: "ganar masa muscular",
  };
  const dietMap = {
    omnivore: "omnivoro",
    vegetarian: "vegetariano",
    vegan: "vegano",
  };
  const activityMap = {
    low: "actividad baja",
    moderate: "actividad moderada",
    high: "actividad alta",
  };

  const goalText = goalMap[profile.goal] || "mejorar tu nutricion";
  const dietText = dietMap[profile.diet] || "personalizado";
  const actText = activityMap[profile.activity_level] || "actividad moderada";
  const cookLevel = session.level === "low" ? "recetas faciles y directas" : session.level === "advanced" ? "recetas avanzadas con mayor variedad tecnica" : "recetas de dificultad media";

  const tips = [];
  if (profile.meals_per_day >= 5) tips.push("Tu distribucion de comidas es alta: prioriza preparaciones simples y batch cooking.");
  if (profile.training_days >= 5) tips.push("Entrenas muchos dias: manten una comida post-entreno con buena proteina y carbohidrato.");
  if (profile.max_prep_minutes <= 25) tips.push("Tiempo ajustado: enfocate en recetas de 1 sarten o preparaciones en bloque.");
  if (profile.goal === "gain_muscle") tips.push("Para ganar musculo, prioriza consistencia calorica y proteina diaria.");
  if (profile.goal === "lose_fat") tips.push("Para perder grasa, mantendremos saciedad alta con fibra y proteina.");
  if (profile.dislikes?.length) tips.push(`Hemos evitado ingredientes que no te gustan: ${profile.dislikes.join(", ")}.`);

  return `
    <h3>Consejo IA para ${session.name}</h3>
    <p>
      Perfil detectado: ${actText}, objetivo de <strong>${goalText}</strong>, dieta <strong>${dietText}</strong> y preferencia por ${cookLevel}.
      Tu objetivo calorico estimado es <strong>${menu.target_calories} kcal/dia</strong>.
    </p>
    <ul>
      ${tips.slice(0, 4).map((tip) => `<li>${tip}</li>`).join("")}
    </ul>
    <p class="muted">Siguiente paso recomendado: revisa el dia actual, valida recetas y ajusta restricciones antes de regenerar.</p>
  `;
}

function showAiInsight(profile, menu) {
  if (!aiInsightEl) return;
  aiInsightEl.classList.remove("hidden");
  aiInsightEl.innerHTML = buildAiInsight(profile, menu);
  pulseNode(aiInsightEl);
}

function renderDetail(recipe) {
  if (!recipe) return;
  localStorage.setItem(SELECTED_RECIPE_KEY, recipe.id);

  const base = `
    <img class="recipe-img" src="${recipeImage(recipe.id)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" alt="${recipe.name}" />
    <h3>${recipe.name}</h3>
    <p class="muted">${recipe.calories} kcal | P ${recipe.protein_g} | C ${recipe.carbs_g} | G ${recipe.fat_g}</p>
  `;

  if (session.level === "low") {
    recipeDetailEl.innerHTML = `${base}<strong>Pasos clave</strong><ol>${recipe.steps.slice(0, 2).map((s) => `<li>${s.text}</li>`).join("")}</ol><a class="primary inline-btn" href="recipe.html?id=${recipe.id}">Ver receta completa</a>`;
    return;
  }

  if (session.level === "intermediate") {
    recipeDetailEl.innerHTML = `${base}<strong>Ingredientes</strong><ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul><a class="primary inline-btn" href="recipe.html?id=${recipe.id}">Abrir receta</a>`;
    return;
  }

  recipeDetailEl.innerHTML = `${base}<div class="badges"><span class="badge">${recipe.prep_minutes || "-"} min</span><span class="badge">Dificultad ${recipe.difficulty || "easy"}</span><span class="badge">Costo ${recipe.cost_level || "mid"}</span></div><strong>Ingredientes</strong><ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul><strong>Pasos</strong><ol>${recipe.steps.map((s) => `<li>${s.text}</li>`).join("")}</ol>`;
}

function updateDayIndicator(day) {
  let text = normalizeDay(day.day);
  if (session.level === "advanced" && day.total_calories) {
    text += ` | ${day.total_calories} kcal | P ${day.total_protein_g}g`;
  }
  dayIndicatorEl.textContent = text;
}

function updateDayDots() {
  dayDotsEl.innerHTML = "";
  menuState.week.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `day-dot ${index === menuState.currentDayIndex ? "active" : ""}`;
    dot.addEventListener("click", () => {
      menuState.currentDayIndex = index;
      renderCurrentDay(true);
    });
    dayDotsEl.appendChild(dot);
  });
}

function renderCurrentDay(animated = false) {
  const day = menuState.week[menuState.currentDayIndex];
  if (!day) return;

  updateDayIndicator(day);
  updateDayDots();

  menuEl.classList.toggle("switching", animated);
  setTimeout(() => menuEl.classList.remove("switching"), 220);
  pulseNode(menuEl);

  const card = document.createElement("div");
  card.className = "day-card day-card-large";

  for (const meal of day.meals) {
    const recipe = meal.recipe;
    const btn = document.createElement("button");
    btn.className = "meal-btn meal-card-btn";

    const mealTitle = normalizeMealType(meal.meal_type);
    const mealSubtitle =
      session.level === "low"
        ? "Recomendacion del dia"
        : session.level === "advanced"
          ? `${recipe.name} · ${recipe.calories} kcal · P ${recipe.protein_g}g`
          : recipe.name;

    btn.innerHTML = `
      <img class="meal-thumb" src="${recipeImage(recipe.id)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" alt="${recipe.name}" />
      <div class="meal-copy">
        <strong>${mealTitle}</strong>
        <span>${mealSubtitle}</span>
      </div>
    `;

    btn.addEventListener("click", () => renderDetail(recipe));
    card.appendChild(btn);
  }

  menuEl.innerHTML = "";
  menuEl.appendChild(card);

  const first = day.meals?.[0]?.recipe;
  if (first) renderDetail(first);
}

function shiftDay(delta) {
  if (!menuState.week.length) return;
  const len = menuState.week.length;
  menuState.currentDayIndex = (menuState.currentDayIndex + delta + len) % len;
  renderCurrentDay(true);
}

function renderMenu(menu) {
  showSummary(menu);
  menuState.week = menu.week;
  menuState.currentDayIndex = 0;
  showAiInsight(payload(), menu);
  renderCurrentDay(false);
}

prevDayBtn.addEventListener("click", () => shiftDay(-1));
nextDayBtn.addEventListener("click", () => shiftDay(1));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Generando menu...";
  statusEl.style.color = "#8ed8ff";

  try {
    const result = await fetchData();
    renderMenu(result.data);
    localStorage.setItem("fitmenu_last_week", JSON.stringify(result.data));
    statusEl.textContent = "Menu generado correctamente";
    statusEl.style.color = "#7ef5c6";
    pulseNode(statusEl);
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.style.color = "#ff9ab8";
    pulseNode(statusEl);
  }
});

