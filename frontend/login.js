const loginForm = document.getElementById("loginForm");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const registerBtn = document.getElementById("registerBtn");
const authStatus = document.getElementById("authStatus");

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

function hydrateFromSession() {
  const s = getSession();
  if (!s) return;
  if (s.email) emailInput.value = s.email;
}

function defaultNameFromEmail(email) {
  const local = (email || "user").split("@")[0] || "user";
  return local.replace(/[._-]/g, " ").trim() || "Usuario FitMenu";
}

function enterWithLocalSession(email, mode = "login") {
  const fallbackUser = {
    id: getSession()?.userId || `local_${Date.now()}`,
    name: defaultNameFromEmail(email),
    email,
    account: authAccountFromSession(),
  };
  const localToken = getSession()?.token || `local_token_${Date.now()}`;
  mergeSessionWithUser(fallbackUser, localToken, mode);
  window.location.href = "form.html";
}

async function handleLogin(email, password) {
  const result = await authenticateUser(email, password);
  const authToken = result.token || result.accessToken || "";
  const fallbackUser = {
    name: defaultNameFromEmail(email),
    email,
    account: authAccountFromSession(),
  };
  mergeSessionWithUser(result.user || fallbackUser, authToken, "login");
  window.location.href = "form.html";
}

async function handleRegister(email, password) {
  const result = await registerUser({
    name: defaultNameFromEmail(email),
    email,
    password,
  });
  const authToken = result.token || result.accessToken || "";
  const fallbackUser = {
    name: defaultNameFromEmail(email),
    email,
    account: authAccountFromSession(),
  };
  mergeSessionWithUser(result.user || fallbackUser, authToken, "register");
  window.location.href = "form.html";
}

function validateCredentials() {
  const email = emailInput.value.trim().toLowerCase();
  const password = passInput.value;

  if (!email) {
    authStatus.textContent = "Introduce un email valido.";
    return null;
  }

  if (password.length < 8) {
    authStatus.textContent = "La contrasena debe tener al menos 8 caracteres.";
    return null;
  }

  return { email, password };
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = validateCredentials();
  if (!payload) return;

  authSubmitBtn.disabled = true;
  registerBtn.disabled = true;
  authStatus.textContent = "Iniciando sesion...";

  try {
    await handleLogin(payload.email, payload.password);
  } catch (error) {
    const message = (error?.message || "").toLowerCase();
    if (message.includes("credencial") || message.includes("invalid") || message.includes("unauthorized")) {
      authStatus.textContent = "Credenciales no validas. Revisa email/contrasena o usa Crear cuenta.";
    } else {
      authStatus.textContent = "API no disponible. Entrando en modo local...";
      enterWithLocalSession(payload.email, "login");
      return;
    }
  } finally {
    authSubmitBtn.disabled = false;
    registerBtn.disabled = false;
  }
});

registerBtn.addEventListener("click", async () => {
  const payload = validateCredentials();
  if (!payload) return;

  authSubmitBtn.disabled = true;
  registerBtn.disabled = true;
  authStatus.textContent = "Creando cuenta...";

  try {
    await handleRegister(payload.email, payload.password);
  } catch (error) {
    const message = (error?.message || "").toLowerCase();
    if (message.includes("ya existe") || message.includes("already") || message.includes("exist")) {
      authStatus.textContent = "La cuenta ya existe. Probando acceso...";
      try {
        await handleLogin(payload.email, payload.password);
        return;
      } catch {
        authStatus.textContent = "La cuenta existe pero no se pudo iniciar sesion con esa contrasena.";
      }
    } else {
      authStatus.textContent = "API no disponible. Creando sesion local...";
      enterWithLocalSession(payload.email, "register");
      return;
    }
  } finally {
    authSubmitBtn.disabled = false;
    registerBtn.disabled = false;
  }
});

hydrateFromSession();
