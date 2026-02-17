import { getJSON, setJSON, removeKey, storageKeys } from "./storage.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function randomId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function hashPassword(password) {
  const value = String(password || "");
  if (window.crypto?.subtle && window.TextEncoder) {
    const data = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return btoa(unescape(encodeURIComponent(value)));
}

function getUsers() {
  return getJSON(storageKeys.users, []);
}

function setUsers(users) {
  setJSON(storageKeys.users, users);
}

export function getSession() {
  return getJSON(storageKeys.session, null);
}

export function clearSession() {
  removeKey(storageKeys.session);
}

export function requireSessionOrRedirect() {
  const session = getSession();
  if (!session?.token || !session?.userId) {
    window.location.replace("login.html");
    return null;
  }
  return session;
}

export function getUserById(userId) {
  return getUsers().find((user) => user.id === userId) || null;
}

export function getUserByEmail(email) {
  const safeEmail = normalizeEmail(email);
  return getUsers().find((user) => user.email === safeEmail) || null;
}

function setSessionForUser(user) {
  const session = {
    token: randomId("token"),
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date().toISOString(),
  };
  setJSON(storageKeys.session, session);
  return session;
}

export async function registerUser({ email, password, name = "" }) {
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "");
  if (!safeEmail || safePassword.length < 8) {
    throw new Error("Email o contrasena no valida.");
  }

  const users = getUsers();
  if (users.some((user) => user.email === safeEmail)) {
    throw new Error("La cuenta ya existe.");
  }

  const user = {
    id: randomId("usr"),
    email: safeEmail,
    name: name.trim() || safeEmail.split("@")[0],
    passwordHash: await hashPassword(safePassword),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  setUsers(users);
  const session = setSessionForUser(user);
  return { user, session };
}

export async function loginUser({ email, password }) {
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "");
  const user = getUserByEmail(safeEmail);

  if (!user) {
    throw new Error("No existe una cuenta con ese email.");
  }

  const passwordHash = await hashPassword(safePassword);
  if (passwordHash !== user.passwordHash) {
    throw new Error("Contrasena incorrecta.");
  }

  const session = setSessionForUser(user);
  return { user, session };
}

export function getCurrentUser() {
  const session = getSession();
  if (!session?.userId) return null;
  return getUserById(session.userId);
}

export function logoutUser() {
  clearSession();
  window.location.replace("login.html");
}
