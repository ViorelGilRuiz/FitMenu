const SESSION_KEY = "fitmenu_session";
const SELECTED_RECIPE_KEY = "fitmenu_selected_recipe";
const DEFAULT_API_URL = "http://127.0.0.1:8001";
const API_CANDIDATES = [
  "http://127.0.0.1:8001",
  "http://127.0.0.1:8000",
  "http://127.0.0.1:3000/api",
  "http://127.0.0.1:3000",
];

const RECIPE_IMAGE_SETS = {
  r1: [
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r2: [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r3: [
    "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r4: [
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r5: [
    "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r6: [
    "https://images.pexels.com/photos/3296395/pexels-photo-3296395.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4955256/pexels-photo-4955256.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r7: [
    "https://images.pexels.com/photos/6294246/pexels-photo-6294246.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r8: [
    "https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r9: [
    "https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r10: [
    "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4040697/pexels-photo-4040697.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r11: [
    "https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r12: [
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r13: [
    "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r14: [
    "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r15: [
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r16: [
    "https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r17: [
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r18: [
    "https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r19: [
    "https://images.pexels.com/photos/4040697/pexels-photo-4040697.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r20: [
    "https://images.pexels.com/photos/4955256/pexels-photo-4955256.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r21: [
    "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6294246/pexels-photo-6294246.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  r22: [
    "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1600",
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

function baseCandidates(preferred = null) {
  const items = [preferred, getSession()?.apiUrl, DEFAULT_API_URL, ...API_CANDIDATES]
    .filter(Boolean)
    .map((x) => String(x).replace(/\/+$/, ""));
  return [...new Set(items)];
}

function rememberWorkingApi(base) {
  const s = getSession() || {};
  setSession({
    ...s,
    apiUrl: String(base).replace(/\/+$/, ""),
  });
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function authAccountFromSession(sessionLike = null) {
  const s = sessionLike || getSession() || {};
  return {
    level: s.level || "intermediate",
    activity_level: s.activityLevel || "moderate",
    training_days: Number.isFinite(s.trainingDays) ? s.trainingDays : 4,
    max_prep_minutes: Number.isFinite(s.maxPrepMinutes) ? s.maxPrepMinutes : 40,
    preferred_cost: s.preferredCost || "any",
  };
}

function mergeSessionWithUser(user, token = null, authMode = null) {
  const safeUser = user || {};
  const account = safeUser.account || {};
  const fullName = safeUser.name || safeUser.fullName || "Usuario FitMenu";
  setSession({
    userId: safeUser.id || getSession()?.userId || "",
    name: fullName,
    email: safeUser.email || getSession()?.email || "",
    token: token || getSession()?.token || "",
    apiUrl: getSession()?.apiUrl || DEFAULT_API_URL,
    level: account.level || "intermediate",
    activityLevel: account.activity_level || "moderate",
    trainingDays: account.training_days ?? 4,
    maxPrepMinutes: account.max_prep_minutes ?? 40,
    preferredCost: account.preferred_cost || "any",
    authMode: authMode || getSession()?.authMode || "login",
  });
}

async function apiRequest(path, options = {}, requiresAuth = false) {
  const s = getSession();
  const candidates = baseCandidates(s?.apiUrl);
  let lastError = new Error("No se pudo conectar con la API.");

  for (const base of candidates) {
    const headers = { ...(options.headers || {}) };
    if (requiresAuth) {
      if (!s?.token) throw new Error("Sesion no valida");
      headers.Authorization = `Bearer ${s.token}`;
    }

    try {
      const response = await fetch(`${base}${path}`, { ...options, headers });
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (response.ok) {
        rememberWorkingApi(base);
        return data;
      }

      const detail = data?.detail || data?.message || response.statusText;
      lastError = new Error(detail || `Error ${response.status}`);
    } catch (error) {
      lastError = new Error(error?.message || "Fallo de red");
    }
  }

  throw lastError;
}

async function registerUser(userData) {
  const legacyPayload = {
    name: userData.name,
    email: normalizeEmail(userData.email),
    password: userData.password,
    account: authAccountFromSession(userData),
  };

  try {
    return await apiRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(legacyPayload),
    });
  } catch (_) {
    const modernPayload = {
      fullName: userData.name,
      email: normalizeEmail(userData.email),
      password: userData.password,
    };
    return apiRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modernPayload),
    });
  }
}

async function authenticateUser(email, password, accountPatch = null) {
  const legacyPayload = {
    email: normalizeEmail(email),
    password,
    account: authAccountFromSession(accountPatch || getSession()),
  };

  try {
    return await apiRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(legacyPayload),
    });
  } catch (_) {
    const modernPayload = {
      email: normalizeEmail(email),
      password,
    };
    return apiRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modernPayload),
    });
  }
}

async function getCurrentUser() {
  return apiRequest("/auth/me", { method: "GET" }, true);
}

async function updateUserAccount(accountPatch) {
  return apiRequest("/auth/me/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountPatch),
  }, true);
}

async function updateUserProfile(profile) {
  return apiRequest("/auth/me/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  }, true);
}

function requireAuth() {
  const s = getSession();
  if (!s || !s.token) {
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




