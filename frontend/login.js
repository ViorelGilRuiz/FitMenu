const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const level = document.getElementById("level").value;
  const activityLevel = document.getElementById("activityLevel").value;
  const trainingDays = Number(document.getElementById("trainingDays").value);
  const maxPrepMinutes = Number(document.getElementById("maxPrepMinutes").value);
  const preferredCost = document.getElementById("preferredCost").value;

  if (!name || !email) return;
  if (password.length < 8) {
    alert("La contrasena debe tener al menos 8 caracteres.");
    return;
  }

  setSession({
    name,
    email,
    apiUrl: DEFAULT_API_URL,
    level,
    activityLevel,
    trainingDays: Number.isFinite(trainingDays) ? trainingDays : 4,
    maxPrepMinutes: Number.isFinite(maxPrepMinutes) ? maxPrepMinutes : 40,
    preferredCost,
  });

  window.location.href = "form.html";
});
