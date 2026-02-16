requireAuth();
bindLogout();
bindBack();

const cardsGrid = document.getElementById("cardsGrid");

function allowedDifficulties(level) {
  if (level === "low") return new Set(["easy"]);
  if (level === "intermediate") return new Set(["easy", "medium"]);
  return new Set(["easy", "medium", "hard"]);
}

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

function attachHoverImageRotation(card, imgEl, recipeId) {
  const images = recipeImages(recipeId);
  if (!images || images.length < 2) return;

  let index = 0;
  let timer = null;

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    index = 0;
    imgEl.src = images[index];
  };

  card.addEventListener("mouseenter", () => {
    if (timer) return;
    timer = setInterval(() => {
      index = (index + 1) % images.length;
      imgEl.style.opacity = "0.72";
      setTimeout(() => {
        imgEl.src = images[index];
        imgEl.style.opacity = "1";
      }, 90);
    }, 620);
  });

  card.addEventListener("mouseleave", stop);
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

  const allow = allowedDifficulties(session.level);
  const filtered = recipes.filter((r) => allow.has(r.difficulty || "easy"));
  const visible = filtered.length ? filtered : recipes;

  cardsGrid.innerHTML = "";
  for (const recipe of visible) {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipeImage(recipe.id)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" alt="${recipe.name}" />
      <h3>${recipe.name}</h3>
      <p>${recipe.calories} kcal | P ${recipe.protein_g}g | ${recipe.prep_minutes || "-"} min | ${recipe.difficulty || "easy"}</p>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem(SELECTED_RECIPE_KEY, recipe.id);
      window.location.href = `recipe.html?id=${recipe.id}`;
    });

    const imgEl = card.querySelector("img");
    attachHoverImageRotation(card, imgEl, recipe.id);
    tiltCard(card);
    cardsGrid.appendChild(card);
  }
}

loadRecipes();

