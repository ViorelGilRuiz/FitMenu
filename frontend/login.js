const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const level = document.getElementById("level").value;

  setSession({ name, apiUrl: DEFAULT_API_URL, level });
  window.location.href = "form.html";
});
