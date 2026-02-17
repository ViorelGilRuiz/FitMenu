import { getSession, getCurrentUser } from "./authService.js";
import { getProfile, hasGeneratedMenu, isProfileComplete } from "./userService.js";

function redirect(url) {
  window.location.replace(url);
}

function getUserState(userId) {
  const profile = getProfile(userId);
  const hasProfile = isProfileComplete(profile);
  const hasMenu = hasGeneratedMenu(userId);
  return { profile, hasProfile, hasMenu };
}

export function getPostLoginRoute(userId) {
  const state = getUserState(userId);
  if (!state.hasProfile || !state.hasMenu) return "form.html";
  return "menu.html";
}

export function guardLoginPage() {
  const session = getSession();
  if (!session?.userId) return null;
  redirect(getPostLoginRoute(session.userId));
  return null;
}

export function guardFormPage() {
  const session = getSession();
  if (!session?.userId) {
    redirect("login.html");
    return null;
  }

  const user = getCurrentUser();
  const state = getUserState(session.userId);
  const params = new URLSearchParams(window.location.search);
  const editMode = params.get("edit") === "1";

  if (state.hasProfile && state.hasMenu && !editMode) {
    redirect("menu.html");
    return null;
  }

  return { session, user, state, editMode };
}

export function guardMenuPage() {
  const session = getSession();
  if (!session?.userId) {
    redirect("login.html");
    return null;
  }

  const user = getCurrentUser();
  const state = getUserState(session.userId);
  if (!state.hasProfile) {
    redirect("form.html");
    return null;
  }

  return { session, user, state };
}

export function guardRecipePage() {
  const session = getSession();
  if (!session?.userId) {
    redirect("login.html");
    return null;
  }

  const user = getCurrentUser();
  const state = getUserState(session.userId);
  if (!state.hasProfile) {
    redirect("form.html");
    return null;
  }
  if (!state.hasMenu) {
    redirect("menu.html");
    return null;
  }

  return { session, user, state };
}
