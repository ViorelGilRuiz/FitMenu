const SESSION_KEY = "fitmenu_session";
const SELECTED_RECIPE_KEY = "fitmenu_selected_recipe";
const DEFAULT_API_URL = "http://127.0.0.1:8001";

const RECIPE_IMAGES = {
  r1: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e2?auto=format&fit=crop&w=1600&q=80",
  r2: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1600&q=80",
  r3: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
  r4: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1600&q=80",
  r5: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80",
  r6: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&q=80",
  r7: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1600&q=80",
  r8: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=1600&q=80",
  r9: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=80",
  r10: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1600&q=80",
};

const FALLBACK_IMG = "https://placehold.co/900x600/1a3a62/dbeafe?text=FitMenu+Recipe";

function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!session) return null;
    if (!session.apiUrl) {
      session.apiUrl = DEFAULT_API_URL;
      setSession(session);
    }
    return session;
  } catch {
    return null;
  }
}

function setSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function requireAuth() {
  const s = getSession();
  if (!s) {
    window.location.href = "login.html";
    return null;
  }
  return s;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SELECTED_RECIPE_KEY);
  window.location.href = "login.html";
}

function bindLogout() {
  const btn = document.getElementById("logoutBtn");
  if (btn) btn.addEventListener("click", logout);
}

function bindBack() {
  const btn = document.getElementById("backBtn");
  if (btn) btn.addEventListener("click", () => window.history.back());
}

function recipeImage(id) {
  return RECIPE_IMAGES[id] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80";
}

function normalizeDay(day) {
  const labels = { monday: "Lunes", tuesday: "Martes", wednesday: "Miercoles", thursday: "Jueves", friday: "Viernes", saturday: "Sabado", sunday: "Domingo" };
  return labels[day] || day;
}

function normalizeMealType(mealType) {
  const labels = { breakfast: "Desayuno", lunch: "Comida", dinner: "Cena", snack: "Snack", snack_am: "Snack AM", snack_pm: "Snack PM", late_snack: "Snack Noche" };
  return labels[mealType] || mealType;
}

function levelLabel(level) {
  if (level === "low") return "Bajo";
  if (level === "advanced") return "Avanzado";
  return "Intermedio";
}
