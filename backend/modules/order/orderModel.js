const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: [true, 'Cart item must have a product ID'],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: {
          type: Number,
          required: [true, 'Product price is required'],
        },
      },
    ],

    totalOrderPrice: {
      type: Number,
      required: [true, 'Total order price is required'],
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'ready', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model('Order', orderSchema);
