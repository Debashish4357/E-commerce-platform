const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Middleware to check if user is rider
const isRider = async (req, res, next) => {
  if (req.user.role !== 'rider') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get rider's assigned orders
router.get('/orders', auth, isRider, async (req, res) => {
  try {
    const orders = await Order.find({ rider: req.user._id })
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (delivered/undelivered)
router.patch('/orders/:id/status', auth, isRider, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (!['delivered', 'undelivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 