const express = require("express");
const transaksiController = require("./transaksi.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware(["admin", "petugas"]),
  transaksiController.getAll
);

router.post(
  "/",
  roleMiddleware(["admin", "petugas"]),
  transaksiController.create
);

router.get(
  "/anggota/:id_anggota",
  roleMiddleware(["admin", "petugas", "anggota"]),
  transaksiController.getByAnggota
);

router.get(
  "/:id",
  roleMiddleware(["admin", "petugas"]),
  transaksiController.getById
);

module.exports = router;