const asyncHandler = require('express-async-handler');
const factory = require('../../utils/handlersFactory');
const Order = require('./orderModel');
const Product = require('../product/productModel');

// ======================================================================
// ORDER: GET ALL ORDERS (Admin Only)
// ======================================================================

// ------------------------------------------------------
// @desc    Get list of all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
// ------------------------------------------------------
exports.getOrders = factory.getAll(Order);

// ======================================================================
// ORDER: GET SPECIFIC ORDER BY ID
// ======================================================================

// ------------------------------------------------------
// @desc    Get specific order by id
// @route   GET /api/v1/orders/:id
// @access  Private/User-Admin
// ------------------------------------------------------
exports.getOrder = factory.getOne(Order);

// ======================================================================
// ORDER: GET LOGGED USER ORDERS
// ======================================================================

// ------------------------------------------------------
// @desc    Get orders for the logged-in user
// @route   GET /api/v1/orders/my-orders
// @access  Private/User
// ------------------------------------------------------
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

// ======================================================================
// ORDER: CREATE ORDER (Server calculates total price securely)
// ======================================================================

// ------------------------------------------------------
// @desc    Create a new order and calculate total price server-side
// @route   POST /api/v1/orders
// @access  Private/User
// ------------------------------------------------------
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Order items cannot be empty',
    });
  }

  // 1. Calculate total order price and fetch trusted prices from database
  let totalOrderPrice = 0;
  const processedOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: `No product found for id: ${item.product}`,
      });
    }

    const itemPrice = product.price;
    totalOrderPrice += itemPrice * item.quantity;

    processedOrderItems.push({
      product: item.product,
      quantity: item.quantity,
      price: itemPrice,
    });
  }

  // 2. Create order linked to current user
  const order = await Order.create({
    user: req.user._id,
    orderItems: processedOrderItems,
    totalOrderPrice,
    orderStatus: 'pending',
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// ======================================================================
// ORDER: UPDATE ORDER STATUS (Admin Only)
// ======================================================================

// ------------------------------------------------------
// @desc    Update order status (pending, ready, cancelled)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
// ------------------------------------------------------
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    return res.status(404).json({
      status: 'fail',
      message: `No order found for this id ${req.params.id}`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});
