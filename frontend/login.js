const loginForm = document.getElementById("loginForm");
const switchLogin = document.getElementById("switchLogin");
const switchRegister = document.getElementById("switchRegister");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authStatus = document.getElementById("authStatus");
const nameWrap = document.getElementById("nameWrap");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const levelInput = document.getElementById("level");
const activityInput = document.getElementById("activityLevel");
const trainingInput = document.getElementById("trainingDays");
const prepInput = document.getElementById("maxPrepMinutes");
const costInput = document.getElementById("preferredCost");

let mode = "login";

function setMode(nextMode) {
  mode = nextMode;
  const isLogin = mode === "login";
  switchLogin.classList.toggle("active", isLogin);
  switchRegister.classList.toggle("active", !isLogin);
  authSubmitBtn.textContent = isLogin ? "Entrar" : "Crear cuenta";
  nameWrap.style.display = isLogin ? "none" : "grid";
  nameInput.required = !isLogin;
  authStatus.textContent = isLogin ? "" : "";
}

function hydrateFromUser(user) {
  if (!user) return;
  nameInput.value = user.name || "";
  const account = user.account || {};
  if (account.level) levelInput.value = account.level;
  if (account.activityLevel) activityInput.value = account.activityLevel;
  if (Number.isFinite(account.trainingDays)) trainingInput.value = account.trainingDays;
  if (Number.isFinite(account.maxPrepMinutes)) prepInput.value = account.maxPrepMinutes;
  if (account.preferredCost) costInput.value = account.preferredCost;
}

switchLogin.addEventListener("click", () => setMode("login"));
switchRegister.addEventListener("click", () => setMode("register"));

emailInput.addEventListener("blur", () => {
  const user = findUserByEmail(emailInput.value);
  if (user && mode === "login") {
    hydrateFromUser(user);
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passInput.value,
    level: levelInput.value,
    activityLevel: activityInput.value,
    trainingDays: Number(trainingInput.value),
    maxPrepMinutes: Number(prepInput.value),
    preferredCost: costInput.value,
  };

  if (!payload.email) {
    authStatus.textContent = "Introduce un email valido.";
    return;
  }

  if (payload.password.length < 8) {
    authStatus.textContent = "La contrasena debe tener al menos 8 caracteres.";
    return;
  }

  if (mode === "register") {
    if (!payload.name) {
      authStatus.textContent = "Tu nombre es obligatorio para registrarte.";
      return;
    }
    const created = registerUser(payload);
    if (!created.ok) {
      authStatus.textContent = created.message;
      return;
    }

    setSession({
      userId: created.user.id,
      name: created.user.name,
      email: created.user.email,
      apiUrl: DEFAULT_API_URL,
      level: created.user.account.level,
      activityLevel: created.user.account.activityLevel,
      trainingDays: created.user.account.trainingDays,
      maxPrepMinutes: created.user.account.maxPrepMinutes,
      preferredCost: created.user.account.preferredCost,
      authMode: "register",
    });

    window.location.href = "form.html";
    return;
  }

  const auth = authenticateUser(payload.email, payload.password);
  if (!auth.ok) {
    authStatus.textContent = auth.message;
    return;
  }

  const account = auth.user.account || {};
  updateUserAccount(auth.user.id, {
    level: payload.level,
    activityLevel: payload.activityLevel,
    trainingDays: Number.isFinite(payload.trainingDays) ? payload.trainingDays : account.trainingDays,
    maxPrepMinutes: Number.isFinite(payload.maxPrepMinutes) ? payload.maxPrepMinutes : account.maxPrepMinutes,
    preferredCost: payload.preferredCost || account.preferredCost,
  });

  const refreshed = findUserByEmail(payload.email);
  setSession({
    userId: refreshed.id,
    name: refreshed.name,
    email: refreshed.email,
    apiUrl: DEFAULT_API_URL,
    level: refreshed.account?.level || "intermediate",
    activityLevel: refreshed.account?.activityLevel || "moderate",
    trainingDays: refreshed.account?.trainingDays ?? 4,
    maxPrepMinutes: refreshed.account?.maxPrepMinutes ?? 40,
    preferredCost: refreshed.account?.preferredCost || "any",
    authMode: "login",
  });

  window.location.href = "form.html";
});

setMode("login");
