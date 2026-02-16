const SESSION_KEY = "fitmenu_session";
const SELECTED_RECIPE_KEY = "fitmenu_selected_recipe";
const DEFAULT_API_URL = "http://127.0.0.1:8001";

const RECIPE_IMAGES = {
  r1: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r2: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r3: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r4: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r5: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r6: "https://images.pexels.com/photos/3296395/pexels-photo-3296395.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r7: "https://images.pexels.com/photos/6294246/pexels-photo-6294246.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r8: "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r9: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1600",
  r10: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const FALLBACK_IMG = "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600";

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
  return RECIPE_IMAGES[id] || "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600";
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
