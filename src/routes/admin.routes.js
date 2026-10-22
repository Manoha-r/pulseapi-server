const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrator-only user management
 */
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with search, filtering, and pagination
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Filter users by role
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role required
 */

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found
 *
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input or user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found
 */

router.get("/users", authMiddleware,roleMiddleware, adminController.getUsers);
router.get("/users/:id", authMiddleware,roleMiddleware,adminController.getUserById);
router.patch("/users/:id", authMiddleware, roleMiddleware, adminController.updateUserById);
router.delete("/users/:id", authMiddleware, roleMiddleware, adminController.deleteUserById);
module.exports = router;