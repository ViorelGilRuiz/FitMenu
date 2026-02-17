import { getJSON, setJSON, storageKeys } from "./storage.js";

const DEFAULT_API = "http://127.0.0.1:8001";

const RECIPE_IMAGE_MAP = {
  r1: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r2: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r3: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r4: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r5: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r6: "https://images.pexels.com/photos/3296395/pexels-photo-3296395.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r7: "https://images.pexels.com/photos/6294246/pexels-photo-6294246.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r8: "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r9: "https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r10: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r11: "https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r12: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600";

const LOCAL_RECIPES = [
  {
    id: "r1",
    name: "Avena proteica con frutas",
    calories: 420,
    protein_g: 28,
    carbs_g: 52,
    fat_g: 11,
    prep_minutes: 12,
    difficulty: "easy",
    cost_level: "low",
    ingredients: ["60 g de avena", "250 ml bebida vegetal", "1 scoop de proteina", "1 banana", "canela"],
    steps: [{ text: "Cuece la avena con bebida vegetal 5 minutos." }, { text: "Anade proteina y mezcla." }, { text: "Sirve con banana y canela." }],
  },
  {
    id: "r2",
    name: "Bowl de pollo arroz y verduras",
    calories: 610,
    protein_g: 46,
    carbs_g: 60,
    fat_g: 20,
    prep_minutes: 30,
    difficulty: "medium",
    cost_level: "mid",
    ingredients: ["160 g pechuga de pollo", "80 g arroz", "brocoli", "zanahoria", "aceite de oliva"],
    steps: [{ text: "Cocina arroz y reserva." }, { text: "Saltea pollo en dados hasta dorar." }, { text: "Incorpora verduras y sirve sobre arroz." }],
  },
  {
    id: "r3",
    name: "Ensalada de garbanzos y quinoa",
    calories: 530,
    protein_g: 22,
    carbs_g: 58,
    fat_g: 23,
    prep_minutes: 22,
    difficulty: "easy",
    cost_level: "low",
    ingredients: ["120 g garbanzos", "70 g quinoa", "tomate cherry", "pepino", "limon y aceite"],
    steps: [{ text: "Cuece quinoa y enfria." }, { text: "Mezcla garbanzos y verduras picadas." }, { text: "Alina con limon, aceite y sal." }],
  },
  {
    id: "r4",
    name: "Yogur con nueces y frutos rojos",
    calories: 290,
    protein_g: 18,
    carbs_g: 21,
    fat_g: 15,
    prep_minutes: 6,
    difficulty: "easy",
    cost_level: "low",
    ingredients: ["200 g yogur alto en proteina", "30 g frutos rojos", "20 g nueces"],
    steps: [{ text: "Sirve el yogur en bol." }, { text: "Anade frutos rojos y nueces." }],
  },
  {
    id: "r5",
    name: "Tofu salteado con arroz jazmin",
    calories: 560,
    protein_g: 32,
    carbs_g: 66,
    fat_g: 17,
    prep_minutes: 28,
    difficulty: "medium",
    cost_level: "mid",
    ingredients: ["180 g tofu", "80 g arroz jazmin", "pimiento", "cebolla", "ajo"],
    steps: [{ text: "Cuece arroz y reserva." }, { text: "Saltea tofu en cubos con ajo." }, { text: "Agrega verduras y mezcla con arroz." }],
  },
  {
    id: "r6",
    name: "Salmon al horno con patata y ensalada",
    calories: 640,
    protein_g: 42,
    carbs_g: 39,
    fat_g: 36,
    prep_minutes: 36,
    difficulty: "medium",
    cost_level: "high",
    ingredients: ["170 g salmon", "250 g patata", "mezcla verde", "aceite de oliva"],
    steps: [{ text: "Hornea la patata 25 minutos." }, { text: "Anade salmon y hornea 10 minutos mas." }, { text: "Sirve con ensalada fresca." }],
  },
  {
    id: "r7",
    name: "Tortilla de claras con espinaca",
    calories: 330,
    protein_g: 33,
    carbs_g: 14,
    fat_g: 12,
    prep_minutes: 14,
    difficulty: "easy",
    cost_level: "low",
    ingredients: ["6 claras y 1 huevo", "espinaca", "aceite", "sal"],
    steps: [{ text: "Saltea espinaca 2 minutos." }, { text: "Agrega claras y huevo batido." }, { text: "Cuaja a fuego medio." }],
  },
  {
    id: "r8",
    name: "Smoothie vegano de proteina y cacao",
    calories: 360,
    protein_g: 27,
    carbs_g: 26,
    fat_g: 17,
    prep_minutes: 7,
    difficulty: "easy",
    cost_level: "low",
    ingredients: ["bebida de almendra", "proteina vegetal", "cacao", "hielo", "banana"],
    steps: [{ text: "Introduce todo en batidora." }, { text: "Tritura 30-45 segundos." }],
  },
  {
    id: "r9",
    name: "Pudin de chia con mango",
    calories: 340,
    protein_g: 12,
    carbs_g: 36,
    fat_g: 16,
    prep_minutes: 8,
    difficulty: "easy",
    cost_level: "low",
    ingredients: ["35 g chia", "220 ml bebida de coco", "1/2 mango", "canela"],
    steps: [{ text: "Mezcla chia con bebida de coco." }, { text: "Refrigera minimo 4 horas." }, { text: "Sirve con mango y canela." }],
  },
  {
    id: "r10",
    name: "Pasta integral con atun y verduras",
    calories: 620,
    protein_g: 39,
    carbs_g: 84,
    fat_g: 16,
    prep_minutes: 32,
    difficulty: "medium",
    cost_level: "mid",
    ingredients: ["90 g pasta integral", "atun", "calabacin", "tomate", "ajo"],
    steps: [{ text: "Cuece la pasta al dente." }, { text: "Saltea verduras con ajo." }, { text: "Mezcla con atun y pasta." }],
  },
  {
    id: "r11",
    name: "Tacos de pescado con col y lima",
    calories: 560,
    protein_g: 36,
    carbs_g: 54,
    fat_g: 22,
    prep_minutes: 34,
    difficulty: "hard",
    cost_level: "mid",
    ingredients: ["pescado blanco", "tortillas", "col", "yogur", "lima"],
    steps: [{ text: "Marina y cocina pescado a la plancha." }, { text: "Prepara salsa con yogur y lima." }, { text: "Monta tacos con col fresca." }],
  },
  {
    id: "r12",
    name: "Shakshuka fitness con garbanzos",
    calories: 500,
    protein_g: 29,
    carbs_g: 48,
    fat_g: 20,
    prep_minutes: 30,
    difficulty: "hard",
    cost_level: "mid",
    ingredients: ["huevo", "tomate triturado", "garbanzos", "pimiento", "comino"],
    steps: [{ text: "Sofrie verduras con especias." }, { text: "Agrega tomate y garbanzos." }, { text: "Casca huevos y cocina tapado." }],
  },
].map((recipe) => ({ ...recipe, image: RECIPE_IMAGE_MAP[recipe.id] || FALLBACK_IMAGE }));

async function fetchRecipesFromApi(apiBase = DEFAULT_API) {
  const response = await fetch(`${apiBase}/recipes`);
  if (!response.ok) throw new Error("API recipes unavailable");
  const data = await response.json();
  if (!Array.isArray(data) || !data.length) throw new Error("Empty recipes");
  return data.map((recipe) => ({
    ...recipe,
    image: RECIPE_IMAGE_MAP[recipe.id] || recipe.image || FALLBACK_IMAGE,
    steps: Array.isArray(recipe.steps) ? recipe.steps : [],
  }));
}

export async function getRecipeCatalog() {
  const cached = getJSON(storageKeys.recipesCache, null);
  if (Array.isArray(cached) && cached.length) return cached;

  try {
    const remote = await fetchRecipesFromApi();
    setJSON(storageKeys.recipesCache, remote);
    return remote;
  } catch {
    setJSON(storageKeys.recipesCache, LOCAL_RECIPES);
    return LOCAL_RECIPES;
  }
}

export async function getRecipeById(recipeId) {
  const recipes = await getRecipeCatalog();
  return recipes.find((recipe) => recipe.id === recipeId) || null;
}

export function getRecipeImage(recipeId) {
  return RECIPE_IMAGE_MAP[recipeId] || FALLBACK_IMAGE;
}

export function getFallbackImage() {
  return FALLBACK_IMAGE;
}
