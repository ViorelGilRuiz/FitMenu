import { guardLoginPage, getPostLoginRoute } from "../services/guards.js";
import { loginUser, registerUser } from "../services/authService.js";

guardLoginPage();

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const statusEl = document.getElementById("authStatus");
const submitBtn = document.getElementById("authSubmitBtn");
const registerBtn = document.getElementById("registerBtn");

function setStatus(text, type = "info") {
  statusEl.textContent = text;
  statusEl.style.color = type === "error" ? "#ffb2a0" : type === "ok" ? "#9bf1c2" : "#d5c7b6";
}

function validateCredentials() {
  const email = String(emailInput.value || "").trim().toLowerCase();
  const password = String(passwordInput.value || "");
  if (!email || !email.includes("@")) {
    setStatus("Introduce un email valido.", "error");
    return null;
  }
  if (password.length < 8) {
    setStatus("La contrasena debe tener minimo 8 caracteres.", "error");
    return null;
  }
  return { email, password };
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  registerBtn.disabled = isLoading;
}

function goAfterAuth(userId) {
  window.location.replace(getPostLoginRoute(userId));
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = validateCredentials();
  if (!payload) return;

  try {
    setLoading(true);
    setStatus("Entrando...");
    const result = await loginUser(payload);
    setStatus("Sesion iniciada.", "ok");
    goAfterAuth(result.user.id);
  } catch (error) {
    setStatus(error.message || "No se pudo iniciar sesion.", "error");
  } finally {
    setLoading(false);
  }
});

registerBtn.addEventListener("click", async () => {
  const payload = validateCredentials();
  if (!payload) return;

  try {
    setLoading(true);
    setStatus("Creando cuenta...");
    const result = await registerUser({
      email: payload.email,
      password: payload.password,
      name: payload.email.split("@")[0],
    });
    setStatus("Cuenta creada correctamente.", "ok");
    goAfterAuth(result.user.id);
  } catch (error) {
    setStatus(error.message || "No se pudo crear la cuenta.", "error");
  } finally {
    setLoading(false);
  }
});
