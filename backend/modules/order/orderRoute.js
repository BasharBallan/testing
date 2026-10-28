const express = require('express');
const {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
} = require('./orderService');

const authService = require('../user/authService');

const router = express.Router();

// All order routes require authentication
router.use(authService.protect);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/v1/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Returns a list of orders for the currently authenticated user
 *     responses:
 *       200:
 *         description: List of user orders returned successfully
 *       401:
 *         description: Unauthorized
 */
router
  .route('/my-orders')
  .get(authService.allowedTo('user'), getMyOrders);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders in the system
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Returns a list of all orders (Admin only)
 *     responses:
 *       200:
 *         description: List of orders returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new order (User only, total price calculated server-side)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "645a7b8e9f1a2b3c4d5e6f7a"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .get(authService.allowedTo('admin'), getOrders)
  .post(authService.allowedTo('user'), createOrder);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order returned successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(authService.allowedTo('user', 'admin'), getOrder);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: [pending, ready, cancelled]
 *                 example: "ready"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Order not found
 */
router
  .route('/:id/status')
  .put(authService.allowedTo('admin'), updateOrderStatus);

module.exports = router;
