const express = require("express");
const dashboardController = require("./dashboard.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/summary",
  roleMiddleware(["admin"]),
  dashboardController.summary
);

router.get(
  "/statistik-jenis-transaksi",
  roleMiddleware(["admin"]),
  dashboardController.statistikJenisTransaksi
);

router.get(
  "/transaksi-terbaru",
  roleMiddleware(["admin"]),
  dashboardController.transaksiTerbaru
);

module.exports = router;