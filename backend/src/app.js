const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const authRoutes = require("./modules/auth/auth.routes");
const anggotaRoutes = require("./modules/anggota/anggota.routes");
const transaksiRoutes = require("./modules/transaksi/transaksi.routes");
const blockchainRoutes = require("./modules/blockchain/blockchain.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/anggota", anggotaRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "API Sistem Transaksi Koperasi Blockchain berjalan",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Backend berhasil terhubung ke Neon PostgreSQL",
      database_time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database gagal terhubung",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});