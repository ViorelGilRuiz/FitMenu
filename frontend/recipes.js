requireAuth();
bindLogout();
bindBack();

const cardsGrid = document.getElementById("cardsGrid");

function tiltCard(card) {
  card.addEventListener("mousemove", (event) => {
    const b = card.getBoundingClientRect();
    const x = (event.clientX - b.left) / b.width;
    const y = (event.clientY - b.top) / b.height;
    card.style.transform = `rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-2px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
}

async function loadRecipes() {
  const session = getSession();
  let recipes = [];

  try {
    const response = await fetch(`${session.apiUrl}/recipes`);
    if (response.ok) {
      recipes = await response.json();
    }
  } catch {
    recipes = [];
  }

  if (!recipes.length) {
    cardsGrid.innerHTML = "<p class='muted'>No se pudieron cargar recetas.</p>";
    return;
  }

  cardsGrid.innerHTML = "";
  for (const recipe of recipes) {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipeImage(recipe.id)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" alt="${recipe.name}" />
      <h3>${recipe.name}</h3>
      <p>${recipe.calories} kcal | P ${recipe.protein_g}g | ${recipe.prep_minutes || "-"} min</p>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem(SELECTED_RECIPE_KEY, recipe.id);
      window.location.href = `recipe.html?id=${recipe.id}`;
    });

    tiltCard(card);
    cardsGrid.appendChild(card);
  }
}

loadRecipes();

