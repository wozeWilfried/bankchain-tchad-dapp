const express = require("express");
const { query } = require("../db");

const router = express.Router();

const FALLBACK_USERS = [
  { id: 1, email: "admin@bankchain.td", password: "admin123", name: "Administrateur" },
  { id: 2, email: "user@bankchain.td", password: "user123", name: "Utilisateur" },
];

const sessions = {};
let useFallback = false;

async function findUser(email, password) {
  if (!useFallback) {
    try {
      const rows = await query("SELECT id, email, name FROM users WHERE email = ? AND password = ?", [email, password]);
      if (rows.length > 0) return rows[0];
    } catch {
      console.log("⚠️  MySQL indisponible, utilisation du fallback mémoire");
      useFallback = true;
    }
  }
  return FALLBACK_USERS.find((u) => u.email === email && u.password === password) || null;
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }
    const user = await findUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessions[token] = { id: user.id, email: user.email, name: user.name };
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  res.json({ user: sessions[token] });
});

router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) delete sessions[token];
  res.json({ success: true });
});

module.exports = router;
