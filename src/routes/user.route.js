const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");





/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and account management
 */

/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 *   patch:
 *     summary: Update current user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Manohar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: manohar@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already exists
 *
 *   delete:
 *     summary: Delete current user's account
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/user/change-password:
 *   patch:
 *     summary: Change current user's password
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or current password
 *       401:
 *         description: Unauthorized
 */


router.get("/me", authMiddleware, userController.getCurrentUser);

router.patch("/me", authMiddleware,userController.updateCurrentUser);

router.patch("/change-password", authMiddleware, userController.changePassword);
router.delete("/me", authMiddleware, userController.deleteCurrentUser);


module.exports = router;