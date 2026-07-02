const express = require("express");
const anggotaController = require("./anggota.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware(["admin"]),
  anggotaController.getAll
);

router.get(
  "/:id",
  roleMiddleware(["admin"]),
  anggotaController.getById
);

router.post(
  "/",
  roleMiddleware(["admin"]),
  anggotaController.create
);

router.put(
  "/:id",
  roleMiddleware(["admin"]),
  anggotaController.update
);

router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  anggotaController.remove
);

module.exports = router;