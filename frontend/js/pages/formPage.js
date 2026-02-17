import { guardFormPage } from "../services/guards.js";
import { saveProfile, getLatestMenu } from "../services/userService.js";
import { getRecipeCatalog } from "../services/recipeService.js";
import { saveNewWeeklyMenu } from "../services/menuService.js";
import { renderNavbar, bindNavbarActions } from "../ui/navbar.js";

const access = guardFormPage();
if (!access) {
  throw new Error("redirect");
}

const { session, user, state } = access;

const navbarRoot = document.getElementById("topbarMount");
navbarRoot.innerHTML = renderNavbar({
  active: "form",
  title: "Configura tu perfil",
  subtitle: `${user?.name || session.email} | Personalizacion de menu`,
});
bindNavbarActions();

const form = document.getElementById("profileForm");
const statusEl = document.getElementById("formStatus");
const ctaBtn = document.getElementById("saveProfileBtn");
const accountSnapshotEl = document.getElementById("accountSnapshot");

const fields = {
  sex: document.getElementById("sex"),
  age: document.getElementById("age"),
  weight_kg: document.getElementById("weight"),
  height_cm: document.getElementById("height"),
  meals_per_day: document.getElementById("mealsPerDay"),
  goal: document.getElementById("goal"),
  diet: document.getElementById("diet"),
  lactose_free: document.getElementById("lactoseFree"),
  gluten_free: document.getElementById("glutenFree"),
  allergies: document.getElementById("allergies"),
  dislikes: document.getElementById("dislikes"),
};

function setStatus(text, type = "info") {
  statusEl.textContent = text;
  statusEl.style.color = type === "error" ? "#ffb2a0" : type === "ok" ? "#95f4bf" : "#d5c7b6";
}

function normalizeList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProfilePayload() {
  return {
    sex: fields.sex.value,
    age: Number(fields.age.value),
    weight_kg: Number(fields.weight_kg.value),
    height_cm: Number(fields.height_cm.value),
    meals_per_day: Number(fields.meals_per_day.value),
    goal: fields.goal.value,
    diet: fields.diet.value,
    lactose_free: fields.lactose_free.checked,
    gluten_free: fields.gluten_free.checked,
    allergies: normalizeList(fields.allergies.value),
    dislikes: normalizeList(fields.dislikes.value),
    level: session.level || "intermediate",
    activity_level: session.activityLevel || "moderate",
    training_days: Number.isFinite(session.trainingDays) ? session.trainingDays : 4,
    max_prep_minutes: Number.isFinite(session.maxPrepMinutes) ? session.maxPrepMinutes : 40,
    preferred_cost: session.preferredCost || "any",
  };
}

function validate(payload) {
  if (!payload.sex) return "Selecciona el sexo.";
  if (!(payload.age >= 14 && payload.age <= 90)) return "Edad fuera de rango.";
  if (!(payload.weight_kg > 30 && payload.weight_kg < 300)) return "Peso fuera de rango.";
  if (!(payload.height_cm >= 120 && payload.height_cm <= 230)) return "Altura fuera de rango.";
  if (!(payload.meals_per_day >= 3 && payload.meals_per_day <= 6)) return "Comidas/dia debe ser entre 3 y 6.";
  if (!payload.goal || !payload.diet) return "Objetivo y dieta son obligatorios.";
  return null;
}

function hydrateProfile(profile) {
  if (!profile) return;
  fields.sex.value = profile.sex || fields.sex.value;
  fields.age.value = profile.age ?? fields.age.value;
  fields.weight_kg.value = profile.weight_kg ?? fields.weight_kg.value;
  fields.height_cm.value = profile.height_cm ?? fields.height_cm.value;
  fields.meals_per_day.value = profile.meals_per_day ?? fields.meals_per_day.value;
  fields.goal.value = profile.goal || fields.goal.value;
  fields.diet.value = profile.diet || fields.diet.value;
  fields.lactose_free.checked = !!profile.lactose_free;
  fields.gluten_free.checked = !!profile.gluten_free;
  fields.allergies.value = Array.isArray(profile.allergies) ? profile.allergies.join(", ") : "";
  fields.dislikes.value = Array.isArray(profile.dislikes) ? profile.dislikes.join(", ") : "";
}

function renderAccountSnapshot() {
  const profile = state.profile;
  const hasMenu = !!getLatestMenu(session.userId);
  accountSnapshotEl.innerHTML = `
    <strong>${user?.name || "Usuario"}</strong><br>
    ${session.email}<br>
    Perfil: ${profile ? "completado" : "pendiente"} | Menu semanal: ${hasMenu ? "generado" : "pendiente"}
  `;
}

hydrateProfile(state.profile);
renderAccountSnapshot();
ctaBtn.textContent = state.hasMenu ? "Guardar cambios" : "Guardar y generar menu";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const profile = getProfilePayload();
  const error = validate(profile);
  if (error) {
    setStatus(error, "error");
    return;
  }

  try {
    setStatus("Guardando perfil...");
    saveProfile(session.userId, profile);

    if (!state.hasMenu) {
      const recipes = await getRecipeCatalog();
      saveNewWeeklyMenu(session.userId, profile, recipes);
      setStatus("Perfil guardado y menu generado.", "ok");
    } else {
      setStatus("Perfil actualizado correctamente.", "ok");
    }

    window.location.replace("menu.html");
  } catch (saveError) {
    setStatus(saveError.message || "No se pudo guardar el perfil.", "error");
  }
});
