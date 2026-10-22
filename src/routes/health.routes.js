const express = require("express");
const router = express.Router();
const healthController = require("../controllers/health.controller.js");

router.get("/api/v1/health", healthController.checkHealth);


module.exports = router;
