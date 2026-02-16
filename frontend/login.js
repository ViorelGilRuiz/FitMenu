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

function accountPayload() {
  return {
    level: levelInput.value,
    activityLevel: activityInput.value,
    trainingDays: Number(trainingInput.value),
    maxPrepMinutes: Number(prepInput.value),
    preferredCost: costInput.value,
  };
}

function setMode(nextMode) {
  mode = nextMode;
  const isLogin = mode === "login";
  switchLogin.classList.toggle("active", isLogin);
  switchRegister.classList.toggle("active", !isLogin);
  authSubmitBtn.textContent = isLogin ? "Entrar" : "Crear cuenta";
  nameWrap.style.display = isLogin ? "none" : "grid";
  nameInput.required = !isLogin;
  authStatus.textContent = "";
}

function hydrateFromSession() {
  const s = getSession();
  if (!s) return;
  if (s.name) nameInput.value = s.name;
  if (s.email) emailInput.value = s.email;
  if (s.level) levelInput.value = s.level;
  if (s.activityLevel) activityInput.value = s.activityLevel;
  if (Number.isFinite(s.trainingDays)) trainingInput.value = s.trainingDays;
  if (Number.isFinite(s.maxPrepMinutes)) prepInput.value = s.maxPrepMinutes;
  if (s.preferredCost) costInput.value = s.preferredCost;
}

async function handleRegister(payload) {
  const result = await registerUser({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    ...accountPayload(),
  });

  mergeSessionWithUser(result.user, result.token, "register");
  window.location.href = "form.html";
}

async function handleLogin(payload) {
  const result = await authenticateUser(payload.email, payload.password, accountPayload());
  mergeSessionWithUser(result.user, result.token, "login");
  window.location.href = "form.html";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passInput.value,
  };

  if (!payload.email) {
    authStatus.textContent = "Introduce un email valido.";
    return;
  }

  if (payload.password.length < 8) {
    authStatus.textContent = "La contrasena debe tener al menos 8 caracteres.";
    return;
  }

  if (mode === "register" && !payload.name) {
    authStatus.textContent = "Tu nombre es obligatorio para registrarte.";
    return;
  }

  authStatus.textContent = mode === "register" ? "Creando cuenta..." : "Iniciando sesion...";

  try {
    if (mode === "register") {
      await handleRegister(payload);
      return;
    }
    await handleLogin(payload);
  } catch (error) {
    authStatus.textContent = error.message || "No se pudo autenticar. Revisa tus datos.";
  }
});

switchLogin.addEventListener("click", () => setMode("login"));
switchRegister.addEventListener("click", () => setMode("register"));

hydrateFromSession();
setMode("login");
