import { api } from "./api/client";

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthed() {
  return !!getToken();
}

export function signOut() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common.Authorization;
  
  window.location.href = "/login";
}


export function getUserEmail() {
  const t = getToken();
  if (!t) return null;
  try {
    const [, payload] = t.split(".");
    const json = JSON.parse(atob(payload));
    
    return json.email || json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null;
  } catch { return null; }
}
