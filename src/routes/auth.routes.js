const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
} = require("../middleware/rateLimiter");


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, logout, and token management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Manohar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: manohar@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid or missing input
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: manohar@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful; access and refresh cookies are set
 *       400:
 *         description: Missing or invalid input
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful; authentication cookies cleared
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Missing, invalid, or expired refresh token
 *       429:
 *         description: Too many refresh requests
 */


router.post("/register", registerLimiter, authController.registerUser);

router.post("/login", loginLimiter, authController.userLogin);
// router.get("/me", authMiddleware, authController.getCurrentUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh", refreshLimiter, authController.refreshToken);
module.exports = router;
