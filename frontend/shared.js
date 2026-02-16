const SESSION_KEY = "fitmenu_session";
const SELECTED_RECIPE_KEY = "fitmenu_selected_recipe";
const USERS_KEY = "fitmenu_users";
const DEFAULT_API_URL = "http://127.0.0.1:8001";

const RECIPE_IMAGE_SETS = {
  r1: [
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r2: [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r3: [
    "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r4: [
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r5: [
    "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r6: [
    "https://images.pexels.com/photos/3296395/pexels-photo-3296395.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3642718/pexels-photo-3642718.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r7: [
    "https://images.pexels.com/photos/6294246/pexels-photo-6294246.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r8: [
    "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r9: [
    "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r10: [
    "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r11: [
    "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r12: [
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r13: [
    "https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r14: [
    "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r15: [
    "https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3296395/pexels-photo-3296395.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r16: [
    "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r17: [
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4955256/pexels-photo-4955256.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r18: [
    "https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r19: [
    "https://images.pexels.com/photos/4040697/pexels-photo-4040697.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r20: [
    "https://images.pexels.com/photos/4955256/pexels-photo-4955256.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r21: [
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4040697/pexels-photo-4040697.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r22: [
    "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
};

const FALLBACK_IMG = "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600";

function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!session) return null;
    if (!session.apiUrl) {
      session.apiUrl = DEFAULT_API_URL;
    }
    if (!session.activityLevel) session.activityLevel = "moderate";
    if (!Number.isFinite(session.trainingDays)) session.trainingDays = 4;
    if (!Number.isFinite(session.maxPrepMinutes)) session.maxPrepMinutes = 40;
    if (!session.preferredCost) session.preferredCost = "any";
    if (!session.authMode) session.authMode = "login";
    setSession(session);
    return session;
  } catch {
    return null;
  }
}

function setSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function loadUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  return loadUsers().find((u) => normalizeEmail(u.email) === normalized) || null;
}

function registerUser(userData) {
  const users = loadUsers();
  const email = normalizeEmail(userData.email);
  if (!email) return { ok: false, message: "Email invalido." };
  if (users.some((u) => normalizeEmail(u.email) === email)) {
    return { ok: false, message: "Ese email ya esta registrado. Inicia sesion." };
  }

  const now = new Date().toISOString();
  const record = {
    id: `u_${Math.random().toString(36).slice(2, 10)}`,
    email,
    password: userData.password,
    name: userData.name,
    created_at: now,
    updated_at: now,
    account: {
      level: userData.level || "intermediate",
      activityLevel: userData.activityLevel || "moderate",
      trainingDays: Number.isFinite(userData.trainingDays) ? userData.trainingDays : 4,
      maxPrepMinutes: Number.isFinite(userData.maxPrepMinutes) ? userData.maxPrepMinutes : 40,
      preferredCost: userData.preferredCost || "any",
    },
    profile: userData.profile || null,
  };

  users.push(record);
  saveUsers(users);
  return { ok: true, user: record };
}

function authenticateUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { ok: false, message: "Usuario o contrasena incorrectos." };
  }
  return { ok: true, user };
}

function updateUserAccount(userId, patch) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  users[idx].account = { ...(users[idx].account || {}), ...patch };
  users[idx].updated_at = new Date().toISOString();
  saveUsers(users);
  return users[idx];
}

function updateUserProfile(userId, profile) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  users[idx].profile = profile;
  users[idx].updated_at = new Date().toISOString();
  saveUsers(users);
  return users[idx];
}

function getCurrentUser() {
  const s = getSession();
  if (!s?.userId) return null;
  const users = loadUsers();
  return users.find((u) => u.id === s.userId) || null;
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
  return (RECIPE_IMAGE_SETS[id] && RECIPE_IMAGE_SETS[id][0]) || FALLBACK_IMG;
}

function recipeImages(id) {
  return RECIPE_IMAGE_SETS[id] || [FALLBACK_IMG];
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




