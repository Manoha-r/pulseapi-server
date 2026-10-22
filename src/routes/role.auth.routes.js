const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")

router.get("/test", authMiddleware,roleMiddleware,authController.adminTest);
module.exports = router;