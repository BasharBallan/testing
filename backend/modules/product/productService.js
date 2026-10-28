const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { uploadSingleImage } = require('../../middlewares/uploadImageMiddleware');
const factory = require('../../utils/handlersFactory');
const Product = require('./productModel');

// ======================================================================
// PRODUCT: UPLOAD & RESIZE IMAGE COVER
// ======================================================================
exports.uploadProductImage = uploadSingleImage('imageCover');

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }
  next();
});

// ======================================================================
// PRODUCT: GET ALL PRODUCTS
// ======================================================================

// ------------------------------------------------------
// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
// ------------------------------------------------------
exports.getProducts = factory.getAll(Product);

// ======================================================================
// PRODUCT: GET SPECIFIC PRODUCT BY ID
// ======================================================================

// ------------------------------------------------------
// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
// ------------------------------------------------------
exports.getProduct = factory.getOne(Product);

// ======================================================================
// PRODUCT: CREATE PRODUCT
// ======================================================================

// ------------------------------------------------------
// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin-Manager
// ------------------------------------------------------
exports.createProduct = factory.createOne(Product);

// ======================================================================
// PRODUCT: UPDATE PRODUCT
// ======================================================================

// ------------------------------------------------------
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin-Manager
// ------------------------------------------------------
exports.updateProduct = factory.updateOne(Product);

// ======================================================================
// PRODUCT: DELETE PRODUCT
// ======================================================================

// ------------------------------------------------------
// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
// ------------------------------------------------------
exports.deleteProduct = factory.deleteOne(Product);
