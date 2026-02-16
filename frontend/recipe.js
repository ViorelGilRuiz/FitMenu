requireAuth();
bindLogout();
bindBack();

const page = document.getElementById("recipePage");
const params = new URLSearchParams(window.location.search);

function recipeIdFromState() {
  return params.get("id") || localStorage.getItem(SELECTED_RECIPE_KEY);
}

function difficultyLabel(value) {
  const labels = { easy: "Facil", medium: "Media", hard: "Alta" };
  return labels[value] || value;
}

function costLabel(value) {
  const labels = { low: "Bajo", mid: "Medio", high: "Alto" };
  return labels[value] || value;
}

async function loadRecipe() {
  const id = recipeIdFromState();
  if (!id) {
    page.innerHTML = "No hay receta seleccionada. Ve a Cartas 3D.";
    return;
  }

  const session = getSession();
  const response = await fetch(`${session.apiUrl}/recipes/${id}`);
  if (!response.ok) {
    page.innerHTML = "No se pudo cargar la receta.";
    return;
  }

  const recipe = await response.json();
  localStorage.setItem(SELECTED_RECIPE_KEY, recipe.id);

  page.innerHTML = `
    <img class="recipe-img" src="${recipeImage(recipe.id)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" alt="${recipe.name}" />
    <h2>${recipe.name}</h2>
    <p class="muted">${recipe.calories} kcal | P ${recipe.protein_g} g | C ${recipe.carbs_g} g | G ${recipe.fat_g} g</p>
    <div class="badges">
      <span class="badge">${recipe.prep_minutes || "-"} min</span>
      <span class="badge">Dificultad ${difficultyLabel(recipe.difficulty || "easy")}</span>
      <span class="badge">Costo ${costLabel(recipe.cost_level || "mid")}</span>
    </div>
    <h3>Ingredientes</h3>
    <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <h3>Paso a paso</h3>
    <ol>${recipe.steps.map((s) => `<li>${s.text}</li>`).join("")}</ol>
  `;
}

loadRecipe();

