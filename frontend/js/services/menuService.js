import { saveGeneratedMenu, getMenus } from "./userService.js";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function allowedDifficulties(level = "intermediate") {
  if (level === "low" || level === "basic") return new Set(["easy"]);
  if (level === "advanced") return new Set(["easy", "medium", "hard"]);
  return new Set(["easy", "medium"]);
}

function mealPlanByCount(mealsPerDay = 4) {
  if (mealsPerDay <= 3) return ["breakfast", "lunch", "dinner"];
  if (mealsPerDay === 4) return ["breakfast", "lunch", "dinner", "snack_am"];
  if (mealsPerDay === 5) return ["breakfast", "snack_am", "lunch", "dinner", "snack_pm"];
  return ["breakfast", "snack_am", "lunch", "dinner", "late_snack", "snack_pm"];
}

function estimateTargetCalories(profile) {
  const sexFactor = profile.sex === "male" ? 5 : -161;
  const bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + sexFactor;
  const activityMap = { low: 1.35, moderate: 1.55, high: 1.75 };
  const multiplier = activityMap[profile.activity_level] || 1.55;
  const maintenance = bmr * multiplier;
  if (profile.goal === "gain_muscle") return Math.round(maintenance + 280);
  if (profile.goal === "lose_fat") return Math.round(maintenance - 380);
  return Math.round(maintenance);
}

function weekLabel(index) {
  return `Semana ${index + 1}`;
}

export function buildWeeklyMenu(profile, recipes, weekIndex = 0) {
  const allow = allowedDifficulties(profile.level || "intermediate");
  const compatible = recipes.filter((recipe) => allow.has(recipe.difficulty || "easy"));
  const pool = compatible.length ? compatible : recipes;
  const meals = mealPlanByCount(profile.meals_per_day);
  const target = estimateTargetCalories(profile);
  let cursor = weekIndex * 7;

  const week = DAYS.map((day) => {
    const items = meals.map((mealType) => {
      const recipe = pool[cursor % pool.length];
      cursor += 1;
      return { meal_type: mealType, recipe_id: recipe.id };
    });
    return { day, meals: items };
  });

  return {
    id: `week_${Date.now()}_${weekIndex + 1}`,
    label: weekLabel(weekIndex),
    weekIndex,
    target_calories: target,
    generatedAt: new Date().toISOString(),
    week,
  };
}

export function saveNewWeeklyMenu(userId, profile, recipes) {
  const previous = getMenus(userId);
  const menu = buildWeeklyMenu(profile, recipes, previous.length);
  saveGeneratedMenu(userId, menu);
  return menu;
}

export function hydrateMenuWithRecipes(menu, recipes) {
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  return {
    ...menu,
    week: menu.week.map((day) => ({
      ...day,
      meals: day.meals.map((meal) => ({
        ...meal,
        recipe: byId.get(meal.recipe_id) || null,
      })),
    })),
  };
}

export function buildWeekAdvice(profile, menu, weekIndex = 0) {
  const rotation = [
    "Prioriza cocinar 2 bases (proteina + carbohidrato) para ahorrar tiempo.",
    "Ajusta hidratacion diaria y reparte proteina en todas las comidas.",
    "Prepara snacks con antelacion para evitar decisiones impulsivas.",
    "Revisa adherencia: si una receta no te encaja, sustituyela por una similar.",
  ];
  const goalLabel =
    profile.goal === "gain_muscle" ? "ganancia muscular" : profile.goal === "lose_fat" ? "definicion" : "mantenimiento";

  return {
    title: `Consejo IA | ${menu.label}`,
    body: `Plan enfocado en ${goalLabel} con objetivo estimado de ${menu.target_calories} kcal/dia y ${profile.meals_per_day} comidas.`,
    tips: [
      rotation[weekIndex % rotation.length],
      "Usa el bloque de receta para anotar sensaciones y mejoras.",
      "Si cambias objetivo o restricciones, edita perfil y regenera menu.",
    ],
  };
}
