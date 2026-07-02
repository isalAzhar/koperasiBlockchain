const express = require("express");
const blockchainController = require("./blockchain.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware(["admin"]),
  blockchainController.getAll
);

router.get(
  "/verify",
  roleMiddleware(["admin"]),
  blockchainController.verify
);

router.get(
  "/:id",
  roleMiddleware(["admin"]),
  blockchainController.getById
);

module.exports = router;