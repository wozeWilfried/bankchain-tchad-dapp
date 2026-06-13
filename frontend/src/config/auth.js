const DEMO_USERS = [
  { id: 1, email: "admin@bankchain.td", password: "admin123", name: "Administrateur", role: "admin" },
  { id: 2, email: "user@bankchain.td", password: "user123", name: "Utilisateur", role: "user" },
];

const STORAGE_KEY = "bankchain_auth";

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(data) {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function login(email, password) {
  const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const session = { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  setStoredAuth(session);
  return session;
}

export function logout() {
  setStoredAuth(null);
}

export { DEMO_USERS };
