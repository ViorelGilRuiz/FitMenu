const KEY_PREFIX = "fitmenu_v2";

function key(name) {
  return `${KEY_PREFIX}:${name}`;
}

export function getJSON(name, fallback = null) {
  try {
    const raw = localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJSON(name, value) {
  localStorage.setItem(key(name), JSON.stringify(value));
}

export function removeKey(name) {
  localStorage.removeItem(key(name));
}

export function updateJSON(name, updater, fallback = null) {
  const current = getJSON(name, fallback);
  const next = updater(current);
  setJSON(name, next);
  return next;
}

export const storageKeys = {
  users: "users",
  session: "session",
  userData: "user_data",
  recipesCache: "recipes_cache",
};
