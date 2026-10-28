const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../../utils/validators/productValidator');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
} = require('./productService');
const authService = require('../user/authService');
const { cache } = require('../../middlewares/cache');
const cacheService = require('../../utils/cacheService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Returns a list of all products
 *     responses:
 *       200:
 *         description: List of products returned successfully
 */
/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new product (Admin/Manager only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - quantity
 *               - price
 *               - imageCover
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Fresh Milk"
 *               description:
 *                 type: string
 *                 example: "Fresh organic cow milk 1 liter bottle"
 *               quantity:
 *                 type: number
 *                 example: 50
 *               price:
 *                 type: number
 *                 example: 15.5
 *               category:
 *                 type: string
 *                 example: "Dairy"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route('/')
  .get(
    cache(() => 'products:all', 60),
    getProducts
  )
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    async (req, res, next) => {
      await cacheService.del('products:all');
      next();
    },
    createProduct
  );
/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product returned successfully
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Milk"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route('/:id')
  .get(
    cache((req) => `product:${req.params.id}`, 60),
    getProductValidator,
    getProduct
  )
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    async (req, res, next) => {
      await cacheService.del(`product:${req.params.id}`);
      await cacheService.del('products:all');
      next();
    },
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteProductValidator,
    async (req, res, next) => {
      await cacheService.del(`product:${req.params.id}`);
      await cacheService.del('products:all');
      next();
    },
    deleteProduct
  );

module.exports = router;
