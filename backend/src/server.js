process.on("unhandledRejection", (err) => {
  console.error("⚠️  Erreur non geree:", err.message);
});

require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const { startIndexer } = require("./indexer");
const transactionsRouter = require("./routes/transactions");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"] }));
app.use(express.json());

app.use("/api/transactions", transactionsRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status:    "ok",
    contract:  process.env.CONTRACT_ADDRESS,
    network:   "sepolia",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.listen(PORT, async () => {
  console.log("");
  console.log("🚀  Serveur BankChad demarre");
  console.log(`📡  API disponible sur http://localhost:${PORT}`);
  console.log(`🔗  Contrat : ${process.env.CONTRACT_ADDRESS}`);
  console.log("");

  await startIndexer();
});
