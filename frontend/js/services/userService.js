import { getJSON, setJSON, storageKeys } from "./storage.js";

function blankUserState() {
  return {
    profile: null,
    menus: [],
    favorites: [],
    cooked: [],
    notes: {},
  };
}

function getAllUserData() {
  return getJSON(storageKeys.userData, {});
}

function setAllUserData(data) {
  setJSON(storageKeys.userData, data);
}

function ensureUserData(userId) {
  const all = getAllUserData();
  if (!all[userId]) {
    all[userId] = blankUserState();
    setAllUserData(all);
  }
  return all[userId];
}

export function getUserData(userId) {
  if (!userId) return blankUserState();
  return ensureUserData(userId);
}

export function updateUserData(userId, updater) {
  if (!userId) return blankUserState();
  const all = getAllUserData();
  const current = all[userId] || blankUserState();
  all[userId] = updater(current);
  setAllUserData(all);
  return all[userId];
}

export function getProfile(userId) {
  return getUserData(userId).profile || null;
}

export function saveProfile(userId, profile) {
  return updateUserData(userId, (state) => ({ ...state, profile }));
}

export function isProfileComplete(profile) {
  if (!profile) return false;
  return !!(
    profile.sex &&
    Number.isFinite(profile.age) &&
    profile.age >= 14 &&
    profile.age <= 90 &&
    Number.isFinite(profile.weight_kg) &&
    profile.weight_kg > 30 &&
    Number.isFinite(profile.height_cm) &&
    profile.height_cm >= 120 &&
    Number.isFinite(profile.meals_per_day) &&
    profile.meals_per_day >= 3 &&
    profile.meals_per_day <= 6 &&
    profile.goal &&
    profile.diet
  );
}

export function getMenus(userId) {
  const menus = getUserData(userId).menus || [];
  return Array.isArray(menus) ? menus : [];
}

export function hasGeneratedMenu(userId) {
  return getMenus(userId).length > 0;
}

export function saveGeneratedMenu(userId, menu) {
  return updateUserData(userId, (state) => {
    const menus = [...(state.menus || []), menu].slice(-10);
    return { ...state, menus };
  });
}

export function getLatestMenu(userId) {
  const menus = getMenus(userId);
  return menus.length ? menus[menus.length - 1] : null;
}

export function toggleFavoriteRecipe(userId, recipeId) {
  return updateUserData(userId, (state) => {
    const current = new Set(state.favorites || []);
    if (current.has(recipeId)) current.delete(recipeId);
    else current.add(recipeId);
    return { ...state, favorites: Array.from(current) };
  });
}

export function markRecipeCooked(userId, recipeId) {
  return updateUserData(userId, (state) => {
    const cooked = new Set(state.cooked || []);
    cooked.add(recipeId);
    return { ...state, cooked: Array.from(cooked) };
  });
}
